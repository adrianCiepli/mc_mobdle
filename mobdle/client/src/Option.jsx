import "./css/Option.css";

function Option({ name }) {
    const imgPath = "/" + name + ".gif";

    return(
        <div className="Option">
            <img src={imgPath} alt="Image" />
            <div className="name">{name}</div>
        </div>
    )
}

export default Option;