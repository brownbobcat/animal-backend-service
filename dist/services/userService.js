import { readFromJSONFile } from "../utils/utils.js";
import { generateToken, getUser, decodeToken } from "../auth/auth.js";
import { usersDataPath } from "../config/paths.js";
import { findAnimalsByUserId } from "./animalService.js";
export async function getAllUsers() {
    return await readFromJSONFile(usersDataPath);
}
export async function findUserById(userId) {
    const users = await getAllUsers();
    return users.find((user) => user.id === userId);
}
export async function login(username, password) {
    try {
        const user = await getUser(username, password);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const userToken = generateToken(user);
        return {
            userId: user.id,
            username: user.username,
            token: userToken,
        };
    }
    catch (error) {
        console.log(`Error: ${error.message}`);
        return null;
    }
}
export async function displayUserInfo(authToken) {
    try {
        const decoded = decodeToken(authToken);
        if (!decoded) {
            console.log("Error: Invalid or expired token. Please login again.");
            return false;
        }
        const userId = decoded.userId;
        if (!userId) {
            console.log("Error: Token does not contain a valid user ID.");
            return false;
        }
        const user = await findUserById(userId);
        if (!user) {
            console.log("Error: User not found.");
            return false;
        }
        console.log(`User ID: ${user.id}`);
        console.log(`Username: ${user.username}`);
        const userAnimals = await findAnimalsByUserId(userId);
        if (userAnimals.length > 0) {
            console.log("\nYou've added the following animals to the system:");
            userAnimals.forEach((animal) => {
                console.log(`ID: ${animal.id}, Name: ${animal.name}`);
            });
        }
        else {
            console.log("\nYou haven't added any animals to the system yet.");
        }
        return true;
    }
    catch (error) {
        console.log("Error displaying user info");
        return false;
    }
}
