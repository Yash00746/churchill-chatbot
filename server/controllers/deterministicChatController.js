import { askLLM } from "../services/llmService.js";
import { 
  detectTopic, 
  detectDialogueTree, 
  chooseWeightedResponse 
} from "../services/chatServices.js";

import { addToHistory, getHistory } from "../services/chatHistory.js";

export async function handleDeterministicChat(req, res) {
  try {
    const persona = req.app.locals.persona;
    const rawInput = req.body.text || "";
    const input = rawInput.toLowerCase().trim();
    const context = req.body.context || { currentTopic: null, treeState: null };
    let nextContext = { ...context };

    if (!persona) {
      return res.status(500).json({ error: "Server Error: Persona not loaded" });
    }

    // ✅ add user message to memory
    addToHistory("user", rawInput);

    // ---------------- Dialogue Tree ----------------
    if (context.treeState) {
      const { name, nodeId } = context.treeState;
      const tree = persona.dialogueTrees[name];
      const currentNode = tree.nodes[nodeId];

      const matchOption = Object.keys(currentNode.options).find(opt =>
        input.includes(opt)
      );

      if (matchOption) {
        const nextNodeId = currentNode.options[matchOption];
        const nextNode = tree.nodes[nextNodeId];

        addToHistory("assistant", nextNode.bot);

        return res.json({
          mode: "dialogue_tree",
          context: { ...nextContext, treeState: { name, nodeId: nextNodeId } },
          message: nextNode.bot
        });
      }

      nextContext.treeState = null;
    }

    // ---------------- Start Dialogue Tree ----------------
    const treeMatch = detectDialogueTree(input, persona);
    if (treeMatch) {
      const msg = treeMatch.tree.nodes[treeMatch.tree.startNode].bot;

      addToHistory("assistant", msg);

      return res.json({
        mode: "dialogue_tree",
        context: {
          ...nextContext,
          treeState: {
            name: treeMatch.name,
            nodeId: treeMatch.tree.startNode
          }
        },
        message: msg
      });
    }

    // ---------------- Script Matching ----------------
    let finalTopic = detectTopic(input, persona);

    if (finalTopic !== "default") {
      console.log(`📜 Script Match: "${finalTopic}"`);

      let reply;
      nextContext.currentTopic = finalTopic;

      if (finalTopic === "greetings") {
        const hour = new Date().getHours();
        reply = hour < 12 ? "Good morning." : "Good evening.";
      } else {
        reply = chooseWeightedResponse(persona.responses[finalTopic]);
      }

      addToHistory("assistant", reply);

      return res.json({
        mode: "chat",
        topic: finalTopic,
        message: reply,
        context: nextContext
      });
    }

    // ---------------- LLM FALLBACK ----------------
    console.log(`🤖 No Script. Calling LLM...`);

    const history = getHistory();

    const aiReply = await askLLM(rawInput, history);

    addToHistory("assistant", aiReply);

    return res.json({
      mode: "llm_reply",
      topic: "llm_fallback",
      message: aiReply,
      context: nextContext
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "I am unable to think clearly.",
      error: err.message
    });
  }
}