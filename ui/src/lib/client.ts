import { GraphQLClient } from 'graphql-request';
import config from 'src/config';

const client = new GraphQLClient(config.urls.graphql, {
  credentials: 'include',
});

export default client;
