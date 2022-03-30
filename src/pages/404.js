import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <Seo title="404: Not found" />
    <h1>404: No hay chatbots por aquí</h1>
    <p>Me temo que lo que buscas no está por aquí.</p>
    <p>Revisa la URL de tu candidatura.</p>
    <h3 style={{ marginTop: "150px", display: "block" }}>
      ¿A que candidatura te gustaría aplicar?
    </h3>
    <div>
      <Link to="/atc">Atención al cliente</Link>
    </div>
    <div>
      <Link to="/ventas">Teleoperador comercial</Link>
    </div>

    <div>
      <Link to="/rec">Teleoperador recobros</Link>
    </div>
    <div>
      <Link to="/tec">Asistencia técnica</Link>
    </div>
  </Layout>
)

export default NotFoundPage
