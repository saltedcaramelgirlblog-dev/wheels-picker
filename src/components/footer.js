import * as React from "react"
import { Link } from "gatsby"

const linkStyle = {
  color: "#111",
  textDecoration: "none",
}

const headingStyle = {
  fontWeight: 700,
  marginBottom: 8,
}

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        background: "#d4d4d4",
        padding: "32px 24px",
        marginTop: "var(--space-5)",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: "var(--size-content)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 18 }}>🟡</div>
          <div style={{ fontWeight: 700 }}>Wheels Picker</div>
          <div style={{ marginLeft: 8, color: "#333" }}>© {year}</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div>
            <div style={headingStyle}> </div>
            <div style={{ display: "grid", gap: 10 }}>
              <Link to="/tools/" style={linkStyle}>Tools</Link>
              <a href="#" style={linkStyle}>Premium Plan</a>
              <a href="#" style={linkStyle}>About</a>
              <a href="#" style={linkStyle}>Feedback & Contact</a>
            </div>
          </div>
          <div>
            <div style={headingStyle}> </div>
            <div style={{ display: "grid", gap: 10 }}>
              <a href="#" style={linkStyle}>Blog</a>
              <a href="#" style={linkStyle}>Latest Updates</a>
              <a href="#" style={linkStyle}>Embed Wheel</a>
              <a href="#" style={linkStyle}>Buy Us A Coffee</a>
            </div>
          </div>
          <div>
            <div style={headingStyle}> </div>
            <div style={{ display: "grid", gap: 10 }}>
              <a href="#" style={linkStyle}>Video Gallery</a>
              <a href="#" style={linkStyle}>Privacy Policy</a>
              <a href="#" style={linkStyle}>Terms and Conditions</a>
              <a href="#" style={linkStyle}>Cookie Policy</a>
            </div>
          </div>
          <div>
            <div style={headingStyle}> </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <a href="#" style={linkStyle}>🔵 Facebook</a>
              <a href="#" style={linkStyle}>🟣 Instagram</a>
              <a href="#" style={linkStyle}>🔷 Twitter</a>
              <a href="#" style={linkStyle}>🟥 Youtube</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer











