import config from 'src/config';

export default (filePath?: string) => {
  if (!filePath) {
    return;
  }

  return new URL(`${config.urls.storage}${filePath}`).toString();
};
