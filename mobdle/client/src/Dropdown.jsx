import mobs from "./data/mobs";
import Option from "./Option";
import './css/Dropdown.css'

function Dropdown({ inGuessArea, textContent, handleSubmit, mobOptions }) {
    // Dynamic Dropdown menu that renders options matching text input, need a prop passed for this from TextGuess
    /**
     * Initially I had here the derivation of mobOptions from textArea (which is now derived in GuessArea), and I would call setMobOptions in this function.
     * The issue is, this function is part of the rendering of the component, meaning essentially it is not within an event handler, useEffect, ...
     * This means that every time this component render, I change the state of the app in that moment as well.
     * Rendering does not necessarily mean inside the return statement, just any code that executes within the function that is not "locked" by some event or something.
     * This means that you can easily end up with infinite loops of re-rendering constantly (technically not always), but this is just a bad practice
     * Renders themselves should not change states, only events and interactions with the render should cause that which cause re-renders.
     */
    const renderDropdown = () => {
         return mobOptions.map((mobName) => {return <Option key={mobName} name={mobName} handleSubmit={handleSubmit} />})
    }

    return ( 
        // The {} embeds JS that returns some HTML, so either just text or some actual HTML code, so {renderDropdown()} is unnecessary because it is not embedded in HTML code
        // It's actually just in some JavaScript code so you do not need to escape from HTML to JS.
        <div className="Dropdown">
            {inGuessArea && textContent.length > 2 ? 
            renderDropdown() : 
            <></>}
        </div>
    )
}

export default Dropdown;