import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomImageGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["🐶 Dog","🐱 Cat","🦊 Fox","🐼 Panda","🦁 Lion","🐯 Tiger","🦄 Unicorn","🐸 Frog"]}
        title="Random Image Generator"
        subtitle="Spin to pick an image"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random Image Generator" />

export default RandomImageGeneratorPage
