import { forwardRef } from 'react'

export const ShimmerButton = forwardRef(function ShimmerButton(
  {
    shimmerColor = '#ffffff',
    shimmerDuration = '3s',
    borderRadius = '999px',
    background = 'rgba(12, 18, 15, 0.92)',
    className = '',
    children,
    style,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`shimmer-button ${className}`.trim()}
      style={{
        '--shimmer-color': shimmerColor,
        '--speed': shimmerDuration,
        '--radius': borderRadius,
        '--bg': background,
        ...style,
      }}
      {...props}
    >
      <span className="shimmer-rotator" aria-hidden="true" />
      <span className="shimmer-highlight" aria-hidden="true" />
      <span className="shimmer-label">{children}</span>
    </button>
  )
})
