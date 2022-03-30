import React, { useState, useEffect } from "react"
import "../../components/layout.css"
import Iframe from "react-iframe"
import Seo from "../../components/seo"
import axios from "axios"
import * as queryString from "query-string"

const FeedbackPagePt = ({ location }) => {
  const { name, c } = queryString.parse(location.search)

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState("no sesion")

  const headers = {
    Authorization: "bearer 40b3ff5fdeaf4ca6851eecadd6eec23c",
  }

  useEffect(() => {
    getBotId()
  }, [])

  const getBotId = async () => {
    try {
      const getBotId = await axios({
        method: "get", //you can set what request you want to be
        url:
          "https://api.33bot.io/v1/conversation/chat/61d4163973e5c80008c9363b/bots",
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

  return (
    <>
      <Seo title="Feeback Modern Talent Hub" />

      <div style={{ width: "100vw", height: "100vh" }}>
        {loading ? (
          <p> Cargando... </p>
        ) : (
          <Iframe
            url={`https://chat.33bot.io/61d4262a5ae8f900085ac84b?r=web&close=0&session=${session}`}
            width="100%"
            height="100%"
            allow="camera;microphone"
            frameborder="0"
          />
        )}
      </div>
    </>
  )
}

export default FeedbackPagePt
