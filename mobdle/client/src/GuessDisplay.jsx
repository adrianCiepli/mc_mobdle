import "./css/GuessDisplay.css";
import Tile from "./Tile";
import mobs from "./data/mobs.js";
import {useState, useEffect} from "react";

function GuessDisplay({guesses, setGuesses, answer}) {

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function capitalizeAll(s) {
        let arr = s.split(" "); // turns it into an array separated by spaces
        arr = arr.map((word) => capitalize(word)); // No { } means implicit return in one line, map applies function to each item and return array
        return arr.join(" "); // Puts items of array together and separates by space
    }

    // TODO: have a useEffect that, on guess update, will update the display and will do fancy animation for newest guess only

    return (
        <div className="GuessDisplay">
            <div className="grid">
                <p>Name</p><p>Dimension</p><p>Hostility</p><p>Hearts</p><p>Movement</p><p>Height</p><p>Tameable</p><p>Release</p>
            {guesses.map((guess) => {
                const cguess = capitalizeAll(guess);
                const ans = mobs[answer];
                const g = mobs[cguess];
                
                // Format: // name, dimension, hostility, hp, movement, height, tameable, releaseVersion
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

                // r/w = right/wrong, h/l = higher/lower
                // Format: // name, dimension, hostility, hp, movement, height, tameable, releaseVersion
                return (
                    <div className="row" key={guess}>
                        <p>{cguess}</p>
                        <Tile type={"r/w"} value={g.dimension} correctness={dimension} special={""} />
                        <Tile type={"r/w"} value={g.hostility} correctness={hostility} special={""} />
                        <Tile type={"h/l"} value={g.hp} correctness={hp} special={"heart"} />
                        {/* Passing array in makes React just mash all items into one string, so we turn into string ourselves*/}
                        {/* See Tile.jsx for additional comments */}
                        <Tile type={"r/w"} value={g.movement} correctness={movement} special={""} />
                        <Tile type={"h/l"} value={g.height} correctness={height} special={"height"} />
                        <Tile type={"r/w"} value={g.tameable} correctness={tameable} special={"tameable"} />
                        <Tile type={"h/l"} value={g.releaseVersion} correctness={release} special={""} />
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default GuessDisplay;