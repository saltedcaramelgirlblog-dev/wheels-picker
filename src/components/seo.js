/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

function Seo({ description, title, children, image, pathname, keywords }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
            image
            keywords
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const siteUrl = site.siteMetadata?.siteUrl || ''
  const canonical = pathname ? `${siteUrl}${pathname}` : null
  const defaultImage = site.siteMetadata?.image
  const metaImage = image || defaultImage
  const metaKeywords = keywords || site.siteMetadata?.keywords

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="google-site-verification" content="hCFUo9BnoLBOReZaSCMOKJiVzCPPX0scHk3Sdfhntb4" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {metaImage && <meta property="og:image" content={`${siteUrl}${metaImage}`} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      {metaImage && <meta name="twitter:image" content={`${siteUrl}${metaImage}`} />}
      {children}
    </>
  )
}

export default Seo
