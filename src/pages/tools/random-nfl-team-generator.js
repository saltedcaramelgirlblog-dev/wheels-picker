import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomNFLTeamGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["Patriots","Packers","Cowboys","Chiefs","Steelers","49ers","Rams","Eagles"]}
        title="Random NFL Team Generator"
        subtitle="Spin to pick an NFL team"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random NFL Team Generator" />

export default RandomNFLTeamGeneratorPage
