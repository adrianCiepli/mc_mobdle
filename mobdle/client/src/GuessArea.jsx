import TextGuess from "./TextGuess";
import Dropdown from "./Dropdown";
import { useState } from "react";

function GuessArea() {
    {/* Have a text field and a dropdown option that changes dynamically with typing */}
    const [userGuess, setUserGuess] = useState("");
    const [inTextArea, setInTextArea] = useState(false);
    return (
        <div className="GuessArea">
            <TextGuess userGuess={userGuess} setUserGuess={setUserGuess} setInTextArea={setInTextArea} />
            <Dropdown userGuess={userGuess} inTextArea={inTextArea} />
        </div>
    )
}

export default GuessArea;