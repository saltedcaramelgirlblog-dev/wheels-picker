import * as React from "react"
import Seo from "../../components/seo"
import Footer from "../../components/footer"
import CoinFlipper from "../../components/CoinFlipper"
import "../../styles/picker.css"

const FlipACoinPage = () => {
  return (
    <>
      <div className="wheel-container" style={{ textAlign: "center", margin: "40px auto" }}>
        <CoinFlipper />
      </div>
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Flip a Coin" />

export default FlipACoinPage
