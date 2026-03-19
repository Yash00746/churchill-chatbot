import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">

      <div className="vignette"></div>

      <div className="home-content fade-in">
        <h1 className="home-title">Winston Churchill</h1>
        <p className="home-subtitle">
          Step into history. Ask about his life, his battles, his leadership, and the wisdom that shaped a nation.
        </p>

        <Link to="/chat" className="home-button">
          Enter the War Room
        </Link>
      </div>
    </div>
  );
}
