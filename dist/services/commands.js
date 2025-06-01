import { getAllAnimals, findAnimalById, createAnimal, } from "../services/animalService.js";
import { login, displayUserInfo } from "../services/userService.js";
import { decodeToken } from "../auth/auth.js";
export async function checkCommands(command, nextArg, ...args) {
    if (command === "animals") {
        await animalCommands(nextArg, args);
    }
    else if (command === "user") {
        await userCommands(nextArg);
    }
    else if (command === "login") {
        await loginCommand(nextArg, args);
    }
    else {
        console.log("Invalid command");
    }
}
async function animalCommands(subCommand, args) {
    if (subCommand === "all") {
        const animals = await getAllAnimals();
        console.log(JSON.stringify(animals, null, 2));
    }
    else if (subCommand === "one" && args[0]) {
        const animal = await findAnimalById(args[0]);
        if (animal) {
            console.log(animal);
        }
        else {
            console.log(`Error: Animal with ID: ${args[0]} does not exist`);
        }
    }
    else if (subCommand === "create") {
        await handleAnimalCreate(args);
    }
    else {
        console.log("Please use the right command(s)");
    }
}
async function handleAnimalCreate(args) {
    if (args.length < 2) {
        console.log("Please provide both an auth token and animal data");
        return;
    }
    const authToken = args[0];
    const animalData = args[1];
    const decoded = decodeToken(authToken);
    if (!decoded) {
        console.log("Error: Invalid or expired token. Please login again.");
        return;
    }
    const userId = decoded.userId;
    console.log("userId", decoded.userId);
    if (!userId) {
        console.log("Error: Token does not contain a valid user ID.");
        return;
    }
    const newAnimal = await createAnimal(animalData, userId);
    if (newAnimal) {
        console.log("Animal created successfully:");
        console.log(JSON.stringify(newAnimal, null, 2));
    }
    else {
        console.log("Failed to create animal. Please check your data format and try again.");
    }
}
async function userCommands(authToken) {
    if (authToken) {
        await displayUserInfo(authToken);
    }
    else {
        console.log("Please provide an auth token:");
    }
}
async function loginCommand(username, args) {
    if (username) {
        const password = args[0];
        const userLoginOutput = await login(username, password);
        if (userLoginOutput) {
            console.log("Login successful!");
            console.log("Auth token:", userLoginOutput.token);
        }
    }
    else {
        console.log("Please provide both username and password");
    }
}
