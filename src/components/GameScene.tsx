import { useState, useEffect, useRef } from 'react'
import { useInkStory } from '../hooks/useInkStory'
import type { InkChoice } from '../types'
import Act1 from '../assets/backgrounds/Act1.png'
import Act2 from '../assets/backgrounds/Act2.png'
import Act3 from '../assets/backgrounds/Act3.png'
import Option1 from '../assets/backgrounds/Aoption1.png'
import Option2 from '../assets/backgrounds/Aoption2.png'
import Option3 from '../assets/backgrounds/Aoption3.png'
import ClassroomSound from '../assets/sounds/Classroom.wav'
import KitchenSound from '../assets/sounds/Kitchen.wav'
import RoomSound from '../assets/sounds/Room.wav'
import SlapSound from '../assets/sounds/Slap.wav'
import Act4 from '../assets/backgrounds/Act4.png'
import Act5 from '../assets/backgrounds/Act5.png'
import Act6 from '../assets/backgrounds/Act6.png'
import Act7 from '../assets/backgrounds/Act7.png'
import Act8 from '../assets/backgrounds/Act8.png'
import Act9 from '../assets/backgrounds/Act9.png'
import Act10 from '../assets/backgrounds/Act10.png'
import Act11 from '../assets/backgrounds/Act11.png'

const SCENE_IMAGES: Record<string, string> = {
  Act1, Act2, Act3, Act4, Act5, Act6, Act7, Act8, Act9, Act10, Act11,
  Option1, Option2, Option3,
}

const SCENE_SOUNDS: Record<string, string> = {
  Classroom: ClassroomSound,
  Kitchen: KitchenSound,
  Room: RoomSound,
  Slap: SlapSound,
}

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

  const tags = state.tags.reduce((acc, tag) => {
    const [k, ...v] = tag.split(':')
    acc[k.trim()] = v.join(':').trim()
    return acc
  }, {} as Record<string, string>)

  const sceneImage = SCENE_IMAGES[tags['image']] ?? null
  const sceneSound = SCENE_SOUNDS[tags['sound']] ?? null
  const bg = BG_COLOURS[tags['background']] ?? '#000'
  const transitionTag = tags['transition'] ?? null
  const speakTag = tags['speak'] ?? null

  const readingDelay = Math.min(
    7000,
    Math.max(2500, state.paragraphs.join(' ').length * 25)
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (tags['sound'] === 'silence') {
      audioRef.current?.pause()
      audioRef.current = null
      return
    }
    if (sceneSound) {
      const currentSrc = audioRef.current?.src ?? ''
      const newSrc = new Audio(sceneSound).src
      if (!audioRef.current || !currentSrc.includes(newSrc.split('/').pop() ?? '')) {
        audioRef.current?.pause()
        audioRef.current = new Audio(sceneSound)
        audioRef.current.loop = sceneSound === SlapSound ? false : true
        audioRef.current.volume = sceneSound === SlapSound ? 0.8 : 0.3
        audioRef.current.play().catch(() => {})
      }
    } else {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [sceneSound, tags])

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth)
  const [showContinue, setShowContinue] = useState(false)
  const [transition, setTransition] = useState<'idle' | 'fading_in' | 'holding' | 'fading_out'>('idle')
  const [pendingChanges, setPendingChanges] = useState<string[]>([])
  const [activeChange, setActiveChange] = useState<number>(-1)
  const [showStatPanel, setShowStatPanel] = useState(false)
  const [hitBar, setHitBar] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setShowContinue(false)
    const timer = setTimeout(() => setShowContinue(true), readingDelay)
    return () => clearTimeout(timer)
  }, [state.paragraphs])

  // Speech synthesis — automatic on scene load
  useEffect(() => {
    if (!speakTag) return
    const text = speakTag === 'player_name' ? playerName : speakTag
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = 1

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred =
                voices.find(v => v.name.includes('Prabhat Indic')) ??
                voices.find(v => v.name.includes('मधुर')) ??
                voices.find(v => v.lang === 'hi-IN') ??
                voices[0]
      if (preferred) utterance.voice = preferred
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => loadVoices()
    } else {
      loadVoices()
    }

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [speakTag, playerName])

  // Transition animation
  useEffect(() => {
    if (!transitionTag) {
      setTransition('idle')
      return
    }
    setTransition('fading_in')
    const t1 = setTimeout(() => setTransition('holding'), 1000)
    const t2 = setTimeout(() => setTransition('fading_out'), 6000)
    const t3 = setTimeout(() => {
      setTransition('idle')
      choose({ index: -1, text: '', isLocked: false, isPermanentLock: false, isFaint: false })
    }, 7000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [transitionTag])

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

    if (composure !== prev.composure) notifications.push(`COMPOSURE ${composure - prev.composure > 0 ? '+' : ''}${composure - prev.composure}`)
    if (energy !== prev.energy) notifications.push(`ENERGY ${energy - prev.energy > 0 ? '+' : ''}${energy - prev.energy}`)
    if (stress !== prev.stress) notifications.push(`STRESS ${stress - prev.stress > 0 ? '+' : ''}${stress - prev.stress}`)

    if (notifications.length > 0) setPendingChanges(notifications)
    previousStats.current = { composure, energy, stress }
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
        if (change.includes('COMPOSURE')) setHitBar('Composure')
        if (change.includes('ENERGY')) setHitBar('Energy')
        if (change.includes('STRESS')) setHitBar('Stress')
        setTimeout(() => setHitBar(null), 400)
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

    return () => clearTimeout(startTimer)
  }, [pendingChanges, readingDelay])

  if (isPortrait) {
    return (
      <div style={{
        height: '100vh', overflow: 'hidden', background: '#000',
        color: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>↻</div>
        <p style={{ fontSize: '1.1rem' }}>Please rotate your device.</p>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Some stories are wider than they are tall.</p>
      </div>
    )
  }

  if (state.isEnded) return <EndScreen />

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      transition: 'background-color 1.2s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: '1rem',
    }}>

      {sceneImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${sceneImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.6, transition: 'opacity 0.8s ease', zIndex: 0,
        }} />
      )}

      {sceneImage && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
          zIndex: 1,
        }} />
      )}

      <div style={{
        position: 'relative', zIndex: 2, width: '92%',
        background: 'rgba(0,0,0,0.25)', borderRadius: '8px',
        padding: '0.8rem 1rem', border: 'none',
      }}>
        {state.paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0, marginBottom: '0.5em' }}>{p}</p>
        ))}

        {state.choices.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.7rem' }}>
            {state.choices.map(choice => (
              <ChoiceButton key={choice.index} choice={choice} onChoose={choose} />
            ))}
          </div>
        )}

        {state.choices.length === 0 && showContinue && !transitionTag && (
          <button
          onClick={() => {
            choose({ index: -1, text: '', isLocked: false, isPermanentLock: false, isFaint: false })
          }}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(212,207,200,0.5)', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.85rem', padding: '0',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              letterSpacing: '0.08em', transition: 'color 0.3s ease', marginTop: '0.8rem',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(212,207,200,1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,207,200,0.5)')}
          >
            <span>continue</span>
            <span>→</span>
          </button>
        )}
      </div>

      {transition !== 'idle' && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: transition === 'fading_in' ? 0 : 1,
          transition: transition === 'fading_in' ? 'opacity 1s ease' : transition === 'fading_out' ? 'opacity 1s ease' : 'none',
          animation: transition === 'fading_in' ? 'fadeIn 1s ease forwards' : 'none',
        }}>
          {(transition === 'holding' || transition === 'fading_out') && (
            <p style={{
              color: 'rgba(212,207,200,0.7)', fontSize: '0.95rem', fontStyle: 'italic',
              letterSpacing: '0.1em', textAlign: 'center', lineHeight: 1.8,
              opacity: transition === 'fading_out' ? 0 : 1,
              transition: transition === 'fading_out' ? 'opacity 1s ease' : 'none',
              animation: transition === 'holding' ? 'fadeIn 0.8s ease forwards' : 'none',
            }}>
              {transitionTag === 'eight_years_earlier'
                ? 'Eight years earlier.'
                : transitionTag === 'three_days_later'
                ? 'Three days later.'
                : transitionTag === 'hold_onto_that'
                ? <>This hurt you. It was wrong. Hold onto that.<br/>The game will not take it from you.</>
                : ''}
            </p>
          )}
        </div>
      )}

      {lockMessage && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', zIndex: 100,
          color: 'rgba(212,207,200,0.85)', fontSize: '0.9rem', fontStyle: 'italic',
          textAlign: 'center', padding: '1rem 2rem', background: 'rgba(0,0,0,0.55)',
          borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
          maxWidth: '700px', whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          {lockMessage}
        </div>
      )}

      {(tags['character'] === 'papa_tired' || tags['character'] === 'papa_controlled') && (
        <>
          {showStatPanel && (
            <div style={{
              position: 'fixed', top: '70px', left: '50%',
              transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
              padding: '10px 14px', minWidth: '200px', zIndex: 1000,
            }}>
              {pendingChanges.map((change, index) => (
                <div key={change} style={{
                  padding: '3px 0', fontSize: '0.75rem', fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  opacity: index < activeChange ? 0.2 : index === activeChange ? 1 : 0.6,
                  transform: index === activeChange ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}>
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

function ChoiceButton({ choice, onChoose }: { choice: InkChoice; onChoose: (c: InkChoice) => void }) {
  const isLocked = choice.isLocked
  const [shaking, setShaking] = useState(false)

  const handleClick = () => {
    if (isLocked) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
    onChoose(choice)
  }

  return (
    <button onClick={handleClick} style={{
      background: isLocked ? 'rgba(180,140,80,0.06)' : 'transparent',
      border: isLocked
        ? '1px dashed rgba(212,207,200,0.25)'
        : choice.isFaint ? '1px solid rgba(139,157,195,0.5)' : '1px solid rgba(212,207,200,0.5)',
      color: isLocked ? 'rgba(212,207,200,0.45)' : choice.isFaint ? 'rgba(139,157,195,0.85)' : 'rgba(255,255,255,1)',
      cursor: 'pointer', fontFamily: 'inherit',
      fontSize: isLocked ? '0.78rem' : choice.isFaint ? '0.82rem' : '0.88rem',
      fontStyle: isLocked ? 'italic' : choice.isFaint ? 'italic' : 'normal',
      lineHeight: 1.2, padding: '0.18rem 0.7rem', textAlign: 'left',
      width: '100%', textDecoration: 'none',
      letterSpacing: isLocked ? '0.02em' : 'normal',
      animation: shaking ? 'shake 0.5s ease' : 'none',
    }}>
      {isLocked ? '🔒 ' : ''}{choice.text}
    </button>
  )
}

function EndScreen() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current++
      setVisible(current)
      if (current >= 3) clearInterval(interval)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const lines = ['You are sixteen.', 'You were eight.', 'You will be both for the rest of your life.']

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', gap: '0.8em',
      textAlign: 'center', padding: '2rem',
    }}>
      {lines.map((line, i) => (
        <p key={i} style={{ fontSize: '1rem', opacity: visible > i ? 1 : 0, transition: 'opacity 0.8s ease', margin: 0 }}>{line}</p>
      ))}
    </div>
  )
}

function Bars({ composure, energy, stress, hitBar }: { composure: number; energy: number; stress: number; hitBar: string | null }) {
  const stats = [
    { label: 'Composure', value: composure },
    { label: 'Energy', value: energy },
    { label: 'Stress', value: stress },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', width: '170px',
      padding: '10px', background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', zIndex: 999,
    }}>
      {stats.map(stat => {
        const isHit = hitBar === stat.label
        return (
          <div key={stat.label} style={{
            marginBottom: '14px',
            transform: isHit ? 'translateX(-6px) scale(1.06)' : 'translateX(0px) scale(1)',
            transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
              <span>{stat.label}</span>
              <span>{stat.value}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.max(0, Math.min(100, stat.value))}%`, height: '100%',
                background: isHit ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.85)',
                boxShadow: isHit ? '0 0 12px rgba(255,255,255,0.65)' : 'none',
                transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
