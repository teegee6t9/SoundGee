import type { BrowserWindow } from 'electron'
import type { Soundboard } from '../shared/types'
import { getSoundboards } from './store'
import { registerHotkey, unregisterHotkey, getRegisteredSoundKeys } from './hotkeys'

let lastActiveBoardIds: Set<string> = new Set()
let lastForegroundProcess: string | null = null
let activeBoardsListener: ((ids: string[]) => void) | null = null

export function setActiveBoardsListener(cb: (ids: string[]) => void): void {
  activeBoardsListener = cb
}

export function getActiveBoardIds(): string[] {
  return [...lastActiveBoardIds]
}

export function computeActiveBoardIds(boards: Soundboard[], foregroundProcess: string | null): Set<string> {
  const ids = new Set<string>()
  for (const board of boards) {
    const matchers = board.appMatchers ?? []
    if (matchers.length === 0 || (foregroundProcess !== null && matchers.includes(foregroundProcess))) {
      ids.add(board.id)
    }
  }
  return ids
}

/**
 * Two boards can be simultaneously active if either is general (no appMatchers) or they
 * share at least one associated app - used to reject hotkey duplicates that would only
 * collide once both packs are live together.
 */
function boardsCanCoexist(a: Soundboard, b: Soundboard): boolean {
  const matchersA = a.appMatchers ?? []
  const matchersB = b.appMatchers ?? []
  if (matchersA.length === 0 || matchersB.length === 0) return true
  return matchersA.some((m) => matchersB.includes(m))
}

export function findStaticConflict(
  boards: Soundboard[],
  targetBoardId: string,
  accelerator: string,
  excludeSoundId?: string
): boolean {
  const targetBoard = boards.find((b) => b.id === targetBoardId)
  if (!targetBoard) return false

  for (const board of boards) {
    if (board.id !== targetBoardId && !boardsCanCoexist(targetBoard, board)) continue
    for (const sound of board.sounds) {
      if (sound.id === excludeSoundId) continue
      if (sound.hotkey === accelerator) return true
    }
  }
  return false
}

export function reconcileHotkeys(win: BrowserWindow, foregroundProcess: string | null = lastForegroundProcess): void {
  lastForegroundProcess = foregroundProcess
  const boards = getSoundboards()
  const activeBoardIds = computeActiveBoardIds(boards, foregroundProcess)
  const registeredKeys = getRegisteredSoundKeys()

  for (const board of boards) {
    const isActive = activeBoardIds.has(board.id)
    for (const sound of board.sounds) {
      if (!sound.hotkey) continue
      const key = `${board.id}:${sound.id}`
      const isRegistered = registeredKeys.has(key)
      if (isActive && !isRegistered) {
        registerHotkey(win, board.id, sound.id, sound.hotkey)
      } else if (!isActive && isRegistered) {
        unregisterHotkey(board.id, sound.id)
      }
    }
  }

  const changed =
    activeBoardIds.size !== lastActiveBoardIds.size || [...activeBoardIds].some((id) => !lastActiveBoardIds.has(id))
  lastActiveBoardIds = activeBoardIds
  if (changed) {
    activeBoardsListener?.([...activeBoardIds])
  }
}
