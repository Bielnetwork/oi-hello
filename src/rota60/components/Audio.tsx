import { useEffect, useRef, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { track } from '../data/analytics'

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
  const engine = window.speechSynthesis
  const voices = useRef<SpeechSynthesisVoice[]>([])
  const request = useRef(0)
  const timer = useRef<number>(undefined)
  const active = useRef<{ utterance: SpeechSynthesisUtterance; source: string }>(null)
  const [rate, setRate] = useState(readRate)
  const [audio, setAudio] = useState<{ source: string; status: Status }>({ source: '', status: 'idle' })

  function cancel() {
    request.current++
    window.clearTimeout(timer.current)
    active.current = null
    engine?.cancel()
  }

  function stop() {
    cancel()
    setAudio({ source: '', status: 'idle' })
  }

  useEffect(() => {
    if (!engine) return
    const update = () => { voices.current = engine.getVoices() }
    update()
    engine.addEventListener('voiceschanged', update)
    return () => {
      engine.removeEventListener('voiceschanged', update)
      cancel()
    }
  }, [engine])

  function play(text: string, source: string, speed: Rate = rate) {
    cancel()
    const token = request.current
    const update = (status: Status) => {
      if (request.current === token) setAudio({ source, status })
    }
    if (!engine || !window.SpeechSynthesisUtterance) {
      update('unavailable')
      return
    }
    const available = engine.getVoices()
    if (available.length) voices.current = available
    const voice = voices.current.find(item => item.lang.toLowerCase().replace('_', '-') === 'en-us')
      ?? voices.current.find(item => /^en(?:[-_]|$)/i.test(item.lang))
    if (!voice) {
      update('unavailable')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.lang = voice.lang
    utterance.rate = speed
    active.current = { utterance, source }
    const finish = (status: Status) => {
      if (request.current !== token) return
      window.clearTimeout(timer.current)
      active.current = null
      update(status)
    }
    utterance.onstart = () => {
      if (request.current !== token) return
      window.clearTimeout(timer.current)
      update('playing')
      track('audio_played', { rate: speed })
    }
    utterance.onend = () => finish('idle')
    utterance.onerror = () => finish('unavailable')
    update('starting')
    timer.current = window.setTimeout(() => {
      update('unavailable')
      cancel()
    }, 4000)
    try {
      engine.speak(utterance)
    } catch {
      finish('unavailable')
    }
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
    if (current) play(current.utterance.text, current.source, next)
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
