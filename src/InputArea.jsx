import { useState, useEffect } from "react";
import Button from "./Button.jsx";

export default function InputArea({ onAsk }) {
  const [question, setQuestion] = useState("");
  const [shake, setShake] = useState(false);
  const [randomSuggestions, setRandomSuggestions] = useState([]);
  const [hasSent, setHasSent] = useState(false);

  const suggestions = [
    "Who are you?",
    "What did you do in the war?",
    "When were you born?",
    "Where did you grow up?",
    "What is your purpose?",
    "Tell me something interesting.",
    "What is your biggest achievement?",
    "What were you known for?",
    "What events changed your life?",
    "What wisdom can you share?"
  ];

  useEffect(() => {
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 3));
  }, []);

  const sendQuestion = () => {
    if (!question.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    onAsk(question);
    setQuestion("");
    setHasSent(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const handleSuggestionClick = (text) => {
    onAsk(text);
    setHasSent(true);
  };

  const showSuggestions = !hasSent && question.trim() === "";

  return (
    <div className={`input-area ${showSuggestions ? "with-suggestions" : ""}`}>
      <h3>Ask a Question</h3>

      <div className={`textarea-wrapper ${shake ? "shake" : ""}`}>
        <textarea
          value={question}
          placeholder=""               
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Type your question"
        />
        <label className="floating-label">Type your question here</label>
      </div>

      <Button
        className="ask-button"
        text="Ask Question"
        onClick={sendQuestion}
      />

      {showSuggestions && (
        <>
          <p>Or try one of these questions:</p>
          {randomSuggestions.map((text, index) => (
            <Button
              key={index}
              className="suggestion-button"
              text={text}
              onClick={() => handleSuggestionClick(text)}
            />
          ))}
        </>
      )}
    </div>
  );
}
