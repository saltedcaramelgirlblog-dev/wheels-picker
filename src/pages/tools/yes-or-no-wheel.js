import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const YesOrNoWheelPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["YES", "NO", "YES", "NO"]}
        title="Yes No Picker Wheel"
        subtitle="Decide yes or no by wheel"
        variant="yesno"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Yes or No Picker Wheel" />

export default YesOrNoWheelPage
