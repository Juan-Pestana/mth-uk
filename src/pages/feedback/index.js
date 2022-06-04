import React, { useState, useEffect } from "react"
import "../../components/layout.css"
import Iframe from "react-iframe"
import Seo from "../../components/seo"
import axios from "axios"
import SelectPopup from "../../components/SelectPopup"
import Select from "react-select"
import { certificados } from "../../utils/options"
import * as queryString from "query-string"

const FeedbackPageUK = ({ location }) => {
  const feedback = "Sí"
  const { name, c } = queryString.parse(location.search)

  const [sel, setSel] = useState([])
  const [selectInput, setSelectInput] = useState("")
  const [visibility, setVisibility] = useState(false)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState("no sesion")

  const headers = {
    Authorization: "bearer 40b3ff5fdeaf4ca6851eecadd6eec23c",
  }

  useEffect(() => {
    getBotId()
    eventSubscribe()
  }, [])

  const getBotId = async () => {
    try {
      const getBotId = await axios({
        method: "get", //you can set what request you want to be
        url:
          "https://api.33bot.io/v1/conversation/chat/6267c7f5790f0f0009b7a96f/bots",
        headers,
      })
      //const bot_id = getBotId.data[0].id

      const newSession = await axios({
        method: "post", //you can set what request you want to be
        url: "https://api.33bot.io/v1/conversation/create",
        data: {
          bot_id: getBotId.data[0].id,
        },
        headers,
      })

      const someSession = newSession.data.id
      setSession(someSession)

      const updateSession = await axios({
        method: "post", //you can set what request you want to be
        url: "https://api.33bot.io/v1/conversation/update",
        data: {
          session_id: someSession,
          global_vars: {
            nombre: {
              text: name,
              value: name,
            },
            candidatura_seleccionada: {
              text: c,
              value: c,
            },
            feedback: {
              text: feedback,
              value: feedback,
            },
          },
        },
        headers,
      })

      if (updateSession.data.status === "ok") {
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  console.log(`iniciando chatbot con sesión ${session}`)

  const updateData = async () => {
    const data = sel.map(sel => sel.value)

    await axios({
      method: "post", //you can set what request you want to be
      url: "https://api.33bot.io/v1/conversation/message/user",
      data: {
        session_id: session,
        payload: data.join(", "),
        text: data.join(", "),
      },
      headers,
    })
    setSel([])
  }

  let popupCloseHandler = async () => {
    await updateData()
    //setSel([])
    setVisibility(false)
    console.log(sel)
  }

  let changeHandler = value => {
    if (value[0]) {
      setSel([...value])
    } else {
      setSel([value])
    }
  }

  const eventSubscribe = () => {
    window.addEventListener(
      "message",
      function (event) {
        const data = event.data
        if (event.data.event) {
          switch (data.event) {
            case "clearStorage":
              localStorage.removeItem("session")
              break
            case "openSelect1":
              //setSel([])
              setSelectInput("cert single")
              setVisibility(true)
              break
            default:
              console.log(data)
          }
        }
      },
      false
    )
  }

  return (
    <>
      <Seo title="Feeback Modern Talent Hub" />

      <div style={{ width: "100vw", height: "100vh" }}>
        {loading ? (
          <p> Cargando... </p>
        ) : (
          <Iframe
            url={`https://chat.33bot.io/626a685ddd786d0009a4e72f?r=web&close=0&session=${session}`}
            width="100%"
            height="100%"
            allow="camera;microphone"
            frameborder="0"
          />
        )}
        <SelectPopup
          onClose={popupCloseHandler}
          show={visibility}
          selection={sel}
          title={
            selectInput === "cert single"
              ? "Diga-nos a Certificação do seu programa"
              : selectInput === "cert multi"
              ? "Quais outras certificações você tem?"
              : selectInput === "devops"
              ? "Sua Stack Dev/Ops"
              : "selecione suas ferramentas"
          }
        >
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="certificados"
            value={sel}
            options={certificados}
            onChange={changeHandler}
          />
        </SelectPopup>
      </div>
    </>
  )
}

export default FeedbackPageUK
