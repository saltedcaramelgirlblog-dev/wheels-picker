import * as React from "react"

function clamp01(n) { return Math.max(0, Math.min(1, n)) }
function lighten(hex, amount = 0.12) {
  try {
    const clean = hex.replace('#','')
    const bigint = parseInt(clean.length === 3 ? clean.split('').map(c=>c+c).join('') : clean, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    const lr = Math.round(r + (255 - r) * clamp01(amount))
    const lg = Math.round(g + (255 - g) * clamp01(amount))
    const lb = Math.round(b + (255 - b) * clamp01(amount))
    return `#${((1 << 24) + (lr << 16) + (lg << 8) + lb).toString(16).slice(1)}`
  } catch { return hex }
}

const CoinFlipper = () => {
  const [result, setResult] = React.useState("TAILS")
  const [headsCount, setHeadsCount] = React.useState(0)
  const [tailsCount, setTailsCount] = React.useState(0)
  const [isFlipping, setIsFlipping] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("coin")
  const [bgColor, setBgColor] = React.useState("#ec4899")
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const audioCtxRef = React.useRef(null)
  const audioRef = React.useRef(null)
  const audioSrcRef = React.useRef("/sounds/coin.mp3")

  // Load persisted preferences
  React.useEffect(() => {
    try {
      const s = localStorage.getItem('coin:soundEnabled')
      if (s != null) setSoundEnabled(s === 'true')
      const c = localStorage.getItem('coin:bgColor')
      if (c) setBgColor(c)
    } catch (_) {}
  }, [])

  React.useEffect(() => {
    try { localStorage.setItem('coin:soundEnabled', String(soundEnabled)) } catch(_) {}
  }, [soundEnabled])
  React.useEffect(() => {
    try { localStorage.setItem('coin:bgColor', bgColor) } catch(_) {}
  }, [bgColor])

  React.useEffect(() => {
    // Initialize audio element if the user provides a static asset
    const candidates = ["/sounds/coin.mp3", "/coin.mp3", "/sounds/coin.ogg", "/coin.ogg"]
    const audio = new Audio()
    audio.preload = "auto"
    audio.volume = 0.85
    // Pick the first candidate; browsers will ignore if 404, we'll fallback at play() time
    audio.src = candidates[0]
    audioRef.current = audio
    audioSrcRef.current = candidates[0]

    const resume = () => {
      try {
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume().catch(() => {})
        }
      } catch (_) {}
    }
    document.addEventListener("pointerdown", resume, { once: true })
    return () => document.removeEventListener("pointerdown", resume)
  }, [])

  const tryPlayElement = async () => {
    const candidates = ["/sounds/coin.mp3", "/coin.mp3", "/sounds/coin.ogg", "/coin.ogg"]
    for (const src of candidates) {
      try {
        const el = new Audio(src)
        el.preload = "auto"
        el.volume = 0.85
        await el.play()
        audioRef.current = el
        audioSrcRef.current = src
        return true
      } catch (e) {
        // continue
      }
    }
    return false
  }

  const playCoinSound = React.useCallback(async () => {
    if (!soundEnabled) return
    // Prefer user-uploaded file if present
    const el = audioRef.current
    if (el && typeof el.play === "function") {
      try { el.currentTime = 0; await el.play(); return } catch (e) {
        // If it failed, try alternative static paths
        const ok = await tryPlayElement()
        if (ok) return
      }
    }

    const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)
    if (!AudioCtx) return
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx()
    const ctx = audioCtxRef.current

    const master = ctx.createGain()
    master.gain.value = 0.4
    master.connect(ctx.destination)

    // ping 1 (bright initial strike)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "triangle"
    osc1.frequency.setValueAtTime(3200, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08)
    gain1.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 0.005)
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
    osc1.connect(gain1).connect(master)

    // ping 2 (lower metallic body)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(1800, ctx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.14)
    gain2.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain2.gain.exponentialRampToValueAtTime(0.7, ctx.currentTime + 0.01)
    gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
    osc2.connect(gain2).connect(master)

    // brief noise burst for texture
    const bufferSize = 0.1 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6))
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = 2500
    bp.Q.value = 1.2
    const gainN = ctx.createGain()
    gainN.gain.value = 0.25
    noise.connect(bp).connect(gainN).connect(master)

    osc1.start()
    osc2.start()
    noise.start()
    osc1.stop(ctx.currentTime + 0.14)
    osc2.stop(ctx.currentTime + 0.2)
    noise.stop(ctx.currentTime + 0.1)
  }, [soundEnabled])

  const flip = React.useCallback(() => {
    if (isFlipping) return
    setIsFlipping(true)
    playCoinSound()
    const next = Math.random() < 0.5 ? "HEADS" : "TAILS"
    setTimeout(() => {
      setResult(next)
      if (next === "HEADS") setHeadsCount((c) => c + 1)
      else setTailsCount((c) => c + 1)
      setIsFlipping(false)
    }, 1600)
  }, [isFlipping, playCoinSound])

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        flip()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [flip])

  const wrapperColor = lighten(bgColor, 0.16)

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div style={{ display: "inline-flex", background: "#fff", borderRadius: 10, padding: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 16 }}>
        <button onClick={() => setActiveTab('coin')} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: activeTab==='coin'? '#2E7D32':'transparent', color: activeTab==='coin'? '#fff':'#333', cursor: 'pointer', fontWeight: 700 }}>Coin</button>
        <button onClick={() => setActiveTab('settings')} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: activeTab==='settings'? '#2E7D32':'transparent', color: activeTab==='settings'? '#fff':'#333', cursor: 'pointer', fontWeight: 700 }}>Settings</button>
      </div>

      {activeTab === 'coin' ? (
        <>
          <h2 style={{ letterSpacing: 1, marginBottom: 6 }}>COIN FLIP SIMULATOR</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>Flip a coin to get heads or tails randomly</p>

          <div className={"coin-3d"}>
            <div
              className={`coin-wrapper ${isFlipping ? "throwing" : ""}`}
              onClick={flip}
              role="button"
              aria-label="Flip a coin"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && flip()}
              style={{ background: wrapperColor }}
            >
              <div className={`coin ${isFlipping ? "flipping" : ""}`} style={{ background: bgColor }}>
                <div className="coin-face">{result}</div>
              </div>
            </div>
          </div>

          <div style={{ color: "#666", marginTop: 12 }}>(Press Button or Click Coin / Spacebar)</div>

          <button
            onClick={flip}
            disabled={isFlipping}
            style={{
              marginTop: 14,
              background: "#333",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            FLIP IT
          </button>

          <div style={{ marginTop: 16, color: "#333" }}>Style 1 - {headsCount}H {tailsCount}T</div>
        </>
      ) : (
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'left', background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 12 }}>Settings</h3>
          <div style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <span style={{ fontWeight: 600 }}>Background Color</span>
              <input type="color" value={bgColor} onChange={(e)=>setBgColor(e.target.value)} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <span style={{ fontWeight: 600 }}>Play Sound</span>
              <input type="checkbox" checked={soundEnabled} onChange={(e)=>setSoundEnabled(e.target.checked)} />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoinFlipper
