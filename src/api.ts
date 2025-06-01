import express from "express";
import cors from "cors";
import {
  createAnimal,
  findAnimalById,
  findAnimalsByUserId,
  getAllAnimals,
} from "./services/animalService";
import { findUserById, login } from "./services/userService";
import { decodeToken } from "./auth/auth";

const PORT = 3000;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5502", "http://127.0.0.1:5502"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/animals", async (req, res) => {
  try {
    const data = await getAllAnimals();
    const formattedData = data.map(({ createdByUser, ...rest }) => rest);
    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({
      Error: "Internal Server Error",
    });
  }
});

app.get("/animals/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const formattedId = parseInt(id);

    if (!isNaN(formattedId)) {
      const data = await findAnimalById(formattedId);

      if (!data) {
        res.status(404).json({
          Error: "animal not found",
        });
      }

      const { createdByUser, ...rest } = data!;

      res.status(200).send(rest);
    } else {
      res.status(400).json({
        Error: "id must be a valid whole number",
      });
    }
  } catch (error) {
    res.status(500).json({
      Error: "Internal Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        Error:
          "Malformed/Invalid Request Body -- Username and password are required",
      });
    }

    const data = await login(username, password);

    if (!data) {
      res.status(401).json({ Error: "Unauthorized" });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      Error: "Internal Server Error",
    });
  }
});

app.post("/animals", async (req, res) => {
  try {
    const authToken = req.headers.authtoken as string;
    const decoded = authToken ? decodeToken(authToken!) : null;

    if (!authToken || !decoded || !decoded.userId) {
      res.status(401).json({
        Error: "Unauthorized",
      });
    }

    const animalDataString = JSON.stringify(req.body);

    const { animal: newAnimal, error } = await createAnimal(
      animalDataString,
      decoded!.userId
    );

    if (!newAnimal) {
      res.status(400).json({
        Error: `Malformed/Invalid Request Body -- ${error}`,
      });
    }

    res.status(201).json({
      message: "successfully created new animal record",
      id: newAnimal!.id,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal Server Error",
    });
  }
});

app.get("/user", async (req, res) => {
  try {
    const authToken = req.headers.authtoken as string;
    const decoded = authToken ? decodeToken(authToken!) : null;

    if (!authToken || !decoded || !decoded.userId) {
      res.status(401).json({
        Error: "Unauthorized",
      });
    }

    const userId = decoded!.userId;
    const user = await findUserById(userId);

    const userAnimals = await findAnimalsByUserId(userId);

    const formattedData = userAnimals.map((animal) => ({
      id: animal.id,
      name: animal.name,
    }));

    const { id, username } = user!;

    res.status(200).json({
      id,
      name: username,
      animals: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
