import { useEffect, useRef } from "react"

interface DustMote {
  x: number; y: number; radius: number; opacity: number
  speedX: number; speedY: number
  wobble: number; wobbleSpeed: number; wobbleAmp: number
  life: number; maxLife: number
}

type SceneType = "classroom" | "kitchen" | "office" | "default"
interface AmbientCanvasProps { scene?: SceneType; active?: boolean }

const rand = (min: number, max: number) => Math.random() * (max - min) + min

// Window is roughly left 18% of screen, vertically centered with slats
// Motes spawn inside that bright column and drift right + slightly down
const spawnMote = (w: number, h: number): DustMote => {
  const windowX  = w * 0.13          // horizontal center of window light
  const windowW  = w * 0.08          // how wide the spawn zone is
  const windowY1 = h * 0.05          // window top
  const windowY2 = h * 0.78          // window bottom

  const maxLife = rand(6000, 14000)  // ms before recycling

  return {
    x: rand(windowX - windowW, windowX + windowW),
    y: rand(windowY1, windowY2),
    radius: rand(0.6, 2.0),
    opacity: 0,                       // fade in from zero
    speedX: rand(0.18, 0.55),         // always moving right
    speedY: rand(-0.04, 0.12),        // very slight downward drift
    wobble: rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.008, 0.022),
    wobbleAmp: rand(0.1, 0.5),        // tiny vertical wiggle
    life: 0,
    maxLife,
  }
}

const AmbientCanvas = ({ scene = "classroom", active = true }: AmbientCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resize)

    const COUNT = scene === "classroom" ? 320 : 60

    // Seed motes already mid-flight so screen isn't empty on load
    const motes: DustMote[] = Array.from({ length: COUNT }, () => {
      const m = spawnMote(canvas.width, canvas.height)
      // scatter them across the full width initially
      m.x = rand(canvas.width * 0.05, canvas.width * 0.85)
      m.life = rand(0, m.maxLife * 0.7)
      m.opacity = rand(0.05, 0.35)
      return m
    })

    const draw = (timestamp: number) => {
      const delta = timestamp - (lastTimeRef.current || timestamp)
      lastTimeRef.current = timestamp

      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)

      motes.forEach(m => {
        m.life += delta

        // Lifecycle: fade in for first 10%, hold, fade out for last 15%
        const progress = m.life / m.maxLife
        let alpha: number
        if (progress < 0.10) {
          alpha = (progress / 0.10) * 0.38
        } else if (progress < 0.85) {
          alpha = 0.38
        } else {
          alpha = ((1 - progress) / 0.15) * 0.38
        }

        // Wobble
        m.wobble += m.wobbleSpeed
        m.x += m.speedX
        m.y += m.speedY + Math.sin(m.wobble) * m.wobbleAmp

        // Respawn when life ends or exits right edge
        if (m.life >= m.maxLife || m.x > w * 1.05) {
          const fresh = spawnMote(w, h)
          Object.assign(m, fresh)
          return
        }

        // Wrap top/bottom so motes don't vanish
        if (m.y < -4) m.y = h + 4
        if (m.y > h + 4) m.y = -4

        // Brighter near the window light source, dim as they travel right
        const distFromWindow = Math.max(0, m.x - w * 0.18)
        const travelFade = Math.max(0.15, 1 - distFromWindow / (w * 0.7))

        ctx.beginPath()
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,210,175,${alpha * travelFade})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    if (active) rafRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize) }
  }, [scene, active])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none", zIndex: 10,
      }}
    />
  )
}

export default AmbientCanvas