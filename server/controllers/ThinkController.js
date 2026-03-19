import { askLLM } from "../services/llmService.js";
import { addToHistory, getHistory } from "../services/chatHistory.js";

export async function handleThink(req, res) {
  try {
    const originalText =
      req.originalText ??
      req.body.text ??
      "";

    if (!originalText || originalText.trim().length === 0) {
      return res.status(400).json({
        error: "Empty message. I cannot answer silence."
      });
    }

    // ✅ add user message
    addToHistory("user", originalText);

    const history = getHistory();

    // ✅ call LLM WITH memory
    const aiReply = await askLLM(originalText, history);

    // ✅ store reply
    addToHistory("assistant", aiReply);

    return res.json({
      mode: "llm_fallback",
      message: aiReply
    });

  } catch (err) {
    console.error("Think controller error:", err);
    return res.status(500).json({
      error: "Think controller failed to respond."
    });
  }
}