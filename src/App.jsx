import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import Home from './Home';
import ChatRoom from './ChatRoom';
import './App.css';

function App() {
  const [isLargeText, setIsLargeText] = useState(
    () => localStorage.getItem("largeText") === "true"
  );

  useEffect(() => {
    localStorage.setItem("largeText", isLargeText);
  }, [isLargeText]);

  return (
    <div className={isLargeText ? "large-text-mode" : ""}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/chat"
            element={
              <ChatRoom
                isLargeText={isLargeText}
                toggleFontSize={() => setIsLargeText(v => !v)}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
