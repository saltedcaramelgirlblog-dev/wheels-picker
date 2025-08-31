import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
 

const toolNames = [
  "Wheels Picker",
  "Team Picker Wheel",
  "Yes No Picker Wheel",
  "Number Picker Wheel",
  "Letter Picker Wheel",
  "Country Picker Wheel",
  "State Picker Wheel",
  "Color Picker Wheel",
  "Image Picker Wheel",
  "Date Picker Wheel",
  "MLB Picker Wheel",
  "NBA Picker Wheel",
  "NFL Picker Wheel",
]

const toolLinks = {
  "Wheels Picker": "/",
  "Team Picker Wheel": "/tools/random-team-generator/",
  "Yes No Picker Wheel": "/tools/yes-or-no-wheel/",
  "Number Picker Wheel": "/tools/random-number-generator/",
  "Letter Picker Wheel": "/tools/random-letter-generator/",
  "Country Picker Wheel": "/tools/random-country-generator/",
  "State Picker Wheel": "/tools/random-state-generator/",
  "Color Picker Wheel": "/tools/random-color-generator/",
  "Image Picker Wheel": "/tools/random-image-generator/",
  "Date Picker Wheel": "/tools/random-date-generator/",
  "MLB Picker Wheel": "/tools/random-mlb-team-generator/",
  "NBA Picker Wheel": "/tools/random-nba-team-generator/",
  "NFL Picker Wheel": "/tools/random-nfl-team-generator/",
}

const WheelHeader = () => {
  const [toolsOpen, setToolsOpen] = React.useState(false)
  const toolsRef = React.useRef(null)
  const data = useStaticQuery(graphql`
    query WheelHeaderSiteTitleQuery {
      site {
        siteMetadata { title shortTitle }
      }
    }
  `)
  const siteTitle = data?.site?.siteMetadata?.shortTitle || "Wheels Picker"

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!toolsRef.current) return
      if (!toolsRef.current.contains(e.target)) setToolsOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  

  return (
    <header className="header">
      <Link to="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
        <img src={require("../images/wheels-picker-icon-200.png").default} alt="Wheels Picker" width={200} height={70} style={{ display: "block" }} />
      </Link>
      <nav className="nav">
        <button className="nav-btn">Settings</button>
        
        <div style={{ position: "relative" }} ref={toolsRef}>
          <button
            className="nav-btn"
            aria-haspopup="menu"
            aria-expanded={toolsOpen}
            onClick={() => setToolsOpen((v) => !v)}
          >
            Tools ▾
          </button>
          {toolsOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "white",
                color: "#333",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                minWidth: 320,
                padding: 8,
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 8,
                  padding: 8,
                }}
              >
                {toolNames.map((label) => (
                  <Link
                    key={label}
                    role="menuitem"
                    to={toolLinks[label] || "/tools/"}
                    onClick={() => setToolsOpen(false)}
                    style={{
                      display: "block",
                      textAlign: "left",
                      border: "none",
                      background: "transparent",
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f2f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div style={{ padding: 8, borderTop: "1px solid #eee" }}>
                <Link
                  to="/tools/"
                  onClick={() => setToolsOpen(false)}
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  All Tools
                </Link>
              </div>
            </div>
          )}
        </div>
        <button className="nav-btn">☰</button>
      </nav>
    </header>
  )
}

export default WheelHeader
