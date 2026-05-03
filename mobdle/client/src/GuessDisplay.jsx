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


function GuessDisplay({guesses, setGuesses, answer}) {
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
                <p>Name</p><p>Dimension</p><p>Hostility</p><p>Hearts</p><p>Movement</p><p>Height</p><p>Tameable</p><p>Release</p>
            {guesses.map((guess, index) => {
                const cguess = capitalizeAll(guess);
                const ans = mobs[answer];
                const g = mobs[cguess];
                
                // Format: // name, dimension, hostility, hp, movement, height, tameable, releaseVersion
                const name = cguess === answer ? "eq" : "neq";
                const dimension = ans.dimension === g.dimension ? "eq" : "neq";
                const hostility = ans.hostility === g.hostility ? "eq" : "neq";
                const movement = ans.movement === g.movement ? "eq" : "neq";
                const tameable = ans.tameable === g.tameable ? "eq" : "neq";

                let hp = "";
                const HP_CLOSENESS_THRESHOLD = 1;
                if (ans.hp === g.hp) {
                    hp = "eq";
                } else if (ans.hp < g.hp) {
                    if (g.hp - ans.hp < HP_CLOSENESS_THRESHOLD) {
                        hp = "high-close";
                    } else {
                        hp = "high-far";
                    }
                } else {
                    if (ans.hp - g.hp < HP_CLOSENESS_THRESHOLD) {
                        hp = "low-close";
                    } else {
                        hp = "low-far";
                    }
                }

                let height = "";
                const HEIGHT_CLOSENESS_THRESHOLD = 0.3;
                if (ans.height === g.height) {
                    height = "eq";
                } else if (ans.height < g.height) {
                    if (g.height - ans.height < HEIGHT_CLOSENESS_THRESHOLD) {
                        height = "high-close";
                    } else {
                        height = "high-far";
                    }
                } else {
                    if (ans.height - g.height < HEIGHT_CLOSENESS_THRESHOLD) {
                        height = "low-close";
                    } else {
                        height = "low-far";
                    }
                }

                let release = "";
                let ansRelease = ans.releaseVersion.split(".");
                let gRelease = g.releaseVersion.split(".");
                // parseInt takes second arg as base of integer, good for sanity to include base 10
                let i = 0;
                while (i < Math.min(ansRelease.length, gRelease.length)) {
                    if (parseInt(gRelease[i], 10) < parseInt(ansRelease[i], 10)) {
                        release = "low-far";
                        break;
                    } else if (parseInt(gRelease[i], 10) > parseInt(ansRelease[i], 10)) {
                        release = "high-far";
                        break;
                    }
                    i++;
                }
                if (i === Math.min(ansRelease.length, gRelease.length)) {
                    if (gRelease.length < ansRelease.length) {
                        release = "low-far";
                    } else if (gRelease.length > ansRelease.length) {
                        release = "high-far";
                    } else {
                        release = "eq";
                    }
                }

                let lastTile = "";
                if (!initialMount.current && index === 0) {
                    lastTile = "tile-flip";
                }

                // r/w = right/wrong, h/l = higher/lower
                // Format: // name, dimension, hostility, hp, movement, height, tameable, releaseVersion
                // Since the index of the first is always 0, don't use as key since doing so means React sees this first element on key=(index=0) as the same element on re-render
                // where the class has not changed, it has .tile-flip on previous render and now the same, so the animation does not trigger since class is constant on render
                if (index === 0) {
                    return (
                        <div className="row" key={guesses.length - index}>
                            <div className={lastTile} style={{animationDelay: "0s"}}><Tile type={"r/w"} value={cguess} correctness={name} special={""}/></div>
                            <div className={lastTile} style={{animationDelay: "0.5s"}}><Tile type={"r/w"} value={g.dimension.split(",").join(", ")} correctness={dimension} special={""}/></div>
                            <div className={lastTile} style={{animationDelay: "1s"}}><Tile type={"r/w"} value={g.hostility} correctness={hostility} special={""} /></div>
                            <div className={lastTile} style={{animationDelay: "1.5s"}}><Tile type={"h/l"} value={g.hp} correctness={hp} special={"heart"} /></div>
                            {/* Passing array in makes React just mash all items into one string, so we turn into string ourselves*/}
                            {/* See Tile.jsx for additional comments */}
                            <div className={lastTile} style={{animationDelay: "2s"}}><Tile type={"r/w"} value={g.movement.split(",").join(", ")} correctness={movement} special={""} /></div>
                            <div className={lastTile} style={{animationDelay: "2.5s"}}><Tile type={"h/l"} value={g.height} correctness={height} special={"height"} /></div>
                            <div className={lastTile} style={{animationDelay: "3s"}}><Tile type={"r/w"} value={g.tameable} correctness={tameable} special={"tameable"} /></div>
                            <div className={lastTile} style={{animationDelay: "3.5s"}}><Tile type={"h/l"} value={g.releaseVersion} correctness={release} special={""} /></div>
                        </div>
                    )  
                } else {
                    return (
                        <div className="row" key={guesses.length - index}>
                            <div className={lastTile}><Tile type={"r/w"} value={cguess} correctness={name} special={""}/></div>
                            <div className={lastTile}><Tile type={"r/w"} value={g.dimension.split(",").join(", ")} correctness={dimension} special={""}/></div>
                            <div className={lastTile}><Tile type={"r/w"} value={g.hostility} correctness={hostility} special={""} /></div>
                            <div className={lastTile}><Tile type={"h/l"} value={g.hp} correctness={hp} special={"heart"} /></div>
                            {/* Passing array in makes React just mash all items into one string, so we turn into string ourselves*/}
                            {/* See Tile.jsx for additional comments */}
                            <div className={lastTile}><Tile type={"r/w"} value={g.movement.split(",").join(", ")} correctness={movement} special={""} /></div>
                            <div className={lastTile}><Tile type={"h/l"} value={g.height} correctness={height} special={"height"} /></div>
                            <div className={lastTile}><Tile type={"r/w"} value={g.tameable} correctness={tameable} special={"tameable"} /></div>
                            <div className={lastTile}><Tile type={"h/l"} value={g.releaseVersion} correctness={release} special={""} /></div>
                        </div>
                    )
                }
            })}
            </div>
        </div>
    )
}

export default GuessDisplay;