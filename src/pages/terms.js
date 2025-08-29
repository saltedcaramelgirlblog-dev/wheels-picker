import * as React from "react"
import Seo from "../components/seo"
import Footer from "../components/footer"
import WheelHeader from "../components/WheelHeader"

const TermsPage = () => {
  return (
    <div className="container">
      <WheelHeader />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
        <h1 style={{ marginBottom: 16 }}>Terms and Conditions</h1>
        <p>These terms will be customized later. This page is a placeholder for your Terms and Conditions content.</p>
      </main>
      <Footer />
    </div>
  )
}

export const Head = () => <Seo title="Terms and Conditions" />

export default TermsPage



