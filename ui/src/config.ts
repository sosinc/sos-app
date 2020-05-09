interface Config {
  basename: string;
  urls: {
    auth: string;
    api: string;
  };
}

if (!process.env.REACT_APP_AUTH_API_URL) {
  throw new Error('REACT_APP_AUTH_API_URL environment variable must be set');
}

if (!process.env.REACT_APP_API_URL) {
  throw new Error('REACT_APP_API_URL environment variable must be set');
}

const basename = process.env.REACT_APP_BASE_PATH || '/';

const config: Config = {
  basename,
  urls: {
    api: process.env.REACT_APP_API_URL,
    auth: process.env.REACT_APP_AUTH_API_URL,
  },
};

export default config;
