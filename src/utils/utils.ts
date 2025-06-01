import fs from "fs/promises";

export async function readFromJSONFile<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(
      `Error reading JSON file at ${filePath}:`,
      (error as Error).message
    );
    return [];
  }
}

export async function writeToJSONFile<T>(
  filePath: string,
  data: T[]
): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, "utf8");
    return true;
  } catch (error) {
    console.error(
      `Error writing JSON file to ${filePath}:`,
      (error as Error).message
    );
    return false;
  }
}
