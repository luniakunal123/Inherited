import { useState } from 'react'

type Props = { onSubmit: (name: string) => void }

export default function NameEntry({ onSubmit }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    onSubmit(value.trim() || 'you')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1rem',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem' }}>
        Before we begin —
      </p>
      <h1 style={{ fontWeight: 400, fontSize: '1.4rem' }}>
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
          borderBottom: '1px solid rgba(212,207,200,0.25)',
          color: 'var(--color-text-primary)',
          fontFamily: 'inherit',
          fontSize: '1.2rem',
          padding: '0.4rem 0.2rem',
          textAlign: 'center',
          width: '240px',
          outline: 'none',
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          background: 'transparent',
          border: '1px solid rgba(212,207,200,0.18)',
          color: 'rgba(212,207,200,0.7)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          letterSpacing: '0.08em',
          marginTop: '1rem',
          padding: '0.6rem 2rem',
        }}
      >
        Begin
      </button>
      <p style={{
        color: 'var(--color-text-note)',
        fontSize: '0.75rem',
        fontStyle: 'italic',
      }}>
        The game will remember.
      </p>
    </div>
  )
}