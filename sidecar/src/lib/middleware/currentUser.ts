import { createParamDecorator } from "type-graphql";
import { ResolverContext } from "../types";

export const CurrentUser = (): ParameterDecorator =>
  createParamDecorator<ResolverContext>(
    ({ context }) => context.req.session && context.req.session.user
  );
