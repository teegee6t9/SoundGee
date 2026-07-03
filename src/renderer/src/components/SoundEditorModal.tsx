import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { HotkeyRecorder } from './HotkeyRecorder'
import type { AppState, Sound } from '@shared/types'

interface Props {
  soundboardId: string
  sound: Sound
  onClose: () => void
  onChanged: (state: AppState) => void
  onDeleted: (state: AppState) => void
}

export function SoundEditorModal({ soundboardId, sound, onClose, onChanged, onDeleted }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [name, setName] = useState(sound.name)
  const [color, setColor] = useState(sound.color || '#7c3aed')
  const [volume, setVolume] = useState(sound.volume)

  async function handleSave(): Promise<void> {
    const state = await window.api.updateSound(soundboardId, sound.id, { name: name.trim(), color, volume })
    onChanged(state)
    onClose()
  }

  async function handleDelete(): Promise<void> {
    if (!window.confirm(t('sound.confirmDeleteSound'))) return
    const state = await window.api.deleteSound(soundboardId, sound.id)
    onDeleted(state)
  }

  return (
    <Modal title={sound.name} onClose={onClose}>
      <div className="form-row">
        <label>{t('sound.name')}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-row">
        <label>{t('sound.color')}</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>

      <div className="form-row">
        <label>
          {t('sound.volume')} ({Math.round(volume * 100)}%)
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>

      <div className="form-row">
        <label>{t('sound.hotkey')}</label>
        <HotkeyRecorder
          value={sound.hotkey}
          onChange={async (accelerator) => {
            const result = await window.api.registerHotkey(soundboardId, sound.id, accelerator)
            if (result.ok) onChanged(result.state)
            return result
          }}
          onClear={async () => {
            const state = await window.api.unregisterHotkey(soundboardId, sound.id)
            onChanged(state)
          }}
        />
      </div>

      <div className="modal-footer">
        <button className="danger" onClick={handleDelete}>
          {t('sound.delete')}
        </button>
        <div className="spacer" />
        <button onClick={onClose}>{t('modal.cancel')}</button>
        <button className="primary" onClick={handleSave}>
          {t('modal.save')}
        </button>
      </div>
    </Modal>
  )
}
