import config from 'src/config';

export default async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const { uploadUrl, filePath } = await fetch(config.urls.storage, {
    credentials: 'include',
  }).then((res) => res.json());

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', uploadUrl);

    request.upload.addEventListener('progress', (e) => {
      const percentComplete = (e.loaded / e.total) * 100;

      if (onProgress) {
        onProgress(percentComplete);
      }
    });

    // AJAX request finished event
    request.addEventListener('load', () => {
      if (request.status === 200) {
        return resolve(filePath);
      }

      return reject();
    });

    request.send(file);
  });
};
