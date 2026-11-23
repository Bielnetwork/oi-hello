import { useEffect, useRef, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { track } from '../data/analytics'
import { audioManifest } from '../data/audioManifest'

const speeds = [
  { rate: 0.7, label: 'Muito devagar', display: '0.70x' },
  { rate: 0.85, label: 'Devagar', display: '0.85x' },
  { rate: 1, label: 'Normal', display: '1.00x' },
] as const
type Rate = (typeof speeds)[number]['rate']
type Status = 'idle' | 'starting' | 'playing' | 'unavailable'

function readRate(): Rate {
  try {
    const stored = Number(localStorage.getItem('rota60:audio-rate'))
    return speeds.find(({ rate }) => rate === stored)?.rate ?? 0.85
  } catch {
    return 0.85
  }
}

export function useTravelAudio() {
  const timer = useRef<number>(undefined)
  const active = useRef<HTMLAudioElement>(null)
  const [rate, setRate] = useState(readRate)
  const [audio, setAudio] = useState<{ source: string; status: Status }>({ source: '', status: 'idle' })

  function cancel() {
    window.clearTimeout(timer.current)
    const media = active.current
    active.current = null
    if (!media) return
    media.onplaying = media.onended = media.onerror = null
    media.pause()
    media.removeAttribute('src')
    media.load()
  }

  function stop() {
    cancel()
    setAudio({ source: '', status: 'idle' })
  }

  useEffect(() => cancel, [])

  function play(text: string, source: string) {
    cancel()
    const file = audioManifest[text]
    if (!file) {
      setAudio({ source, status: 'unavailable' })
      return
    }

    const media = new Audio()
    active.current = media
    media.preload = 'none'
    media.defaultPlaybackRate = media.playbackRate = rate
    media.preservesPitch = true
    if ('webkitPreservesPitch' in media) Object.assign(media, { webkitPreservesPitch: true })

    function finish(status: Status) {
      if (active.current !== media) return
      cancel()
      setAudio({ source, status })
    }

    let started = false
    media.onplaying = () => {
      if (active.current !== media || started) return
      started = true
      window.clearTimeout(timer.current)
      setAudio({ source, status: 'playing' })
      track('audio_played', { rate: media.playbackRate })
    }
    media.onended = () => finish('idle')
    media.onerror = () => finish('unavailable')
    setAudio({ source, status: 'starting' })
    timer.current = window.setTimeout(() => finish('unavailable'), 12000)
    media.src = '/audio/experiencia/' + file
    media.play().catch(() => finish('unavailable'))
  }

  function changeRate(next: Rate) {
    if (next === rate) return
    setRate(next)
    try {
      localStorage.setItem('rota60:audio-rate', String(next))
    } catch {
      // O controle continua disponível na sessão atual.
    }
    track('audio_speed_changed', { rate: next })
    const current = active.current
    if (current) current.defaultPlaybackRate = current.playbackRate = next
  }

  return { play, stop, audio, rate, changeRate }
}

export type AudioController = ReturnType<typeof useTravelAudio>

export function AudioSpeed({ controller }: { controller: AudioController }) {
  return <fieldset className="audio-speed">
    <legend>Velocidade do áudio</legend>
    <div>{speeds.map(({ rate, label, display }) => <label key={rate}>
      <input type="radio" name="rota60-audio-speed" checked={controller.rate === rate} onChange={() => controller.changeRate(rate)}/>
      <span>{label} <small>{display}</small></span>
    </label>)}</div>
  </fieldset>
}

export function AudioButton({ text, label, source = label, controller, onPlay }: {
  text: string
  label: string
  source?: string
  onPlay?: () => void
  controller: AudioController
}) {
  const status = controller.audio.source === source ? controller.audio.status : 'idle'
  return <div className="audio-control">
    <button type="button" className="audio-button" onClick={() => { onPlay?.(); controller.play(text, source) }}>
      <Volume2 size={17}/> {label}
    </button>
    <div className="audio-status" role="status">
      {status === 'starting' && 'Preparando áudio…'}
      {status === 'playing' && 'Reproduzindo…'}
      {status === 'unavailable' && 'Áudio indisponível neste navegador. Você pode usar o texto e a tradução.'}
    </div>
  </div>
}
