import React, { useState, useEffect } from "react"; // adicionei useEffect
import "../styles/GameZone.css";
import LogoutDock from "../components/LogoutDock";
import BackToProfileDock from "../components/BackToProfileDock";
 
 
 
import flappyBirdImg from "../images/flappy-bird.png";
import StreetF2Img from "../images/StreetF2Img.png";
import pacManImg from "../images/pac-man.png";
import TekkenImg from "../images/tekken.png";
import JojoImg from "../images/jojo.png";
import SonicImg from "../images/sonic.png";
import PoPImg from "../images/pop.png";
import CrashImg from "../images/crash.png";
import MKImg from "../images/mk.png";
import DK2Img from "../images/dk2.png";
import Fifa2KImg from "../images/fifa2k.png";
import InitialDImg from "../images/initiald.png";
 
const games = [
  {
    name: "Flappy Bird",
    thumbnail: flappyBirdImg,
    url: "https://flappybird.io",
    width: 360,
    height: 640,
  },
  {
    name: "Hyper Street Fighter 2: The Anniversary Edition",
    thumbnail: StreetF2Img,
    url: "https://www.retrogames.cc/embed/8805-hyper-street-fighter-2%3A-the-anniversary-edition-031222-japan.html",
    width: 400,
    height: 500,
  },
  {
    name: "Pac-Man",
    thumbnail: pacManImg,
    url: "https://www.retrogames.cc/embed/37240-pac-man-us.html",
    width: 640,
    height: 480,
  },
  {
    name: "Tekken3",
    thumbnail: TekkenImg,
    url: "https://www.retrogames.cc/embed/40238-tekken-3.html",
    width: 640,
    height: 480,
  },
  {
    name: "JoJo's Bizarre Adventure: Heritage for the Future",
    thumbnail: JojoImg,
    url: "https://www.retrogames.cc/embed/8843-jojos-bizarre-adventure%3A-heritage-for-the-future-jojo-no-kimyou-na-bouken%3A-mirai-e-no-isan-japan-990927-no-cd.html",
    width: 640,
    height: 480,
  },
  {
    name: "Sonic The Hedgehog",
    thumbnail: SonicImg,
    url: "https://www.retrogames.cc/embed/30899-sonic-the-hedgehog-usa-europe.html",
    width: 640,
    height: 480,
  },
  {
    name: "Prince Of Persia",
    thumbnail: PoPImg,
    url: "https://www.retrogames.cc/embed/21915-prince-of-persia-europe.html",
    width: 640,
    height: 480,
  },
  {
    name: "Crash Bandicoot",
    thumbnail: CrashImg,
    url: "https://www.retrogames.cc/embed/40784-crash-bandicoot.html",
    width: 640,
    height: 480,
  },
  {
    name: "Mortal Kombat 1",
    thumbnail: MKImg,
    url: "https://www.retrogames.cc/embed/44396-mortal-kombat-1-boss-hack-4-7-fix-by-worm.html",
    width: 640,
    height: 480,
  },
  {
    name: "Donkey Kong Country 2 - Diddy's Kong Quest",
    thumbnail: DK2Img,
    url: "https://www.retrogames.cc/embed/20136-donkey-kong-country-2-diddy-s-kong-quest-germany-en-de.html",
    width: 640,
    height: 480,
  },
  {
    name: "FIFA 2000",
    thumbnail: Fifa2KImg,
    url: "https://www.retrogames.cc/embed/41776-fifa-2000.html",
    width: 640,
    height: 480,
  },
  {
    name: "Initial D",
    thumbnail: InitialDImg,
    url: "https://www.retrogames.cc/embed/42698-initial-d.html",
    width: 640,
    height: 480,
  },
];
 
export default function GameZone() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
 
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
 
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };
 
  return (
    <div className="gamezone-container">
      <div className="side-dock">
        <BackToProfileDock />
        <LogoutDock />
      </div>
 
      <div className="header-container">
        <h1 className="gamezone-title">🎮 Bem-vindo à GameZone!</h1>
 
      </div>
<button
          onClick={toggleTheme}
          aria-label="Alternar tema claro/escuro"
          className="theme-toggle-btn"
        >
          {theme === "light" ? "Modo Escuro 🌙" : "Modo Claro ☀️"}
        </button>
      {!selectedGame ? (
        <>
          <h2 className="games-list-title">Lista de Jogos</h2>
          <div className="game-list">
            {games.map((game) => (
              <div
                key={game.name}
                className="game-card"
                onClick={() => setSelectedGame(game)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") setSelectedGame(game);
                }}
              >
                <img src={game.thumbnail} alt={game.name} />
                <h3 className="game-name">{game.name}</h3>
                <button className="play-button">Jogar</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="game-player">
          <h2 className="selected-game-title">{selectedGame.name}</h2>
          <iframe
            src={selectedGame.url}
            width={selectedGame.width}
            height={selectedGame.height}
            title={selectedGame.name}
            frameBorder="0"
            allowFullScreen
          />
          <br />
          <button onClick={() => setSelectedGame(null)}>↩ Voltar</button>
        </div>
      )}
    </div>
  );
}