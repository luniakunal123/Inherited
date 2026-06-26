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
import Beta from '../assets/sounds/Beta.wav'
import RoomSound from '../assets/sounds/Room.wav'
import SlapSound from '../assets/sounds/Slap.wav'
import Office from '../assets/sounds/Office.wav'
import Traffic from '../assets/sounds/Traffic.wav'
import Act4 from '../assets/backgrounds/Act4.png'
import Act5 from '../assets/backgrounds/Act5.png'
import Act6 from '../assets/backgrounds/Act6.png'
import Act7 from '../assets/backgrounds/Act7.png'
import Act8 from '../assets/backgrounds/Act8.png'
import Act9 from '../assets/backgrounds/Act9.png'
import Act10 from '../assets/backgrounds/Act10.png'
import Act11 from '../assets/backgrounds/Act11.png'
import Act200 from '../assets/backgrounds/Act200.png'
import Act201 from '../assets/backgrounds/Act201.png'
import Act202 from '../assets/backgrounds/Act202.png'
import Act203 from '../assets/backgrounds/Act203.png'
import Act204 from '../assets/backgrounds/Act204.png'
import Act205 from '../assets/backgrounds/Act205.png'
import AmbientCanvas from "./AmbientCanvas";
import Chalkboard from "./Chalkboard";

const SCENE_IMAGES: Record<string, string> = {
  Act1, Act2, Act3, Act4, Act5, Act6, Act7, Act8, Act9, Act10, Act11,Act200,Act201,Act202,Act203,Act204,Act205,
  Option1, Option2, Option3,
}

const SCENE_SOUNDS: Record<string, string> = {
  Classroom: ClassroomSound,
  Kitchen: KitchenSound,
  Room: RoomSound,
  Slap: SlapSound,
  Traffic: Traffic,
  Office: Office,
  Beta: Beta
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

const getAmbientScene = (img: string) => {
  if (img === 'Act1' || img === 'Act4' || img === 'Act5' || img === 'Act6') return 'classroom'
  if (img === 'Act2' || img === 'Act3' || img === 'Act7' || img === 'Act8') return 'kitchen'
  if (img === 'Act9' || img === 'Act10' || img === 'Act11') return 'office'
  return 'default'
}

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
  const isWishScene = tags['wish'] === 'true'

  const isIdentityScene = state.paragraphs.join(' ').includes('You are not sure it was what you meant to become')
  const isFlipScene = state.paragraphs.join(' ').includes('You are not') && state.paragraphs.join(' ').includes('anymore') && !isIdentityScene

  const readingDelay = (isIdentityScene || isFlipScene)
    ? 5000
    : Math.min(7000, Math.max(2500, state.paragraphs.join(' ').length * 25))

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
        audioRef.current.loop =
  sceneSound !== SlapSound &&
  sceneSound !== Beta
        audioRef.current.volume = sceneSound === SlapSound ? 0.8 : 0.3
        if (sceneSound === Beta) {
          setTimeout(() => {
            audioRef.current?.play().catch(() => {})
          }, 3000) // 3 second delay
        } else {
          audioRef.current.play().catch(() => {})
        }
      }
    } else {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [sceneSound, tags])

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth)
  const [showContinue, setShowContinue] = useState(false)
  const [transition, setTransition] = useState<'idle' | 'fading_in' | 'holding' | 'fading_out'>('idle')
  const [screenShaking, setScreenShaking] = useState(false)
  const [showWish, setShowWish] = useState(false)
  const [lockedTapped, setLockedTapped] = useState(false)
  const [showChalkboard, setShowChalkboard] = useState(false)
  const [boardDrawing, setBoardDrawing] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setShowContinue(false)
    setLockedTapped(false)
    const timer = setTimeout(() => setShowContinue(true), readingDelay)
    return () => clearTimeout(timer)
  }, [state.paragraphs])

  // Speech synthesis — automatic on scene load
  const spokenFor = useRef<string | null>(null)
  useEffect(() => {
    if (!speakTag) {
      spokenFor.current = null
      return
    }
    if (spokenFor.current === speakTag) return
    spokenFor.current = speakTag

    const text = speakTag === 'player_name' ? playerName : speakTag
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = 1

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred =
        voices.find(v => v.name.includes('अर्जुन')) ??
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
  }, [speakTag, playerName])

  // Flip scene — auto advance after 4 seconds
  const flipAdvanced = useRef(false)
  useEffect(() => {
    if (!isFlipScene) {
      flipAdvanced.current = false
      return
    }
    if (flipAdvanced.current) return
    flipAdvanced.current = true
    const t = setTimeout(() => {
      choose({ index: -1, text: '', isLocked: false, isPermanentLock: false, isFaint: false })
    }, 4000)
    return () => clearTimeout(t)
  }, [isFlipScene])

  // Wish scene — fade in then auto advance
  const wishAdvanced = useRef(false)
  useEffect(() => {
    if (!isWishScene) {
      setShowWish(false)
      wishAdvanced.current = false
      return
    }
    if (wishAdvanced.current) return
    wishAdvanced.current = true
    setShowWish(false)
    const t1 = setTimeout(() => setShowWish(true), 1500)
    const t2 = setTimeout(() => {
      choose({ index: -1, text: '', isLocked: false, isPermanentLock: false, isFaint: false })
    }, 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isWishScene])

  const hasShaken = useRef(false)

  // Screen shake + vibration on slap
  useEffect(() => {
    if (tags['sound'] !== 'Slap') {
      hasShaken.current = false
      return
    }
    if (hasShaken.current) return
    hasShaken.current = true
    setScreenShaking(true)
    setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([300])
    }, 1200)
    setTimeout(() => setScreenShaking(false), 600)
  }, [tags])

  // Transition animation
  useEffect(() => {
    if (!transitionTag) {
      setTransition('idle')
      return
    }
    setTransition('fading_in')
    const holdTime = transitionTag === 'present_day' ? 8000 : 6000
    const advanceTime = transitionTag === 'present_day' ? 9000 : 7000
    const t1 = setTimeout(() => setTransition('holding'), 1000)
    const t2 = setTimeout(() => setTransition('fading_out'), holdTime)
    const t3 = setTimeout(() => {
      setTransition('idle')
      choose({ index: -1, text: '', isLocked: false, isPermanentLock: false, isFaint: false })
    }, advanceTime)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [transitionTag])


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

  if (isFlipScene) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: bg,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 1.2s ease',
      }}>
        {state.paragraphs.map((p, i) => (
          <p key={i} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '1.6rem',
            color: 'rgba(212,207,200,0.85)',
            textAlign: 'center',
            letterSpacing: '0.03em',
            margin: 0,
            width: '85%',
            lineHeight: 1.6,
            animation: 'fadeIn 2s ease forwards',
          }}>{p}</p>
        ))}

       
      </div>
    )
  }

  if (isWishScene) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: bg,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {sceneImage && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${sceneImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.6, zIndex: 0,
          }} />
        )}
        {sceneImage && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
            zIndex: 1,
          }} />
        )}
        <AmbientCanvas scene={getAmbientScene(tags['image'] ?? '')} active={true} />
        <p style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.8rem',
          fontStyle: 'italic',
          color: 'rgba(212,207,200,0.55)',
          opacity: showWish ? 1 : 0,
          transition: 'opacity 1.2s ease',
          textAlign: 'center',
          letterSpacing: '0.04em',
          zIndex: 2,
          margin: 0,
          width: '80%',
          lineHeight: 1.6,
        }}>
          I wish I could call home.
        </p>
      </div>
    )
  }

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
      animation: screenShaking ? 'screenShake 0.6s ease' : 'none',
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

<AmbientCanvas scene={getAmbientScene(tags['image'] ?? '')} active={transition === 'idle'} />

      {/* Drawing overlay on blackboard in scene */}
      {(tags['image'] === 'Act1' || tags['image'] === 'Act4') && boardDrawing && !showChalkboard && (
        <img
          src={boardDrawing}
          style={{
            position: "absolute",
            top: "6%", left: "46%",
          width: "40%", height: "48%",
          objectFit: "fill",
          opacity: 0.88,
          zIndex: 3,
          pointerEvents: "none",
          filter: "blur(0.4px)",
          borderRadius: "2px",
          }}
        />
      )}

      {/* ✦ Blackboard interaction hint — classroom scenes only */}
      {(tags['image'] === 'Act1' || tags['image'] === 'Act4') && !showChalkboard && (
        <div
          onClick={() => setShowChalkboard(true)}
          style={{
            position: "absolute",
            top: "32%", left: "68%",
            zIndex: 6,
            cursor: "pointer",
            color: "rgba(235,232,210,0.55)",
            fontSize: "1.1rem",
            userSelect: "none",
            animation: "starPulse 2.8s ease-in-out infinite",
            textShadow: "0 0 8px rgba(235,232,210,0.3)",
          }}
        >
          ✦
        </div>
      )}

{showChalkboard && (
        <Chalkboard
          onClose={(dataUrl) => {
            if (dataUrl) setBoardDrawing(dataUrl)
            setShowChalkboard(false)
          }}
        />
      )}

      <div style={{
        position: 'relative', zIndex: 2, width: '92%',
        background: 'rgba(0,0,0,0.25)', borderRadius: '8px',
        padding: '0.8rem 1rem', border: 'none',
      }}>
        {state.paragraphs.map((p, i) => (
          <p key={i} style={{
            fontSize: '0.85rem',
            lineHeight: 1.6,
            margin: 0,
            marginBottom: '0.5em',
          }}>{p}</p>
        ))}

        {state.choices.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.7rem' }}>
            {state.choices.map(choice => (
              <ChoiceButton
                key={choice.index}
                choice={choice}
                onChoose={choose}
                lockedTapped={lockedTapped}
                onLockedTap={() => setLockedTapped(true)}
              />
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
                : transitionTag === 'present_day'
                ? 'Present day.'
                : ''}
            </p>
          )}
        </div>
      )}

      {lockMessage && (
        <div style={{
          position: 'fixed', top: '8%', left: '50%',
          transform: 'translateX(-50%)', zIndex: 100,
          color: 'rgba(212,207,200,0.85)', fontSize: '0.9rem', fontStyle: 'italic',
          textAlign: 'center', padding: '1rem 2rem', background: 'rgba(0,0,0,0.55)',
          borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
          maxWidth: '700px', whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          {lockMessage}
        </div>
      )}

{tags['character'] === 'papa_controlled' && state.choices.length > 0 && (
        <>
          <Bars
            composure={state.variables.composure ?? 100}
            energy={state.variables.energy ?? 80}
            stress={state.variables.stress ?? 30}
          />
        </>
      )}
    </div>
  )
}

function ChoiceButton({ choice, onChoose, lockedTapped, onLockedTap }: {
  choice: InkChoice
  onChoose: (c: InkChoice) => void
  lockedTapped?: boolean
  onLockedTap?: () => void
}) {
  const isLocked = choice.isLocked
  const showAsLocked = isLocked && lockedTapped
  const [shaking, setShaking] = useState(false)

  const handleClick = () => {
    if (isLocked) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      if (onLockedTap) onLockedTap()
    }
    onChoose(choice)
  }

  return (
    <button onClick={handleClick} style={{
      background: showAsLocked ? 'rgba(180,140,80,0.06)' : 'transparent',
      border: showAsLocked
        ? '1px dashed rgba(212,207,200,0.25)'
        : choice.isFaint ? '1px solid rgba(139,157,195,0.5)' : '1px solid rgba(212,207,200,0.5)',
      color: showAsLocked ? 'rgba(212,207,200,0.45)' : choice.isFaint ? 'rgba(139,157,195,0.85)' : 'rgba(255,255,255,1)',
      cursor: 'pointer', fontFamily: 'inherit',
      fontSize: showAsLocked ? '0.78rem' : choice.isFaint ? '0.82rem' : '0.88rem',
      fontStyle: showAsLocked ? 'italic' : choice.isFaint ? 'italic' : 'normal',
      lineHeight: 1.2, padding: '0.18rem 0.7rem', textAlign: 'left',
      width: '100%', textDecoration: 'none',
      letterSpacing: showAsLocked ? '0.02em' : 'normal',
      animation: shaking ? 'shake 0.5s ease' : 'none',
      transition: 'all 0.3s ease',
    }}>
      {showAsLocked ? '🔒 ' : ''}{choice.text}
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

function Bars({ composure, energy, stress }: { composure: number; energy: number; stress: number }) {
  const stats = [
    { label: 'Composure', value: composure },
    { label: 'Energy', value: energy },
    { label: 'Stress', value: stress },
  ]

  return (
    <div style={{
      position: 'fixed', top: '16px', right: '16px', width: '120px',
      padding: '7px 8px', background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', zIndex: 999,
    }}>
      {stats.map(stat => {
        return (
          <div key={stat.label} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.65rem' }}>
              <span>{stat.label}</span>
              <span>{stat.value}</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.max(0, Math.min(100, stat.value))}%`, height: '100%',
                background: 'rgba(255,255,255,0.85)',
                transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
