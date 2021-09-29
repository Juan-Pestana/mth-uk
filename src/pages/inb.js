import * as React from "react"
import "../components/layout.css"
import Iframe from "react-iframe"
import Seo from "../components/seo"

const InbPage = () => (
  <>
    <Seo title="Trabaja en El Corte Inglés" />
    <div style={{ width: "100vw", height: "100vh" }}>
      <Iframe
        url="https://chat.33bot.io/60d461a666f3de0008c371df?r=web&close=0"
        width="100%"
        height="100%"
        allow="camera;microphone"
        frameborder="0"
      />
    </div>
  </>
)

export default InbPage
