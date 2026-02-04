import mobs from "./data/mobs";
import Option from "./Option";

function Dropdown({ inTextArea }) {
    {/* Dynamic Dropdown menu that renders options matching text input, need a prop passed for this from TextGuess */}
    return (
        <div className="Dropdown">
            {inTextArea ? <><Option name="Allay" /> <Option name="Zombie" /> <Option name="Iron Golem" /> <Option name="Rabbit" /> </> : <></>}
        </div>
    )
}

export default Dropdown;