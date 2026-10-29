import "./css/GiveUpModal.css";
import { useUIContext } from "./contexts/UIContext";

function GiveUpModal({ handleGiveUp, setRenderGiveUpModal }) {
    const uiContext = useUIContext();

    const handleCancel = () => {
        setRenderGiveUpModal(false);
        uiContext.playButtonClick();
    }

    return(
        <div className="GiveUpModal">
            <p className="main-text">Are you sure you wanna <span style={{"color": "red"}}>give up</span>?</p>
            <p className="sub-text">(That's kinda cringe)</p>
            <div className='button-container'>
                <button className='confirm-give-up-button' onClick={handleGiveUp} style={{"color": "rgb(246, 253, 42)"}}>
                    Give Up
                </button>
                <button className='cancel-button' onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default GiveUpModal;
