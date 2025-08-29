import * as React from "react"
import { Link } from "gatsby"
import Seo from "../components/seo"
import PickerWheel from "../components/PickerWheel"
import Footer from "../components/footer"
import "../styles/picker.css"
import { StaticImage } from "gatsby-plugin-image"

const IndexPage = () => {
  const usefulLinks = [
    { label: "Wheels Picker (Home)", to: "/" },
    { label: "Tools", to: "/tools/" },
    { label: "Team Picker Wheel", to: "/tools/random-team-generator/" },
    { label: "Yes No Picker Wheel", to: "/tools/yes-or-no-wheel/" },
    { label: "Number Picker Wheel", to: "/tools/random-number-generator/" },
    { label: "Letter Picker Wheel", to: "/tools/random-letter-generator/" },
    { label: "Country Picker Wheel", to: "/tools/random-country-generator/" },
    { label: "State Picker Wheel", to: "/tools/random-state-generator/" },
    { label: "Color Picker Wheel", to: "/tools/random-color-generator/" },
    { label: "Image Picker Wheel", to: "/tools/random-image-generator/" },
    { label: "Date Picker Wheel", to: "/tools/random-date-generator/" },
    { label: "MLB Picker Wheel", to: "/tools/random-mlb-team-generator/" },
    { label: "NBA Picker Wheel", to: "/tools/random-nba-team-generator/" },
    { label: "NFL Picker Wheel", to: "/tools/random-nfl-team-generator/" },
    { label: "Flip a Coin", to: "/tools/flip-a-coin/" },
    { label: "Wheel of Names", to: "/tools/wheel-of-names/" },
    { label: "Using SSR (Demo)", to: "/using-ssr/" },
    { label: "Using TypeScript (Demo)", to: "/using-typescript/" },
  ]
  const introPieces = [
    "A fashionable wheel spinner that can be customized and has multiple functions. Simply enter your information, spin the wheel, and receive your random outcome.",
    "Sometimes our brains simply aren't able to make decisions, so why not allow the wheel spinner make the little choice?",
    "Simply enter your information and spin the wheel to get a random outcome right away.",
    "The wheel spinner's sophisticated algorithm will provide you with the most equitable outcome.",
    "The technology is frequently used for remote events, raffles, instruction, and many more purposes.",
    "The Picker Wheel characteristics are explained in detail in the sections that follow.",
  ]
  
  return (
    <>
      <PickerWheel showWatermarkOnLoad watermarkText="Press to Spin" />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.25rem", background: "#ffffff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
        <div aria-label="Useful Links" style={{ margin: "0 0 12px", color: "#111827", display: "flex", flexWrap: "wrap", alignItems: "baseline" }}>
          <strong style={{ marginRight: 6 }}>Useful Links:</strong>
          {usefulLinks.map((l, i) => (
            <span key={l.to} style={{ marginRight: 8 }}>
              <Link to={l.to} style={{ color: "#b45309", fontWeight: 700, textDecoration: "none" }}>
                {l.label}
              </Link>
              {i < usefulLinks.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
        <div
          id="table-of-contents"
          style={{
            margin: "1.5rem 0",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
            background: "#f3f4f6",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <details>
            <summary style={{ padding: "12px 16px", fontWeight: 800, cursor: "pointer" }}>
              Table of Contents
            </summary>
            <nav aria-label="Table of Contents" style={{ padding: "0 16px 16px" }}>
              <ol style={{ lineHeight: 1.9, paddingLeft: 18 }}>
                <li><a href="#what-is-picker-wheel">What Is Wheels Picker?</a></li>
                <li><a href="#how-to-use">How to Use This Spinner?</a></li>
              </ol>
            </nav>
          </details>
        </div>

        <section id="what-is-picker-wheel" style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 12 }}>1. What Is Wheels Picker?</h2>
          <div style={{ marginBottom: 12, color: "#111827", display: "flex", flexWrap: "wrap", alignItems: "baseline" }}>
            {introPieces.map((txt, i) => (
              <span key={i} style={{ marginRight: 8 }}>{txt}</span>
            ))}
          </div>
          
        </section>

        <section id="how-to-use" style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 12, color: "#111827", lineHeight: 1.8 }}>
            <h2 style={{ margin: "8px 0" }}>2. How to Use This Spinner?</h2>
            <p>Wheels Picker is incredibly user-friendly. The few steps to use the spinner to select a random decision are listed below.</p>
            <p>Add inputs such as text or images. You can combine the two.</p>
            <p>Using the plus button or return key on your device, enter the text input one at a time.</p>
            <p>Click the image input button to insert the image.</p>
            <p>The input lists are shown. Changes to the input's value, position, duplication, hiding, and deletion are still possible. Each entry can have both text and an image. The wheel spinner will immediately display all of these modifications.</p>
            <p>The spinning wheel can be started by pressing the "Ctrl + Enter" on Windows or "Cmd + Enter" on MacOS keys or by clicking the Spin button on the random wheel.</p>
            <p>Turn the wheel.</p>
            <p>After the wheel spins, the Picker Wheel indicates the picked option where its pointer points.</p>
            <p>For the specified option, pick one of the action modes. To switch, select, or close operations, you can also use the keyboard keys Tab, Enter, and Esc.</p>

            <h2 style={{ margin: "16px 0 8px" }}>3. What is the wheel spinner for?</h2>
            <p>We receive feedback from users of our website in novel ways every day:</p>
            <ul style={{ paddingLeft: 18 }}>
              <li>Select the student who will respond to the next question by using the classroom's random name picker. How to apply it in the educational setting</li>
              <li>To determine which devoted client will receive the monthly giveaway, if you are a retailer, spin the wheel.</li>
              <li>Use the wheel spinner to select a lucky winner from among the participants who completed the survey during your presentation.</li>
              <li>Random name picker at work: Choose a speaker at random during your daily standup meeting.</li>
              <li>Put your to-do list on a wheel and spin it to determine which one to start with if you are feeling overburdened.</li>
            </ul>

            <h2 style={{ margin: "16px 0 8px" }}>4. Can the wheel be rigged?</h2>
            <p>It is not possible to predict which entry will win in advance. Clicking the wheel causes it to accelerate for precisely one second, then randomly rotate between 0 and 360 degrees before decelerating to a stop. Since a random rotation occurs while the wheel is spinning quickly, it is invisible to the unaided eye.</p>

            <h2 style={{ margin: "16px 0 8px" }}>5. Create New Wheel and Switch Wheel</h2>
            <p>To obtain a fresh, blank default Wheel, click the "Create New Wheel" button. An unlimited amount of wheels can be produced, and you can alternate between them. You may make a wheel of names, an animal wheel, etc., for instance. <em>Please remember that only the information from the wheel that is presently in use is kept for the following visit. Refreshing the site will remove all wheels except the active wheel.</em></p>
          </div>
        </section>

        

        
      </div>

      <Footer />
    </>
  )
}

export const Head = () => (
  <Seo pathname="/">
    <meta name="google-site-verification" content="hCFUo9BnoLBOReZaSCMOKJiVzCPPX0scHk3Sdfhntb4" />
  </Seo>
)

export default IndexPage
