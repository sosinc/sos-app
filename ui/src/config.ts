interface Config {
  basename: string;
  urls: {
    graphql: string;
  };
}

if (!process.env.clientGraphqlUrl || !process.env.serverGraphqlUrl) {
  throw new Error('clientGraphqlUrl && serverGraphqlUrl environment variable must be set');
}

const basename = process.env.basePath || '/';

const config: Config = {
  basename,
  urls: {
    graphql: process.browser ? process.env.clientGraphqlUrl : process.env.serverGraphqlUrl,
  },
};

export default config;
