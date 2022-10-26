import React, { useEffect, useState } from "react"

const PopupContainer = props => {
    const [show, setShow] = useState(false)

    const closeHandler = () => {
        setShow(false)
        props.onClose(false)
    }

    useEffect(() => {
        setShow(props.show)
    }, [props.show])

    return (
        <div
            style={{
                display: show ? "block" : "none",
                visibility: show ? "visible" : "hidden",
                opacity: show ? "1" : "0",
            }}
            className="ovrlay"
        >
            <div className="popup">
                <h2>{props.title}</h2>
                <span
                    className="close"
                    role={"none"}
                    onClick={closeHandler}
                >
          &times;
        </span>
                <hr />
                <div className="content">
                    <div>{props.children}</div>
                    {props.showButton && <div>
                        <button onClick={closeHandler}>{props.button}</button>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default PopupContainer