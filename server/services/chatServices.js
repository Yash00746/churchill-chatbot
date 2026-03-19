
const COMMON_WORDS = new Set([
  "who", "what", "where", "when", "why", "how", 
  "is", "are", "was", "were", "am", "be",
  "do", "does", "did", 
  "can", "could", "would", "should", "will",
  "your", "my", "the", "a", "an", "this", "that",
  "i", "you", "he", "she", "it", "they", "we", "me", "him", "her"
]);


export function isQuestion(input) {
  if (!input) return false;
  if (input.endsWith("?")) return true;
  const questionWords = ["who", "what", "when", "where", "why", "how", "did", "was", "is", "are"];
  return questionWords.some(word => input.startsWith(word + " "));
}


export function chooseWeightedResponse(responses) {
  if (!responses || responses.length === 0) return null;
  
  if (typeof responses[0] === 'string') {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const total = responses.reduce((sum, r) => sum + (r.probability ?? 1), 0);
  let random = Math.random() * total;

  for (const r of responses) {
    random -= (r.probability ?? 1);
    if (random <= 0) return r.text;
  }

  return responses[0].text;
}


export function detectTopic(input, persona) {
  
  const isComparison = /\b(like|similar|compare|same as)\b/i.test(input);
  const isQuestionInput = input.includes("?") || /^(who|what|where|when|why|how|was|did|is|are)\b/i.test(input);

  if (isComparison && isQuestionInput) {
    return "default"; 
  }

 
  let bestTopic = "default";
  let bestScore = 0;

  for (const topic in persona.topics) {
    if (topic === "default") continue; 
    let currentTopicScore = 0;

    persona.topics[topic].forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      
      const pluralVariant = lowerKeyword.endsWith('y') 
          ? lowerKeyword.slice(0, -1) + "ies" 
          : lowerKeyword + "s";

      const isMatch = input.includes(lowerKeyword) || input.includes(pluralVariant);

      if (isMatch) {
         const wordsInKeyword = lowerKeyword.split(" ");
         let keywordPoints = 0;

         wordsInKeyword.forEach(w => {
             
             if (COMMON_WORDS.has(w)) keywordPoints += 1; 
             else keywordPoints += 10; 
         });

         if (wordsInKeyword.length > 1 && input.includes(lowerKeyword)) keywordPoints += 5; 
         if (input === lowerKeyword) keywordPoints += 5;

         currentTopicScore += keywordPoints;
      }
    });

    if (currentTopicScore > bestScore) {
      bestScore = currentTopicScore;
      bestTopic = topic;
    }
  }

  if (bestScore < 3) return "default"; 
  return bestTopic;
}


export function detectDialogueTree(input, persona) {
  if (!persona.dialogueTrees) return null;

  for (const treeName in persona.dialogueTrees) {
    const tree = persona.dialogueTrees[treeName];
    if (tree.triggers && tree.triggers.some(t => input.includes(t.toLowerCase()))) {
      return {
        name: treeName,
        tree
      };
    }
  }
  return null;
}


export function continueDialogueTree(treeState, persona) {
  if (!treeState) return null;

  const { name, nodeId } = treeState;
  const tree = persona.dialogueTrees?.[name];
  if (!tree) return null;

  const currentNode = tree.nodes[nodeId];
  if (!currentNode || !currentNode.options) return { finished: true };

  
  return { tree, currentNode };
}