import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomColorGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["Red","Green","Blue","Orange","Purple","Yellow","Pink","Cyan"]}
        title="Random Color Generator"
        subtitle="Spin to pick a color"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random Color Generator" />

export default RandomColorGeneratorPage
