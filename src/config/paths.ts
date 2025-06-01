import path from "path";
import url from "url";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const rootDir = path.join(dirname, "../..");

export const animalsDataPath = path.join(
  rootDir,
  "src",
  "data",
  "animals.json"
);
export const usersDataPath = path.join(rootDir, "src", "data", "users.json");
