import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/appStore'
import { PromptModal } from './PromptModal'

export function Sidebar(): React.JSX.Element {
  const { t } = useTranslation()
  const soundboards = useAppStore((s) => s.soundboards)
  const selectedBoardId = useAppStore((s) => s.selectedBoardId)
  const selectBoard = useAppStore((s) => s.selectBoard)
  const applyState = useAppStore((s) => s.applyState)

  const [creating, setCreating] = useState(false)
  const [renamingBoard, setRenamingBoard] = useState<{ id: string; name: string } | null>(null)

  async function handleCreateConfirm(name: string): Promise<void> {
    setCreating(false)
    const state = await window.api.createSoundboard(name)
    applyState(state)
    const created = state.soundboards[state.soundboards.length - 1]
    if (created) selectBoard(created.id)
  }

  async function handleRenameConfirm(name: string): Promise<void> {
    if (!renamingBoard || name === renamingBoard.name) {
      setRenamingBoard(null)
      return
    }
    const id = renamingBoard.id
    setRenamingBoard(null)
    const state = await window.api.renameSoundboard(id, name)
    applyState(state)
  }

  async function handleDelete(id: string): Promise<void> {
    if (!window.confirm(t('sidebar.confirmDeleteBoard'))) return
    const state = await window.api.deleteSoundboard(id)
    applyState(state)
  }

  async function handleImportPack(): Promise<void> {
    const state = await window.api.importSoundboardPack()
    if (state) {
      applyState(state)
      const last = state.soundboards[state.soundboards.length - 1]
      if (last) selectBoard(last.id)
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>{t('app.title')}</h1>
      </div>
      <div className="sidebar-actions">
        <button onClick={() => setCreating(true)}>+ {t('sidebar.newSoundboard')}</button>
        <button onClick={handleImportPack}>{t('sidebar.import')}</button>
      </div>
      {soundboards.length === 0 && <p className="empty-hint">{t('sidebar.noBoards')}</p>}
      <ul className="board-list">
        {soundboards.map((board) => (
          <li key={board.id} className={board.id === selectedBoardId ? 'active' : ''}>
            <button className="board-name" onClick={() => selectBoard(board.id)}>
              {board.name}
            </button>
            <div className="board-item-actions">
              <button title={t('sidebar.rename')} onClick={() => setRenamingBoard({ id: board.id, name: board.name })}>
                ✎
              </button>
              <button
                title={t('sidebar.export')}
                onClick={async () => {
                  await window.api.exportSoundboard(board.id)
                }}
              >
                ⬇
              </button>
              <button title={t('sidebar.delete')} onClick={() => handleDelete(board.id)}>
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      {creating && (
        <PromptModal
          title={t('sidebar.newSoundboard')}
          label={t('sidebar.newBoardPrompt')}
          confirmLabel={t('modal.create')}
          onCancel={() => setCreating(false)}
          onConfirm={handleCreateConfirm}
        />
      )}

      {renamingBoard && (
        <PromptModal
          title={t('sidebar.rename')}
          label={t('sidebar.renameBoardPrompt')}
          initialValue={renamingBoard.name}
          confirmLabel={t('modal.save')}
          onCancel={() => setRenamingBoard(null)}
          onConfirm={handleRenameConfirm}
        />
      )}
    </aside>
  )
}
