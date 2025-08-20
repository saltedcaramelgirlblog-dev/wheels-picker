import * as React from "react"
import Seo from "../../components/seo"
import WheelHeader from "../../components/WheelHeader"
import Footer from "../../components/footer"
import PickerWheel from "../../components/PickerWheel"
import "../../styles/picker.css"

const RandomNumberGeneratorPage = () => {
  const [min, setMin] = React.useState(1)
  const [max, setMax] = React.useState(10)
  const [interval, setIntervalStep] = React.useState(1)

  const buildNumbers = React.useCallback(() => {
    const nums = []
    if (min > max || interval <= 0) return nums
    for (let n = min; n <= max && nums.length < 1000; n += interval) nums.push(String(n))
    return nums
  }, [min, max, interval])

  const numbers = buildNumbers()

  return (
    <>
      <div className="container">
        <WheelHeader title="Number Picker Wheel" />
        <div className="main-content">
          <div className="wheel-section">
            <div className="wheel-container">
              <PickerWheel
                inputs={numbers}
                title="Number Picker Wheel"
                subtitle="Pick a random number by wheel"
                hideHeader
                hideInputsPanel
                renderOnlyWheel
                showWatermarkOnLoad
              />
            </div>
          </div>

          <div className="inputs-panel" style={{ width: 480 }}>
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>INPUTS</div>

              <div style={{ marginBottom: 8, fontWeight: 700 }}>Mode:</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: "2px solid #1b5e20", background: "#e8f5e9", fontWeight: 700 }}>Random Number</button>
                <button style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", fontWeight: 700 }}>Random Digits</button>
              </div>

              <div style={{ marginBottom: 8, fontWeight: 700 }}>Input Method:</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: "2px solid #333", background: "#fff", fontWeight: 700 }}>By Range</button>
                <button style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", fontWeight: 700 }}>By Formula</button>
              </div>

              <div style={{ marginBottom: 8, fontWeight: 700 }}>Range:</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                <div style={{ display: "grid", justifyItems: "center" }}>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value || "0", 10))}
                    style={{ width: 120, height: 80, fontSize: 42, fontWeight: 800, textAlign: "center", borderRadius: 12, border: "1px solid #ccc" }}
                  />
                  <div style={{ marginTop: 6, fontWeight: 700 }}>MIN</div>
                </div>
                <div style={{ display: "grid", justifyItems: "center" }}>
                  <input
                    type="number"
                    value={interval}
                    onChange={(e) => setIntervalStep(Math.max(1, parseInt(e.target.value || "1", 10)))}
                    style={{ width: 100, height: 50, fontSize: 24, fontWeight: 700, textAlign: "center", borderRadius: 8, border: "1px solid #ccc" }}
                  />
                  <div style={{ marginTop: 6, fontWeight: 700 }}>INTERVAL</div>
                </div>
                <div style={{ display: "grid", justifyItems: "center" }}>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value || "0", 10))}
                    style={{ width: 120, height: 80, fontSize: 42, fontWeight: 800, textAlign: "center", borderRadius: 12, border: "1px solid #ccc" }}
                  />
                  <div style={{ marginTop: 6, fontWeight: 700 }}>MAX</div>
                </div>
              </div>
              <div style={{ color: "#666", fontSize: 12, marginBottom: 12 }}>*Maximum 1000 portions</div>

              <div style={{ fontWeight: 700, marginBottom: 6 }}>Exclude: <span style={{ fontWeight: 400, color: "#777" }}>E.g. 2,5,8</span></div>
              <input type="text" placeholder="Numbers to be excluded (separated by comma ,)" style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random Number Generator" />

export default RandomNumberGeneratorPage
