import { useState, useRef, useEffect } from "react";
import './css/TextGuess.css';

function TextGuess({ textContent, inGuessArea, setTextContent, handleSubmit }) {
    {/* Should be simple thing for accepting text input */}
    // To access an HTML element, we need to do this, attach the variable via 'ref' attribute to the element, then reference as textInput.current in our JS code
    const inputElement = useRef();

    const onChange = (e) => {
        {/*e is the event object that is passed into an event handler func, e.target returns HTML element that triggered event, .value gives its string value*/}
        setTextContent(e.target.value)
    }

    useEffect(() => {
        if (!inGuessArea) {
            inputElement.current.blur();
        }
    }, [inGuessArea])

    return (
        <div className="TextGuess">
            <form onSubmit={(e) => {handleSubmit(e, textContent)}}>
                <input className="input-area" type="text" value={textContent} placeholder="Enter your guess..." onChange={onChange} ref={inputElement} />
            </form>
        </div>
    )
}

export default TextGuess;