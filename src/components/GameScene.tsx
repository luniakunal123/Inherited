import { useState, useEffect, useRef } from 'react'
import { useInkStory } from '../hooks/useInkStory'
import type { InkChoice } from '../types'

const BG_COLOURS: Record<string, string> = {
  classroom_day:         '#1a1a2e',
  home_entrance_evening: '#1a1208',
  living_room_night:     '#0d0d0d',
  bedroom_day:           '#1a1a14',
  office_corridor:       '#0f1520',
  fade_grey:             '#111111',
  fade_white:            '#1a1916',
  black:                 '#000000',
}

type Props = { playerName: string }

export default function GameScene({ playerName }: Props) {
  const { state, choose, lockMessage } = useInkStory(playerName)

  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  )

  const tags = state.tags.reduce((acc, tag) => {
    const [k, ...v] = tag.split(':')
    acc[k.trim()] = v.join(':').trim()
    return acc
  }, {} as Record<string, string>)


  const bg = BG_COLOURS[tags['background']] ?? '#000'
  const readingDelay = Math.min(
    7000,
    Math.max(
      2500,
      state.paragraphs.join(' ').length * 25
    )
  )

  const [pendingChanges, setPendingChanges] = useState<string[]>([])
const [activeChange, setActiveChange] = useState<number>(-1)
const [showStatPanel, setShowStatPanel] = useState(false)
const [hitBar, setHitBar] = useState<string | null>(null)

useEffect(() => {
  const handleResize = () => {
    setIsPortrait(
      window.innerHeight > window.innerWidth
    )
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

const previousStats = useRef({
  composure: state.variables.composure ?? 100,
  energy: state.variables.energy ?? 80,
  stress: state.variables.stress ?? 30,
})
  
useEffect(() => {
  const prev = previousStats.current

  const composure = state.variables.composure ?? 100
  const energy = state.variables.energy ?? 80
  const stress = state.variables.stress ?? 30

  const notifications: string[] = []

  if (composure !== prev.composure) {
    const diff = composure - prev.composure

    notifications.push(
      `COMPOSURE ${diff > 0 ? '+' : ''}${diff}`
    )
  }

  if (energy !== prev.energy) {
    const diff = energy - prev.energy

    notifications.push(
      `ENERGY ${diff > 0 ? '+' : ''}${diff}`
    )
  }

  if (stress !== prev.stress) {
    const diff = stress - prev.stress

    notifications.push(
      `STRESS ${diff > 0 ? '+' : ''}${diff}`
    )
  }

  if (notifications.length > 0) {
    setPendingChanges(notifications)
  }

  previousStats.current = {
    composure,
    energy,
    stress,
  }
}, [state.variables])

useEffect(() => {
  if (pendingChanges.length === 0) return

  let current = 0

  setActiveChange(-1)
setShowStatPanel(false)

const startTimer = setTimeout(() => {
  setShowStatPanel(true)
  setActiveChange(0)

    const interval = setInterval(() => {
      const change = pendingChanges[current]

      if (change.includes('COMPOSURE')) {
        setHitBar('Composure')
      }

      if (change.includes('ENERGY')) {
        setHitBar('Energy')
      }

      if (change.includes('STRESS')) {
        setHitBar('Stress')
      }

      setTimeout(() => {
        setHitBar(null)
      }, 400)

      current++

      if (current >= pendingChanges.length) {
        clearInterval(interval)

        setTimeout(() => {
          setPendingChanges([])
          setActiveChange(-1)
          setShowStatPanel(false)
        }, 1200)
      } else {
        setActiveChange(current)
      }
    }, 1200)
  }, readingDelay)

  return () => {
    clearTimeout(startTimer)
  }
}, [pendingChanges, readingDelay])

if (isPortrait) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: 'rgba(255,255,255,0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          marginBottom: '1rem',
        }}
      >
        ↻
      </div>

      <p style={{ fontSize: '1.1rem' }}>
        Turn the page.
      </p>

      <p
        style={{
          opacity: 0.6,
          fontSize: '0.9rem',
        }}
      >
        Some stories are wider than they are tall.
      </p>
    </div>
  )
}
  

  if (state.isEnded) {
    return <EndScreen />
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      transition: 'background-color 1.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
    }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          {state.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: '0.5em' }}>{p}</p>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {state.choices.length > 0 ? (
            state.choices.map(choice => (
              <ChoiceButton
                key={choice.index}
                choice={choice}
                onChoose={choose}
              />
            ))
          ) : (
            <button
              onClick={() => choose({ index: -1, text: '', isLocked: false, isPermanentLock: false, isFaint: false })}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(212,207,200,0.5)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                letterSpacing: '0.08em',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(212,207,200,1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,207,200,0.5)')}
            >
              <span>continue</span>
              <span>→</span>
            </button>
          )}
        </div>

        {lockMessage && (
          <p style={{
            color: 'rgba(212,207,200,0.45)',
            fontSize: '0.82rem',
            fontStyle: 'italic',
            marginTop: '0.8rem',
          }}>
            {lockMessage}
          </p>
        )}

</div> 


{(tags['character'] === 'papa_tired' || tags['character'] === 'papa_controlled') && (
  <>
  {showStatPanel && (
    <div
      style={{
        position: 'fixed',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        padding: '16px 24px',
        backdropFilter: 'blur(8px)',
        minWidth: '300px',
        zIndex: 1000,
      }}
    >
      {pendingChanges.map((change, index) => (
        <div
          key={change}
          style={{
            padding: '6px 0',
            fontFamily: 'monospace',
      letterSpacing: '0.08em',
            opacity:
              index < activeChange
                ? 0.2
                : index === activeChange
                ? 1
                : 0.6,
            transform:
              index === activeChange
                ? 'scale(1.05)'
                : 'scale(1)',
            transition: 'all 0.3s ease',
          }}
        >
          {change}
        </div>
      ))}
    </div>
  )}

<Bars
  composure={state.variables.composure ?? 100}
  energy={state.variables.energy ?? 80}
  stress={state.variables.stress ?? 30}
  hitBar={hitBar}
/>
  </>
)}

    </div>
  )
}


function ChoiceButton({
  choice,
  onChoose,
}: {
  choice: InkChoice
  onChoose: (c: InkChoice) => void
}) {
  const isLocked = choice.isLocked

  return (
    <button
      onClick={() => onChoose(choice)}
      style={{
        background: 'transparent',
        border: `1px solid ${
          choice.isFaint
            ? 'rgba(139,157,195,0.25)'
            : isLocked
            ? 'rgba(212,207,200,0.15)'
            : 'rgba(212,207,200,0.18)'
        }`,
        color: isLocked
          ? 'rgba(212,207,200,0.35)'
          : choice.isFaint
          ? 'rgba(139,157,195,0.65)'
          : 'rgba(212,207,200,0.85)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: choice.isFaint ? '0.92rem' : '1rem',
        fontStyle: isLocked ? 'italic' : choice.isFaint ? 'italic' : 'normal',
        lineHeight: 1.6,
        padding: '0.6rem 1rem',
        textAlign: 'left',
        width: '100%',
        textDecoration: 'none',
        letterSpacing: isLocked ? '0.02em' : 'normal',
      }}
    >
      {isLocked ? '🔒 ' : ''}{choice.text}
    </button>
  )
}

function EndScreen() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const lines = 3
    let current = 0
    const interval = setInterval(() => {
      current++
      setVisible(current)
      if (current >= lines) clearInterval(interval)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const lines = [
    'You are sixteen.',
    'You were eight.',
    'You will be both for the rest of your life.',
  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1.2em',
      textAlign: 'center',
      padding: '2rem',
    }}>
      {lines.map((line, i) => (
        <p
          key={i}
          style={{
            fontSize: '1.3rem',
            opacity: visible > i ? 1 : 0,
            transition: 'opacity 0.8s ease',
            margin: 0,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  )
}

function Bars({
  composure,
  energy,
  stress,
  hitBar,
}: {
  composure: number
  energy: number
  stress: number
  hitBar: string | null
}) {
  const stats = [
    { label: 'Composure', value: composure },
    { label: 'Energy', value: energy },
    { label: 'Stress', value: stress },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '220px',
        padding: '16px',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        zIndex: 999,
      }}
    >
      {stats.map(stat => {
  const isHit = hitBar === stat.label

  return (
    <div
    key={stat.label}
    style={{
      marginBottom: '14px',
      transform: isHit
  ? 'translateX(-6px) scale(1.06)'
  : 'translateX(0px) scale(1)',

transition:
  'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
    }}
  >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
              fontSize: '0.95rem',
            }}
          >
            <span>{stat.label}</span>
            <span>{stat.value}</span>
          </div>

          <div
            style={{
              height: '10px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.max(0, Math.min(100, stat.value))}%`,
                height: '100%',
                background: isHit
  ? 'rgba(255,255,255,1)'
  : 'rgba(255,255,255,0.85)',

boxShadow: isHit
  ? '0 0 12px rgba(255,255,255,0.65)'
  : 'none',

transition:
  'width 0.9s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease',
              }}
            />
          </div>
        </div>
      )})
}
    </div>
  )
}
