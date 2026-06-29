import { useState } from "react"

interface FeedbackScreenProps {
  formId: string // your Formspree form ID
}

export default function FeedbackScreen({ formId }: FeedbackScreenProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [visible] = useState(true)

  const handleSubmit = async () => {
    if (rating === 0) return
    setStatus('submitting')
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })
      if (res.ok) setStatus('done')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 600,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      opacity: visible ? 1 : 0,
      transition: 'opacity 1s ease',
      animation: 'fadeIn 1.5s ease forwards',
    }}>
      {status === 'done' ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'rgba(212,207,200,0.85)',
            fontSize: '1rem',
            fontStyle: 'italic',
            letterSpacing: '0.08em',
            lineHeight: 1.8,
            margin: 0,
          }}>
            Thank you.<br/>Your words mean a lot.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '1.8rem',
          width: '100%', maxWidth: '400px',
        }}>
          {/* Prompt */}
          <p style={{
            color: 'rgba(212,207,200,0.7)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            letterSpacing: '0.08em',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.8,
          }}>
            How did Inherited make you feel?
          </p>

          {/* Star rating */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                style={{
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  color: star <= (hovered || rating)
                    ? 'rgba(212,207,200,0.9)'
                    : 'rgba(212,207,200,0.15)',
                  transition: 'color 0.2s ease',
                  userSelect: 'none',
                }}
              >
                ✦
              </span>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Anything you'd like to share... (optional)"
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,207,200,0.15)',
              borderRadius: '6px',
              color: 'rgba(212,207,200,0.8)',
              fontSize: '0.8rem',
              fontFamily: 'inherit',
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              lineHeight: 1.6,
              padding: '0.7rem 0.9rem',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || status === 'submitting'}
            style={{
              background: 'transparent',
              border: `1px solid rgba(212,207,200,${rating === 0 ? '0.1' : '0.3'})`,
              color: `rgba(212,207,200,${rating === 0 ? '0.2' : '0.6'})`,
              borderRadius: '4px',
              padding: '0.5rem 1.8rem',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              fontFamily: 'inherit',
              cursor: rating === 0 ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {status === 'submitting' ? 'sending...' : 'send'}
          </button>

          {status === 'error' && (
            <p style={{
              color: 'rgba(212,100,100,0.7)',
              fontSize: '0.7rem',
              margin: 0,
              fontStyle: 'italic',
            }}>
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
