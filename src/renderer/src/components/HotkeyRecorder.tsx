import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { eventToAccelerator } from '../lib/accelerator'

interface Props {
  value?: string
  onChange: (accelerator: string) => Promise<{ ok: boolean; error?: string }>
  onClear: () => void
}

export function HotkeyRecorder({ value, onChange, onClear }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [recording, setRecording] = useState(false)
  const [conflict, setConflict] = useState(false)

  useEffect(() => {
    if (!recording) return
    function handleKeyDown(e: KeyboardEvent): void {
      e.preventDefault()
      e.stopPropagation()
      const accelerator = eventToAccelerator(e)
      if (!accelerator) return
      setRecording(false)
      onChange(accelerator).then((result) => setConflict(!result.ok))
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [recording, onChange])

  return (
    <div className="hotkey-recorder">
      <button type="button" className={recording ? 'recording' : ''} onClick={() => setRecording(true)}>
        {recording ? t('hotkey.pressKey') : value || t('hotkey.record')}
      </button>
      {value && (
        <button
          type="button"
          className="hotkey-clear"
          onClick={() => {
            setConflict(false)
            onClear()
          }}
        >
          {t('hotkey.clear')}
        </button>
      )}
      {conflict && <p className="error-text">{t('hotkey.conflict')}</p>}
    </div>
  )
}
