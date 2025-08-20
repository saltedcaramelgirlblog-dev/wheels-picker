import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const COLORS = ["#2E7D32", "#FFD54F", "#8BC34A", "#FF9800"]

export default function PickerWheel({ initialInputs, title, subtitle, variant, onResult, inputs: controlledInputs, hideHeader, hideInputsPanel, renderOnlyWheel, autoConfetti = true, confettiDurationMs = 1200, stopConfettiOnUnmount = true, showWatermarkOnLoad = false, watermarkText = "Press to Spin" } = {}) {
  const canvasRef = React.useRef(null)
  const data = useStaticQuery(graphql`
    query PickerWheelSiteTitleQuery {
      site { siteMetadata { title } }
    }
  `)
  const siteTitle = data?.site?.siteMetadata?.title || "Wheels Picker"
  const inputsRef = React.useRef(
    initialInputs && initialInputs.length
      ? initialInputs
      : [
          "Pizza",
          "Burger",
          "Sushi",
          "Pasta",
          "Salad",
          "Steak",
          "Chicken",
          "Fish",
        ]
  )
  const [inputs, setInputs] = React.useState(inputsRef.current)
  
  // allow external control of inputs
  React.useEffect(() => {
    if (Array.isArray(controlledInputs) && controlledInputs.length) {
      inputsRef.current = controlledInputs
      setInputs(controlledInputs)
    }
  }, [controlledInputs])
  
  const [newInput, setNewInput] = React.useState("")
  const [isSpinning, setIsSpinning] = React.useState(false)
  const [rotation, setRotation] = React.useState(0)
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const [resultText, setResultText] = React.useState("")
  const [showResult, setShowResult] = React.useState(false)
  const confettiRef = React.useRef(null)
  const audioCtxRef = React.useRef(null)
  const lastTickIndexRef = React.useRef(-1)
  const nextTickAllowedTimeRef = React.useRef(0)
  const tickDelayMsRef = React.useRef(450)
  const idleActiveRef = React.useRef(false)
  const idleRafRef = React.useRef(0)
  const idleLastTsRef = React.useRef(0)
  const [toolsOpen, setToolsOpen] = React.useState(false)
  const toolsRef = React.useRef(null)
  const [watermarkVisible, setWatermarkVisible] = React.useState(!!showWatermarkOnLoad)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const settingsRef = React.useRef(null)

  // yes/no variant state
  const isYesNoVariant = variant === "yesno"
  const [yesCount, setYesCount] = React.useState(0)
  const [noCount, setNoCount] = React.useState(0)
  const [mode, setMode] = React.useState("yesno") // "yesno" | "yesnomaybe"
  const [inputSets, setInputSets] = React.useState(4)

  const toolNames = React.useMemo(
    () => [
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
    ],
    []
  )

  const toolLinks = React.useMemo(
    () => ({
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
    }),
    []
  )

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!toolsRef.current) return
      if (!toolsRef.current.contains(e.target)) setToolsOpen(false)
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  const colors = ["#2E7D32", "#FFD54F", "#8BC34A", "#FF9800"]

  // --- Wheels (presets) management ---
  const [wheels, setWheels] = React.useState(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem("picker_wheels_v1")
      if (raw) return JSON.parse(raw)
    } catch (e) {}
    return []
  })
  const [activeWheelId, setActiveWheelId] = React.useState(() => {
    if (typeof window === "undefined") return ""
    try {
      return localStorage.getItem("picker_wheels_active_v1") || ""
    } catch (e) { return "" }
  })

  // Initialize default wheel if none exists
  React.useEffect(() => {
    if (wheels.length === 0) {
      const defaultWheel = {
        id: String(Date.now()),
        name: "Wheel 1",
        inputs: inputsRef.current,
      }
      setWheels([defaultWheel])
      setActiveWheelId(defaultWheel.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist wheels and active id
  React.useEffect(() => {
    try { localStorage.setItem("picker_wheels_v1", JSON.stringify(wheels)) } catch (e) {}
  }, [wheels])
  React.useEffect(() => {
    try { localStorage.setItem("picker_wheels_active_v1", activeWheelId) } catch (e) {}
  }, [activeWheelId])

  const createNewWheel = () => {
    const nextIndex = wheels.length + 1
    const newWheel = {
      id: String(Date.now() + Math.random()),
      name: `Wheel ${nextIndex}`,
      inputs: ["YES", "NO", "YES", "NO"],
    }
    setWheels((ws) => [...ws, newWheel])
    setActiveWheelId(newWheel.id)
    inputsRef.current = newWheel.inputs
    setInputs(newWheel.inputs)
  }

  const selectWheel = (wheelId) => {
    if (wheelId === activeWheelId) return
    const w = wheels.find((x) => x.id === wheelId)
    if (!w) return
    setActiveWheelId(wheelId)
    inputsRef.current = Array.isArray(w.inputs) ? w.inputs : []
    setInputs(inputsRef.current)
  }

  const deleteWheel = (wheelId) => {
    setWheels((ws) => ws.filter((w) => w.id !== wheelId))
    if (wheelId === activeWheelId) {
      const remaining = wheels.filter((w) => w.id !== wheelId)
      const next = remaining[0]
      if (next) {
        setActiveWheelId(next.id)
        inputsRef.current = next.inputs
        setInputs(next.inputs)
      } else {
        const base = ["YES", "NO", "YES", "NO"]
        inputsRef.current = base
        setInputs(base)
      }
    }
  }

  const draw = React.useCallback(
    (rotationRadians) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 10

      // Force white text for segments and watermark
      const segmentTextColor = "#ffffff"
      const watermarkColor = "#ffffff"

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const segmentAngle = (2 * Math.PI) / inputs.length
      inputs.forEach((label, index) => {
        const start = index * segmentAngle + rotationRadians
        const end = (index + 1) * segmentAngle + rotationRadians
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, start, end)
        ctx.closePath()
        ctx.fillStyle = COLORS[index % COLORS.length]
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()

        // text (supports multi-line with flag above name)
        const mid = (start + end) / 2
        const r = radius * 0.7
        const x = centerX + r * Math.cos(mid)
        const y = centerY + r * Math.sin(mid)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(mid + Math.PI / 2)
        ctx.fillStyle = segmentTextColor
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        if (mid > Math.PI / 2 && mid < (3 * Math.PI) / 2) ctx.rotate(Math.PI)
        const parts = String(label).split("\n")
        if (parts.length > 1) {
          // first line: emoji/flag larger
          ctx.font = "28px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
          ctx.fillText(parts[0], 0, -10)
          // remaining lines combined as label below
          const rest = parts.slice(1).join(" ")
          ctx.font = "bold 14px Arial"
          ctx.fillText(rest, 0, 14)
        } else {
          ctx.font = "bold 16px Arial"
          ctx.fillText(label, 0, 0)
        }
        ctx.restore()
      })

      // watermark (drawn on top, before center/pointer)
      if (watermarkVisible) {
        const text = String(watermarkText || "").toUpperCase()
        if (text) {
          ctx.save()
          ctx.fillStyle = watermarkColor
          ctx.shadowColor = "rgba(0,0,0,0.45)"
          ctx.shadowBlur = 10
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.font = "900 56px Arial"
          const arcRadius = radius * 0.62
          const angleSpan = Math.PI * 0.9 // ~162° across top arc
          const startAngle = -Math.PI / 2 - angleSpan / 2
          const step = angleSpan / Math.max(1, text.length - 1)
          for (let i = 0; i < text.length; i++) {
            const ch = text[i]
            const ang = startAngle + i * step
            const x = centerX + arcRadius * Math.cos(ang)
            const y = centerY + arcRadius * Math.sin(ang)
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(ang + Math.PI / 2)
            ctx.fillText(ch, 0, 0)
            ctx.restore()
          }
          ctx.restore()
        }
      }

      // center
      ctx.beginPath()
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
      ctx.fillStyle = "#333"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 3
      ctx.stroke()

      // pointer at top
      ctx.save()
      ctx.translate(centerX, centerY - radius - 15)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-8, 15)
      ctx.lineTo(8, 15)
      ctx.closePath()
      ctx.fillStyle = "#FF5722"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
    },
    [inputs, watermarkVisible, watermarkText]
  )

  // draw on mount and when rotation/inputs change
  React.useEffect(() => {
    draw(rotation)
  }, [rotation, inputs, draw])

  // ensure watermark visibility changes are reflected immediately
  React.useEffect(() => {
    draw(rotation)
  }, [watermarkVisible, draw, rotation])

  // tick sound (simplified)
  const playTick = React.useCallback(() => {
    if (!soundEnabled) return
    const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)
    if (!AudioCtx) return
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx()
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(900, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.07)
  }, [soundEnabled])

  const playCenterClick = React.useCallback(() => {
    if (!soundEnabled) return
    const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)
    if (!AudioCtx) return
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx()
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(220, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.13)
  }, [soundEnabled])

  // idle slow spin
  const startIdleSpin = React.useCallback(() => {
    if (idleActiveRef.current) return
    idleActiveRef.current = true
    idleLastTsRef.current = performance.now()
    const step = (now) => {
      if (!idleActiveRef.current) return
      const elapsed = now - idleLastTsRef.current
      idleLastTsRef.current = now
      const radiansPerSecond = (2 * Math.PI) / 180 // ~2deg/s
      setRotation((prev) => prev + radiansPerSecond * (elapsed / 1000))
      idleRafRef.current = requestAnimationFrame(step)
    }
    idleRafRef.current = requestAnimationFrame(step)
  }, [])

  const stopIdleSpin = React.useCallback(() => {
    idleActiveRef.current = false
    try { if (idleRafRef.current) cancelAnimationFrame(idleRafRef.current) } catch (e) {}
  }, [])

  React.useEffect(() => {
    startIdleSpin()
    return () => stopIdleSpin()
  }, [startIdleSpin, stopIdleSpin])

  // Helpers for yes/no variant
  const regenerateYesNoInputs = React.useCallback((m, sets) => {
    const base = m === "yesnomaybe" ? ["YES", "NO", "MAYBE"] : ["YES", "NO"]
    const next = []
    for (let s = 0; s < sets; s++) {
      for (let b = 0; b < base.length; b++) next.push(base[b])
    }
    inputsRef.current = next
    setInputs(next)
  }, [])

  React.useEffect(() => {
    if (!isYesNoVariant) return
    regenerateYesNoInputs(mode, inputSets)
  }, [isYesNoVariant, mode, inputSets, regenerateYesNoInputs])

  const spin = React.useCallback(() => {
    if (isSpinning || inputs.length === 0) return
    setWatermarkVisible(false)
    setIsSpinning(true)
    stopIdleSpin()
    // play center click then delay first segment tick
    playCenterClick()
    nextTickAllowedTimeRef.current = performance.now() + tickDelayMsRef.current

    const start = performance.now()
    const duration = 6000
    const startRotation = rotation
    const spins = 6 + Math.random() * 6
    const finalAngle = Math.random() * (2 * Math.PI)
    const target = startRotation + spins * 2 * Math.PI + finalAngle

    // initialize last tick index based on current position to avoid an immediate tick
    const segInit = (2 * Math.PI) / inputs.length
    const pointerInit = -Math.PI / 2
    const relInit = ((pointerInit - startRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
    lastTickIndexRef.current = Math.floor(relInit / segInit)
    const tick = () => {
      const now = performance.now()
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 5)
      const value = startRotation + (target - startRotation) * ease
      setRotation(value)

      // tick when crossing segment
      const seg = (2 * Math.PI) / inputs.length
      const pointer = -Math.PI / 2
      const rel = ((pointer - value) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
      const idx = Math.floor(rel / seg)
      if (idx !== lastTickIndexRef.current) {
        lastTickIndexRef.current = idx
        if (now >= nextTickAllowedTimeRef.current) playTick()
      }

      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        setIsSpinning(false)
        // compute winning segment
        const seg = (2 * Math.PI) / inputs.length
        const pointer = -Math.PI / 2
        const rel = ((pointer - target) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
        const idx = Math.floor(rel / seg) % inputs.length
        const text = inputs[idx]
        setResultText(text)
        if (typeof onResult === "function") {
          try { onResult(text) } catch (e) {}
        }
        if (isYesNoVariant) {
          const t = String(text).toUpperCase()
          if (t === "YES") setYesCount((c) => c + 1)
          if (t === "NO") setNoCount((c) => c + 1)
        }
        setShowResult(true)
        if (autoConfetti) startConfetti(confettiDurationMs)
        setTimeout(() => startIdleSpin(), 800)
      }
    }
    requestAnimationFrame(tick)
  }, [isSpinning, inputs.length, rotation, playTick, playCenterClick, startIdleSpin, stopIdleSpin, inputs, onResult, isYesNoVariant, autoConfetti, confettiDurationMs])

  const addInput = () => {
    const t = newInput.trim()
    if (!t || inputs.includes(t)) return
    const next = [...inputs, t]
    inputsRef.current = next
    setInputs(next)
    setNewInput("")
  }

  const removeInput = (index) => {
    const next = inputs.filter((_, i) => i !== index)
    inputsRef.current = next
    setInputs(next)
  }

  // --- Confetti helpers ---
  const startConfetti = (durationMs = 6000) => {
    if (typeof window === "undefined") return
    stopConfetti()
    const overlay = document.createElement("canvas")
    overlay.id = "confetti-canvas"
    overlay.style.position = "fixed"
    overlay.style.inset = "0"
    overlay.style.pointerEvents = "none"
    overlay.style.zIndex = "999"
    document.body.appendChild(overlay)
    const ctx = overlay.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      overlay.width = Math.floor(window.innerWidth * dpr)
      overlay.height = Math.floor(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const onResize = () => resize()
    window.addEventListener("resize", onResize)

    const colorsList = ["#E91E63", "#9C27B0", "#3F51B5", "#2196F3", "#009688", "#4CAF50", "#FF9800", "#FFC107", "#FF5722"]
    const gravity = 0.18
    const drag = 0.994
    const wind = 0.02
    const particles = []
    const emitRate = 220
    let emitAccumulator = 0

    const makeParticle = (x, y, vx, vy) => {
      const size = 3 + Math.random() * 6
      const shapeSeed = Math.random()
      const shape = shapeSeed < 0.5 ? "rect" : shapeSeed < 0.75 ? "circle" : shapeSeed < 0.9 ? "triangle" : "streamer"
      return {
        x, y, vx, vy,
        size,
        color: colorsList[Math.floor(Math.random() * colorsList.length)],
        life: 3500 + Math.random() * 2500,
        born: performance.now(),
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        alpha: 1,
        shape,
      }
    }

    // initial burst from wheel center if available
    try {
      const rect = canvasRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      for (let i = 0; i < 200; i++) {
        const ang = Math.random() * Math.PI * 2
        const sp = 6 + Math.random() * 10
        particles.push(makeParticle(cx, cy, Math.cos(ang) * sp, Math.sin(ang) * sp - 2))
      }
    } catch (e) {}

    const start = performance.now()
    let last = start
    const animate = (now) => {
      const elapsed = now - start
      const dt = Math.min(40, now - last)
      last = now

      // emit from top for duration
      if (elapsed < durationMs) {
        emitAccumulator += (emitRate * dt) / 1000
        while (emitAccumulator >= 1) {
          emitAccumulator -= 1
          const x = Math.random() * window.innerWidth
          const y = -20
          const vx = (Math.random() - 0.5) * 1.2
          const vy = 2.5 + Math.random() * 3.5
          particles.push(makeParticle(x, y, vx, vy))
        }
      }

      ctx.clearRect(0, 0, overlay.width, overlay.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vx = p.vx * drag + wind
        p.vy = p.vy * drag + gravity
        p.x += p.vx * (dt / 16.666)
        p.y += p.vy * (dt / 16.666)
        p.rotation += p.spin

        const lifeElapsed = now - p.born
        p.alpha = Math.max(0, 1 - lifeElapsed / p.life)
        if (p.alpha <= 0 || p.y > window.innerHeight + 40) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        switch (p.shape) {
          case "circle":
            ctx.beginPath()
            ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2)
            ctx.fill()
            break
          case "triangle":
            ctx.beginPath()
            ctx.moveTo(0, -p.size)
            ctx.lineTo(p.size, p.size)
            ctx.lineTo(-p.size, p.size)
            ctx.closePath()
            ctx.fill()
            break
          case "streamer":
            ctx.fillRect(-p.size * 0.4, -p.size * 1.6, p.size * 0.8, p.size * 3.2)
            break
          default:
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        }
        ctx.restore()
      }

      if (elapsed < durationMs + 1500 || particles.length > 0) {
        confettiRef.current && (confettiRef.current.rafId = requestAnimationFrame(animate))
      } else {
        stopConfetti()
      }
    }

    confettiRef.current = { overlay, rafId: requestAnimationFrame(animate), resizeHandler: onResize }
  }

  const stopConfetti = () => {
    const state = confettiRef.current
    if (!state) return
    confettiRef.current = null
    try {
      if (state.rafId) cancelAnimationFrame(state.rafId)
    } catch (e) {}
    window.removeEventListener("resize", state.resizeHandler)
    if (state.overlay && state.overlay.parentElement) state.overlay.remove()
  }

  React.useEffect(() => {
    return () => {
      if (stopConfettiOnUnmount) stopConfetti()
    }
  }, [stopConfettiOnUnmount])

  const closeResult = () => {
    setShowResult(false)
    stopConfetti()
  }

  const wheelContainer = (
    <div className="wheel-container">
      <h2>{title || "Wheels Picker"}</h2>
      <p className="subtitle">{subtitle || "Help you to make a random decision"}</p>
      <div
        className="wheel-wrapper"
        onMouseDown={() => setWatermarkVisible(false)}
        onTouchStart={() => setWatermarkVisible(false)}
      >
        <canvas ref={canvasRef} id="wheelCanvas" width={560} height={560} />
        <div
          className="spin-button"
          onMouseDown={() => setWatermarkVisible(false)}
          onTouchStart={() => setWatermarkVisible(false)}
          onClick={spin}
          role="button"
          aria-label="Spin"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && spin()}
        >
          <div className="pointer" />
          <span>SPIN</span>
        </div>
      </div>
      <div className="wheel-controls">
        <button className="control-btn" onClick={() => setSoundEnabled((v) => !v)} title={soundEnabled ? "Sound On" : "Sound Off"}>
          <span role="img" aria-label="sound">{soundEnabled ? "🔊" : "🔇"}</span>
        </button>
        <button className="control-btn" onClick={() => alert("Results history feature coming soon!")}>🏆</button>
      </div>
    </div>
  )

  if (renderOnlyWheel) {
    return (
      <>
        {wheelContainer}
        {showResult && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.0)",
              zIndex: 1000,
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                textAlign: "center",
                minWidth: 300,
              }}
            >
              <h2 style={{ color: "#2E7D32", marginBottom: "1rem" }}>🎉 Result!</h2>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>{resultText}</p>
              <button
                onClick={closeResult}
                style={{
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="container">
      {!hideHeader && (
        <header className="header">
          <Link to="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="wheel-icon">🎯</div>
            <h1>{siteTitle}</h1>
          </Link>
          <nav className="nav">
            
            <div style={{ position: "relative" }} ref={settingsRef}>
              <button
                className="nav-btn"
                aria-haspopup="menu"
                aria-expanded={settingsOpen}
                onClick={() => setSettingsOpen((v) => !v)}
              >
                Settings ▾
              </button>
              {settingsOpen && (
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
                    minWidth: 280,
                    padding: 8,
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                    <button
                      onClick={createNewWheel}
                      style={{
                        width: "100%",
                        background: "#fef3c7",
                        border: "1px solid #fcd34d",
                        borderRadius: 6,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      + Create New Wheel
                    </button>
                    <div style={{ marginTop: 6, color: "#777", fontSize: 12 }}>
                      Only the selected wheel is kept for next visit.
                    </div>
                  </div>

                  <div style={{ maxHeight: 260, overflow: "auto", padding: 4 }}>
                    {wheels.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => selectWheel(w.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: 6,
                          marginBottom: 4,
                          background: w.id === activeWheelId ? "#fde68a" : "transparent",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = w.id === activeWheelId ? "#fde68a" : "#f0f2f5")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = w.id === activeWheelId ? "#fde68a" : "transparent")}
                      >
                        <div style={{ fontWeight: 700 }}>{w.name}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteWheel(w.id) }}
                          title="Remove"
                          style={{ border: "none", background: "transparent", cursor: "pointer" }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
      )}

      <div className="main-content">
        <div className="wheel-section">
          {wheelContainer}
        </div>

        {!hideInputsPanel && (
          <div className="inputs-panel">
            {isYesNoVariant && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <div style={{ flex: 1, background: "#1b5e20", color: "#fff", borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{yesCount}</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>YES</div>
                  </div>
                  <div style={{ flex: 1, background: "#f0ad0c", color: "#000", borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{noCount}</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>NO</div>
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Mode</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <button
                      onClick={() => setMode("yesno")}
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: mode === "yesno" ? "2px solid #1b5e20" : "1px solid #ccc",
                        background: mode === "yesno" ? "#e8f5e9" : "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      YES or NO
                    </button>
                    <button
                      onClick={() => setMode("yesnomaybe")}
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: mode === "yesnomaybe" ? "2px solid #333" : "1px solid #ccc",
                        background: mode === "yesnomaybe" ? "#f7f7f7" : "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      YES NO or MAYBE
                    </button>
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Number of Input Sets</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[1,2,3,4,5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setInputSets(n)}
                        style={{
                          width: 72,
                          padding: "10px 0",
                          borderRadius: 8,
                          border: inputSets === n ? "2px solid #333" : "1px solid #ccc",
                          background: inputSets === n ? "#eee" : "#fff",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="panel-header">
              <h3>INPUTS</h3>
              <div className="panel-controls">
                <button className="panel-btn">👁️</button>
                <button className="panel-btn">↩️</button>
                <button className="panel-btn">☰</button>
                <button className="panel-btn">⋯</button>
              </div>
            </div>

            <div className="input-section">
              <div className="input-group">
                <input
                  id="inputField"
                  type="text"
                  placeholder="Input text here..."
                  maxLength={50}
                  value={newInput}
                  onChange={(e) => setNewInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addInput()}
                />
                <button id="addBtn" className="add-btn" onClick={addInput}>+</button>
              </div>
              <div className="separator" />
              <div className="inputs-list">
                {inputs.map((t, i) => (
                  <div key={i} className="input-item">
                    <span className="text">{t}</span>
                    <button className="remove-btn" onClick={() => removeInput(i)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-footer">
              <button className="panel-btn">🖼️</button>
              <button className="panel-btn">⤢</button>
            </div>
          </div>
        )}
      </div>
      {showResult && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.0)",
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              textAlign: "center",
              minWidth: 300,
            }}
          >
            <h2 style={{ color: "#2E7D32", marginBottom: "1rem" }}>🎉 Result!</h2>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>{resultText}</p>
            <button
              onClick={closeResult}
              style={{
                background: "#4CAF50",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


