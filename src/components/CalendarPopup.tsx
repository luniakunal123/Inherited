import { useState } from "react"

interface CalendarPopupProps {
  onClose: () => void
}

const MONTHS_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
]

const DAYS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
const DAYS_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const today = new Date()

export default function CalendarPopup({ onClose }: CalendarPopupProps) {
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [visible, setVisible] = useState(true)

  const minYear = today.getFullYear() - 10
  const maxYear = today.getFullYear() + 10

  const prevMonth = () => {
    if (month === 0) { if (year <= minYear) return; setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { if (year >= maxYear) return; setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday = (d: number | null) =>
    d !== null &&
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  const isSunday = (i: number) => i % 7 === 0

  const atMin = month === 0 && year <= minYear
  const atMax = month === 11 && year >= maxYear

  const rows = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 490,
          background: "rgba(0,0,0,0.65)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.96})`,
        zIndex: 500,
        width: "min(90vw, 380px)",
        opacity: visible ? 1 : 0,
        transition: "all 0.3s ease",
        display: "flex",
        boxShadow: "0 20px 80px rgba(0,0,0,0.9)",
        border: "1px solid #ccc",
      }}>

        {/* Main calendar body */}
        <div style={{
          flex: 1,
          background: "#f8f6f0",
          fontFamily: "'Georgia', serif",
          overflow: "hidden",
        }}>

          {/* Top pin */}
          <div style={{
            display: "flex", justifyContent: "center",
            paddingTop: "6px", paddingBottom: "2px",
            background: "#f8f6f0",
          }}>
            <div style={{
              width: "10px", height: "10px",
              background: "#8a7a60",
              borderRadius: "50%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }} />
          </div>

          {/* Month + year header */}
          <div style={{
            padding: "4px 10px 6px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "2px solid #222",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={prevMonth} disabled={atMin} style={{
                background: "transparent", border: "none",
                color: atMin ? "#ccc" : "#333",
                fontSize: "1.1rem", cursor: atMin ? "default" : "pointer",
                padding: "0", fontFamily: "inherit", lineHeight: 1,
              }}>‹</button>
              <div style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#111",
                fontFamily: "sans-serif",
              }}>
                {MONTHS_HI[month]}
              </div>
              <button onClick={nextMonth} disabled={atMax} style={{
                background: "transparent", border: "none",
                color: atMax ? "#ccc" : "#333",
                fontSize: "1.1rem", cursor: atMax ? "default" : "pointer",
                padding: "0", fontFamily: "inherit", lineHeight: 1,
              }}>›</button>
            </div>
            <div style={{
              fontSize: "1.4rem",
              fontWeight: "bold",
              color: "#111",
              fontFamily: "sans-serif",
            }}>
              {year}
            </div>
          </div>

          {/* Day headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom: "1px solid #555",
          }}>
            {DAYS_HI.map((d, i) => (
              <div key={i} style={{
                textAlign: "center",
                padding: "3px 1px 1px",
                borderRight: i < 6 ? "1px solid #ccc" : "none",
              }}>
                <div style={{
                  fontSize: "0.55rem",
                  color: i === 0 ? "#cc0000" : "#222",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                }}>{d}</div>
                <div style={{
                  fontSize: "0.5rem",
                  color: i === 0 ? "#cc0000" : "#444",
                  fontFamily: "sans-serif",
                  letterSpacing: "0.02em",
                }}>{DAYS_EN[i]}</div>
              </div>
            ))}
          </div>

          {/* Date rows */}
          {rows.map((row, ri) => (
            <div key={ri} style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderBottom: "1px solid #ddd",
            }}>
              {row.map((d, ci) => (
                <div key={ci} style={{
                  borderRight: ci < 6 ? "1px solid #ddd" : "none",
                  padding: "4px 3px 3px",
                  minHeight: "36px",
                  position: "relative",
                  background: isToday(d) ? "rgba(255,220,100,0.2)" : "transparent",
                }}>
                  {d !== null && (
                    <>
                      {isToday(d) && (
                        <div style={{
                          position: "absolute",
                          top: "3px", left: "50%",
                          transform: "translateX(-50%)",
                          width: "22px", height: "22px",
                          border: "1.5px solid #cc0000",
                          borderRadius: "50%",
                          borderTopLeftRadius: "54% 46%",
                          borderTopRightRadius: "46% 54%",
                          borderBottomLeftRadius: "46% 54%",
                          borderBottomRightRadius: "54% 46%",
                        }} />
                      )}
                      <div style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: isSunday(ci) || isToday(d) ? "#cc0000" : "#111",
                        textAlign: "center",
                        fontFamily: "sans-serif",
                        lineHeight: 1,
                        position: "relative", zIndex: 1,
                      }}>{d}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Blue side panel */}
        <div style={{
          width: "60px",
          background: "linear-gradient(180deg, #1a3a6b 0%, #0f2548 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 6px",
          flexShrink: 0,
        }}>
          {/* भारत सरकार */}
          <div style={{
            color: "#d4a017",
            fontSize: "0.65rem",
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "sans-serif",
            lineHeight: 1.4,
            letterSpacing: "0.02em",
          }}>
            भारत<br/>सरकार
          </div>

          {/* Ashoka emblem placeholder */}
          <div style={{
            width: "36px", height: "36px",
            border: "1.5px solid #d4a017",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d4a017",
            fontSize: "0.5rem",
            textAlign: "center",
            opacity: 0.8,
          }}>
            ✦
          </div>

          {/* कैलेंडर + year */}
          <div style={{
            color: "#d4a017",
            fontSize: "0.6rem",
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "sans-serif",
            lineHeight: 1.5,
          }}>
            कैलेंडर<br/>
            <span style={{ fontSize: "0.7rem" }}>{year}</span>
          </div>

          {/* Railway emblem placeholder */}
          <div style={{
            width: "32px", height: "32px",
            border: "1.5px solid #d4a017",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
          }}>
            <div style={{ color: "#d4a017", fontSize: "0.45rem", textAlign: "center", lineHeight: 1.2 }}>
              भारतीय<br/>रेल
            </div>
          </div>

          {/* Indian Railways */}
          <div style={{
            color: "#d4a017",
            fontSize: "0.45rem",
            textAlign: "center",
            fontFamily: "sans-serif",
            lineHeight: 1.4,
            letterSpacing: "0.02em",
          }}>
            INDIAN<br/>RAILWAYS
          </div>
        </div>
      </div>
    </>
  )
}
