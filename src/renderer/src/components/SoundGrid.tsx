import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/appStore'
import { playSound } from '../audio/playback'
import { SoundTile } from './SoundTile'
import { ImportSoundModal } from './ImportSoundModal'
import { SoundEditorModal } from './SoundEditorModal'
import type { Sound } from '@shared/types'

export function SoundGrid(): React.JSX.Element {
  const { t } = useTranslation()
  const soundboards = useAppStore((s) => s.soundboards)
  const selectedBoardId = useAppStore((s) => s.selectedBoardId)
  const settings = useAppStore((s) => s.settings)
  const applyState = useAppStore((s) => s.applyState)

  const [importOpen, setImportOpen] = useState(false)
  const [editingSound, setEditingSound] = useState<Sound | null>(null)

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
          onImported={(state) => {
            applyState(state)
            setImportOpen(false)
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
        />
      )}
    </main>
  )
}
