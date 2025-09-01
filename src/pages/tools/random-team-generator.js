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

const sample = ["Alex", "Jamie", "Taylor", "Jordan", "Casey", "Morgan", "Riley", "Quinn"]

const Card = ({ children, style }) => (
  <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 6px 28px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", overflow: "hidden", ...style }}>{children}</div>
)

const SectionTitle = ({ children }) => (
  <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: 0.2, marginBottom: 10, color: "#1f2937" }}>{children}</div>
)

const Label = ({ children }) => (
  <div style={{ marginBottom: 6, fontWeight: 600, color: "#374151" }}>{children}</div>
)

const SmallTip = ({ children }) => (
  <div style={{ color: "#6b7280", fontSize: 12 }}>{children}</div>
)

const RandomTeamGeneratorPage = () => {
  const [namesText, setNamesText] = React.useState(sample.join("\n"))
  const [groupsCount, setGroupsCount] = React.useState(2)
  const [maxPerGroup, setMaxPerGroup] = React.useState(1)
  const [pickQty, setPickQty] = React.useState(0)
  const [pickRepresentatives, setPickRepresentatives] = React.useState(false)
  const [groups, setGroups] = React.useState([])
  const [lastAdded, setLastAdded] = React.useState(null)

  const [showWheel, setShowWheel] = React.useState(false)
  const [wheelQueue, setWheelQueue] = React.useState([])
  const overlayRef = React.useRef(null)
  const nextGroupIndexRef = React.useRef(0)

  // Optional: allow overriding defaults via query param ?names=Alice,Bob,Charlie
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      const raw = params.get('names')
      if (!raw) return
      const parts = raw
        .split(raw.includes('\n') ? /\r?\n/ : ',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (parts.length) setNamesText(parts.join('\n'))
    } catch (e) {}
  }, [])

  const parsedNames = React.useMemo(() => {
    return namesText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
  }, [namesText])

  function computeTargetGroups(total) {
    let g = groupsCount > 0 ? groupsCount : 0
    if (!g && maxPerGroup > 0) g = Math.max(1, Math.ceil(total / maxPerGroup))
    if (g <= 0) g = 2
    return g
  }

  function startSequentialAssign() {
    const list = shuffleArray(parsedNames)
    const targetGroups = computeTargetGroups(list.length)
    const initial = Array.from({ length: targetGroups }, () => ({ members: [], repIndex: -1 }))
    setGroups(initial)
    setWheelQueue(list)
    nextGroupIndexRef.current = 0
    setShowWheel(true)
    // kick first spin shortly after overlay mounts
    setTimeout(() => {
      const spinBtn = overlayRef.current?.querySelector?.('.spin-button')
      spinBtn && spinBtn.click()
    }, 350)
  }

  function continueIfNeeded(updatedGroups, remaining) {
    const capacityReached = maxPerGroup > 0 && updatedGroups.every(g => g.members.length >= maxPerGroup)
    const done = remaining.length === 0 || capacityReached
    if (done) {
      setTimeout(() => setShowWheel(false), 600)
      return
    }
    setTimeout(() => {
      const spinBtn = overlayRef.current?.querySelector?.('.spin-button')
      spinBtn && spinBtn.click()
    }, 600)
  }

  const onWheelResult = (winner) => {
    if (!winner) return
    setWheelQueue((prev) => {
      const remaining = prev.filter((n) => n !== winner)
      setGroups((gs) => {
        const nextGs = gs.map((g) => ({ ...g, members: [...g.members] }))
        // find next group with capacity
        let idx = nextGroupIndexRef.current
        const totalGroups = nextGs.length
        let loops = 0
        while (maxPerGroup > 0 && nextGs[idx].members.length >= maxPerGroup && loops < totalGroups) {
          idx = (idx + 1) % totalGroups
          loops++
        }
        nextGroupIndexRef.current = (idx + 1) % totalGroups
        nextGs[idx].members.push(winner)
        setLastAdded({ groupIndex: idx, name: winner, ts: Date.now() })
        return nextGs
      })
      continueIfNeeded(groups, remaining) // groups here is previous state, but we only need remaining to evaluate done; fine.
      return remaining
    })
  }

  const resetGroups = () => setGroups([])

  const startDisabled = parsedNames.length === 0

  return (
    <>
      <div className="container">
        <WheelHeader />
        <div className="main-content">
          {/* RESULT */}
          <Card style={{ flex: 1, padding: 16 }}>
            <SectionTitle>3. RESULT</SectionTitle>
            {groups.length === 0 ? (
              <div style={{ color: '#6b7280' }}>No teams yet. Configure the controller and press START.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {groups.map((g, i) => (
                  <div key={i} style={{ border: '1px solid #cbd5e1', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                    <div style={{ padding: '10px 12px', fontWeight: 900, background: i % 2 ? '#fbbf24' : '#14532d', color: i % 2 ? '#111827' : '#fff' }}>
                      Team {i + 1}
                    </div>
                    <div style={{ padding: 12, minHeight: 180 }}>
                      {g.members.length === 0 ? (
                        <div style={{ color: '#6b7280' }}>Empty</div>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {g.members.map((m, idx) => (
                            <li key={idx} style={{ marginBottom: 4, lineHeight: 1.4, transition: 'background 300ms', background: lastAdded && lastAdded.groupIndex === i && lastAdded.name === m ? '#fef3c7' : 'transparent' }}>
                              {m}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* CONTROLLER */}
          <Card style={{ width: 400, padding: 16 }}>
            <SectionTitle>2. CONTROLLER</SectionTitle>

            <Label>Distribute equally based on:</Label>
            <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="radio" name="basis" defaultChecked /> Default</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="radio" name="basis" disabled /> Gender</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="radio" name="basis" disabled /> Label</label>
            </div>

            <Label>Pick quantity <span title="Pick N from the list">ℹ️</span></Label>
            <input type="number" value={pickQty} min={0} onChange={(e)=>setPickQty(Math.max(0, parseInt(e.target.value||'0',10)))} style={{ width: 90, padding: 10, borderRadius: 10, border: '1px solid #d1d5db', marginBottom: 12, fontWeight: 700, textAlign: 'center' }} />

            <Label>Number of groups</Label>
            <input type="number" value={groupsCount} min={0} onChange={(e)=>setGroupsCount(Math.max(0, parseInt(e.target.value||'0',10)))} style={{ width: 90, padding: 10, borderRadius: 10, border: '1px solid #d1d5db', marginBottom: 6, fontWeight: 700, textAlign: 'center' }} />
            <SmallTip>OR (Set either one)</SmallTip>

            <Label>Max people/group</Label>
            <input type="number" value={maxPerGroup} min={0} onChange={(e)=>setMaxPerGroup(Math.max(0, parseInt(e.target.value||'0',10)))} style={{ width: 90, padding: 10, borderRadius: 10, border: '1px solid #d1d5db', marginBottom: 12, fontWeight: 700, textAlign: 'center' }} />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 16px' }}>
              <input type="checkbox" checked={pickRepresentatives} onChange={(e)=>setPickRepresentatives(e.target.checked)} />
              Pick representatives?
            </label>

            <button onClick={startSequentialAssign} disabled={startDisabled} style={{ width: '100%', padding: '14px 16px', fontWeight: 900, background: startDisabled ? '#f3f4f6' : '#fde68a', color: '#111827', border: '1px solid #eab308', borderRadius: 10, cursor: startDisabled ? 'not-allowed' : 'pointer', boxShadow: startDisabled ? 'none' : 'inset 0 -2px 0 rgba(0,0,0,0.05)' }}>START</button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <button style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#111827' }} onClick={()=>window.alert('Groups board coming soon!')}>Open Groups Board</button>
              <button style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#111827' }} onClick={resetGroups}>Remove All Groups</button>
            </div>
          </Card>

          {/* INPUTS */}
          <Card style={{ width: 520 }}>
            <div style={{ padding: 16 }}>
              <SectionTitle>1. INPUTS</SectionTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span title="Preview" style={{ opacity: 0.8 }}>👁️</span>
                  <span title="Group" style={{ opacity: 0.8 }}>👥</span>
                  <span title="List" style={{ opacity: 0.8 }}>📋</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button title="More" className="panel-btn" style={{ width: 'auto', height: 'auto', padding: '6px 10px' }}>⋯</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <input placeholder="Input here..." value={''} onChange={()=>{}} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }} />
                <button title="Add" className="panel-btn" style={{ width: 36, height: 36, borderRadius: 8 }}>+</button>
              </div>
              <div style={{ borderBottom: '3px dashed #9aa0a6', margin: '10px 0 14px' }} />
              <textarea
                value={namesText}
                onChange={(e)=>setNamesText(e.target.value)}
                style={{ width: '100%', minHeight: 420, resize: 'vertical', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb', lineHeight: 1.5 }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Wheel Overlay */}
      {showWheel && (
        <div ref={overlayRef} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
            <PickerWheel
              inputs={wheelQueue}
              title="Picking..."
              subtitle=""
              hideHeader
              hideInputsPanel
              renderOnlyWheel
              showLocalSettings={false}
              onResult={onWheelResult}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Random Team Generator" />

export default RandomTeamGeneratorPage
