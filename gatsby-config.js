/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
const netlifyAdapter = (require("gatsby-adapter-netlify").default || require("gatsby-adapter-netlify"))

// Hardcode canonical site URL
const siteUrl = "https://www.wheelspicker.com"

module.exports = {
  adapter: netlifyAdapter(),
  siteMetadata: {
    title: `Wheels Picker - Spin the wheels and make a random decision`,
    description: `Wheels Picker is a fun random spinner that helps you make quick decisions. Just add your choices or names, spin the wheel, and let fate choose the result.`,
    author: `Wheels Picker`,
    siteUrl,
    image: `/icons/icon-512x512.png`,
    keywords: `picker wheel,random picker wheel,random name picker wheel,name picker wheel,random name picker,wheel spin,pickerwheel,spin wheel,wheel decide,wheel of names,spin the wheel,random name picker,wheel spinner,random wheel,randomizer wheel,spinner wheel,spinning wheel,random picker`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // GA4 Measurement ID (hardcoded)
        trackingIds: ["G-MCEY12RWN0"],
        gtagConfig: {
          anonymize_ip: true,
          cookie_flags: "SameSite=None;Secure",
        },
        pluginConfig: {
          head: true,
          respectDNT: true,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Wheels Picker`,
        short_name: `Wheels`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/wheels-picker-icon-512.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap-index.xml`,
        policy: [{ userAgent: `*`, allow: `/` }],
      },
    },
  ],
}
