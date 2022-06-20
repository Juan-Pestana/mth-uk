/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  React.useEffect(() => {
    run()
  }, [])

  let run = () => {
    window.criteo_q = window.criteo_q || []

    var deviceType = /iPad/.test(navigator.userAgent)
      ? "t"
      : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(
          navigator.userAgent
        )
      ? "m"
      : "d"

    window.criteo_q.push(
      { event: "setAccount", account: 97048 },

      { event: "setSiteType", type: deviceType },

      { event: "viewItem", item: "1" }
    )
  }

  return (
    <>
      {/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}

      <main>{children}</main>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
