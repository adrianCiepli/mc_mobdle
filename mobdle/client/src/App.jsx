import './css/App.css';
import GuessArea from "./GuessArea";
import bgVideo from "./assets/minecraft_bg1.mp4";
import GuessDisplay from './GuessDisplay';
import mobs from './data/mobs.js';
import { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";


function App() {
  const [guesses, setGuesses] = useState([]);
  const ANIMATIONTIME = 4.5; // seconds, time for a new guess tile-row to fully flip over
  const mobNames = Object.keys(mobs);
  const answer = useRef(mobNames[Math.floor(Math.random() * mobNames.length)]);

  // Non-functional code that just uses each .gif so that there is no initial-fetch lag the first time they are needed in DropDown menu
  useEffect(() => {
    Object.keys(mobs).forEach(name => {
        const img = new Image();
        img.src = `/${name}.gif`;
    });
  }, []);

  useEffect(() => {
    console.log("Answer: ", answer.current);
  }, [answer]);

  return (
    <div className="App">
      <div className='title-area'>
        <p className='under-title'>The Minecraft Mob Guessing Game</p>
        {/* <h1 className="main-title">Mobdle</h1> */}
        <img src='/title_text.png' className='main-title' style={{ width: '30%', height: '35%' }} />
      </div>
      <div className='guess-area'>
        <GuessArea guesses={guesses} setGuesses={setGuesses} answer={answer.current} ANIMATIONTIME={ANIMATIONTIME} />
      </div>
      <div className='guess-display'>
        <GuessDisplay guesses={guesses} setGuesses={setGuesses} answer={answer.current} ANIMATIONTIME={ANIMATIONTIME} />
      </div>
    </div>
  );
}

export default App;