import * as React from "react"
import Seo from "../../components/seo"
import WheelHeader from "../../components/WheelHeader"
import Footer from "../../components/footer"
import PickerWheel from "../../components/PickerWheel"
import "../../styles/picker.css"

function shuffleArray(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const defaultNames = [
  "Alex",
  "Jamie",
  "Taylor",
  "Jordan",
  "Casey",
  "Morgan",
  "Riley",
  "Quinn",
]

const WheelOfNamesPage = () => {
  const [namesText, setNamesText] = React.useState(defaultNames.join("\n"))
  const [names, setNames] = React.useState(defaultNames)
  const [history, setHistory] = React.useState([])
  const [activeTab, setActiveTab] = React.useState("entries") // 'entries' | 'results'

  // Optional: allow overriding defaults via query param ?names=Alice,Bob,Charlie
  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const params = new URLSearchParams(window.location.search)
      const raw = params.get("names")
      if (!raw) return
      const parts = raw
        .split(raw.includes("\n") ? /\r?\n/ : ",")
        .map((s) => s.trim())
        .filter(Boolean)
      if (parts.length) setNamesText(parts.join("\n"))
    } catch (e) {}
  }, [])

  // sync text->array
  React.useEffect(() => {
    const parsed = namesText
      .split(/\r?\n/) // new lines
      .map((s) => s.trim())
      .filter(Boolean)
    setNames(parsed.length ? parsed : ["—"])
  }, [namesText])

  const sortAZ = () => {
    const sorted = [...names]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    setNamesText(sorted.join("\n"))
  }

  const shuffle = () => {
    const s = shuffleArray(names.filter(Boolean))
    setNamesText(s.join("\n"))
  }

  const clearResults = () => setHistory([])

  const onResult = (winner) => {
    setHistory((h) => [{ winner, at: Date.now() }, ...h].slice(0, 200))
    setActiveTab("results")
  }

  return (
    <>
      <div className="container">
        <WheelHeader />
        <div className="main-content">
          <div className="wheel-section">
            <div className="wheel-container">
              <PickerWheel
                inputs={names}
                title="Wheel of Names"
                subtitle="Click to spin"
                hideHeader
                hideInputsPanel
                renderOnlyWheel
                onResult={onResult}
                showWatermarkOnLoad
              />
            </div>
          </div>

          <div className="inputs-panel" style={{ width: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "inline-flex", background: "#fff", borderRadius: 8, padding: 4, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <button onClick={() => setActiveTab("entries")} style={{ padding: "6px 12px", border: "none", borderRadius: 6, background: activeTab === "entries" ? "#2E7D32" : "transparent", color: activeTab === "entries" ? "#fff" : "#333", cursor: "pointer", fontWeight: 700 }}>Entries</button>
                <button onClick={() => setActiveTab("results")} style={{ padding: "6px 12px", border: "none", borderRadius: 6, background: activeTab === "results" ? "#2E7D32" : "transparent", color: activeTab === "results" ? "#fff" : "#333", cursor: "pointer", fontWeight: 700 }}>Results</button>
              </div>
              {activeTab === "entries" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={shuffle} className="panel-btn" title="Shuffle"
                    style={{ width: "auto", height: "auto", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span role="img" aria-label="shuffle">🔀</span>
                    <span>Shuffle</span>
                  </button>
                  <button onClick={sortAZ} className="panel-btn" title="Sort A to Z"
                    style={{ width: "auto", height: "auto", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span>🔤</span>
                    <span>Sort A–Z</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={clearResults} className="panel-btn" title="Clear results"
                    style={{ width: "auto", height: "auto", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span>🗑️</span>
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>

            {activeTab === "entries" ? (
              <div>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>Enter one name per line</div>
                <textarea
                  value={namesText}
                  onChange={(e) => setNamesText(e.target.value)}
                  style={{ width: "100%", minHeight: 360, resize: "vertical", padding: 12, borderRadius: 8, border: "1px solid #ddd", lineHeight: 1.5 }}
                />
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>Results history ({history.length})</div>
                {history.length === 0 ? (
                  <div style={{ color: "#777" }}>No results yet. Spin the wheel!</div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: 420, overflow: "auto" }}>
                    {history.map((r, idx) => (
                      <li key={idx} style={{ padding: "10px 12px", border: "1px solid #eee", borderRadius: 8, marginBottom: 8, background: "#fff" }}>
                        <strong style={{ color: "#2E7D32" }}>{r.winner}</strong>
                        <div style={{ color: "#999", fontSize: 12 }}>{new Date(r.at).toLocaleString()}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Wheel of Names" />

export default WheelOfNamesPage
