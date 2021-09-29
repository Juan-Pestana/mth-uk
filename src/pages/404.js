import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <Seo title="404: Not found" />
    <h1>404: No hay chatbots por aquí</h1>
    <p>
      Me temo que lo que buscas no está por aquí. Revisa la URL de tu
      candidatura
    </p>
  </Layout>
)

export default NotFoundPage
