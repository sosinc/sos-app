import { Resolver, Mutation, Arg, Query, Ctx, Authorized } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { compare, hash } from "bcrypt";
import { Repository } from "typeorm";
import mail from "../../lib/mail";
import { User } from "../../entity/User.entity";
import { ResolverContext } from "../../lib/types";
import ServerError from "../../lib/ServerError";
import makeRandom from "../../lib/makeRandom";
import { UserLogin } from "../../entity/UserLogin.entity";

import { Employee } from "../../entity/Employee.entity";

const { APP_NAME = "App" } = process.env;

@Resolver(returns => String)
export class AuthResolver {
  @InjectRepository(User)
  private userRepo: Repository<User>;

  @InjectRepository(UserLogin)
  private userLoginRepo: Repository<UserLogin>;

  @InjectRepository(Employee)
  private employeeRepo: Repository<Employee>;

  @Query()
  ping(): string {
    return "pong";
  }

  @Mutation(returns => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req: { session } }: ResolverContext
  ): Promise<User> {
    try {
      const userLogin = await this.userLoginRepo.findOne({ public_key: email, provider: "EMAIL" });

      if (!userLogin) {
        throw new ServerError("Invalid email/password", {
          status: 403,
        });
      }

      if (!userLogin.private_key) {
        throw new ServerError("Please set your password to login", {
          status: 412,
        });
      }

      const user = await this.userRepo.findOne(userLogin.user_id, { relations: ["role"] });

      if (!user) {
        throw new ServerError("Invalid email/password", {
          status: 403,
        });
      }

      const isValidPassword = await compare(password, userLogin.private_key);
      if (!isValidPassword) {
        throw new ServerError("Invalid email/password", {
          status: 403,
        });
      }

      if (user && session) {
        if (user.role_id === "USER") {
          const employee = await this.employeeRepo.findOneOrFail({ user_id: user.id });

          // eslint-disable-next-line no-param-reassign
          session.organizationId = employee.organization_id;
        }

        // eslint-disable-next-line no-param-reassign
        session.user = user;
      }

      return user;
    } catch (error) {
      console.error("[Error] login Mutation", error);

      throw new ServerError(error.message);
    }
  }

  @Authorized()
  @Mutation(returns => String)
  async logout(@Ctx() { req }: ResolverContext) {
    req.session = null;

    return "ok";
  }

  @Authorized()
  @Mutation(returns => String)
  async changeActiveOrg(@Ctx() { req }: ResolverContext, @Arg("orgId") orgId: string) {
    req.session.organizationId = orgId;

    return "ok";
  }

  @Mutation(returns => String)
  async sendPasswordResetOtp(@Ctx() { req }: ResolverContext, @Arg("email") email: string) {
    try {
      await this.userLoginRepo.findOneOrFail({ public_key: email, provider: "EMAIL" });

      const otp = makeRandom(6).toUpperCase();
      req.session.passwordReset = {
        email,
        otp,
      };
      req.session.cookie.maxAge = 1000 * 60 * 5;

      mail.sendMail({
        to: email,
        subject: `Password reset OTP from "${APP_NAME}"`,
        html: `<p>Your OTP is</p> <h1>${otp} </h1>`,
      });
    } catch (err) {
      console.error("[Error: sendPasswordResetOtp]", err);
    }

    return "ok";
  }

  @Mutation(returns => User)
  async resetPassword(
    @Ctx() { req }: ResolverContext,
    @Arg("newPassword") newPassword: string,
    @Arg("otp") inputOtp: string
  ): Promise<User> {
    const otp = req.session.passwordReset?.otp;
    const email = req.session.passwordReset?.email;

    if (!otp || !email) {
      throw new ServerError("Incorrect OTP!", { status: 401 });
    }

    const userLogin = await this.userLoginRepo.findOne({ public_key: email, provider: "EMAIL" });

    if (!userLogin || !otp || otp !== inputOtp) {
      throw new ServerError("Incorrect OTP!", { status: 401 });
    }

    userLogin.private_key = await hash(newPassword, 10);
    await this.userLoginRepo.save(userLogin);

    return this.userRepo.findOneOrFail({ id: userLogin.user_id });
  }
}
