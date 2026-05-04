import './css/Tile.css';

function Tile({type, value, correctness, special}) {
    let classString = "";
    let needUpArrow = false;
    let needDownArrow = false;

    if (correctness === "eq") {
        classString = "correct";
    } else if (correctness === "neq") {
        classString = "wrong";
    } else if (correctness === "high-close") {
        classString = "close downarrow";
    } else if (correctness === "high-far") {
        classString = "wrong downarrow";
    } else if (correctness === "low-close") {
        classString = "close uparrow";
    } else if (correctness === "low-far") {
        classString = "wrong uparrow";
    } else {
        classString = "close";
    }

    return (
        <div className='Tile'>
            <div className={classString}>
                {/* Passing array into any JSX means react takes the literal items and turns them into separate HTML entities raw*/}
                {/* In our case with an array of strings for spawn, these just turn into regular text side-by-side in HTML <p> tag, so we turn into our own string first*/}
                {/* However, if we try and do that here with value.join(", "), then some non-array value-props throw an error, hence we do the .join() in GuessDisplay.jsx*/}
                <p className='text'>{(() => {
                    if (special === "height") {
                        return value + " blocks";
                    } else if (special === "tameable") {
                        return value ? "Yes" : "No";
                    } else {
                        return value;
                    }
                })()}</p>
            </div>
        </div>
    )
}

export default Tile;