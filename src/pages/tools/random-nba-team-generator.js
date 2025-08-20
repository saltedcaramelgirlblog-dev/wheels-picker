import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomNBATeamGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["Lakers","Celtics","Warriors","Bulls","Heat","Spurs","Suns","Knicks"]}
        title="Random NBA Team Generator"
        subtitle="Spin to pick an NBA team"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random NBA Team Generator" />

export default RandomNBATeamGeneratorPage
