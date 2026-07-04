import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/appStore'

export function TitleBar(): React.JSX.Element {
  const { t } = useTranslation()
  const soundboardsEnabled = useAppStore((s) => s.settings.soundboardsEnabled)

  return (
    <div className="titlebar">
      <div className="titlebar-drag">
        <span className="titlebar-title">{t('app.title')}</span>
        <span className={`sounds-indicator ${soundboardsEnabled ? 'on' : 'off'}`}>
          <span className="sounds-dot" />
          {soundboardsEnabled ? t('titlebar.soundsOn') : t('titlebar.soundsOff')}
        </span>
      </div>
      <div className="titlebar-controls">
        <button
          className="titlebar-btn"
          title={t('titlebar.minimize')}
          aria-label={t('titlebar.minimize')}
          onClick={() => window.api.minimizeWindow()}
        >
          &#x2013;
        </button>
        <button
          className="titlebar-btn titlebar-close"
          title={t('titlebar.close')}
          aria-label={t('titlebar.close')}
          onClick={() => window.api.closeWindow()}
        >
          &#x2715;
        </button>
      </div>
    </div>
  )
}
