import "./css/GiveUpModal.css";

function GiveUpModal({ handleGiveUp, setRenderGiveUpModal }) {

    const handleCancel = () => {
        setRenderGiveUpModal(false);
    }

    return(
        <div className="GiveUpModal">
            <p className="main-text">Are you sure you wanna <span style={{"color": "yellow"}}>give up</span>?</p>
            <p className="sub-text">(That's kinda cringe)</p>
            <div className='button-container'>
                <button className='confirm-give-up-button' onClick={handleGiveUp} style={{"color": "rgb(254, 53, 53)"}}>Give Up</button>
                <button className='cancel-button' onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default GiveUpModal;
