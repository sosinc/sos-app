import { getConnectionOptions, createConnection, useContainer, Connection } from "typeorm";
import { Container } from "typedi";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { NODE_ENV, DATABASE_URL } from "./config";

export const createDbConnection = async (): Promise<Connection> => {
  // Create DB connection
  const options = (await getConnectionOptions(NODE_ENV)) as PostgresConnectionOptions;
  useContainer(Container);
  const connection = await createConnection({
    ...options,
    name: "default",
    url: DATABASE_URL,
  });

  return connection;
};
