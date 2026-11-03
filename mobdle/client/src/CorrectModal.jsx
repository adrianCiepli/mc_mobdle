import { useEffect } from "react";
import { useUIContext } from "./contexts/UIContext";
import "./css/CorrectModal.css";

function CorrectModal({ name, fadingOut }) {
    const uiContext = useUIContext();
    const imgPath = "/" + name + ".gif";

    useEffect(() => {
        // match timing to inwards animation
        setTimeout(() => {uiContext.playSuccessConfetti()}, 200);
    }, []);

    return(
        <div className="CorrectModal">
            <p className={'main-text ' + (fadingOut ? 'fading-out' : '')}>You got it!</p>
            <p className={"sub-text " + (fadingOut ? 'fading-out' : '')}>The answer was...</p>
            <img className={"mob-img " + (fadingOut ? 'fading-out' : '')} src={imgPath} alt="Image" />
            <p className={"mob-name " + (fadingOut ? 'fading-out' : '')}>{name}</p>
        </div>
    )
}

export default CorrectModal;
