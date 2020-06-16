import * as express from "express";
import * as uuid from "uuid";

import { buckets, client } from "./client";

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
    const readUrl = await client.presignedGetObject(bucket, filename, 24 * 60 * 60);

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
    const uploadUrl = await client.presignedPutObject(buckets.userUploads, filename, 24 * 60 * 60);

    return res.json({
      uploadUrl,
      filePath: new URL(uploadUrl).pathname,
    });
  } catch (err) {
    return res.status(500).json();
  }
});

export default api;
