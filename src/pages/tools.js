import * as React from "react"
import Seo from "../components/seo"
import { Link } from "gatsby"
import WheelHeader from "../components/WheelHeader"
import Footer from "../components/footer"
import "../styles/picker.css"

const tools = [
  { path: "/tools/yes-or-no-wheel/", label: "Yes or No Wheel", emoji: "✅", desc: "Make a quick yes or no decision with a single spin." },
  { path: "/tools/flip-a-coin/", label: "Flip a Coin", emoji: "🪙", desc: "A fair 50/50 coin flip with a slick animation." },
  { path: "/tools/wheel-of-names/", label: "Wheel of Names", emoji: "🎯", desc: "Enter names and pick a random winner." },
  { path: "/tools/random-team-generator/", label: "Random Team Generator", emoji: "👥", desc: "Group a list of people into random teams." },
  { path: "/tools/random-number-generator/", label: "Random Number Generator", emoji: "🔢", desc: "Generate numbers in a range with a spin." },
  { path: "/tools/random-letter-generator/", label: "Random Letter Generator", emoji: "🔤", desc: "Pick a random letter from the alphabet." },
  { path: "/tools/random-country-generator/", label: "Random Country Generator", emoji: "🌍", desc: "Discover a random country on each spin." },
  { path: "/tools/random-state-generator/", label: "Random State Generator", emoji: "🗽", desc: "Pick a random US state instantly." },
  { path: "/tools/random-color-generator/", label: "Random Color Generator", emoji: "🎨", desc: "Get a random color for your design ideas." },
  { path: "/tools/random-image-generator/", label: "Random Image Generator", emoji: "🖼️", desc: "Generate a random placeholder image." },
  { path: "/tools/random-date-generator/", label: "Random Date Generator", emoji: "📅", desc: "Pick a random date between two dates." },
  { path: "/tools/random-mlb-team-generator/", label: "Random MLB Team Generator", emoji: "⚾", desc: "Pick a random MLB team." },
  { path: "/tools/random-nba-team-generator/", label: "Random NBA Team Generator", emoji: "🏀", desc: "Pick a random NBA team." },
  { path: "/tools/random-nfl-team-generator/", label: "Random NFL Team Generator", emoji: "🏈", desc: "Pick a random NFL team." },
]

const ToolsPage = () => {
  return (
    <>
      <div className="container">
        <WheelHeader title="Tools" />
        <div className="main-content">
          <div className="wheel-section" style={{ width: "100%" }}>
            <div className="wheel-container" style={{ maxWidth: 1200 }}>
              <h2>Tools</h2>
              <p className="subtitle">Explore our tools below</p>
              <div className="tools-grid">
                {tools.map((t) => (
                  <Link key={t.path} to={t.path} className="tool-card">
                    <div className="tool-thumb" aria-hidden>{t.emoji || "🎡"}</div>
                    <div className="tool-body">
                      <div className="tool-title">{t.label}</div>
                      <div className="tool-desc">{t.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Tools" />

export default ToolsPage
