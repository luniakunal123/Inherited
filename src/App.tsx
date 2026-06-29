import { useState, useEffect } from 'react'
import NameEntry from './components/NameEntry'
import GameScene from './components/GameScene'

function ContentWarning({ onContinue }: { onContinue: () => void }) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setOpacity(1), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      onClick={onContinue}
      style={{
        position: 'fixed', inset: 0,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        padding: '2rem',
      }}
    >
      <div style={{
        opacity,
        transition: 'opacity 1.5s ease',
        textAlign: 'center',
        maxWidth: '500px',
      }}>
        <p style={{
          color: 'rgba(212,207,200,0.85)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          letterSpacing: '0.06em',
          lineHeight: 2,
          margin: 0,
          marginBottom: '2.5rem',
        }}>
          Inherited contains depictions of parental violence<br />
          and emotional abuse.<br />
          Some moments may be difficult to sit with.<br />
          Please take care of yourself.
        </p>
        <p style={{
          color: 'rgba(212,207,200,0.3)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          margin: 0,
          animation: 'breathe 2.5s ease-in-out infinite',
        }}>
          tap anywhere to continue
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<'warning' | 'name' | 'game'>('warning')
  const [playerName, setPlayerName] = useState<string | null>(null)

  if (screen === 'warning') {
    return <ContentWarning onContinue={() => setScreen('name')} />
  }

  if (screen === 'name' || !playerName) {
    return <NameEntry onSubmit={(name) => { setPlayerName(name); setScreen('game') }} />
  }

  return <GameScene playerName={playerName} />
}