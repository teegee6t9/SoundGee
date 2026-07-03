import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import type { AppState } from '@shared/types'

interface Props {
  soundboardId: string
  onClose: () => void
  onImported: (state: AppState) => void
}

export function ImportSoundModal({ soundboardId, onClose, onImported }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [filePath, setFilePath] = useState<string | null>(null)
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function pickFile(): Promise<void> {
    const path = await window.api.pickAudioFile()
    if (path) {
      setFilePath(path)
      setUrl('')
      if (!name) {
        const base = path.split(/[\\/]/).pop() ?? path
        setName(base.replace(/\.[^.]+$/, ''))
      }
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!name.trim()) return
    setBusy(true)
    setError(null)
    try {
      const state = filePath
        ? await window.api.addSoundFromFile(soundboardId, filePath, name.trim())
        : await window.api.addSoundFromUrl(soundboardId, url.trim(), name.trim())
      onImported(state)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const canSubmit = name.trim().length > 0 && (filePath !== null || url.trim().length > 0) && !busy

  return (
    <Modal title={t('import.title')} onClose={onClose}>
      <div className="form-row">
        <label>{t('import.localFile')}</label>
        <div className="file-picker">
          <button type="button" onClick={pickFile}>
            {t('import.chooseFile')}
          </button>
          <span className="file-name">
            {filePath ? filePath.split(/[\\/]/).pop() : t('import.noFileChosen')}
          </span>
        </div>
      </div>

      <div className="form-row">
        <label>{t('import.orUrl')}</label>
        <input
          type="text"
          placeholder={t('import.urlPlaceholder')}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (e.target.value) setFilePath(null)
          }}
        />
      </div>

      <div className="form-row">
        <label>{t('import.name')}</label>
        <input
          type="text"
          placeholder={t('import.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="modal-footer">
        <button onClick={onClose}>{t('modal.cancel')}</button>
        <button className="primary" disabled={!canSubmit} onClick={handleSubmit}>
          {busy ? t('import.downloading') : t('import.submit')}
        </button>
      </div>
    </Modal>
  )
}
