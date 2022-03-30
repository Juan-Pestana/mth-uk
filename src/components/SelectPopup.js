import React, { useEffect, useState } from "react"
//import popupStyles from "./custom-popup.module.css"

const SelectPopup = props => {
  const [show, setShow] = useState(false)

  const closeHandler = e => {
    setShow(false)

    props.onClose(false)
  }

  useEffect(() => {
    setShow(props.show)
  }, [props.show])

  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        opacity: show ? "1" : "0",
      }}
      className="ovrlay"
    >
      <div className="popup">
        <h2>{props.title}</h2>
        <span className="close" onClick={closeHandler}>
          &times;
        </span>
        <hr />
        <div className="content">
          <div>{props.children}</div>
          <div>
            <button onClick={closeHandler}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectPopup
