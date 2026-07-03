import type { Settings, Sound } from '@shared/types'

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function playSound(sound: Sound, settings: Settings): void {
  const src = `sgsound://local/${encodeURIComponent(sound.fileName)}`
  const deviceIds = settings.outputDeviceIds.length > 0 ? settings.outputDeviceIds : ['default']
  const volume = clamp01(sound.volume) * clamp01(settings.masterVolume)

  for (const deviceId of deviceIds) {
    const audio = new Audio(src)
    audio.volume = volume
    if (audio.setSinkId && deviceId !== 'default') {
      audio.setSinkId(deviceId).catch(() => {
        // device may have been unplugged; ignore and let default output play
      })
    }
    audio.play().catch(() => {
      // playback can be rejected if the file is missing; nothing else to do here
    })
  }
}
