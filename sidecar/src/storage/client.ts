/**
 * Configures Minio cleint
 */
import { Client } from "minio";

export const {
  MINIO_ENDPOINT = "minio",
  MINIO_PORT = 9000,
  MINIO_ACCESS_KEY = "minio",
  MINIO_SECRET_KEY = "minio123",
  USER_UPLOADS_BUCKET_NAME = "user-uploads",
  STORAGE_GATEWAY_ENDPOINT = null,
} = process.env;

export const client = new Client({
  endPoint: MINIO_ENDPOINT,
  port: Number(MINIO_PORT),
  useSSL: false,
  secretKey: MINIO_SECRET_KEY,
  accessKey: MINIO_ACCESS_KEY,
});

export const buckets = {
  userUploads: USER_UPLOADS_BUCKET_NAME,
};

export const init = async () => {
  const bucketExists = await client.bucketExists(buckets.userUploads);

  if (!bucketExists) {
    await client.makeBucket(buckets.userUploads, "");
  }
};
