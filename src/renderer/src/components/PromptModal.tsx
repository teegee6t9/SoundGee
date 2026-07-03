import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'

interface Props {
  title: string
  label: string
  initialValue?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: (value: string) => void
}

export function PromptModal({ title, label, initialValue, confirmLabel, onCancel, onConfirm }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [value, setValue] = useState(initialValue ?? '')

  function submit(): void {
    if (!value.trim()) return
    onConfirm(value.trim())
  }

  return (
    <Modal title={title} onClose={onCancel}>
      <div className="form-row">
        <label>{label}</label>
        <input
          type="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </div>
      <div className="modal-footer">
        <button onClick={onCancel}>{t('modal.cancel')}</button>
        <button className="primary" disabled={!value.trim()} onClick={submit}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
