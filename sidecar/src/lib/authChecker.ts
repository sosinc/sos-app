import { AuthChecker } from "type-graphql";
import { ResolverContext } from "../lib/types";

/**
 * Handles @Authorized decorator in type-graphql
 */
export const authChecker: AuthChecker<ResolverContext> = ({ context: { req } }, roles) => {
  const user = req.session && req.session.user;

  if (!user) {
    return false;
  }

  if (roles && roles.length) {
    const { role } = user;

    if (role == null) {
      return false;
    }
  }

  return true;
};
