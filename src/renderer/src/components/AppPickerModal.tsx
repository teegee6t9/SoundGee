import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import type { AppState } from '@shared/types'

interface Props {
  soundboardId: string
  initialApps: string[]
  onClose: () => void
  onSaved: (state: AppState) => void
}

interface RunningApp {
  processName: string
  title: string
}

export function AppPickerModal({ soundboardId, initialApps, onClose, onSaved }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Set<string>>(new Set(initialApps))
  const [running, setRunning] = useState<RunningApp[]>([])
  const [manualName, setManualName] = useState('')
  const [loading, setLoading] = useState(false)

  async function refresh(): Promise<void> {
    setLoading(true)
    try {
      const apps = await window.api.listRunningApps()
      setRunning(apps.sort((a, b) => a.processName.localeCompare(b.processName)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function toggle(processName: string): void {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(processName)) next.delete(processName)
      else next.add(processName)
      return next
    })
  }

  function addManual(): void {
    const name = manualName.trim().toLowerCase().replace(/\.exe$/, '')
    if (!name) return
    setSelected((prev) => new Set(prev).add(name))
    setManualName('')
  }

  async function handleSave(): Promise<void> {
    const state = await window.api.updateSoundboardApps(soundboardId, [...selected])
    onSaved(state)
    onClose()
  }

  const selectedNotRunning = [...selected].filter((name) => !running.some((r) => r.processName === name))

  return (
    <Modal title={t('apps.title')} onClose={onClose}>
      <p className="hint">{t('apps.hint')}</p>

      <div className="form-row">
        <label>
          {t('apps.running')}
          <button type="button" onClick={refresh} disabled={loading} style={{ marginLeft: 8 }}>
            {t('apps.refresh')}
          </button>
        </label>
        {running.length === 0 && !loading && <p className="hint">{t('apps.noneFound')}</p>}
        <ul className="device-list">
          {running.map((app) => (
            <li key={app.processName}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.has(app.processName)}
                  onChange={() => toggle(app.processName)}
                />
                {app.processName} <span className="hint">— {app.title}</span>
              </label>
            </li>
          ))}
          {selectedNotRunning.map((name) => (
            <li key={name}>
              <label>
                <input type="checkbox" checked onChange={() => toggle(name)} />
                {name} <span className="hint">({t('apps.manualAdd').toLowerCase()})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-row">
        <label>{t('apps.manualLabel')}</label>
        <div className="file-picker">
          <input
            type="text"
            placeholder={t('apps.manualPlaceholder')}
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addManual()
            }}
          />
          <button type="button" onClick={addManual}>
            {t('apps.manualAdd')}
          </button>
        </div>
      </div>

      {selected.size === 0 && <p className="hint">{t('apps.generalHint')}</p>}

      <div className="modal-footer">
        <button onClick={onClose}>{t('modal.cancel')}</button>
        <button className="primary" onClick={handleSave}>
          {t('modal.save')}
        </button>
      </div>
    </Modal>
  )
}
