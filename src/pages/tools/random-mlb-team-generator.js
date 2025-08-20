import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomMLBTeamGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["Yankees","Red Sox","Dodgers","Cubs","Giants","Braves","Mets","Astros"]}
        title="Random MLB Team Generator"
        subtitle="Spin to pick an MLB team"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random MLB Team Generator" />

export default RandomMLBTeamGeneratorPage
