import { forwardRef, useEffect, useMemo, useRef } from 'react'
import './VariableProximity.css'

function useAnimationFrame(callback) {
  useEffect(() => {
    let frameId
    const loop = () => {
      callback()
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [callback])
}

function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = (x, y) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect()
        positionRef.current = { x: x - rect.left, y: y - rect.top }
      } else {
        positionRef.current = { x, y }
      }
    }

    const handleMouseMove = (event) => updatePosition(event.clientX, event.clientY)
    const handleTouchMove = (event) => {
      const touch = event.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [containerRef])

  return positionRef
}

const VariableProximity = forwardRef(function VariableProximity(props, ref) {
  const {
    label,
    fromFontVariationSettings = "'wght' 420, 'opsz' 9",
    toFontVariationSettings = "'wght' 900, 'opsz' 40",
    containerRef,
    radius = 80,
    falloff = 'linear',
    className = '',
    style,
    ...restProps
  } = props

  const letterRefs = useRef([])
  const interpolatedSettingsRef = useRef([])
  const mousePositionRef = useMousePositionRef(containerRef)
  const lastPositionRef = useRef({ x: null, y: null })

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsString) => new Map(
      settingsString
        .split(',')
        .map((setting) => setting.trim())
        .map((setting) => {
          const [name, value] = setting.split(' ')
          return [name.replace(/["']/g, ''), parseFloat(value)]
        }),
    )

    const fromSettings = parseSettings(fromFontVariationSettings)
    const toSettings = parseSettings(toFontVariationSettings)

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }))
  }, [fromFontVariationSettings, toFontVariationSettings])

  const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  const calculateFalloff = (distance) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1)
    if (falloff === 'exponential') return norm ** 2
    if (falloff === 'gaussian') return Math.exp(-((distance / (radius / 2)) ** 2) / 2)
    return norm
  }

  useAnimationFrame(() => {
    if (!containerRef?.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const { x, y } = mousePositionRef.current

    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return
    lastPositionRef.current = { x, y }

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return

      const rect = letterRef.getBoundingClientRect()
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top

      const distance = calculateDistance(x, y, letterCenterX, letterCenterY)

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings
        return
      }

      const falloffValue = calculateFalloff(distance)
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => `'${axis}' ${fromValue + (toValue - fromValue) * falloffValue}`)
        .join(', ')

      interpolatedSettingsRef.current[index] = newSettings
      letterRef.style.fontVariationSettings = newSettings
    })
  })

  const words = label.split(' ')
  let letterIndex = 0

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`.trim()}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex
            letterIndex += 1
            return (
              <span
                key={`${letter}-${currentLetterIndex}`}
                ref={(element) => {
                  letterRefs.current[currentLetterIndex] = element
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex],
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            )
          })}
          {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  )
})

export default VariableProximity
