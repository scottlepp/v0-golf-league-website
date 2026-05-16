import { teamColor, teamInitial } from '@/lib/pdp/team-colors'

interface Props {
  teamId: number
  name: string
  size?: number
}

export function TeamMark({ teamId, name, size = 36 }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: teamColor(teamId),
        color: '#F4EFE3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Manrope, sans-serif',
        fontWeight: 700,
        fontSize: size * 0.36,
        letterSpacing: '0.04em',
        flexShrink: 0,
        boxShadow:
          'inset 0 0 0 1.5px rgba(255,255,255,0.18), 0 1px 2px rgba(0,0,0,0.15)',
      }}
    >
      {teamInitial(name)}
    </div>
  )
}
