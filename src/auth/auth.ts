import "dotenv/config";
import { readFromJSONFile } from "../utils/utils.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, TokenPayload } from "../types";
import { usersDataPath } from "../config/paths.js";

const JWT_SECRET_KEY = process.env.SECRET_KEY || "";

export function generateHash(username: string, password: string): string {
  const userCredentials = `${username}:${password}`;
  return crypto.createHash("sha256").update(userCredentials).digest("hex");
}

export async function getUser(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const users = await readFromJSONFile<User>(usersDataPath);
    const hash = generateHash(username, password);

    for (const user of users) {
      if (user.hash === hash) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.error(
      "Error finding user with credentials:",
      (error as Error).message
    );
    return null;
  }
}

export function generateToken(user: User): string {
  const data = {
    userId: user.id,
  };

  return jwt.sign(data, JWT_SECRET_KEY, { expiresIn: "1h" });
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as TokenPayload;
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
}
