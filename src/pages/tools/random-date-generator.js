import * as React from "react"
import Seo from "../../components/seo"
import PickerWheel from "../../components/PickerWheel"
import Footer from "../../components/footer"
import "../../styles/picker.css"

const RandomDateGeneratorPage = () => {
  return (
    <>
      <PickerWheel
        initialInputs={["Jan 1","Feb 14","Mar 21","Apr 30","May 5","Jun 15","Jul 4","Aug 20","Sep 9","Oct 31","Nov 24","Dec 25"]}
        title="Random Date Generator"
        subtitle="Spin to pick a date"
        showWatermarkOnLoad
      />
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random Date Generator" />

export default RandomDateGeneratorPage
