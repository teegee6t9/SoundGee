import koffi from 'koffi'
import fs from 'fs'
import type { ConfigureResult } from '../shared/types'

const DLL_CANDIDATES = [
  'C:\\Program Files (x86)\\VB\\Voicemeeter\\VoicemeeterRemote64.dll',
  'C:\\Program Files\\VB\\Voicemeeter\\VoicemeeterRemote64.dll'
]

function findDllPath(): string | null {
  return DLL_CANDIDATES.find((p) => fs.existsSync(p)) ?? null
}

export function isVoicemeeterInstalled(): boolean {
  return findDllPath() !== null
}

interface VoicemeeterApi {
  login: () => number
  logout: () => number
  runVoicemeeter: (type: number) => number
  isParametersDirty: () => number
  setParameterFloat: (name: string, value: number) => number
}

let cachedApi: VoicemeeterApi | null = null

function loadApi(): VoicemeeterApi | null {
  if (cachedApi) return cachedApi
  const dllPath = findDllPath()
  if (!dllPath) return null

  const lib = koffi.load(dllPath)
  cachedApi = {
    login: lib.func('__stdcall', 'VBVMR_Login', 'long', []),
    logout: lib.func('__stdcall', 'VBVMR_Logout', 'long', []),
    runVoicemeeter: lib.func('__stdcall', 'VBVMR_RunVoicemeeter', 'long', ['long']),
    isParametersDirty: lib.func('__stdcall', 'VBVMR_IsParametersDirty', 'long', []),
    setParameterFloat: lib.func('__stdcall', 'VBVMR_SetParameterFloat', 'long', ['str', 'float'])
  }
  return cachedApi
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Routes the default hardware microphone (Strip 0, "Stereo Input 1") and Voicemeeter Banana's
 * first virtual input "Voicemeeter Input" (Strip 3 - Banana has 3 hardware strips at indices
 * 0-2 before the virtual ones, fed directly by SoundGee as an output device) into the B1
 * virtual output bus ("Voicemeeter Output"), which Discord/games should pick as their input
 * device. Assumes a fresh, default Banana strip layout - if the user has a customized setup
 * this may not map correctly, hence surfacing a clear ok/error result to the caller.
 */
export async function configureMicAndSoundboardMix(): Promise<ConfigureResult> {
  const api = loadApi()
  if (!api) return { ok: false, error: 'not-installed' }

  // A previous failed attempt may have left the client logged in without a matching logout,
  // which makes the next VBVMR_Login() call fail with a connection error - clear that first.
  api.logout()

  // Per VB-Audio's documented sequence, Login() is called exactly once per client lifetime -
  // it must NOT be called again to "recheck" readiness after launching Voicemeeter.
  const loginResult = api.login()
  if (loginResult < 0) return { ok: false, error: 'login-failed' }

  if (loginResult === 1) {
    // Voicemeeter's audio engine is installed but the app itself isn't running yet.
    const launchResult = api.runVoicemeeter(2) // 2 = Banana
    if (launchResult < 0) {
      api.logout()
      return { ok: false, error: 'launch-failed' }
    }
    await wait(1000)

    // The documented way to detect the connection is live is polling IsParametersDirty()
    // (>= 0 means connected), not re-calling Login(). First launch after install can be slow
    // (driver init, Windows warming up the new exe), so allow up to ~20 seconds.
    let ready = false
    for (let attempt = 0; attempt < 20; attempt++) {
      if (api.isParametersDirty() >= 0) {
        ready = true
        break
      }
      await wait(1000)
    }
    if (!ready) {
      api.logout()
      return { ok: false, error: 'launch-failed' }
    }
  }

  api.setParameterFloat('Strip[0].B1', 1.0)
  api.setParameterFloat('Strip[3].B1', 1.0)
  api.logout()

  return { ok: true }
}
