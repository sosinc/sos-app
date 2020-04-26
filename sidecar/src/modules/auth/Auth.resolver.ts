import { Resolver, Mutation, Arg, Query, Ctx, Authorized } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { compare, hash } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import loadKeys from "../../lib/load-keys";
import { User } from "../../entity/User.entity";
import { ResolverContext } from "../../lib/types";
import ServerError from "../../lib/ServerError";
import { CurrentUser } from "../../lib/middleware/currentUser";

const jwtPrivateKey = loadKeys("private");

const createJwtToken = (user: User): string => {
  return jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": user.id,
      },
    },
    jwtPrivateKey,
    { algorithm: "RS256" }
  );
};

@Resolver(returns => String)
export class AuthResolver {
  @InjectRepository(User)
  private userRepo: Repository<User>;

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

  @Mutation(returns => User)
  async signUp(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req: { session } }: ResolverContext
  ): Promise<User> {
    const exists = await this.userRepo.findOne({ email });
    if (exists) {
      throw new ServerError("Email already in use", { status: 409 });
    }

    await this.userRepo.save({
      email,
      passwordHash: await hash(password, 10),
      role: 1,
    });
    const user = await this.userRepo.findOneOrFail({ email });

    if (user && session) {
      session.user = await this.userRepo.findOne({ id: user.id });
    }

    return user;
  }
}
