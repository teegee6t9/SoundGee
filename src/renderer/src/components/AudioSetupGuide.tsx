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
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)

  async function refreshStatus(): Promise<void> {
    setStatus('checking')
    const installed = await window.api.checkVoicemeeterInstalled()
    setStatus(installed ? 'installed' : 'not-installed')
  }

  useEffect(() => {
    refreshStatus()
  }, [])

  async function handleDownload(): Promise<void> {
    setDownloading(true)
    setDownloadError(false)
    try {
      const result = await window.api.installVoicemeeter()
      if (!result.ok) setDownloadError(true)
    } finally {
      setDownloading(false)
    }
  }

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
      // Voicemeeter Banana exposes several "Voicemeeter ..." playback devices (In 2, In 4, In
      // 5, AUX Input...) besides the one we actually configured the mixing for - match it
      // precisely, and drop any other voicemeeter device a previous run may have picked.
      const voicemeeterDevice = devices.find((d) => {
        const label = d.label.toLowerCase()
        return label.includes('voicemeeter input') && !label.includes('aux')
      })
      if (voicemeeterDevice) {
        const withoutOtherVoicemeeterDevices = currentOutputDeviceIds.filter((id) => {
          const device = devices.find((d) => d.deviceId === id)
          return !device || !device.label.toLowerCase().includes('voicemeeter')
        })
        // Keep "default" (your normal speakers/headphones) alongside Voicemeeter Input, so you
        // still hear sounds yourself instead of only sending them to Voicemeeter.
        const withDefault = withoutOtherVoicemeeterDevices.includes('default')
          ? withoutOtherVoicemeeterDevices
          : ['default', ...withoutOtherVoicemeeterDevices]
        const state = await window.api.updateSettings({
          outputDeviceIds: [...withDefault, voicemeeterDevice.deviceId]
        })
        onApplied(state)
      }
      setConfigured(true)
    } catch {
      setConfigureError('unknown')
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
          <ol className="guide-steps">
            <li>{t('audioSetup.installStep1')}</li>
            <li>{t('audioSetup.installStep2')}</li>
            <li>{t('audioSetup.installStep3')}</li>
            <li>{t('audioSetup.installStep4')}</li>
            <li>{t('audioSetup.installStep5')}</li>
          </ol>
          <div className="modal-footer" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="primary" onClick={handleDownload} disabled={downloading}>
              {downloading ? t('audioSetup.downloading') : t('audioSetup.downloadButton')}
            </button>
            <button type="button" onClick={refreshStatus}>
              {t('audioSetup.recheckButton')}
            </button>
          </div>
          {downloadError && (
            <p className="error-text">
              {t('audioSetup.downloadError')}{' '}
              <a href="https://vb-audio.com/Voicemeeter/banana.htm" target="_blank" rel="noreferrer">
                {t('audioSetup.downloadErrorLink')}
              </a>
            </p>
          )}
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
          {configuring && <p className="hint">{t('audioSetup.configuringHint')}</p>}
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
