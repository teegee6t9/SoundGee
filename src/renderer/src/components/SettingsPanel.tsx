import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { HotkeyRecorder } from './HotkeyRecorder'
import { useAppStore } from '../store/appStore'
import { listOutputDevices, type OutputDevice } from '../audio/devices'
import { AudioSetupGuide } from './AudioSetupGuide'
import type { Language } from '@shared/types'

interface Props {
  onClose: () => void
}

export function SettingsPanel({ onClose }: Props): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const settings = useAppStore((s) => s.settings)
  const applyState = useAppStore((s) => s.applyState)
  const [devices, setDevices] = useState<OutputDevice[]>([])
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => {
    listOutputDevices().then(setDevices)
  }, [])

  async function handleLanguageChange(lang: Language): Promise<void> {
    const state = await window.api.updateSettings({ language: lang })
    applyState(state)
    i18n.changeLanguage(lang)
  }

  async function toggleDevice(deviceId: string): Promise<void> {
    const next = settings.outputDeviceIds.includes(deviceId)
      ? settings.outputDeviceIds.filter((id) => id !== deviceId)
      : [...settings.outputDeviceIds, deviceId]
    const state = await window.api.updateSettings({ outputDeviceIds: next })
    applyState(state)
  }

  async function handleMasterVolume(volume: number): Promise<void> {
    const state = await window.api.updateSettings({ masterVolume: volume })
    applyState(state)
  }

  async function toggleLaunchAtStartup(): Promise<void> {
    const state = await window.api.updateSettings({ launchAtStartup: !settings.launchAtStartup })
    applyState(state)
  }

  async function toggleLaunchMinimized(): Promise<void> {
    const state = await window.api.updateSettings({ launchMinimized: !settings.launchMinimized })
    applyState(state)
  }

  async function handleToggleSoundboards(): Promise<void> {
    const state = await window.api.toggleSoundboardsEnabled()
    applyState(state)
  }

  return (
    <Modal title={t('settings.title')} onClose={onClose}>
      <div className="form-row">
        <label>{t('settings.language')}</label>
        <div className="lang-switch">
          <button className={settings.language === 'en' ? 'active' : ''} onClick={() => handleLanguageChange('en')}>
            English
          </button>
          <button className={settings.language === 'fr' ? 'active' : ''} onClick={() => handleLanguageChange('fr')}>
            Français
          </button>
        </div>
      </div>

      <div className="form-row">
        <label>
          {t('settings.masterVolume')} ({Math.round(settings.masterVolume * 100)}%)
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={settings.masterVolume}
          onChange={(e) => handleMasterVolume(Number(e.target.value))}
        />
      </div>

      <div className="form-row">
        <label>{t('settings.outputDevices')}</label>
        <p className="hint">{t('settings.outputDevicesHint')}</p>
        <ul className="device-list">
          {devices.map((d) => (
            <li key={d.deviceId}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.outputDeviceIds.includes(d.deviceId)}
                  onChange={() => toggleDevice(d.deviceId)}
                />
                {d.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-row">
        <label>
          <input type="checkbox" checked={settings.launchAtStartup} onChange={toggleLaunchAtStartup} />{' '}
          {t('settings.launchAtStartup')}
        </label>
      </div>

      <div className="form-row">
        <label>
          <input type="checkbox" checked={settings.launchMinimized} onChange={toggleLaunchMinimized} />{' '}
          {t('settings.launchMinimized')}
        </label>
      </div>

      <div className="form-row">
        <label>{t('settings.masterToggleHotkey')}</label>
        <HotkeyRecorder
          value={settings.masterToggleHotkey}
          onChange={async (accelerator) => {
            const result = await window.api.registerMasterHotkey(accelerator)
            if (result.ok) applyState(result.state)
            return result
          }}
          onClear={async () => {
            const state = await window.api.unregisterMasterHotkey()
            applyState(state)
          }}
        />
        <div className="lang-switch">
          <span className="hint">{settings.soundboardsEnabled ? t('settings.soundsEnabledOn') : t('settings.soundsEnabledOff')}</span>
          <button type="button" onClick={handleToggleSoundboards}>
            {t('settings.toggleNow')}
          </button>
        </div>
      </div>

      <div className="form-row">
        <button type="button" onClick={() => setGuideOpen(true)}>
          {t('settings.audioGuide')}
        </button>
      </div>

      {guideOpen && <AudioSetupGuide onClose={() => setGuideOpen(false)} />}
    </Modal>
  )
}
