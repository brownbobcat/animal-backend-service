import { readFromJSONFile, writeToJSONFile } from "../utils/utils.js";
import { validateAnimal } from "../utils/validator.js";
import { animalsDataPath } from "../config/paths.js";
import { Animal } from "../types";

export async function getAllAnimals(): Promise<Animal[]> {
  return await readFromJSONFile<Animal>(animalsDataPath);
}

export async function findAnimalById(
  animalId: string | number
): Promise<Animal | null> {
  const animals = await readFromJSONFile<Animal>(animalsDataPath);
  const id = typeof animalId === "string" ? parseInt(animalId) : animalId;

  const animal = animals.find((animal) => animal.id === id);
  return animal || null;
}

export async function findAnimalsByUserId(userId: number): Promise<Animal[]> {
  const animals = await getAllAnimals();
  return animals.filter((animal) => animal.createdByUser === userId);
}

export async function createAnimal(
  animalData: string,
  userId: string | number
): Promise<{ animal: Animal | null; error: string | null }> {
  try {
    const newAnimal = JSON.parse(animalData) as Partial<Animal>;

    const validationError = validateAnimal(newAnimal);
    if (validationError) {
      console.log("Validation error:", validationError);
      return { animal: null, error: `${validationError}` };
    }

    const animals = await readFromJSONFile<Animal>(animalsDataPath);

    const id = animals.reduce(
      (maxId, animal) => (animal && animal.id > maxId ? animal.id : maxId),
      0
    );

    const userIdNumber = typeof userId === "string" ? parseInt(userId) : userId;

    const completeAnimal: Animal = {
      ...(newAnimal as Animal),
      id: id + 1,
      createdByUser: userIdNumber,
    };

    animals.push(completeAnimal);

    const success = await writeToJSONFile<Animal>(animalsDataPath, animals);
    if (success) {
      return { animal: completeAnimal, error: null };
    } else {
      return { animal: null, error: "Failed to write animal data to file" };
    }
  } catch (error) {
    console.log("Error creating animal:", (error as Error).message);
    return { animal: null, error: (error as Error).message };
  }
}
