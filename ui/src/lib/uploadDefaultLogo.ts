import createSvgImage from '../lib/createSvgImage';
import uploadFile from '../lib/uploadFile';

export default async (name: string) => {
  const svg = createSvgImage(name);
  const blob = new Blob([svg], { type: 'image/svg+xml' });

  const file = new File([blob], `${name}-default-logo`, { type: blob.type });
  const url = await uploadFile(file);

  return url;
};
