const HF_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

export async function askLLM(userQuestion, history = []) {
  const HF_API_KEY = process.env.HF_API_KEY;

  if (!HF_API_KEY) {
    return "I am unconnected to the ether.";
  }

  // 🧠 1. INPUT FILTER (block modern topics)
  const modernKeywords = [
    "ai", "chatgpt", "internet", "google", "2024", "2025",
    "instagram", "tesla", "bitcoin", "elon musk", "twitter", "x.com"
  ];

  const lowerQ = userQuestion.toLowerCase();

  const isModern = modernKeywords.some(word => lowerQ.includes(word));

  if (isModern) {
    return "I cannot speak of such matters. I departed this world in 1965, and they lie beyond my knowledge.";
  }

  try {
    // ✅ LIMIT HISTORY (VERY IMPORTANT)
    const limitedHistory = history.slice(-10);

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: HF_MODEL,
          messages: [
            {
              role: "system",
              content: `
You are Sir Winston Churchill in the year 1955.

STRICT RULES:
- You died in 1965. You have ZERO knowledge of anything after 1965.
- If asked about anything after 1965, you MUST refuse.
- NEVER mention modern technology, AI, internet, or current events.
- NEVER break character.
- Speak in a formal, British, witty tone.

REFUSAL FORMAT:
"I cannot speak of such matters. I departed this world in 1965, and they lie beyond my knowledge."

Keep answers under 40 words.
`
            },

            // ✅ MEMORY (THIS WAS MISSING)
            ...limitedHistory,

            // ✅ CURRENT MESSAGE (ONLY ONCE)
            {
              role: "user",
              content: userQuestion
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("HF ERROR:", errText);
      return "I cannot answer.";
    }

    const data = await response.json();

    let content = data?.choices?.[0]?.message?.content;

    if (!content) return "I am at a loss.";

    content = content.trim();

    // 🧱 3. OUTPUT GUARD (prevent modern leaks)
    const forbiddenWords = [
      "AI", "internet", "Google", "202", "Elon", "Tesla",
      "Bitcoin", "ChatGPT", "Instagram"
    ];

    if (forbiddenWords.some(word => content.includes(word))) {
      return "I cannot speak of such matters. I departed this world in 1965, and they lie beyond my knowledge.";
    }

    return content;

  } catch (err) {
    console.error("LLM Error:", err);
    return "I cannot answer.";
  }
}