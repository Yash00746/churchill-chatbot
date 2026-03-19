import express from "express";
import { logger } from "../middleware/logger.js";
import { validateBody } from "../middleware/validateBody.js";
import { parseMessage } from "../middleware/parseMessage.js";
import { handleDeterministicChat } from "../controllers/deterministicChatController.js";
import { handleThink } from "../controllers/ThinkController.js";

const router = express.Router();


router.post(
  "/chat",
  logger,
  validateBody,
  parseMessage,
  handleDeterministicChat
);


router.post(
  "/think",
  logger,
  validateBody,
  handleThink
);


router.get("/persona", (req, res) => {
  res.json(req.app.locals.persona);
});


router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default router;


