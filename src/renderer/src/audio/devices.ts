export interface OutputDevice {
  deviceId: string
  label: string
}

let permissionRequested = false

async function ensureDeviceLabels(): Promise<void> {
  if (permissionRequested) return
  permissionRequested = true
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop())
  } catch {
    // permission denied or no input device available; device labels may stay generic
  }
}

export async function listOutputDevices(): Promise<OutputDevice[]> {
  await ensureDeviceLabels()
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices
    .filter((d) => d.kind === 'audiooutput')
    .map((d) => ({ deviceId: d.deviceId, label: d.label || d.deviceId }))
}
