import React, { useEffect, useState } from "react"
//import popupStyles from "./custom-popup.module.css"

const SelectPopup = props => {
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")

  const closeHandler = e => {
    if (!props.selection.length) {
      setError("this is an error")
      setTimeout(() => {
        setError("")
      }, 3000)
      return
    }

    setShow(false)
    setError(false)

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
        <span
          className="close"
          onClick={closeHandler}
          style={{ display: "none" }}
        >
          &times;
        </span>
        <hr />
        <div className="content">
          <div>{props.children}</div>

          <div>
            {error && (
              <div className="error">
                <div>Please select a valid input</div>
                <small>"Other" or "None" are also valid</small>
              </div>
            )}
            <button onClick={closeHandler}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectPopup
