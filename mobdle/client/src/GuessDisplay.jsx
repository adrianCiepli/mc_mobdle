import "./css/GuessDisplay.css";
import Tile from "./Tile";
import mobs from "./data/mobs.js";
import {useState, useEffect} from "react";
import {useRef} from "react";

/**
useRef allows you to persist a value between renders
Allows you to store mutable values that does not cause a re-render when updated
Can be used to access a DOM element directly

const count = useRef(0);
useEffect(() => {
count.current = count.current + 1;
});

useRef returns an object called current, it's like doing: const count = {current: 0}, so we access by doing count.current

To access DOM element, create a ref using useRef hook: const inputElement = useRef();
then, attach the ref to the DOM element using the ref attribute in JSX: <input type="text" ref={inputElement} />
Now, inputElement.current will directly give you the same thing as document.getElementById('inputId'), so you can do: inputElement.current.focus(); to give focus.

WARNING:
const obj = { current: true }; // This is correct, then obj.current == true
const { initialMount } = obj; // undefined, there's no "initialMount" key, since this is trying to destructure the object's attributes but fails
*/


function GuessDisplay({guesses, setGuesses, ANIMATIONTIME}) {
    const mountCount = useRef(0);
    const initialMount = useRef(true);

    if (mountCount.current === 0) {
        mountCount.current = 1
    } else if (mountCount.current === 1) {
        initialMount.current = false;
    }


    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function capitalizeAll(s) {
        let arr = s.split(" "); // turns it into an array separated by spaces
        arr = arr.map((word) => capitalize(word)); // No { } means implicit return in one line, map applies function to each item and return array
        return arr.join(" "); // Puts items of array together and separates by space
    }

    // .map() takes an anonymous function that can take 3 args, but does not need to all: (currentValue, index, originalArray)

    return (
        <div className="GuessDisplay">
            <div className="grid">
                <div className="row" key={0}><p>Name</p><p>Dimension</p><p>Hostility</p><p>Hearts</p><p>Movement</p><p>Height</p><p>Tameable</p><p>Release</p></div>
            {guesses.map((guess, index) => {
                const g = mobs[guess.name];
                let lastTile = "";
                if (!initialMount.current && index === 0) {
                    lastTile = "tile-flip";
                }

                // r/w = right/wrong, h/l = higher/lower
                // Format: // guess = {name, correct, dimension, hostility, hp, movement, height, tameable, release}
                // Since the index of the first is always 0, don't use as key since doing so means React sees this first element on key=(index=0) as the same element on re-render
                // where the class has not changed, it has .tile-flip on previous render and now the same, so the animation does not trigger since class is constant on render
                const interval = (ANIMATIONTIME - 1) / 7;
                if (index === 0) {
                    return (
                        <div className="row" key={guesses.length - index+1}>
                            <div className={lastTile} style={{animationDelay: `${interval * 7}s`}}><Tile type={"r/w"} value={guess.name} correctness={guess.correct} special={""}/></div>
                            <div className={lastTile} style={{animationDelay: `${interval * 0}s`}}><Tile type={"r/w"} value={g.dimension.split(",").join(", ")} correctness={guess.dimension} special={""}/></div>
                            <div className={lastTile} style={{animationDelay: `${interval * 1}s`}}><Tile type={"r/w"} value={g.hostility} correctness={guess.hostility} special={""} /></div>
                            <div className={lastTile} style={{animationDelay: `${interval * 2}s`}}><Tile type={"h/l"} value={g.hp} correctness={guess.hp} special={"heart"} /></div>
                            {/* Passing array in makes React just mash all items into one string, so we turn into string ourselves*/}
                            {/* See Tile.jsx for additional comments */}
                            <div className={lastTile} style={{animationDelay: `${interval * 3}s`}}><Tile type={"r/w"} value={g.movement.split(",").join(", ")} correctness={guess.movement} special={""} /></div>
                            <div className={lastTile} style={{animationDelay: `${interval * 4}s`}}><Tile type={"h/l"} value={g.height} correctness={guess.height} special={"height"} /></div>
                            <div className={lastTile} style={{animationDelay: `${interval * 5}s`}}><Tile type={"r/w"} value={g.tameable} correctness={guess.tameable} special={"tameable"} /></div>
                            <div className={lastTile} style={{animationDelay: `${interval * 6}s`}}><Tile type={"h/l"} value={g.releaseVersion} correctness={guess.release} special={""} /></div>
                        </div>
                    )  
                } else {
                    return (
                        <div className="row" key={guesses.length - index+1}>
                            <div className={lastTile}><Tile type={"r/w"} value={guess.name} correctness={guess.correct} special={""}/></div>
                            <div className={lastTile}><Tile type={"r/w"} value={g.dimension.split(",").join(", ")} correctness={guess.dimension} special={""}/></div>
                            <div className={lastTile}><Tile type={"r/w"} value={g.hostility} correctness={guess.hostility} special={""} /></div>
                            <div className={lastTile}><Tile type={"h/l"} value={g.hp} correctness={guess.hp} special={"heart"} /></div>
                            {/* Passing array in makes React just mash all items into one string, so we turn into string ourselves*/}
                            {/* See Tile.jsx for additional comments */}
                            <div className={lastTile}><Tile type={"r/w"} value={g.movement.split(",").join(", ")} correctness={guess.movement} special={""} /></div>
                            <div className={lastTile}><Tile type={"h/l"} value={g.height} correctness={guess.height} special={"height"} /></div>
                            <div className={lastTile}><Tile type={"r/w"} value={g.tameable} correctness={guess.tameable} special={"tameable"} /></div>
                            <div className={lastTile}><Tile type={"h/l"} value={g.releaseVersion} correctness={guess.release} special={""} /></div>
                        </div>
                    )
                }
            })}
            </div>
        </div>
    )
}

export default GuessDisplay;