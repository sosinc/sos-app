import config from 'src/config';

export default (filePath?: string) => {
  if (!filePath) {
    return;
  }

  if (filePath.startsWith('http')) {
    return filePath;
  }

  return new URL(`${config.urls.storage}${filePath}`).toString();
};
