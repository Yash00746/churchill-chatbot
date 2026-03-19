import React, { useRef, useEffect } from 'react';

export default function ChatHistory({ messages, isLargeText, toggleFontSize }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const styles = {
    historyPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#d4c4a8',
      height: '100%',
    },
    header: {
      padding: '16px 24px',
      borderBottom: '3px solid #8b7355',
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#4a3d2f',
      background: 'linear-gradient(135deg, #e8d8bf, #d4c4a8)',
      fontFamily: 'Georgia, serif',
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    messageList: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    },
    bubble: (sender) => ({
      maxWidth: '75%',
      padding: '14px 18px',
      borderRadius: '16px',
      alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: sender === 'user' ? '#87ceeb' : '#fffbf0',
      color: sender === 'user' ? '#fff' : '#4a3d2f',
      border: sender === 'user' ? 'none' : '2px solid #c9a86a',
      boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
      fontFamily: 'Georgia, serif',
    }),
  };

  return (
    <div style={styles.historyPanel}>
      <div style={styles.header}>
        <span>Conversation History</span>

        <button
          className={`large-text-toggle ${isLargeText ? "active" : ""}`}
          onClick={toggleFontSize}
          aria-label="Toggle large text"
        >
          {isLargeText ? "Normal Text" : "Large Text"}
        </button>
      </div>

      <div style={styles.messageList}>
        {messages.map(msg => (
          <div key={msg.id} style={styles.bubble(msg.sender)}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
