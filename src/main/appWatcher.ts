import activeWindow from 'active-win'

export function normalizeProcessName(name: string): string {
  return name.toLowerCase().replace(/\.exe$/, '')
}

let intervalHandle: NodeJS.Timeout | null = null
let lastProcess: string | null = null

export function startAppWatcher(onChange: (processName: string | null) => void, intervalMs = 1500): void {
  if (intervalHandle) return

  const poll = async (): Promise<void> => {
    try {
      const result = await activeWindow()
      const processName = result ? normalizeProcessName(result.owner.name) : null
      if (processName !== lastProcess) {
        lastProcess = processName
        onChange(processName)
      }
    } catch {
      // transient failures (e.g. a permission dialog briefly has focus); just retry next tick
    }
  }

  poll()
  intervalHandle = setInterval(poll, intervalMs)
}

export function stopAppWatcher(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle)
    intervalHandle = null
  }
}

export interface RunningApp {
  processName: string
  title: string
}

export async function listRunningApps(): Promise<RunningApp[]> {
  const windows = await activeWindow.getOpenWindows()
  const seen = new Map<string, RunningApp>()
  for (const w of windows) {
    const processName = normalizeProcessName(w.owner.name)
    if (!processName || seen.has(processName)) continue
    seen.set(processName, { processName, title: w.title || w.owner.name })
  }
  return [...seen.values()]
}
