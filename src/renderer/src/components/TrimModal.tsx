import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { MIN_SELECTION_SECONDS, computePeaks, decodeSoundFile, encodeWav } from '../audio/trim'
import type { AppState, Sound } from '@shared/types'

interface Props {
  soundboardId: string
  sound: Sound
  onClose: () => void
  onSaved: (state: AppState) => void
}

type Handle = 'start' | 'end'

const PEAK_BUCKETS = 1000
const WAVE_HEIGHT = 120

function clampStart(time: number, end: number): number {
  return Math.min(Math.max(0, time), Math.max(0, end - MIN_SELECTION_SECONDS))
}

function clampEnd(time: number, start: number, duration: number): number {
  return Math.max(Math.min(duration, time), Math.min(duration, start + MIN_SELECTION_SECONDS))
}

export function TrimModal({ soundboardId, sound, onClose, onSaved }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [startText, setStartText] = useState('0.00')
  const [endText, setEndText] = useState('0.00')
  const [playing, setPlaying] = useState(false)
  const [playhead, setPlayhead] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const rafRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<Handle | null>(null)

  const duration = buffer?.duration ?? 0
  const percent = (time: number): number => (duration > 0 ? (time / duration) * 100 : 0)

  const stopPreview = useCallback((): void => {
    const source = sourceRef.current
    if (source) {
      sourceRef.current = null
      source.onended = null
      try {
        source.stop()
      } catch {
        // already stopped
      }
    }
    cancelAnimationFrame(rafRef.current)
    setPlaying(false)
    setPlayhead(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    const ctx = new AudioContext()
    ctxRef.current = ctx
    decodeSoundFile(sound.fileName, ctx)
      .then((decoded) => {
        if (cancelled) return
        setBuffer(decoded)
        setStart(0)
        setEnd(decoded.duration)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
      stopPreview()
      ctx.close().catch(() => {})
    }
  }, [sound.fileName, stopPreview])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!buffer || !canvas || !context) return
    const peaks = computePeaks(buffer, PEAK_BUCKETS)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-hover').trim() || '#8b5cf6'
    for (let i = 0; i < PEAK_BUCKETS; i++) {
      const barHeight = Math.max(1, peaks[i] * WAVE_HEIGHT)
      context.fillRect(i, (WAVE_HEIGHT - barHeight) / 2, 1, barHeight)
    }
  }, [buffer])

  useEffect(() => setStartText(start.toFixed(2)), [start])
  useEffect(() => setEndText(end.toFixed(2)), [end])

  function timeFromPointer(e: React.PointerEvent<HTMLDivElement>): number {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    return ratio * duration
  }

  function moveHandle(handle: Handle, time: number): void {
    if (handle === 'start') setStart(clampStart(time, end))
    else setEnd(clampEnd(time, start, duration))
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>): void {
    if (!buffer) return
    const time = timeFromPointer(e)
    const handle: Handle = Math.abs(time - start) <= Math.abs(time - end) ? 'start' : 'end'
    dragRef.current = handle
    e.currentTarget.setPointerCapture(e.pointerId)
    stopPreview()
    moveHandle(handle, time)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>): void {
    if (dragRef.current) moveHandle(dragRef.current, timeFromPointer(e))
  }

  function handlePointerUp(): void {
    dragRef.current = null
  }

  function commitTime(handle: Handle, text: string): void {
    stopPreview()
    const parsed = parseFloat(text.replace(',', '.'))
    if (handle === 'start') {
      const next = Number.isFinite(parsed) ? clampStart(parsed, end) : start
      setStart(next)
      setStartText(next.toFixed(2))
    } else {
      const next = Number.isFinite(parsed) ? clampEnd(parsed, start, duration) : end
      setEnd(next)
      setEndText(next.toFixed(2))
    }
  }

  function startPreview(): void {
    const ctx = ctxRef.current
    if (!buffer || !ctx) return
    stopPreview()
    void ctx.resume()

    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.value = sound.volume
    source.connect(gain).connect(ctx.destination)

    const from = start
    const to = end
    const startedAt = ctx.currentTime
    source.start(0, from, to - from)
    source.onended = () => {
      if (sourceRef.current !== source) return
      sourceRef.current = null
      cancelAnimationFrame(rafRef.current)
      setPlaying(false)
      setPlayhead(null)
    }
    sourceRef.current = source
    setPlaying(true)

    const tick = (): void => {
      if (sourceRef.current !== source) return
      setPlayhead(Math.min(to, from + (ctx.currentTime - startedAt)))
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
  }

  async function save(asNewSound: boolean): Promise<void> {
    if (!buffer) return
    stopPreview()
    setSaving(true)
    setSaveError(false)
    try {
      const wav = encodeWav(buffer, start, end)
      const newName = `${sound.name} ${t('trim.newSoundSuffix')}`
      const state = await window.api.saveTrimmedSound(soundboardId, sound.id, wav, asNewSound, newName)
      onSaved(state)
      onClose()
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={t('trim.title', { name: sound.name })} onClose={onClose} wide>
      {loadError && (
        <>
          <p className="error-text">{t('trim.loadError')}</p>
          <div className="modal-footer">
            <button onClick={onClose}>{t('modal.cancel')}</button>
          </div>
        </>
      )}
      {!buffer && !loadError && <p>{t('trim.loading')}</p>}

      {buffer && (
        <>
          <p className="hint">{t('trim.hint')}</p>
          <div
            className="trim-wave"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            ref={waveRef}
          >
            <canvas ref={canvasRef} width={PEAK_BUCKETS} height={WAVE_HEIGHT} />
            <div className="trim-dim" style={{ left: 0, width: `${percent(start)}%` }} />
            <div className="trim-dim" style={{ right: 0, width: `${100 - percent(end)}%` }} />
            <div className="trim-handle" style={{ left: `${percent(start)}%` }} />
            <div className="trim-handle" style={{ left: `${percent(end)}%` }} />
            {playhead !== null && <div className="trim-playhead" style={{ left: `${percent(playhead)}%` }} />}
          </div>

          <div className="trim-controls">
            <label>
              {t('trim.start')}
              <input
                type="text"
                inputMode="decimal"
                value={startText}
                onChange={(e) => setStartText(e.target.value)}
                onBlur={(e) => commitTime('start', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                }}
              />
            </label>
            <label>
              {t('trim.end')}
              <input
                type="text"
                inputMode="decimal"
                value={endText}
                onChange={(e) => setEndText(e.target.value)}
                onBlur={(e) => commitTime('end', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                }}
              />
            </label>
            <button type="button" onClick={playing ? stopPreview : startPreview}>
              {playing ? t('trim.stop') : t('trim.preview')}
            </button>
          </div>

          <p className="hint">
            {t('trim.selection', { length: (end - start).toFixed(2), total: duration.toFixed(2) })}
          </p>
          <p className="hint">{t('trim.replaceHint')}</p>
          {saveError && <p className="error-text">{t('trim.saveError')}</p>}

          <div className="modal-footer">
            <button onClick={onClose}>{t('modal.cancel')}</button>
            <button disabled={saving} onClick={() => save(true)}>
              {t('trim.saveNew')}
            </button>
            <button className="primary" disabled={saving} onClick={() => save(false)}>
              {saving ? t('trim.saving') : t('trim.saveReplace')}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
