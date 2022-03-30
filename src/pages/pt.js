import React, { useState, useEffect } from "react"
import "../components/layout.css"
import Iframe from "react-iframe"
import Seo from "../components/seo"
import axios from "axios"
//import * as queryString from "query-string"

const BotPagePt = () => {
  // const name = "Gestor de cobros"

  // const [loading, setLoading] = useState(true)
  // const [session, setSession] = useState("no sesion")

  // const headers = {
  //   Authorization: "bearer 40b3ff5fdeaf4ca6851eecadd6eec23c",
  // }

  // useEffect(() => {
  //   getBotId()
  // }, [])

  // const getBotId = async () => {
  //   try {
  //     const getBotId = await axios({
  //       method: "get", //you can set what request you want to be
  //       url:
  //         "https://api.33bot.io/v1/conversation/chat/618514683a84680008317ab6/bots",
  //       headers,
  //     })
  //     //const bot_id = getBotId.data[0].id

  //     const newSession = await axios({
  //       method: "post", //you can set what request you want to be
  //       url: "https://api.33bot.io/v1/conversation/create",
  //       data: {
  //         bot_id: getBotId.data[0].id,
  //       },
  //       headers,
  //     })

  //     const someSession = newSession.data.id
  //     setSession(someSession)

  //     const updateSession = await axios({
  //       method: "post", //you can set what request you want to be
  //       url: "https://api.33bot.io/v1/conversation/update",
  //       data: {
  //         session_id: someSession,
  //         global_vars: {
  //           candidatura_seleccionada: {
  //             text: name,
  //             value: name,
  //           },
  //         },
  //       },
  //       headers,
  //     })

  //     if (updateSession.data.status === "ok") {
  //       setLoading(false)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   console.log(`iniciando chatbot con sesión ${session}`)
  // }

  return (
    <>
      <Seo title="Trabaja en Modern Talent Hub" />
      <div style={{ width: "100vw", height: "100vh" }}>
        <Iframe
          url={`https://chat.33bot.io/61d425b6a4eee10009187003?r=web&close=0`}
          width="100%"
          height="100%"
          allow="camera;microphone"
          frameborder="0"
        />
      </div>
    </>
  )
}

export default BotPagePt
