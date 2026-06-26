import { useEffect, useRef, useState, useCallback } from "react"

const STORAGE_KEY = "inherited_chalkboard_v1"
const BOARD_COLOR = "#1c2b1c"
const CHALK_COLOR = "rgba(235,232,218,0.92)"

interface ChalkboardProps {
  onClose: (dataUrl: string | null) => void
}

export default function Chalkboard({ onClose }: ChalkboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const [eraser, setEraser] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setZoomed(true), 30)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = Math.round(window.innerWidth * 0.95)
    canvas.height = Math.round(window.innerHeight * 0.72)

    // Transparent canvas — only chalk strokes are saved, no background
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ("touches" in e) {
      const touch = e.touches[0]
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    isDrawing.current = true
    lastPos.current = getPos(e, canvas)
  }, [])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pos = getPos(e, canvas)
    const last = lastPos.current ?? pos

    if (eraser) {
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
      ctx.lineWidth = 32
      ctx.lineCap = "round"
      ctx.globalCompositeOperation = "destination-out"
      ctx.strokeStyle = "rgba(0,0,0,1)"
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
      ctx.globalCompositeOperation = "source-over"
    } else {
      // Main chalk stroke — thick for fingers
      ctx.globalCompositeOperation = "source-over"
      ctx.lineWidth = 10
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = CHALK_COLOR
      ctx.globalAlpha = 0.55
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()

      // Chalk roughness flecks
      ctx.lineWidth = 2.5
      ctx.globalAlpha = 0.12
      for (let i = 0; i < 6; i++) {
        const ox = (Math.random() - 0.5) * 10
        const oy = (Math.random() - 0.5) * 10
        ctx.beginPath()
        ctx.moveTo(last.x + ox, last.y + oy)
        ctx.lineTo(pos.x + ox, pos.y + oy)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    lastPos.current = pos
  }, [eraser])

  const stopDraw = useCallback(() => {
    isDrawing.current = false
    lastPos.current = null
  }, [])

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleClose = () => {
    const canvas = canvasRef.current
    let dataUrl: string | null = null
    if (canvas) {
      // Create a clean transparent canvas and copy only non-dark pixels
      const clean = document.createElement("canvas")
      clean.width = canvas.width
      clean.height = canvas.height
      const cleanCtx = clean.getContext("2d", { alpha: true })
      if (cleanCtx) {
        cleanCtx.clearRect(0, 0, clean.width, clean.height)
        cleanCtx.globalCompositeOperation = "source-over"
        // Scale down to half size so it fits naturally on the board in the scene
        cleanCtx.drawImage(canvas, 0, 0, clean.width / 2, clean.height / 2)
        // Remove dark background pixels — keep only bright chalk strokes
        const imageData = cleanCtx.getImageData(0, 0, clean.width, clean.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const brightness = (r + g + b) / 3
          // Make dark pixels fully transparent
          if (brightness < 60) {
            data[i + 3] = 0
          } else {
            // Fade semi-dark pixels
            data[i + 3] = Math.min(255, Math.round((brightness / 255) * 255))
          }
        }
        cleanCtx.putImageData(imageData, 0, 0)
        dataUrl = clean.toDataURL("image/png")
        localStorage.setItem(STORAGE_KEY, dataUrl)
      }
    }
    setZoomed(false)
    setTimeout(() => onClose(dataUrl), 420)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 490,
          background: "rgba(0,0,0,0.75)",
          opacity: zoomed ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Board */}
      <div style={{
        position: "fixed",
        zIndex: 500,
        top: zoomed ? "5%" : "8%",
        left: zoomed ? "2.5%" : "45%",
        width: zoomed ? "95%" : "43%",
        height: zoomed ? "80%" : "50%",
        transition: "all 0.42s cubic-bezier(0.22,1,0.36,1)",
        border: "10px solid #4a2e10",
        outline: "2px solid #2a1808",
        boxShadow: zoomed
          ? "inset 0 0 50px rgba(0,0,0,0.5), 0 0 0 2px #6b3f14, 0 20px 60px rgba(0,0,0,0.9)"
          : "none",
          background: BOARD_COLOR,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "3px",
      }}>

        {/* Top toolbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 14px",
          background: "#3a2208",
          borderBottom: "2px solid #2a1608",
          flexShrink: 0,
          opacity: zoomed ? 1 : 0,
          transition: "opacity 0.3s ease 0.2s",
          minHeight: "44px", // big enough for finger tap
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Eraser */}
            <button
              onClick={() => setEraser(e => !e)}
              style={{
                background: eraser ? "rgba(255,255,255,0.15)" : "transparent",
                border: `1px solid ${eraser ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)"}`,
                color: eraser ? "rgba(255,255,255,0.9)" : "rgba(220,210,190,0.65)",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.05em",
                fontFamily: "inherit",
                minHeight: "36px",
              }}
            >
              eraser
            </button>

            {/* Clear */}
            <button
              onClick={handleClear}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(220,210,190,0.4)",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.05em",
                fontFamily: "inherit",
                minHeight: "36px",
              }}
            >
              clear
            </button>
          </div>

          {/* Done */}
          <button
            onClick={handleClose}
            style={{
              background: "transparent", border: "none",
              color: "rgba(220,210,190,0.5)",
              fontSize: "0.8rem", cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.1em",
              padding: "6px 8px", minHeight: "36px",
            }}
          >
            done ✦
          </button>
        </div>

        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={e => { e.preventDefault(); startDraw(e) }}
          onTouchMove={e => { e.preventDefault(); draw(e) }}
          onTouchEnd={stopDraw}
          style={{
            flex: 1, width: "100%", display: "block",
            cursor: eraser ? "cell" : "crosshair",
            touchAction: "none",
            background: "transparent",
            isolation: "isolate",
          }}
        />

        {/* Bottom wood ledge */}
        <div style={{
          height: "10px", flexShrink: 0,
          background: "linear-gradient(to bottom, #4a2e10, #2a1808)",
          borderTop: "2px solid #2a1808",
        }} />
      </div>
    </>
  )
}
