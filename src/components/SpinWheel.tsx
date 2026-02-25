'use client'

import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export interface SpinWheelRef {
  spin: (durationMs: number) => Promise<void>
}

interface SpinWheelProps {
  spinning: boolean
  size?: number
}

const NUM_SEGMENTS = 16

const SEGMENT_FILLS = [
  '#12121A', '#0D0D14', '#161622', '#0A0A10',
  '#14141F', '#0B0B11', '#181824', '#0C0C12',
]

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) }
  const e = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) }
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
}

function rimDot(cx: number, cy: number, r: number, deg: number, dotR: number) {
  const x = cx + r * Math.cos(toRad(deg))
  const y = cy + r * Math.sin(toRad(deg))
  return `M ${x + dotR} ${y} a ${dotR} ${dotR} 0 1 0 ${-dotR * 2} 0 a ${dotR} ${dotR} 0 1 0 ${dotR * 2} 0`
}

const SpinWheel = forwardRef<SpinWheelRef, SpinWheelProps>(({ spinning, size = 320 }, ref) => {
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const rotRef = useRef(0)
  const durationRef = useRef(3200)

  useImperativeHandle(ref, () => ({
    spin: (durationMs: number) =>
      new Promise<void>((resolve) => {
        durationRef.current = durationMs
        const spins = 6 + Math.floor(Math.random() * 4)
        const end = Math.random() * 360
        rotRef.current += spins * 360 + end
        setIsAnimating(true)
        setRotation(rotRef.current)
        setTimeout(() => {
          setIsAnimating(false)
          resolve()
        }, durationMs + 150)
      }),
  }))

  const active = spinning || isAnimating

  const cx = size / 2
  const cy = size / 2
  const outerR = size / 2 - 7
  const rimR = outerR + 2
  const innerRingR = outerR * 0.70
  const hubR = outerR * 0.16
  const segAngle = 360 / NUM_SEGMENTS
  const numRimDots = 40

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size + 26,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Ambient glow when spinning */}
      {active && (
        <>
          <div style={{
            position: 'absolute', top: 26, left: 0, right: 0, bottom: 0,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,183,3,0.2) 0%, transparent 68%)',
            animation: 'pulse-ring 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 26, left: 0, right: 0, bottom: 0,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(114,9,183,0.15) 0%, transparent 65%)',
            animation: 'pulse-ring 1.7s cubic-bezier(0.2, 0.8, 0.2, 1) infinite reverse',
            pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Pointer */}
      <div
        className="wheel-pointer"
        style={{ zIndex: 10, flexShrink: 0, height: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <svg width="24" height="28" viewBox="0 0 24 28">
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="70%" stopColor="#FB8500" />
              <stop offset="100%" stopColor="#A35200" />
            </linearGradient>
            <filter id="pointerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.8)" />
            </filter>
          </defs>
          <polygon points="12,26 2,2 22,2" fill="url(#pg)" filter="url(#pointerShadow)" />
          <polygon points="12,26 2,2 22,2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeLinejoin="miter" />
          <polygon points="12,20 6,4 18,4" fill="rgba(0,0,0,0.15)" />
        </svg>
      </div>

      {/* Wheel */}
      <div
        className={`wheel-glow${active ? ' spinning' : ''}`}
        style={{
          width: size,
          height: size,
          transform: `rotate(${rotation}deg)`,
          transition: isAnimating
            ? `transform ${durationRef.current}ms cubic-bezier(0.1, 0.9, 0.2, 1.0)`
            : 'none',
          willChange: 'transform',
          flexShrink: 0,
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="25%" stopColor="#FFB703" />
              <stop offset="50%" stopColor="#FFD166" />
              <stop offset="75%" stopColor="#FB8500" />
              <stop offset="100%" stopColor="#FFF3B0" />
            </linearGradient>
            <radialGradient id="hubGrad" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#2A2A38" />
              <stop offset="55%" stopColor="#12121A" />
              <stop offset="100%" stopColor="#020205" />
            </radialGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,183,3,0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="hubShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.8)" />
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(255,183,3,0.3)" />
            </filter>
            <filter id="innerBevel">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="3" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.8" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Outer gold border */}
          <circle cx={cx} cy={cy} r={rimR + 4.5} fill="url(#goldRim)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.6))" />
          <circle cx={cx} cy={cy} r={rimR + 1.5} fill="#3D1C00" />
          <circle cx={cx} cy={cy} r={rimR} fill="#0A0A0F" filter="url(#innerBevel)" />

          {/* Segments */}
          <g filter="url(#innerBevel)">
            {Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
              const start = i * segAngle
              const end = (i + 1) * segAngle
              const fill = SEGMENT_FILLS[i % SEGMENT_FILLS.length]
              return (
                <path
                  key={i}
                  d={arcPath(cx, cy, outerR, start, end)}
                  fill={fill}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
              )
            })}
          </g>

          {/* Radial spoke lines between segments */}
          {Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
            const deg = i * segAngle
            const inner = innerRingR
            const outer = outerR
            const ix = cx + inner * Math.cos(toRad(deg))
            const iy = cy + inner * Math.sin(toRad(deg))
            const ox = cx + outer * Math.cos(toRad(deg))
            const oy = cy + outer * Math.sin(toRad(deg))
            return (
              <g key={`spoke-${i}`}>
                <line
                  x1={ix} y1={iy} x2={ox} y2={oy}
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth="2.5"
                />
                <line
                  x1={ix} y1={iy} x2={ox} y2={oy}
                  stroke="rgba(255,183,3,0.15)"
                  strokeWidth="1"
                />
              </g>
            )
          })}

          {/* Inner ring */}
          <circle cx={cx} cy={cy} r={innerRingR + 2}
            fill="none" stroke="rgba(255,183,3,0.3)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={innerRingR - 3}
            fill="none" stroke="rgba(255,183,3,0.1)" strokeWidth="0.75" />

          {/* Accent dots inside inner ring */}
          {Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
            const midDeg = i * segAngle + segAngle / 2
            const r = innerRingR - size * 0.06
            const x = cx + r * Math.cos(toRad(midDeg))
            const y = cy + r * Math.sin(toRad(midDeg))
            const dotR = size * 0.012
            return (
              <circle key={`id-${i}`} cx={x} cy={y} r={dotR}
                fill={i % 2 === 0 ? 'rgba(255,183,3,0.5)' : 'rgba(114,9,183,0.4)'}
              />
            )
          })}

          {/* Rim dots */}
          {Array.from({ length: numRimDots }).map((_, i) => {
            const deg = (i * 360) / numRimDots
            const dotR = Math.max(2, size * 0.008)
            const color = i % 4 === 0 ? '#FFF3B0' : i % 2 === 0 ? '#FB8500' : '#7A3D00'
            return <path key={`rd-${i}`} d={rimDot(cx, cy, rimR + 2.5, deg, dotR)} fill={color} />
          })}

          {/* Hub dark bg with shadow */}
          <circle cx={cx} cy={cy} r={hubR + size * 0.045} fill="url(#hubGrad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
          <circle cx={cx} cy={cy} r={hubR + size * 0.045}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Hub glow */}
          <circle cx={cx} cy={cy} r={hubR + size * 0.055} fill="url(#centerGlow)" />

          {/* Hub gold disc */}
          <circle cx={cx} cy={cy} r={hubR} fill="url(#goldRim)" filter="url(#hubShadow)" />

          {/* Inner hub bevel */}
          <circle cx={cx} cy={cy} r={hubR * 0.85} fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

          {/* Center icon: Using an SVG path for a dice or geometric shape */}
          <g transform={`translate(${cx - hubR * 0.45}, ${cy - hubR * 0.45}) scale(${hubR * 0.038})`}>
            {/* Simple geometric star/crosshair replacing the emoji */}
            <path
              d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
              fill="#12121A"
              stroke="#020205"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  )
})

SpinWheel.displayName = 'SpinWheel'
export default SpinWheel
