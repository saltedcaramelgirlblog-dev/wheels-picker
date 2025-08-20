/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import React from "react"
import Layout from "./src/components/layout"

export const wrapPageElement = ({ element, props }) => {
  const path = props?.location?.pathname || ""
  if (path === "/" || path.startsWith("/tools/")) {
    return element
  }
  return <Layout>{element}</Layout>
}

// You can delete this file if you're not using it
