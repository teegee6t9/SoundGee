import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'

interface Props {
  onClose: () => void
}

export function AudioSetupGuide({ onClose }: Props): React.JSX.Element {
  const { t } = useTranslation()
  return (
    <Modal title={t('guide.title')} onClose={onClose}>
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
    </Modal>
  )
}
