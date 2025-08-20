import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomStateGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["California","Texas","New York","Florida","Illinois","Ohio","Georgia","Pennsylvania"]}
        title="Random State Generator"
        subtitle="Spin to pick a state"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random State Generator" />

export default RandomStateGeneratorPage
