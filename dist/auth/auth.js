import { readFromJSONFile } from "../utils/utils.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { usersDataPath } from "../config/paths.js";
const JWT_SECRET_KEY = process.env.SECRET_KEY || "";
export function generateHash(username, password) {
    const userCredentials = `${username}:${password}`;
    return crypto.createHash("sha256").update(userCredentials).digest("hex");
}
export async function getUser(username, password) {
    try {
        const users = await readFromJSONFile(usersDataPath);
        const hash = generateHash(username, password);
        for (const user of users) {
            if (user.hash === hash) {
                return user;
            }
        }
        return null;
    }
    catch (error) {
        console.error("Error finding user with credentials:", error.message);
        return null;
    }
}
export function generateToken(user) {
    const data = {
        userId: user.id,
    };
    return jwt.sign(data, JWT_SECRET_KEY, { expiresIn: "1h" });
}
export function decodeToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    }
    catch (error) {
        console.error("Invalid token");
        return null;
    }
}
