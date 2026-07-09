import './css/App.css';
import GuessArea from "./GuessArea";
import GuessDisplay from './GuessDisplay';
import mobs from './data/mobs.js';
import { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";

function App() {
  const [guesses, setGuesses] = useState([]); // Format: // guess = {name, correct, dimension, hostility, hp, movement, height, tameable, release}
  const ANIMATIONTIME = 4.5; // seconds, time for a new guess tile-row to fully flip over
  const mobNames = Object.keys(mobs);
  const [gotCorrect, setGotCorrect] = useState(false);
  const [guessShareable, setGuessShareable] = useState("");
  const [copied, setCopied] = useState(false);
  // const answer = useRef(mobNames[Math.floor(Math.random() * mobNames.length)]);

  // Non-functional code that just uses each .gif so that there is no initial-fetch lag the first time they are needed in DropDown menu
  useEffect(() => {
    Object.keys(mobs).forEach(name => {
      const img = new Image();
      img.src = `/${name}.gif`;
    });
    const img = new Image();
    img.src = '/share_white.png';
  }, []);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const todayStr = formatter.format(new Date()); // YYYY-MM-DD

    const cols = ["correct", "dimension", "hostility", "hp", "movement", "height", "tameable", "release"];
    const temp = guesses.map(guess => {
      return cols.map(col => {
        const correctness = guess[col];
        if (correctness === "eq") {
          return "🟩";
        } else if (correctness === "neq" || correctness === "high-far" || correctness === "low-far") {
          return "🟥";
        } else {
          return "🟨";
        }
      }).join(" "); // Each guess gets mapped to a list where each col in cols takes guess[col] and returns a coloured square in the new list, join into string for each guess
    }).join("\n\n"); // The entire array is (at first a list of lists) a list of strings, join them together into one string with lines separated
    const text = `Mobdle (${todayStr}) - ${guesses.length} attempts\n\n${temp}`;
    setGuessShareable(text);
  }, [guesses])

  const handleCopy = () => {
    navigator.clipboard.writeText(guessShareable).then(() => { // It's an async function that returns a Promise, put code that runs after copying is done here:
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    });
  };

  return (
    <div className="App">
      <div className='title-area'>
        <p className='under-title'>The Minecraft Mob Guessing Game</p>
        {/* <h1 className="main-title">Mobdle</h1> */}
        <img src='/title_text.png' className='main-title' style={{ width: '30%', height: '35%' }} />
      </div>
      {/* {gotCorrect && <div className='shareable-guesses' onClick={handleCopy}><img src='/share_white.png' className='share-button' alt='Share Button' />
        <div className='shareable-copy-text'>{copied ? "Copied!" : "Share results"}</div></div>} */}
      {gotCorrect && <div>{copied ? <div className='shareable-guesses-clicked'><img src='/checkmark2.png' className='share-button' alt='Checkmark' /><div className='shareable-copy-text'>Copied!</div></div> :
        <div className='shareable-guesses' onClick={handleCopy}><img src='/share_white.png' className='share-button' alt='Share Button' /><div className='shareable-copy-text'>Share results</div></div>}</div>}

      <div className='guess-area'>
        <GuessArea guesses={guesses} setGuesses={setGuesses} setGotCorrect={setGotCorrect} ANIMATIONTIME={ANIMATIONTIME} />
      </div>
      <div className='guess-display'>
        <GuessDisplay guesses={guesses} setGuesses={setGuesses} ANIMATIONTIME={ANIMATIONTIME} />
      </div>
    </div>
  );
}

export default App;

