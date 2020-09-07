import * as express from "express";
import * as uuid from "uuid";

import { buckets, client, STORAGE_GATEWAY_ENDPOINT, MINIO_ENDPOINT, MINIO_PORT } from "./client";

const api = express.Router();

api.use(express.json());

api.get("/:bucket/:filename", async (req, res) => {
  if (!req.session?.user) {
    return res.status(403).json();
  }

  const { filename, bucket } = req.params;

  if (!filename || !bucket) {
    return res.status(400).json();
  }

  try {
    let readUrl = await client.presignedGetObject(bucket, filename, 24 * 60 * 60);

    if (STORAGE_GATEWAY_ENDPOINT) {
      readUrl = readUrl.replace(`${MINIO_ENDPOINT}:${MINIO_PORT}`, STORAGE_GATEWAY_ENDPOINT);
    }

    return res.redirect(readUrl);
  } catch (err) {
    return res.status(500).json();
  }
});

api.get("/", async (req, res) => {
  if (!req.session?.user) {
    return res.status(403).json();
  }

  try {
    const filename = uuid.v4();
    // URL which directly uploads to internal minio service
    const originalUploadUrl = await client.presignedPutObject(
      buckets.userUploads,
      filename,
      24 * 60 * 60
    );
    let uploadUrl = originalUploadUrl;

    if (STORAGE_GATEWAY_ENDPOINT) {
      uploadUrl = uploadUrl.replace(`${MINIO_ENDPOINT}:${MINIO_PORT}`, STORAGE_GATEWAY_ENDPOINT);
    }

    return res.json({
      uploadUrl,
      filePath: new URL(originalUploadUrl).pathname,
    });
  } catch (err) {
    return res.status(500).json();
  }
});

export default api;
