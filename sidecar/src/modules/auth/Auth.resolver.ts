import { Resolver, Mutation, Arg, Query, Ctx, Authorized } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { compare, hash } from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../../entity/User.entity";
import { ResolverContext } from "../../lib/types";
import ServerError from "../../lib/ServerError";
import { CurrentUser } from "../../lib/middleware/currentUser";
import mail from "../../lib/mail";
import { Otp } from "../../entity/Otp.entity";
import makeRandom from "../../lib/makeRandom";

const { APP_NAME = "App" } = process.env;

@Resolver(returns => String)
export class AuthResolver {
  @InjectRepository(User)
  private userRepo: Repository<User>;

  @InjectRepository(Otp)
  private otpRepo: Repository<Otp>;

  @Authorized()
  @Query(returns => User)
  async me(@CurrentUser() user) {
    return user;
  }

  @Mutation(returns => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req: { session } }: ResolverContext
  ): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ email });

      if (!user) {
        throw new ServerError("Invalid email/password", {
          status: 403,
        });
      }

      const isValidPassword = await compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new ServerError("Invalid email/password", {
          status: 403,
        });
      }

      if (user && session) session.user = user;

      return user;
    } catch (error) {
      console.error("[Error] login Mutation", error);

      throw new ServerError(error.message);
    }
  }

  @Mutation(returns => User, {
    description: `
      Create new user with email only.
      Frontend should make a call to sendPasswordResetOtp behind the scenes
      and ask for new password and OTP.
      Password should then be set with resetPassword.`,
  })
  async signUp(@Arg("email") email: string): Promise<User> {
    const exists = await this.userRepo.findOne({ email });
    if (exists) {
      throw new ServerError("Email already in use", { status: 409 });
    }

    await this.userRepo.save({
      email,
      passwordHash: await hash(makeRandom(20), 10),
      role: 1,
    });
    const user = await this.userRepo.findOneOrFail({ email });

    return user;
  }

  @Mutation(returns => String)
  async sendPasswordResetOtp(@Arg("email") email: string) {
    try {
      const user = await this.userRepo.findOneOrFail({ email });

      const otp = new Otp();
      otp.otp = makeRandom(6).toUpperCase();
      otp.otpType = "Password Reset";
      otp.userId = user.id;
      await this.otpRepo.save(otp);

      mail.sendMail({
        to: email,
        subject: `Password reset OTP from "${APP_NAME}"`,
        html: `<p>Your OTP is</p> <h1>${otp.otp} </h1>`,
      });
    } catch (err) {
      console.error("[Error: sendPasswordResetOtp]", err);
    }

    return "ok";
  }

  @Mutation(returns => User)
  async resetPassword(
    @Arg("email") email: string,
    @Arg("newPassword") newPassword: string,
    @Arg("opt") otp: string
  ): Promise<User> {
    const user = await this.userRepo.findOne({ email });
    const otpDoc = await this.otpRepo
      .createQueryBuilder()
      .where("created_at > NOW() - INTERVAL '15 minutes'")
      .andWhere("otp = :otp", { otp })
      .getOne();

    if (!user || !otpDoc || user.id !== otpDoc.userId) {
      throw new ServerError("Invalid credentials.", { status: 401 });
    }

    user.passwordHash = await hash(newPassword, 10);
    await this.userRepo.save(user);

    return this.userRepo.findOneOrFail({ id: user.id });
  }
}
