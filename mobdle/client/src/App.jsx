import './css/App.css';
import GuessArea from "./GuessArea";
import bgVideo from "./assets/minecraft_bg1.mp4";
import GuessDisplay from './GuessDisplay';
import {useState, useEffect} from "react";


function App() {
  const [guesses, setGuesses] = useState([]);
  const answer = "Sniffer";

  return (
    <div className="App">
      {/* <video autoPlay muted loop playsInline preload='metadata' className='background-video'>
        <source src={bgVideo} type="video/mp4" />
      </video> */}
      <div className='title-area'>
        <p className='under-title'>The Minecraft Mob Guessing Game</p>
        {/* <h1 className="main-title">Mobdle</h1> */}
        <img src='/title_text.png' className='main-title' style={{width: '30%', height: '35%'}}/>
      </div>
      <div className='guess-area'>
        <GuessArea guesses={guesses} setGuesses={setGuesses} answer={answer} />
      </div>
      <div className='guess-display'>
        <GuessDisplay guesses={guesses} setGuesses={setGuesses} answer={answer} />
      </div>
    </div>
  );
}

export default App;