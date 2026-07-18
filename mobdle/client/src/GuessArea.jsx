import TextGuess from "./TextGuess";
import Dropdown from "./Dropdown";
import { useState, useEffect } from "react";
import mobs from "./data/mobs.js";
import confetti from "canvas-confetti";

function GuessArea({ guesses, setGuesses, setGotCorrect, ANIMATIONTIME }) {
    {/* Have a text field and a dropdown option that changes dynamically with typing */ }
    const [inGuessArea, setInGuessArea] = useState(false);
    const [textContent, setTextContent] = useState("");
    const [disabled, setDisabled] = useState(false);

    // Temporarily, while we only have players in Toronto
    function getUserDateString() {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        return formatter.format(new Date()); // e.g. "2026-07-02"
    }

    // Object.keys(dictVar) returns list of all keys of the dictionary
    // List.filter(predicateFunc) will run the predicate for every item and can use item as param, and returns new list of items for which predicate was true on running
    let mobOptions = Object.keys(mobs).filter((mobName) => { return mobName.toLowerCase().includes(textContent.toLowerCase()) });

    /**
     * On refresh, React runs everything from scratch, so states get reset to defaults and the renders that happen right after the refresh are the intial renders.
     */

    // To prevent this from running unnecessarily on EVERY render, this should only run on initial render where a refresh would destroy this needed state
    useEffect(() => {
        // const today = new Date().toLocaleDateString();
        const today = getUserDateString();
        if (localStorage.guesses) {
            // localstorage always stores strings in the attributes, so store an object, we need the JSON methods
            // JSON.parse(string) turns a formatted JSON string into an appropriate object
            // JSON.stringify(object) turns an object, including an array, into a JSON formatted string that localStorage can store
            if (localStorage.date === today) {
                setGuesses(JSON.parse(localStorage.guesses));
                const alreadySolved = JSON.parse(localStorage.guesses).some(g => g.correct === "eq");
                if (alreadySolved) {
                    setDisabled(true);
                    setGotCorrect(true);
                }
            } else {
                localStorage.clear();
                setGuesses([])
            }
        }
        localStorage.date = today;
    }, [])

    const playConfetti = () => {
        var duration = 2 * 1000; // ms
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function () { // runs function repeatedly on ms interval, starting at 0
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval); // this is why we store interval variable, so we can force stop the repeated execution
            }

            var particleCount = 100 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }

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
            if (guesses.some((guess) => guess.name.toLowerCase() === value.toLowerCase())) {
                console.log("Already guessed: " + value);
            } else {
                console.log("Submitting guess: " + value);

                // It's ok to update state here since its inside event listener, which won't auto-run on render
                // It's dangerous inside of a component's return or loosely somewhere where it updates state but also runs on re-render, causing infinite loop
                fetch("api/handle-guess", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({ userGuess: value, userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
                ).then((res) => {
                    if (!res.ok) {
                        throw new Error("Fetch completed but server responded with some error");
                    }
                    return res.json(); // Format: // res/guess = {name, correct, dimension, hostility, hp, movement, height, tameable, release}
                }).then((resBody) => {
                    const newGuesses = [resBody, ...guesses];
                    setGuesses(newGuesses);
                    localStorage.guesses = JSON.stringify(newGuesses);
                    setTextContent("");
                    setDisabled(true);
                    setInGuessArea(false); // bluring handled in TextGuess.jsx
                    if (resBody.correct == "eq") { // Keep input disabled and inGuessArea=false on corrrect guess
                        console.log("Correct!");
                        setTimeout(() => {
                            playConfetti();
                            setGotCorrect(true);
                        }, (ANIMATIONTIME - 0.5) * 1000);
                    } else {
                        setTimeout(() => { // Put user back in text field after animation on wrong guess
                            setDisabled(false);
                            setInGuessArea(true);
                        }, ANIMATIONTIME * 1000)
                    }
                }).catch(err => console.log("Fetch could not complete, error occured:", err)); // Catches any error above, like try/catch
            }
        } else {
            console.log("Submission rejected")
        }
    }

    const handleFocus = (e) => {
        setInGuessArea(true);
    }

    const handleBlur = (e) => {
        setInGuessArea(false);
    }

    return (
        <div className="GuessArea" onFocus={handleFocus} onBlur={handleBlur} >
            <TextGuess textContent={textContent} inGuessArea={inGuessArea} setTextContent={setTextContent} handleSubmit={handleSubmit} disabled={disabled} />
            <Dropdown inGuessArea={inGuessArea} textContent={textContent} handleSubmit={handleSubmit} mobOptions={mobOptions} />
        </div>
    )
}

export default GuessArea;