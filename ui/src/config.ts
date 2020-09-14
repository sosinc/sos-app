interface Config {
  basename: string;
  urls: {
    graphql: string;
    storage: string;
    feedbackForm: string;
  };
}

if (
  !process.env.clientGraphqlUrl ||
  !process.env.serverGraphqlUrl ||
  !process.env.feedbackFormUrl
) {
  throw new Error(
    'clientGraphqlUrl, serverGraphqlUrl and feedbackFormUrl environment variable must be set',
  );
}

if (!process.env.storageApiUrl) {
  throw new Error('storageApiUrl environment variable must be set');
}

const basename = process.env.basePath || '/';

const config: Config = {
  basename,
  urls: {
    feedbackForm: process.env.feedbackFormUrl,
    graphql: process.browser ? process.env.clientGraphqlUrl : process.env.serverGraphqlUrl,
    storage: process.env.storageApiUrl,
  },
};

export default config;
