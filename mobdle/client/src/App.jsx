import './css/App.css';
import GuessArea from "./GuessArea";
import GuessDisplay from './GuessDisplay';
import GiveUpModal from './GiveUpModal.jsx';
import mobs from './data/mobs.js';
import { useUIContext } from './contexts/UIContext.jsx';
import { useState, useEffect } from "react";
import CorrectModal from './CorrectModal.jsx';

function App() {
  const [guesses, setGuesses] = useState([]); // Format: // guess = {name, correct, dimension, hostility, hp, movement, height, tameable, release}
  const ANIMATIONTIME = 4.5; // seconds, time for a new guess tile-row to fully flip over
  const [gotCorrect, setGotCorrect] = useState(false);
  const [correctGuess, setCorrectGuess] = useState("");
  const [guessShareable, setGuessShareable] = useState("");
  const [copied, setCopied] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [renderGiveUpModal, setRenderGiveUpModal] = useState(false);
  const [renderCorrectModal, setRenderCorrectModal] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const uiContext = useUIContext();

  // Non-functional code that just uses each .gif so that there is no initial-fetch lag the first time they are needed in DropDown menu
  useEffect(() => {
    Object.keys(mobs).forEach(name => {
      const img = new Image();
      img.src = `/${name}.gif`;
    });
    const img = new Image();
    img.src = '/share_white.png';
  }, []);

  // For the Correct Modal, needs the name of answer for image
  useEffect(() => {
    if (gotCorrect) {
      // Has to be first guess
      setCorrectGuess(guesses[0].name);
    }
  }, [gotCorrect]);

  // Share button functionality
  // ===========================================
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
        } else if (correctness === "gave-up") {
          return "⬜";
        } else {
          return "🟨";
        }
      }).join(" "); // Each guess gets mapped to a list where each col in cols takes guess[col] and returns a coloured square in the new list, join into string for each guess
    }).join("\n\n"); // The entire array is (at first a list of lists) a list of strings, join them together into one string with lines separated
    let text = '';
    if (gaveUp || guesses.some(g => g.correct === "gave-up")) { // the gaveUp hook is false off refresh, setting it on finished-game load would trigger fetch, can't use on its own
      const numAttempts = guesses.length - 1;
      text = `Mobdle (${todayStr}) - GAVE UP after ${numAttempts} attempt(s)\n\n${temp}`;
    } else {
      text = `Mobdle (${todayStr}) - ${guesses.length} attempt(s)\n\n${temp}`;
    }
    setGuessShareable(text);
  }, [guesses, gaveUp])

  const handleCopy = () => {
    navigator.clipboard.writeText(guessShareable).then(() => { // It's an async function that returns a Promise, put code that runs after copying is done here:
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    });
  };
  // ===========================================

  const pointerDownGiveUp = () => {
    if (!disabled) {
      uiContext.playButtonClick();
    }
  }

  const handleGiveUp = () => {
    uiContext.playButtonClick();
    setRenderGiveUpModal(false);
    setGaveUp(true);
  }

  return (
    <div className="App">
      {renderGiveUpModal &&
      <div className='dark-screen-cover'>
        <GiveUpModal handleGiveUp={handleGiveUp} setRenderGiveUpModal={setRenderGiveUpModal} />
      </div>}
      {renderCorrectModal &&
      <div className={'dark-screen-cover ' + (fadingOut ? 'fading-out' : '')}>
        <CorrectModal name={correctGuess} fadingOut={fadingOut} />
      </div>}
      <div className='title-area'>
        <button className='give-up-button' onPointerDown={pointerDownGiveUp} onClick={() => {setRenderGiveUpModal(true);}} disabled={disabled || gotCorrect}>Give Up ☹</button>
        <p className='under-title'>The Minecraft Mob Guessing Game</p>
        <img src='/title_text.png' className='main-title' draggable={false}/>
      </div>
      {gotCorrect &&
      <div className='share-wrapper'>
        <div className='share-grid-child'>
          <div className={'shareable-guesses ' + (copied ? 'clicked' : '')}
                onPointerDown={copied ? undefined : uiContext.playButtonClick} onClick={copied ? undefined : handleCopy}>
            <img src={copied ? '/checkmark2.png' : '/share_white.png'} className='share-button' alt={copied ? 'Checkmark' : 'Share Button'} />
            <div className='shareable-copy-text'>{copied ? 'Copied!' : 'Share results'}</div>
          </div>
        </div>
      </div>}

      <div className='guess-area'>
        <GuessArea guesses={guesses} setGuesses={setGuesses} setGotCorrect={setGotCorrect} ANIMATIONTIME={ANIMATIONTIME} gaveUp={gaveUp} setGaveUp={setGaveUp}
                    disabled={disabled} setDisabled={setDisabled} setRenderCorrectModal={setRenderCorrectModal} setFadingOut={setFadingOut} />
      </div>
      <div className='guess-display'>
        <GuessDisplay guesses={guesses} ANIMATIONTIME={ANIMATIONTIME} />
      </div>
    </div>
  );
}

export default App;

