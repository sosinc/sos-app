import { CorsOptions } from "cors";
// ENV VARIABLES
export const {
  NODE_ENV = "development",
  EXPRESS_SESSION_SECRET = "EXPRESS_SESSION_SECRET",
  REDISCLOUD_SESSION_URL = "redis://127.0.0.1:6379",
  PORT = 4000,
  DATABASE_URL = "postgres://user:pass@postgres:5432/",
  GRAPHQL_LOGGER = true,
  HOSTNAME = "localhost",
} = process.env;

// IS PRODUCTION
export const isProduction = NODE_ENV === "production";

// WEB URL
export const whitelist = isProduction
  ? ["https://lab.channikhabra.com"]
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:4000"];

export const apolloCors = {
  credentials: true,
  origin: whitelist,
};

export const corsOptions: CorsOptions = {
  credentials: true,
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ): void => {
    if (!requestOrigin || whitelist.indexOf(requestOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`${requestOrigin} Not allowed by CORS`));
    }
  },
};

// RESOLVER PATHS
export const resolverPaths = isProduction
  ? "/modules/**/*.resolver.js"
  : "/modules/**/*.resolver.ts";
