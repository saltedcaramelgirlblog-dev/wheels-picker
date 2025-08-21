import * as React from "react"
import Seo from "../components/seo"
import PickerWheel from "../components/PickerWheel"
import Footer from "../components/footer"
import "../styles/picker.css"

const IndexPage = () => {
  return (
    <>
      <PickerWheel showWatermarkOnLoad watermarkText="Press to Spin" />
      <Footer />
    </>
  )
}

export const Head = () => (
  <Seo title="Wheels Picker">
    <meta name="google-site-verification" content="hCFUo9BnoLBOReZaSCMOKJiVzCPPX0scHk3Sdfhntb4" />
  </Seo>
)

export default IndexPage
