import { create } from 'zustand'
import type { AppState, Soundboard, Settings } from '@shared/types'

interface AppStore {
  soundboards: Soundboard[]
  settings: Settings
  selectedBoardId: string | null
  activeBoardIds: Set<string>
  loaded: boolean
  load: () => Promise<void>
  applyState: (state: AppState) => void
  selectBoard: (id: string) => void
  setActiveBoardIds: (ids: string[]) => void
  setSoundboardsEnabled: (enabled: boolean) => void
}

const emptySettings: Settings = {
  language: 'en',
  outputDeviceIds: [],
  masterVolume: 1,
  launchAtStartup: false,
  launchMinimized: false,
  soundboardsEnabled: true
}

export const useAppStore = create<AppStore>((set, get) => ({
  soundboards: [],
  settings: emptySettings,
  selectedBoardId: null,
  activeBoardIds: new Set(),
  loaded: false,
  load: async () => {
    const [state, activeBoardIds] = await Promise.all([window.api.getState(), window.api.getActiveBoards()])
    get().applyState(state)
    set({ loaded: true, activeBoardIds: new Set(activeBoardIds) })
  },
  applyState: (state: AppState) => {
    set((prev) => {
      const stillExists = state.soundboards.some((b) => b.id === prev.selectedBoardId)
      return {
        soundboards: state.soundboards,
        settings: state.settings,
        selectedBoardId: stillExists ? prev.selectedBoardId : (state.soundboards[0]?.id ?? null)
      }
    })
  },
  selectBoard: (id: string) => set({ selectedBoardId: id }),
  setActiveBoardIds: (ids: string[]) => set({ activeBoardIds: new Set(ids) }),
  setSoundboardsEnabled: (enabled: boolean) =>
    set((prev) => ({ settings: { ...prev.settings, soundboardsEnabled: enabled } }))
}))
