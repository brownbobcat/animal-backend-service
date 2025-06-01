import { readFromJSONFile, writeToJSONFile } from "../utils/utils.js";
import { validateAnimal } from "../utils/validator.js";
import { animalsDataPath } from "../config/paths.js";
export async function getAllAnimals() {
    return await readFromJSONFile(animalsDataPath);
}
export async function findAnimalById(animalId) {
    const animals = await readFromJSONFile(animalsDataPath);
    const id = typeof animalId === "string" ? parseInt(animalId) : animalId;
    const animal = animals.find((animal) => animal.id === id);
    return animal || null;
}
export async function findAnimalsByUserId(userId) {
    const animals = await getAllAnimals();
    return animals.filter((animal) => animal.createdByUser === userId);
}
export async function createAnimal(animalData, userId) {
    try {
        const newAnimal = JSON.parse(animalData);
        const validationError = validateAnimal(newAnimal);
        if (validationError) {
            console.log("Validation error:", validationError);
            return null;
        }
        const animals = await readFromJSONFile(animalsDataPath);
        const id = animals.reduce((maxId, animal) => (animal && animal.id > maxId ? animal.id : maxId), 0);
        const userIdNumber = typeof userId === "string" ? parseInt(userId) : userId;
        const completeAnimal = {
            ...newAnimal,
            id: id + 1,
            createdByUser: userIdNumber,
        };
        animals.push(completeAnimal);
        const success = await writeToJSONFile(animalsDataPath, animals);
        if (success) {
            return completeAnimal;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log("Error creating animal:", error.message);
        return null;
    }
}
