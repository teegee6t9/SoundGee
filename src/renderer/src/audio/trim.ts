export const MIN_SELECTION_SECONDS = 0.05

export async function decodeSoundFile(fileName: string, ctx: AudioContext): Promise<AudioBuffer> {
  const bytes = await window.api.readSoundFile(fileName)
  // decodeAudioData detaches the buffer it's given, so hand it its own copy
  const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  return ctx.decodeAudioData(copy)
}

export function computePeaks(buffer: AudioBuffer, buckets: number): Float32Array {
  const peaks = new Float32Array(buckets)
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, c) => buffer.getChannelData(c))
  const samplesPerBucket = Math.max(1, Math.floor(buffer.length / buckets))
  // Sampling every sample of a long file is wasteful for a ~1000px drawing
  const stride = Math.max(1, Math.floor(samplesPerBucket / 256))

  for (let b = 0; b < buckets; b++) {
    const from = b * samplesPerBucket
    const to = Math.min(buffer.length, from + samplesPerBucket)
    let max = 0
    for (let i = from; i < to; i += stride) {
      for (const data of channels) {
        const v = Math.abs(data[i])
        if (v > max) max = v
      }
    }
    peaks[b] = max
  }
  return peaks
}

function writeString(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
}

/** Encodes [startSec, endSec] of the buffer as a 16-bit PCM WAV file. */
export function encodeWav(buffer: AudioBuffer, startSec: number, endSec: number): ArrayBuffer {
  const sampleRate = buffer.sampleRate
  const startFrame = Math.max(0, Math.floor(startSec * sampleRate))
  const endFrame = Math.min(buffer.length, Math.ceil(endSec * sampleRate))
  const frames = Math.max(0, endFrame - startFrame)
  const channelCount = buffer.numberOfChannels
  const bytesPerSample = 2
  const dataSize = frames * channelCount * bytesPerSample

  const out = new ArrayBuffer(44 + dataSize)
  const view = new DataView(out)
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, channelCount, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * channelCount * bytesPerSample, true)
  view.setUint16(32, channelCount * bytesPerSample, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  const channels = Array.from({ length: channelCount }, (_, c) => buffer.getChannelData(c))
  // ~5 ms fade at both ends so cutting mid-waveform doesn't produce an audible click
  const fadeFrames = Math.min(Math.floor(sampleRate * 0.005), Math.floor(frames / 2))

  let offset = 44
  for (let i = 0; i < frames; i++) {
    let gain = 1
    if (i < fadeFrames) gain = i / fadeFrames
    else if (i >= frames - fadeFrames) gain = (frames - 1 - i) / fadeFrames
    for (let c = 0; c < channelCount; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][startFrame + i] * gain))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += bytesPerSample
    }
  }
  return out
}

export function formatTime(seconds: number): string {
  const total = Math.max(0, seconds)
  const minutes = Math.floor(total / 60)
  const rest = total - minutes * 60
  return `${minutes}:${rest.toFixed(2).padStart(5, '0')}`
}
