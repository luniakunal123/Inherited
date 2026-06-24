import { useState } from 'react'

type Props = { onSubmit: (name: string) => void }

export default function NameEntry({ onSubmit }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const name = value.trim() || 'you'
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
    // Unlock speech synthesis on first user gesture
    const utterance = new SpeechSynthesisUtterance('')
    window.speechSynthesis.speak(utterance)
    window.speechSynthesis.cancel()
    onSubmit(capitalized)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1.2rem',
      textAlign: 'center',
      padding: '2rem',
      background: '#000',
    }}>
      <p style={{
        color: 'rgba(212,207,200,0.4)',
        fontSize: '0.85rem',
        letterSpacing: '0.06em',
        margin: 0,
      }}>
        Before we begin —
      </p>

      <h1 style={{
        fontWeight: 400,
        fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
        color: 'rgba(212,207,200,0.9)',
        margin: 0,
        letterSpacing: '-0.01em',
      }}>
        what do they call you?
      </h1>

      <input
        type="text"
        maxLength={20}
        value={value}
        autoFocus
        placeholder="your name"
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(212,207,200,0.3)',
          color: 'rgba(212,207,200,0.95)',
          fontFamily: 'inherit',
          fontSize: 'clamp(1rem, 4vw, 1.2rem)',
          padding: '0.4rem 0.2rem',
          textAlign: 'center',
          width: 'min(240px, 70vw)',
          outline: 'none',
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(212,207,200,0.5)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          letterSpacing: '0.12em',
          marginTop: '0.5rem',
          padding: '0.4rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(212,207,200,1)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,207,200,0.5)')}
      >
        <span>Begin</span>
        <span>→</span>
      </button>

      <p style={{
        color: 'rgba(212,207,200,0.35)',
        fontSize: '0.78rem',
        fontStyle: 'italic',
        marginTop: '0.5rem',
        letterSpacing: '0.04em',
      }}>
        The game will remember.
      </p>
    </div>
  )
}
