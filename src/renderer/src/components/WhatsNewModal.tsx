import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { CHANGELOG } from '../changelog'

interface Props {
  version: string
  onClose: () => void
}

export function WhatsNewModal({ version, onClose }: Props): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const entry = CHANGELOG[version]
  const lang = i18n.language === 'fr' ? 'fr' : 'en'
  const items = entry?.[lang] ?? []

  return (
    <Modal title={t('whatsNew.title', { version })} onClose={onClose}>
      {items.length > 0 ? (
        <ul className="guide-steps">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{t('whatsNew.noNotes')}</p>
      )}
      <div className="modal-footer">
        <button className="primary" onClick={onClose}>
          {t('whatsNew.ok')}
        </button>
      </div>
    </Modal>
  )
}
