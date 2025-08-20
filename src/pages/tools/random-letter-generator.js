import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomLetterGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["A","B","C","D","E","F","G","H","I","J","K","L"]}
        title="Random Letter Generator"
        subtitle="Spin to pick a letter"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random Letter Generator" />

export default RandomLetterGeneratorPage
