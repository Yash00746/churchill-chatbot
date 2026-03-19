import express from "express";
import cors from "cors";
import fs from "fs";
import chatRoutes from "./routes/chatRoutes.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

try {
  const personaPath = new URL("./data/persona.json", import.meta.url);
  const persona = JSON.parse(fs.readFileSync(personaPath, "utf-8"));
  app.locals.persona = persona;
  console.log("✅ Persona loaded successfully");
} catch (err) {
  console.error("❌ Failed to load persona data:", err);
}

app.use("/api", chatRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
