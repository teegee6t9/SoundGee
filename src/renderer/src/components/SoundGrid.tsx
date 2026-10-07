import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/appStore'
import { playSound } from '../audio/playback'
import { SoundTile } from './SoundTile'
import { ImportSoundModal } from './ImportSoundModal'
import { SoundEditorModal } from './SoundEditorModal'
import { TrimModal } from './TrimModal'
import type { Sound } from '@shared/types'

export function SoundGrid(): React.JSX.Element {
  const { t } = useTranslation()
  const soundboards = useAppStore((s) => s.soundboards)
  const selectedBoardId = useAppStore((s) => s.selectedBoardId)
  const settings = useAppStore((s) => s.settings)
  const applyState = useAppStore((s) => s.applyState)

  const [importOpen, setImportOpen] = useState(false)
  const [editingSound, setEditingSound] = useState<Sound | null>(null)
  const [trimmingSound, setTrimmingSound] = useState<Sound | null>(null)

  const board = soundboards.find((b) => b.id === selectedBoardId) ?? null

  if (!board) {
    return (
      <main className="sound-grid-empty">
        <p>{t('sidebar.noBoards')}</p>
      </main>
    )
  }

  return (
    <main className="sound-grid">
      <div className="tiles">
        {board.sounds.map((sound) => (
          <SoundTile
            key={sound.id}
            sound={sound}
            onPlay={() => playSound(sound, settings)}
            onEdit={() => setEditingSound(sound)}
          />
        ))}
        <button className="tile add-tile" onClick={() => setImportOpen(true)}>
          + {t('grid.addSound')}
        </button>
      </div>
      {board.sounds.length === 0 && <p className="empty-hint">{t('grid.noSounds')}</p>}

      {importOpen && (
        <ImportSoundModal
          soundboardId={board.id}
          onClose={() => setImportOpen(false)}
          onImported={(state, trimAfter) => {
            applyState(state)
            setImportOpen(false)
            if (trimAfter) {
              // addSound* appends, so the freshly imported sound is the last one
              const imported = state.soundboards.find((b) => b.id === board.id)?.sounds.at(-1)
              if (imported) setTrimmingSound(imported)
            }
          }}
        />
      )}

      {editingSound && (
        <SoundEditorModal
          soundboardId={board.id}
          sound={editingSound}
          onClose={() => setEditingSound(null)}
          onChanged={(state) => applyState(state)}
          onDeleted={(state) => {
            applyState(state)
            setEditingSound(null)
          }}
          onTrim={() => {
            setTrimmingSound(editingSound)
            setEditingSound(null)
          }}
        />
      )}

      {trimmingSound && (
        <TrimModal
          soundboardId={board.id}
          sound={trimmingSound}
          onClose={() => setTrimmingSound(null)}
          onSaved={(state) => applyState(state)}
        />
      )}
    </main>
  )
}
