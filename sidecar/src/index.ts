/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import useragent from "express-useragent";
import redis from "redis";
import express, { Request, Response, Express } from "express";
import morgan from "morgan";
import path from "path";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { authChecker } from "./lib/authChecker";

import { createDbConnection } from "./db";
import * as config from "./config";
import { ResolverContext } from "./lib/types";
import ApiRoutes from "./rest";
import seed from "./seed";

// Set timezone of server to UTC
// BE CAREFUL, THIS IS NOT ENOUGH. ALWAYS RUN YOUR SCRIPTS WITH TZ=UTC
process.env.TZ = "UTC";

const createApp = async () => {
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient(config.REDISCLOUD_SESSION_URL);

  try {
    // Set Up Express
    const app = express()
      .enable("trust proxy")
      .use(morgan("dev"))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: false }))
      .use(cookieParser())
      .use(useragent.express())
      .use(cors(config.corsOptions));

    if (config.GRAPHQL_LOGGER) {
      morgan.token("graphql-query", req => {
        const { query, variables, operationName } = req.body;
        return `GRAPHQL: \nOperation Name: ${operationName} \nQuery: \
  \x1b[36m${query}\x1b[0m \nVariables: \x1b[31m${JSON.stringify(variables)}\x1b[0m"`;
      });
      app.use(morgan(":graphql-query"));
    }

    // Set up sessions
    app.set("trust proxy", 1);
    const sessionHandler = session({
      store: new RedisStore({ client: redisClient }),
      secret: config.EXPRESS_SESSION_SECRET as string,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 Week
        secure: config.isProduction,
        sameSite: config.isProduction ? "strict" : "none",
        domain: config.isProduction ? config.HOSTNAME : undefined,
      },
      name: "sos.cookie",
      proxy: config.isProduction,
      resave: false,
      saveUninitialized: false,
      unset: "destroy",
    });
    app.use(sessionHandler);

    return app;
  } catch (err) {
    console.error("[Error src/index]", err);

    throw err;
  }
};

const createGraphqlApp = async (parentApp: Express) => {
  const app = parentApp || (await createApp());

  const schema = await buildSchema({
    authChecker,
    resolvers: [path.join(__dirname, config.resolverPaths)],
    container: Container,
  });

  const apolloServer = new ApolloServer({
    context: ({ req, res }: { req: Request; res: Response }): ResolverContext => ({
      req,
      res,
    }),
    formatError: err => {
      console.error(err);

      return {
        message: err.message,
        data: err.extensions?.exception?.data || {},
        stacktrace: config.isProduction ? null : err.extensions?.exception?.stacktrace,
      };
    },
    introspection: true,
    playground: false,
    schema,
  });

  // Apply cors + GraphiQL middleware
  apolloServer.applyMiddleware({
    cors: config.apolloCors,
    app,
    path: "/v1/graphql",
  });

  return app;
};

const createRestApp = async (parentApp: Express) => {
  const app = parentApp || (await createApp());

  app.use("/v1/api", ApiRoutes);

  return app;
};

const run = async () => {
  await createDbConnection();

  const app = await createApp();

  await createGraphqlApp(app);
  const restApp = await createRestApp(app);

  seed().catch(err => {
    console.error("Failed to Seed", err);
  });

  const port = process.env.PORT || 4000;

  restApp.listen(port, () => {
    console.info(`🚀 Server ready at http://localhost:${port}`);
  });
};

if (require.main === module) {
  run();
}
