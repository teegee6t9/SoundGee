import type { Sound } from '@shared/types'

interface Props {
  sound: Sound
  onPlay: () => void
  onEdit: () => void
}

export function SoundTile({ sound, onPlay, onEdit }: Props): React.JSX.Element {
  return (
    <div className="tile" style={{ borderColor: sound.color || 'var(--accent)' }}>
      <button className="tile-play" onClick={onPlay}>
        <span className="tile-name">{sound.name}</span>
        {sound.hotkey && <span className="tile-hotkey">{sound.hotkey}</span>}
      </button>
      <button className="tile-edit" onClick={onEdit} aria-label="edit">
        ⋮
      </button>
    </div>
  )
}
