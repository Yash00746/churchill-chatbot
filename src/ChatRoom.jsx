import React, { useState } from 'react';
import LeftPanel from './LeftPanel';
import ChatHistory from './ChatHistory';
import InputArea from './InputArea';
import './ChatRoom.css';

export default function ChatRoom({ isLargeText, toggleFontSize }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'I am Winston Churchill. What do you want to ask?',
      inHistory: true
    }
  ]);

  const [pendingBotMessage, setPendingBotMessage] = useState(null);

  const filteredMessages = messages.filter(msg => msg.inHistory);

  const handleAsk = async (question) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: question,
      inHistory: true
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question, context: {} })
      });

      const data = await res.json();

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.message,
        inHistory: false
      };

      setMessages(prev => [...prev, botMessage]);
      setPendingBotMessage(botMessage);

    } catch {
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'bot',
        text: "I cannot reach the war room.",
        inHistory: false
      };

      setMessages(prev => [...prev, errorMessage]);
      setPendingBotMessage(errorMessage);
    }
  };

  const handleTypingComplete = (text) => {
    if (pendingBotMessage && pendingBotMessage.text === text) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === pendingBotMessage.id
            ? { ...msg, inHistory: true }
            : msg
        )
      );
      setPendingBotMessage(null);
    }
  };

  return (
    <div className="app-container">
      <LeftPanel messages={messages} onTypingComplete={handleTypingComplete} />

      <div className="chat-wrapper">
        <ChatHistory
          messages={filteredMessages}
          isLargeText={isLargeText}
          toggleFontSize={toggleFontSize}
        />
      </div>

      <InputArea onAsk={handleAsk} />
    </div>
  );
}
