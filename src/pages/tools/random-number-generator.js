import * as React from "react"
import Seo from "../../components/seo"
import WheelHeader from "../../components/WheelHeader"
import Footer from "../../components/footer"
import PickerWheel from "../../components/PickerWheel"
import "../../styles/picker.css"

const RandomNumberGeneratorPage = () => {
  const [mode, setMode] = React.useState("number") // "number" | "digits"
  // Range mode state
  const [min, setMin] = React.useState(1)
  const [max, setMax] = React.useState(10)
  const [interval, setIntervalStep] = React.useState(1)
  const [numberMethod, setNumberMethod] = React.useState("range") // "range" | "formula"
  const [formulaText, setFormulaText] = React.useState("1,2,3,(10;15),(20;2;30)")
  const [formulaNumbers, setFormulaNumbers] = React.useState([])
  const [digitsCount, setDigitsCount] = React.useState(4)
  const [digitRanges, setDigitRanges] = React.useState(() => Array.from({ length: 4 }, () => ({ from: 0, to: 9 })))

  const clampDigit = (n) => {
    const v = Number.isFinite(n) ? n : 0
    return Math.max(0, Math.min(9, v | 0))
  }

  React.useEffect(() => {
    setDigitRanges((prev) => {
      const next = Array.from({ length: digitsCount }, (_, i) => {
        const p = prev[i] || { from: 0, to: 9 }
        return { from: clampDigit(p.from), to: clampDigit(p.to) }
      })
      return next
    })
  }, [digitsCount])

  const buildRangeNumbers = React.useCallback(() => {
    const nums = []
    if (min > max || interval <= 0) return nums
    for (let n = min; n <= max && nums.length < 1000; n += interval) nums.push(String(n))
    return nums
  }, [min, max, interval])

  const buildDigitsList = React.useCallback(() => {
    const list = []
    for (let i = 0; i <= 9; i++) list.push(String(i))
    return list
  }, [])

  const numbers = mode === "digits" ? buildDigitsList() : (numberMethod === "formula" ? formulaNumbers : buildRangeNumbers())

  // --- Formula parsing ---
  const processFormula = React.useCallback(() => {
    const out = []
    const limit = 1000
    const text = String(formulaText || "").trim()
    if (!text) { setFormulaNumbers([]); return }

    // split by commas, ignoring commas inside parentheses
    const parts = []
    let buf = ""
    let depth = 0
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (ch === '(') { depth++; buf += ch; continue }
      if (ch === ')') { depth = Math.max(0, depth - 1); buf += ch; continue }
      if (ch === ',' && depth === 0) { parts.push(buf.trim()); buf = ""; continue }
      buf += ch
    }
    if (buf.trim()) parts.push(buf.trim())

    const add = (n) => {
      if (out.length < limit) out.push(String(n))
    }

    for (const token of parts) {
      if (!token) continue
      if (token.startsWith('(') && token.endsWith(')')) {
        const inner = token.slice(1, -1)
        const nums = inner.split(';').map((s) => parseInt(s.trim() || '0', 10))
        if (nums.length === 2) {
          let [a, b] = nums
          if (Number.isFinite(a) && Number.isFinite(b)) {
            const step = a <= b ? 1 : -1
            for (let v = a; step > 0 ? v <= b : v >= b; v += step) add(v)
          }
        } else if (nums.length === 3) {
          let [a, stepRaw, b] = nums
          if (Number.isFinite(a) && Number.isFinite(stepRaw) && Number.isFinite(b) && stepRaw !== 0) {
            const step = stepRaw
            for (let v = a; step > 0 ? v <= b : v >= b; v += step) { add(v); if (out.length >= limit) break }
          }
        }
      } else {
        const v = parseInt(token, 10)
        if (Number.isFinite(v)) add(v)
      }
      if (out.length >= limit) break
    }

    setFormulaNumbers(out)
  }, [formulaText])

  // ----- DIGITS MODE (sequential spins) -----
  const [digitsResults, setDigitsResults] = React.useState([]) // index 0 => 1st (ones)
  const [showDigitsWheel, setShowDigitsWheel] = React.useState(false)
  const [currentDigitIndex, setCurrentDigitIndex] = React.useState(0) // 0..digitsCount-1
  const [wheelDigits, setWheelDigits] = React.useState(buildDigitsList())
  const [finalDigitsResult, setFinalDigitsResult] = React.useState("")
  const overlayRef = React.useRef(null)

  const getRangeForIndex = React.useCallback((idx) => {
    const r = digitRanges[idx] || { from: 0, to: 9 }
    const from = clampDigit(Math.min(r.from, r.to))
    const to = clampDigit(Math.max(r.from, r.to))
    const list = []
    for (let d = from; d <= to; d++) list.push(String(d))
    return list.length ? list : ["0"]
  }, [digitRanges])

  const startDigitsPicking = React.useCallback(() => {
    const base = Array.from({ length: digitsCount }, () => null)
    setDigitsResults(base)
    setCurrentDigitIndex(0)
    setWheelDigits(getRangeForIndex(0))
    setFinalDigitsResult("")
    setShowDigitsWheel(true)
    setTimeout(() => {
      const spinBtn = overlayRef.current?.querySelector?.('.spin-button')
      spinBtn && spinBtn.click()
    }, 350)
  }, [digitsCount, getRangeForIndex])

  const continueDigitsIfNeeded = React.useCallback((nextIdx, nextArray) => {
    if (nextIdx >= digitsCount) {
      // complete using latest array
      const result = (nextArray || []).map((d) => (d == null ? "0" : String(d))).reverse().join("")
      setTimeout(() => setShowDigitsWheel(false), 600)
      setFinalDigitsResult(result)
      return
    }
    setWheelDigits(getRangeForIndex(nextIdx))
    setTimeout(() => {
      const spinBtn = overlayRef.current?.querySelector?.('.spin-button')
      spinBtn && spinBtn.click()
    }, 600)
  }, [digitsCount, getRangeForIndex])

  const onDigitWheelResult = React.useCallback((picked) => {
    setDigitsResults((prev) => {
      const next = Array.from({ length: Math.max(prev.length, digitsCount) }, (_, i) => prev[i] ?? null)
      next[currentDigitIndex] = String(picked)
      const nextIdx = currentDigitIndex + 1
      setCurrentDigitIndex(nextIdx)
      continueDigitsIfNeeded(nextIdx, next)
      return next
    })
  }, [currentDigitIndex, continueDigitsIfNeeded, digitsCount])

  const resetDigitsToDefaults = React.useCallback(() => {
    setDigitsCount(4)
    setDigitRanges(Array.from({ length: 4 }, () => ({ from: 0, to: 9 })))
    setDigitsResults([])
    setCurrentDigitIndex(0)
    setFinalDigitsResult("")
  }, [])

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
              {mode === "digits" && (
                <div className="digits-pills" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  {Array.from({ length: digitsCount }, (_, i) => {
                    const idxFromLeft = digitsCount - 1 - i // 4th ... 1st
                    const labelOrder = `${idxFromLeft + 1}${idxFromLeft === 0 ? 'st' : idxFromLeft === 1 ? 'nd' : idxFromLeft === 2 ? 'rd' : 'th'}`
                    const val = digitsResults[idxFromLeft]
                    const isActive = currentDigitIndex === 0 && !showDigitsWheel ? false : currentDigitIndex === idxFromLeft
                    return (
                      <div key={i} className={`digits-pill ${isActive ? 'active' : ''}`} style={{ display: 'grid', placeItems: 'center', width: 92, height: 108, borderRadius: 10, border: isActive ? '2px solid #f59e0b' : '1px solid #d1d5db', background: isActive ? '#fde68a' : '#f9fafb', boxShadow: isActive ? '0 6px 0 #f59e0b' : '0 6px 0 #d1d5db' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{val != null ? val : labelOrder}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{val != null ? 'Num' : 'Num'}</div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div style={{ fontWeight: 800, marginBottom: 8 }}>INPUTS</div>

              <div style={{ marginBottom: 8, fontWeight: 700 }}>Mode:</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button
                  onClick={() => setMode("number")}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: mode === "number" ? "2px solid #1b5e20" : "1px solid #ccc",
                    background: mode === "number" ? "#e8f5e9" : "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Random Number
                </button>
                <button
                  onClick={() => setMode("digits")}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: mode === "digits" ? "2px solid #333" : "1px solid #ccc",
                    background: mode === "digits" ? "#f7f7f7" : "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Random Digits
                </button>
              </div>

              {mode === "number" && (
                <>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>Input Method:</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <button
                      onClick={() => setNumberMethod("range")}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: numberMethod === 'range' ? "2px solid #333" : "1px solid #ccc", background: numberMethod === 'range' ? "#eee" : "#fff", fontWeight: 700, cursor: 'pointer' }}
                    >
                      By Range
                    </button>
                    <button
                      onClick={() => setNumberMethod("formula")}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: numberMethod === 'formula' ? "2px solid #333" : "1px solid #ccc", background: numberMethod === 'formula' ? "#333" : "#fff", color: numberMethod === 'formula' ? '#fff' : 'inherit', fontWeight: 700, cursor: 'pointer' }}
                    >
                      By Formula
                    </button>
                  </div>
                </>
              )}

              {mode === "number" && numberMethod === 'range' && (
                <>
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
                </>
              )}

              {mode === "number" && numberMethod === 'formula' && (
                <>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>Formula:</div>
                  <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
                    <textarea
                      value={formulaText}
                      onChange={(e)=>setFormulaText(e.target.value)}
                      placeholder={"E.g. 1,2,3,(10;15),(20;2;30)"}
                      style={{ width: '100%', minHeight: 160, padding: 12, borderRadius: 10, border: '1px solid #e5e5e5', background: '#f7f7f7' }}
                    />
                    <button onClick={processFormula} style={{ width: 160, justifySelf: 'end', padding: '10px 14px', borderRadius: 10, border: '1px solid #eab308', background: '#FFB703', color: '#111827', fontWeight: 900, cursor: 'pointer' }}>Process</button>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>* Click the tips ⓘ to learn more about the formula</div>
                </>
              )}

              {mode === "digits" && (
                <>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>Number of Digits:</div>
                  <div className="digits-count" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    {[2,3,4,5,6].map((n) => (
                      <button
                        key={n}
                        onClick={() => setDigitsCount(n)}
                        className={`digits-count-btn ${digitsCount === n ? 'selected' : ''}`}
                        style={{ width: 64, padding: "10px 0", borderRadius: 8 }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: 8, fontWeight: 700 }}>Per-Digit Ranges</div>
                  <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 8, marginBottom: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${digitsCount}, 1fr)`, gap: 8, alignItems: "center" }}>
                      <div style={{ fontWeight: 700, textAlign: "right", paddingRight: 8 }}>Digit</div>
                      {Array.from({ length: digitsCount }, (_, i) => (
                        <div key={i} style={{ textAlign: "center", fontWeight: 700 }}>{`${i + 1}`}</div>
                      ))}
                      <div style={{ fontWeight: 700, textAlign: "right", paddingRight: 8 }}>From</div>
                      {digitRanges.map((r, i) => (
                        <input
                          key={`from-${i}`}
                          type="number"
                          min={0}
                          max={9}
                          value={r.from}
                          onChange={(e) => {
                            const val = clampDigit(parseInt(e.target.value || "0", 10))
                            setDigitRanges((prev) => prev.map((x, idx) => (idx === i ? { ...x, from: val } : x)))
                          }}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", textAlign: "center" }}
                        />
                      ))}
                      <div style={{ fontWeight: 700, textAlign: "right", paddingRight: 8 }}>To</div>
                      {digitRanges.map((r, i) => (
                        <input
                          key={`to-${i}`}
                          type="number"
                          min={0}
                          max={9}
                          value={r.to}
                          onChange={(e) => {
                            const val = clampDigit(parseInt(e.target.value || "0", 10))
                            setDigitRanges((prev) => prev.map((x, idx) => (idx === i ? { ...x, to: val } : x)))
                          }}
                          style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", textAlign: "center" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ color: "#666", fontSize: 12, marginBottom: 10 }}>*Wheel spins {digitsCount} times and builds the number from rightmost (1st) to leftmost.</div>
                  <button onClick={startDigitsPicking} style={{ width: '100%', padding: '14px 16px', fontWeight: 900, background: '#fde68a', color: '#111827', border: '1px solid #eab308', borderRadius: 10, cursor: 'pointer', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.05)' }}>START</button>
                  <button onClick={resetDigitsToDefaults} style={{ width: '100%', marginTop: 8, padding: '10px 12px', fontWeight: 700, background: '#fff', color: '#0A9396', border: '1px solid #d1d5db', borderRadius: 10, cursor: 'pointer' }}>Reset</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Digits picking overlay */}
      {showDigitsWheel && (
        <div ref={overlayRef} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
            <PickerWheel
              inputs={wheelDigits}
              title="Picking digit..."
              subtitle=""
              hideHeader
              hideInputsPanel
              renderOnlyWheel
              onResult={onDigitWheelResult}
            />
          </div>
        </div>
      )}

      {/* Final composed number result */}
      {finalDigitsResult && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 1100,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              textAlign: 'center',
              minWidth: 300,
              borderTop: '6px solid #0A9396',
            }}
          >
            <h2 style={{ color: '#0A9396', marginBottom: '1rem' }}>🎉 Result!</h2>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>{finalDigitsResult}</p>
            <button
              onClick={() => setFinalDigitsResult("")}
              style={{
                background: '#F77F00',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 6px 14px rgba(247,127,0,0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FFB703')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F77F00')}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random Number Generator" />

export default RandomNumberGeneratorPage

// Wheel overlay for digits mode
// Injected near end of component return above main footer
