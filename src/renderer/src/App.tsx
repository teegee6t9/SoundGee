import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import { Sidebar } from './components/Sidebar'
import { SoundGrid } from './components/SoundGrid'
import { SettingsPanel } from './components/SettingsPanel'
import { useAppStore } from './store/appStore'
import { playSound } from './audio/playback'
import './App.css'

export default function App(): React.JSX.Element {
  const { i18n } = useTranslation()
  const load = useAppStore((s) => s.load)
  const loaded = useAppStore((s) => s.loaded)
  const settings = useAppStore((s) => s.settings)
  const [settingsOpen, setSettingsOpen] = useState(false)

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

  if (!loaded) {
    return (
      <div className="app-loading">
        <p>Loading...</p>
      </div>
    )
  }

  return (
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
  )
}
