import { Response, Request } from "express";

interface SessionRequest extends Request {
  session?: any;
}

export interface ResolverContext {
  req: SessionRequest;
  res: Response;
}
