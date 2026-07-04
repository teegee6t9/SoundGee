import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { listOutputDevices } from '../audio/devices'
import type { AppState } from '@shared/types'

interface Props {
  onClose: () => void
  currentOutputDeviceIds: string[]
  onApplied: (state: AppState) => void
}

type Status = 'checking' | 'not-installed' | 'installed'

export function AudioSetupGuide({ onClose, currentOutputDeviceIds, onApplied }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('checking')
  const [configuring, setConfiguring] = useState(false)
  const [configureError, setConfigureError] = useState<string | null>(null)
  const [configured, setConfigured] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  async function refreshStatus(): Promise<void> {
    setStatus('checking')
    const installed = await window.api.checkVoicemeeterInstalled()
    setStatus(installed ? 'installed' : 'not-installed')
  }

  useEffect(() => {
    refreshStatus()
  }, [])

  async function handleConfigure(): Promise<void> {
    setConfiguring(true)
    setConfigureError(null)
    setConfigured(false)
    try {
      const result = await window.api.configureVoicemeeterMixing()
      if (!result.ok) {
        setConfigureError(result.error ?? 'unknown')
        return
      }
      const devices = await listOutputDevices()
      const voicemeeterDevice = devices.find((d) => d.label.toLowerCase().includes('voicemeeter'))
      if (voicemeeterDevice && !currentOutputDeviceIds.includes(voicemeeterDevice.deviceId)) {
        const state = await window.api.updateSettings({
          outputDeviceIds: [...currentOutputDeviceIds, voicemeeterDevice.deviceId]
        })
        onApplied(state)
      }
      setConfigured(true)
    } finally {
      setConfiguring(false)
    }
  }

  return (
    <Modal title={t('audioSetup.title')} onClose={onClose}>
      {status === 'checking' && <p>{t('audioSetup.checking')}</p>}

      {status === 'not-installed' && (
        <>
          <p>{t('audioSetup.notInstalled')}</p>
          <div className="modal-footer" style={{ justifyContent: 'flex-start' }}>
            <a
              href="https://vb-audio.com/Voicemeeter/banana.htm"
              target="_blank"
              rel="noreferrer"
              className="btn-link primary"
            >
              {t('audioSetup.downloadButton')}
            </a>
            <button type="button" onClick={refreshStatus}>
              {t('audioSetup.recheckButton')}
            </button>
          </div>
          <p className="hint">{t('audioSetup.installNote')}</p>
        </>
      )}

      {status === 'installed' && (
        <>
          <p>{t('audioSetup.installedIntro')}</p>
          <div className="form-row">
            <button type="button" className="primary" onClick={handleConfigure} disabled={configuring}>
              {configuring ? t('audioSetup.configuring') : t('audioSetup.configureButton')}
            </button>
          </div>
          {configureError && (
            <p className="error-text">
              {t(
                configureError === 'not-installed'
                  ? 'audioSetup.errorNotInstalled'
                  : configureError === 'launch-failed'
                    ? 'audioSetup.errorLaunch'
                    : 'audioSetup.errorLogin'
              )}
            </p>
          )}
          {configured && (
            <>
              <p className="hint">{t('audioSetup.successTitle')}</p>
              <p>{t('audioSetup.successStep')}</p>
            </>
          )}
        </>
      )}

      <div className="form-row" style={{ marginTop: 16 }}>
        <button type="button" onClick={() => setShowAdvanced((v) => !v)}>
          {t('audioSetup.advancedToggle')}
        </button>
      </div>

      {showAdvanced && (
        <>
          <p>{t('guide.intro')}</p>
          <ol className="guide-steps">
            <li>{t('guide.step1')}</li>
            <li>{t('guide.step2')}</li>
            <li>{t('guide.step3')}</li>
            <li>{t('guide.step4')}</li>
          </ol>
          <a href="https://vb-audio.com/Cable/" target="_blank" rel="noreferrer">
            {t('guide.linkLabel')}
          </a>
        </>
      )}
    </Modal>
  )
}
