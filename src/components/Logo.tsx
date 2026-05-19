interface Props {
  size?: number
  color?: string
  withWordmark?: boolean
  className?: string
}

// MainU mark: a custom M⏘U monogram drawn as a single continuous stroke.
// The right leg of the M is the left leg of the U — one shared vertical.
// This creates a tight, fused mark that's unmistakably "MainU" and works at any size.
// The bottom of the U arcs gently — a subtle nod to a bowl/plate without being literal.
export default function Logo({ size = 40, color = '#d4ff00', withWordmark = false, className }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`} aria-label="MainU">
      <svg
        width={(size * 56) / 42}
        height={size}
        viewBox="0 0 56 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The "diacritic dot" — a confidence mark above the U like ü or as a brand signature */}
        <circle cx="40" cy="3.5" r="2.8" fill={color} />

        {/* Single continuous M-U monogram path */}
        <path
          d="M 4 38
             L 4 4
             L 14 22
             L 24 4
             L 24 28
             A 8 8 0 0 0 40 28
             L 40 12"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <span className="font-black text-xl tracking-tight leading-none" style={{ color }}>
          MainU
        </span>
      )}
    </span>
  )
}
