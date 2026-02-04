import './css/App.css';
import GuessArea from "./GuessArea";
import bgVideo from "./assets/minecraft_bg1.mp4";


function App() {
  return (
    <div className="App">
      <video autoPlay muted loop playsInline className='background-video'>
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className='title-area'>
        <p className='under-title'>The Minecraft Guessing Game</p>
        <h1 className="main-title">Mobdle</h1>
      </div>
      <div className='guess-area'>
        <GuessArea />
      </div>
    </div>
  );
}

export default App;