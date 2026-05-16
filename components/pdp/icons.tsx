import type { SVGProps } from 'react'

type Props = { size?: number } & SVGProps<SVGSVGElement>

const base = (size = 22): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export const Flag = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={1.8} {...rest}>
    <path d="M5 21V4" />
    <path d="M5 4h11l-2.5 4 2.5 4H5" />
    <circle cx="5" cy="21" r="1" fill="currentColor" />
  </svg>
)

export const Trophy = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={1.8} {...rest}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4v2a3 3 0 0 0 3 3" />
    <path d="M17 6h3v2a3 3 0 0 1-3 3" />
    <path d="M9 20h6" />
    <path d="M12 14v6" />
  </svg>
)

export const Pencil = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={1.8} {...rest}>
    <path d="M16.5 3.5l4 4L8 20l-5 1 1-5z" />
    <path d="M14 6l4 4" />
  </svg>
)

export const User = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={1.8} {...rest}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
)

export const Chevron = ({ size, ...rest }: Props) => (
  <svg {...base(size ?? 16)} strokeWidth={2.2} {...rest}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const ChevronDown = ({ size, ...rest }: Props) => (
  <svg {...base(size ?? 16)} strokeWidth={2.2} {...rest}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const Minus = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={2.4} {...rest}>
    <path d="M5 12h14" />
  </svg>
)

export const Plus = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={2.4} {...rest}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Check = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={2.4} {...rest}>
    <path d="M4 12l5 5L20 6" />
  </svg>
)

export const Clock = ({ size, ...rest }: Props) => (
  <svg {...base(size ?? 16)} strokeWidth={1.8} {...rest}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const Cal = ({ size, ...rest }: Props) => (
  <svg {...base(size ?? 16)} strokeWidth={1.8} {...rest}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
)

export const Bell = ({ size, ...rest }: Props) => (
  <svg {...base(size ?? 20)} strokeWidth={1.8} {...rest}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </svg>
)

export const GolfBall = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={1.6} {...rest}>
    <circle cx="12" cy="10" r="7" />
    <circle cx="9" cy="9" r="0.6" fill="currentColor" />
    <circle cx="12" cy="8" r="0.6" fill="currentColor" />
    <circle cx="15" cy="9" r="0.6" fill="currentColor" />
    <circle cx="10" cy="12" r="0.6" fill="currentColor" />
    <circle cx="14" cy="12" r="0.6" fill="currentColor" />
    <path d="M11 17v3M13 17v3M10 22h4" />
  </svg>
)

export const Trash = ({ size, ...rest }: Props) => (
  <svg {...base(size)} strokeWidth={1.8} {...rest}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
)
