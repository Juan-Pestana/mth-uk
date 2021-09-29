import React, { useState, useEffect } from "react"
import "../components/layout.css"
import Iframe from "react-iframe"
import Seo from "../components/seo"
import axios from "axios"
import * as queryString from "query-string"

const InbPage = ({ location }) => {
  const { candidatura, candidato } = queryString.parse(location.search)

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
          "https://api.33bot.io/v1/conversation/chat/60d330fdf399c400082b0cec/bots",
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
            sfCandidato: {
              text: parseInt(candidato),
              value: parseInt(candidato),
            },
            sfCandidatura: {
              text: parseInt(candidatura),
              value: parseInt(candidatura),
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
    console.log(`iniciando chatbot con sesión ${session}`)
  }

  return (
    <>
      <Seo title="Trabaja en El Corte Inglés" />
      <div style={{ width: "100vw", height: "100vh" }}>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <Iframe
            url={`https://chat.33bot.io/60d461a666f3de0008c371df?r=web&close=0&session=${session}`}
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

export default InbPage
