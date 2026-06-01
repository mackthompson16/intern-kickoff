import { useEffect, useMemo, useRef } from 'react'

const morphTime = 1.35
const cooldownTime = 0.45

function SvgFilters() {
  return (
    <svg id="filters" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="threshold">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 255 -140"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function MorphingText({ texts = [], className = '' }) {
  const safeTexts = useMemo(() => (texts.length > 0 ? texts : ['']), [texts])
  const textsRef = useRef(safeTexts)
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(cooldownTime)
  const timeRef = useRef(performance.now())
  const coolingRef = useRef(true)

  const text1Ref = useRef(null)
  const text2Ref = useRef(null)

  useEffect(() => {
    textsRef.current = safeTexts.length > 0 ? safeTexts : ['']
    textIndexRef.current = 0
    morphRef.current = 0
    cooldownRef.current = cooldownTime
    coolingRef.current = true
    timeRef.current = performance.now()
  }, [safeTexts])

  useEffect(() => {
    let animationFrameId

    const applyStyles = (fraction) => {
      const current1 = text1Ref.current
      const current2 = text2Ref.current
      const currentTexts = textsRef.current
      if (!current1 || !current2 || currentTexts.length === 0) return

      const clamped = Math.min(Math.max(fraction, 0.0001), 1)
      const inv = Math.max(1 - clamped, 0.0001)

      current2.style.filter = `blur(${Math.min(8 / clamped - 8, 100)}px)`
      current2.style.opacity = `${Math.pow(clamped, 0.4) * 100}%`

      current1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`
      current1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`

      current1.textContent = currentTexts[textIndexRef.current % currentTexts.length]
      current2.textContent = currentTexts[(textIndexRef.current + 1) % currentTexts.length]
    }

    const showCooldownState = () => {
      const current1 = text1Ref.current
      const current2 = text2Ref.current
      if (!current1 || !current2) return
      current2.style.filter = 'none'
      current2.style.opacity = '100%'
      current1.style.filter = 'none'
      current1.style.opacity = '0%'
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const now = performance.now()
      const dt = (now - timeRef.current) / 1000
      timeRef.current = now

      if (coolingRef.current) {
        cooldownRef.current -= dt
        showCooldownState()
        if (cooldownRef.current <= 0) {
          coolingRef.current = false
          morphRef.current = 0
        }
        return
      }

      morphRef.current += dt
      let fraction = morphRef.current / morphTime

      if (fraction >= 1) {
        fraction = 1
        applyStyles(fraction)
        textIndexRef.current += 1
        coolingRef.current = true
        cooldownRef.current = cooldownTime
        morphRef.current = 0
        return
      }

      applyStyles(fraction)
    }

    applyStyles(0)
    animate()

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div
      className={`morphing-text ${className}`.trim()}
      style={{ filter: 'url(#threshold) blur(0.6px)' }}
    >
      <span className="morph-word" ref={text1Ref} style={{ transition: 'none' }} />
      <span className="morph-word" ref={text2Ref} style={{ transition: 'none' }} />
      <SvgFilters />
    </div>
  )
}
