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
  '#1a0840', '#0d1545', '#210948', '#0a1042',
  '#190742', '#0c1348', '#1d0944', '#0b1242',
]

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) }
  const e = { x: cx + r * Math.cos(toRad(endDeg)),   y: cy + r * Math.sin(toRad(endDeg)) }
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
  const outerR    = size / 2 - 7
  const rimR      = outerR + 2
  const innerRingR = outerR * 0.70
  const hubR      = outerR * 0.16
  const segAngle  = 360 / NUM_SEGMENTS
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
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.2) 0%, transparent 68%)',
            animation: 'pulse-ring 1.1s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 26, left: 0, right: 0, bottom: 0,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(168,85,247,0.14) 0%, transparent 65%)',
            animation: 'pulse-ring 1.7s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Pointer */}
      <div
        className="wheel-pointer"
        style={{ zIndex: 10, flexShrink: 0, height: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <svg width="22" height="26" viewBox="0 0 22 26">
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <polygon points="11,24 1,2 21,2" fill="url(#pg)" />
          <polygon points="11,24 1,2 21,2" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" strokeLinejoin="round" />
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
            ? `transform ${durationRef.current}ms cubic-bezier(0.15, 0.7, 0.1, 1.0)`
            : 'none',
          willChange: 'transform',
          flexShrink: 0,
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#fef3c7" />
              <stop offset="25%"  stopColor="#f59e0b" />
              <stop offset="50%"  stopColor="#fbbf24" />
              <stop offset="75%"  stopColor="#d97706" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <radialGradient id="hubGrad" cx="50%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#3b1080" />
              <stop offset="55%"  stopColor="#1a0840" />
              <stop offset="100%" stopColor="#090318" />
            </radialGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(245,158,11,0.28)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="hubShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(245,158,11,0.55)" />
            </filter>
          </defs>

          {/* Outer gold border */}
          <circle cx={cx} cy={cy} r={rimR + 4.5} fill="url(#goldRim)" />
          <circle cx={cx} cy={cy} r={rimR + 1.5} fill="#7c2d12" />
          <circle cx={cx} cy={cy} r={rimR}       fill="#05050f" />

          {/* Segments */}
          {Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
            const start = i * segAngle
            const end   = (i + 1) * segAngle
            const fill  = SEGMENT_FILLS[i % SEGMENT_FILLS.length]
            return (
              <path
                key={i}
                d={arcPath(cx, cy, outerR, start, end)}
                fill={fill}
                stroke="rgba(245,158,11,0.12)"
                strokeWidth="0.75"
              />
            )
          })}

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
              <line
                key={`spoke-${i}`}
                x1={ix} y1={iy} x2={ox} y2={oy}
                stroke="rgba(245,158,11,0.22)"
                strokeWidth="0.9"
              />
            )
          })}

          {/* Inner ring */}
          <circle cx={cx} cy={cy} r={innerRingR + 2}
            fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={innerRingR - 3}
            fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="0.75" />

          {/* Accent dots inside inner ring */}
          {Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
            const midDeg = i * segAngle + segAngle / 2
            const r = innerRingR - size * 0.05
            const x = cx + r * Math.cos(toRad(midDeg))
            const y = cy + r * Math.sin(toRad(midDeg))
            const dotR = size * 0.013
            return (
              <circle key={`id-${i}`} cx={x} cy={y} r={dotR}
                fill={i % 2 === 0 ? 'rgba(245,158,11,0.7)' : 'rgba(168,85,247,0.6)'}
              />
            )
          })}

          {/* Rim dots */}
          {Array.from({ length: numRimDots }).map((_, i) => {
            const deg  = (i * 360) / numRimDots
            const dotR = Math.max(2, size * 0.009)
            const color = i % 4 === 0 ? '#fbbf24' : i % 2 === 0 ? '#d97706' : '#78350f'
            return <path key={`rd-${i}`} d={rimDot(cx, cy, rimR + 3, deg, dotR)} fill={color} />
          })}

          {/* Hub glow */}
          <circle cx={cx} cy={cy} r={hubR + size * 0.055} fill="url(#centerGlow)" />

          {/* Hub dark bg */}
          <circle cx={cx} cy={cy} r={hubR + size * 0.04} fill="url(#hubGrad)" />
          <circle cx={cx} cy={cy} r={hubR + size * 0.04}
            fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />

          {/* Hub gold disc */}
          <circle cx={cx} cy={cy} r={hubR} fill="url(#goldRim)" filter="url(#hubShadow)" />

          {/* Center icon */}
          <text
            x={cx} y={cy + hubR * 0.38}
            textAnchor="middle"
            fontSize={Math.max(12, hubR * 1.15)}
            style={{ userSelect: 'none' }}
          >
            🎲
          </text>
        </svg>
      </div>
    </div>
  )
})

SpinWheel.displayName = 'SpinWheel'
export default SpinWheel
