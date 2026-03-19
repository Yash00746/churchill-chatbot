import React, { useState, useEffect } from 'react';
import './LeftPanel.css';
import churchillNoMouth from './assets/churchill-no-mouth.png';
import churchillMouth from './assets/churchill-mouth.png';

const LeftPanel = ({ messages = [], onTypingComplete }) => {
    const [isThinking, setIsThinking] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [fullText, setFullText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentMessageId, setCurrentMessageId] = useState(null);

    const latestBotMessage = messages.length > 0
        ? [...messages].reverse().find(msg => msg.sender === 'bot')
        : null;

    useEffect(() => {
        if (!fullText) {
            setDisplayedText('');
            setIsSpeaking(false);
            return;
        }

        setIsSpeaking(true);
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setDisplayedText(fullText.substring(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsSpeaking(false);
                if (onTypingComplete) {
                    onTypingComplete(fullText);
                }
            }
        }, 30);

        return () => {
            clearInterval(interval);
            setIsSpeaking(false);
        };
    }, [fullText, onTypingComplete]);

    useEffect(() => {
        setIsThinking(false);
        if (latestBotMessage && latestBotMessage.id !== currentMessageId) {
            setFullText(latestBotMessage.text);
            setCurrentMessageId(latestBotMessage.id);
        }
    }, [latestBotMessage, currentMessageId]);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'user') {
            setIsThinking(true);
            setDisplayedText('');
            setFullText('');
            setIsSpeaking(false);
        }
    }, [messages]);

    const speechContent = isThinking ? 'Thinking...' : displayedText;

    return (
        <div className="left-sidebar">
            <div className="sidebar-content">
                <div className="photo-container">
                    <img
                        src={churchillNoMouth}
                        alt="Winston Churchill"
                        className="animated-photo"
                    />

                    <img
                        src={churchillMouth}
                        alt="Mouth"
                        className={`mouth-overlay ${isSpeaking ? "mouth-speaking" : "mouth-idle"}`}
                    />

                    {(isThinking || fullText) && (
                        <div className="speech-bubble">
                            <p className="speech-text">{speechContent}</p>
                            <div className="speech-pointer"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeftPanel;
