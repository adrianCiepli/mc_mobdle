import TextGuess from "./TextGuess";
import Dropdown from "./Dropdown";
import { useState, useEffect } from "react";
import mobs from "./data/mobs.js";

function GuessArea() {
    {/* Have a text field and a dropdown option that changes dynamically with typing */}
    const [inGuessArea, setInGuessArea] = useState(false);
    const [textContent, setTextContent] = useState("");
    const [guesses, setGuesses] = useState([]);

    let mobOptions = [];
    for (let i=0; i < mobs.length; i++) {
        if (mobs[i].name.toLowerCase().includes(textContent)) {
            mobOptions.push(mobs[i].name);
        }
    }
    /**
     * On refresh, React runs everything from scratch, so states get reset to defaults and the renders that happen right after the refresh are the intial renders.
     */

    // To prevent this from running unnecessarily on EVERY render, this should only run on initial render where a refresh would destroy this needed state
    useEffect(() => {
        if (localStorage.guesses) {
            // localstorage always stores strings in the attributes, so store an object, we need the JSON methods
            // JSON.parse(string) turns a formatted JSON string into an appropriate object
            // JSON.stringify(object) turns an object, including an array, into a JSON formatted string that localStorage can store
            setGuesses(JSON.parse(localStorage.guesses));
        }
    }, [])

    const handleSubmit = (e, value) => {
        e.preventDefault();
        value = value.toLowerCase();
        let isSpecific = false;

        // Covers the case that you click on an option when there's only one, and when you type enough to only match one mob
        if (mobOptions.length === 1) {
            value = mobOptions[0].toLowerCase();
        }

        // Use isSpecific to see if an option was clicked or if full name was typed or, given the above check, if it was typed with only one possible match
        for (let i = 0; i < mobOptions.length; i++) {
            if (value === mobOptions[i].toLowerCase()) {
                isSpecific = true;
            }
        }


        if (value.length > 2 && (isSpecific || mobOptions.length === 1)) {
            if (guesses.includes(value)) {
                console.log("Already guessed: " + value)
            } else {
                console.log("Submitted guess: " + value);
                let temp = guesses;
                temp.push(value);
                setGuesses(temp);
                localStorage.guesses = JSON.stringify(temp);
            }
        } else {
            console.log("Submission rejected")
        }
        setInGuessArea(false);
    }

    const handleFocus = (e) => {
        setInGuessArea(true);
    }

    const handleBlur = (e) => {
        setInGuessArea(false);
    }

    return (
        <div className="GuessArea" onFocus={handleFocus} onBlur={handleBlur} >
            <TextGuess textContent={textContent} inGuessArea={inGuessArea} setTextContent={setTextContent} handleSubmit={handleSubmit} />
            <Dropdown inGuessArea={inGuessArea} textContent={textContent} handleSubmit={handleSubmit} mobOptions={mobOptions} />
        </div>
    )
}

export default GuessArea;