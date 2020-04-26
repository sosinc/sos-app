import * as fs from "fs";
import * as path from "path";

const keys: {
  public: null | string;
  private: null | string;
} = {
  public: null,
  private: null,
};

const baseDir = path.resolve(__dirname, "../../jwt-keys");

type Keys = "public" | "private";

const keyPaths = {
  public: "key.pub",
  private: "key",
};

export default (keyType: Keys = "public"): string => {
  if (!keys[keyType]) {
    keys[keyType] = fs.readFileSync(path.join(baseDir, keyPaths[keyType]), "utf-8");
  }
  const key = keys[keyType];

  if (!key) {
    throw new Error(`Key not found: ${keyType}`);
  }

  return key;
};
