import { useState } from "react-dom/client";
import './css/TextGuess.css';

function TextGuess({ userGuess, setUserGuess, setInTextArea }) {
    {/* Should be simple thing for accepting text input */}

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const onChange = (e) => {
        {/*e is the event object that is passed into an event handler func, e.target returns HTML element that triggered event, .value gives its string value*/}
        setUserGuess(e.target.value);
    }

    const handleFocus = (e) => {
        setInTextArea(true);
    }

    const handleBlur = (e) => {
        setInTextArea(false);
    }

    return (
        <div className="TextGuess">
            <form onSubmit={handleSubmit}>
                <input className="input-area" type="text" value={userGuess} placeholder="Enter your guess..." onChange={onChange} onFocus={handleFocus} onBlur={handleBlur} />
            </form>
        </div>
    )
}

export default TextGuess;