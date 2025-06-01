import fs from "fs/promises";
export async function readFromJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`Error reading JSON file at ${filePath}:`, error.message);
        return [];
    }
}
export async function writeToJSONFile(filePath, data) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonString, "utf8");
        return true;
    }
    catch (error) {
        console.error(`Error writing JSON file to ${filePath}:`, error.message);
        return false;
    }
}
