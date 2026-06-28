import { useEffect, useRef } from "react"

interface DustMote {
  x: number; y: number; radius: number; opacity: number
  speedX: number; speedY: number
  wobble: number; wobbleSpeed: number; wobbleAmp: number
  life: number; maxLife: number
}

type SceneType = "classroom" | "kitchen" | "office" | "window" | "home" | "gate" | "default"
interface AmbientCanvasProps { scene?: SceneType; active?: boolean }

const rand = (min: number, max: number) => Math.random() * (max - min) + min

const spawnMote = (w: number, h: number, scene?: string): DustMote => {
  const isWindow = scene === 'window'
  const windowX  = w * 0.13
  const windowW  = w * 0.08
  const windowY1 = h * 0.05
  const windowY2 = h * 0.78
  const maxLife  = isWindow ? rand(18000, 28000) : rand(6000, 14000)

  const isGate = scene === 'gate'
  return {
    x:          isWindow ? rand(w * 0.23, w * 0.33) : isGate ? rand(w * 0.30, w * 0.50) : rand(windowX - windowW, windowX + windowW),
    y:          isWindow ? rand(-20, 0)              : isGate ? rand(h * 0.05, h * 0.45) : rand(windowY1, windowY2),
    radius:     rand(0.6, 2.0),
    opacity:    0,
    speedX:     isWindow ? rand(0.25, 0.45)          : isGate ? rand(-0.35, -0.12)       : rand(0.18, 0.55),
    speedY:     isWindow ? rand(0.35, 0.55)          : isGate ? rand(0.1, 0.35)          : rand(-0.04, 0.12),
    wobble:     rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.008, 0.022),
    wobbleAmp:  isWindow ? rand(0.05, 0.2)           : isGate ? rand(0.1, 0.3)           : rand(0.1, 0.5),
    life:       0,
    maxLife,
  }
}

const AmbientCanvas = ({ scene = "classroom", active = true }: AmbientCanvasProps) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resize)

    const COUNT = scene === "classroom" ? 320 : scene === "window" ? 400 : scene === "home" ? 120 : scene === "gate" ? 180 : scene === "default" ? 0 : 60

    const motes: DustMote[] = Array.from({ length: COUNT }, () => {
      const m = spawnMote(canvas.width, canvas.height, scene)
      m.x    = (scene === 'window' || scene === 'home') ? rand(canvas.width * 0.23, canvas.width * 0.48) : scene === 'gate' ? rand(canvas.width * 0.30, canvas.width * 0.52) : rand(canvas.width * 0.05, canvas.width * 0.85)
      m.y    = (scene === 'window' || scene === 'home') ? rand(0, canvas.height * 0.35) : scene === 'gate' ? rand(0, canvas.height * 0.6) : m.y
      if (scene === 'gate') m.speedX = rand(-0.35, -0.12)
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

        const progress = m.life / m.maxLife
        let alpha: number
        if (progress < 0.10) {
          alpha = (progress / 0.10) * 0.38
        } else if (progress < 0.85) {
          alpha = 0.38
        } else {
          alpha = ((1 - progress) / 0.15) * 0.38
        }

        m.wobble += m.wobbleSpeed
        m.x += m.speedX
        m.y += m.speedY + Math.sin(m.wobble) * m.wobbleAmp

        // Respawn
        if (m.life >= m.maxLife || m.x > w * 1.05 || (scene === 'window' && (m.x > w * 0.58 && m.y > h * 0.82)) || (scene === 'gate' && m.x < w * 0.05)) {
          const fresh = spawnMote(w, h, scene)
          Object.assign(m, fresh)
          return
        }

       // Wrap top/bottom for classroom only
       if (scene !== 'window' && scene !== 'gate') {
        if (m.y < -4) m.y = h + 4
        if (m.y > h + 4) m.y = -4
      }

        const distFromWindow = Math.max(0, m.x - w * 0.18)
        const travelFade = scene === 'window'
          ? Math.max(0.6, 1 - (m.y / h) * 0.2)
          : scene === 'gate'
          ? Math.max(0.4, 1 - ((w * 0.65 - m.x) / (w * 0.6)))
          : Math.max(0.15, 1 - distFromWindow / (w * 0.7))

        const color = scene === 'window' ? '200,210,220' : scene === 'gate' ? '225,215,185' : '220,210,175'

        ctx.beginPath()
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${alpha * travelFade})`
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
