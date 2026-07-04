import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { SoundGrid } from './components/SoundGrid'
import { SettingsPanel } from './components/SettingsPanel'
import { WhatsNewModal } from './components/WhatsNewModal'
import { useAppStore } from './store/appStore'
import { playSound } from './audio/playback'
import './App.css'

export default function App(): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const load = useAppStore((s) => s.load)
  const loaded = useAppStore((s) => s.loaded)
  const settings = useAppStore((s) => s.settings)
  const applyState = useAppStore((s) => s.applyState)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [updateReady, setUpdateReady] = useState(false)
  const [whatsNewVersion, setWhatsNewVersion] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (loaded) i18n.changeLanguage(settings.language)
  }, [loaded, settings.language, i18n])

  useEffect(() => {
    return window.api.onHotkeyTriggered(({ soundboardId, soundId }) => {
      const board = useAppStore.getState().soundboards.find((b) => b.id === soundboardId)
      const sound = board?.sounds.find((s) => s.id === soundId)
      if (sound) playSound(sound, useAppStore.getState().settings)
    })
  }, [])

  useEffect(() => {
    return window.api.onActiveBoardsChanged((ids) => {
      useAppStore.getState().setActiveBoardIds(ids)
    })
  }, [])

  useEffect(() => {
    return window.api.onSoundboardsEnabledChanged((enabled) => {
      useAppStore.getState().setSoundboardsEnabled(enabled)
    })
  }, [])

  useEffect(() => {
    return window.api.onUpdateReady(() => setUpdateReady(true))
  }, [])

  useEffect(() => {
    if (!loaded) return
    window.api.getAppVersion().then((version) => {
      if (version !== useAppStore.getState().settings.lastSeenVersion) setWhatsNewVersion(version)
    })
  }, [loaded])

  async function dismissWhatsNew(): Promise<void> {
    if (!whatsNewVersion) return
    const state = await window.api.updateSettings({ lastSeenVersion: whatsNewVersion })
    applyState(state)
    setWhatsNewVersion(null)
  }

  if (!loaded) {
    return (
      <div className="app-loading">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <TitleBar />
      <div className="app">
        <Sidebar />
        <div className="main-column">
          <header className="topbar">
            <div />
            <button className="settings-btn" onClick={() => setSettingsOpen(true)} aria-label="settings">
              ⚙
            </button>
          </header>
          <SoundGrid />
        </div>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </div>
      {updateReady && (
        <div className="update-banner">
          <span>{t('update.ready')}</span>
          <button className="primary" onClick={() => window.api.installUpdate()}>
            {t('update.restart')}
          </button>
          <button onClick={() => setUpdateReady(false)}>{t('update.later')}</button>
        </div>
      )}
      {whatsNewVersion && <WhatsNewModal version={whatsNewVersion} onClose={dismissWhatsNew} />}
    </div>
  )
}
