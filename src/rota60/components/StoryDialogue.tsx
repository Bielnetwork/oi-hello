import { useId, useRef, useState } from 'react'
import { Languages, MessageCircleQuestion, RotateCcw } from 'lucide-react'
import { AudioButton, AudioSpeed, type AudioController } from './Audio'
import { repeatRequest } from '../data/story'
import type { Interaction } from '../data/scenes'

export const characterAudio = 'story-character'

export function StoryDialogue({ interaction, controller, answered, speakerOverride }: {
  interaction: Interaction
  controller: AudioController
  answered: boolean
  speakerOverride?: string | undefined
}) {
  const [translation, setTranslation] = useState<boolean>()
  const [instant, setInstant] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [heard, setHeard] = useState(false)
  const quote = useRef<HTMLButtonElement>(null)
  const translationId = useId()
  const repeatId = useId()
  const { speaker, line } = interaction
  const translated = translation ?? answered
  const speaking = controller.audio.source === characterAudio && controller.audio.status === 'playing'

  function replay() {
    setRepeat(false)
    setInstant(true)
    setHeard(true)
    controller.play(line, characterAudio)
    quote.current?.focus()
  }

  return <div className="story-dialogue">
    <div className="story-bubble" data-speaking={speaking}>
      <p className="story-speaker"><span/>{interaction.translation ? speakerOverride ?? speaker : speaker}</p>
      {interaction.translation
        ? <button ref={quote} className="story-line" type="button" lang="en-US" title="Mostrar fala inteira" onClick={() => setInstant(true)}>
          <span className={instant || speaking ? undefined : 'story-line-reveal'}>{line}</span>
        </button>
        : <p className="story-line">{line}</p>}
      {interaction.translation && <>
        <div className="story-dialogue-actions">
          <AudioButton text={line} label={heard ? 'Ouvir novamente' : 'Ouvir fala'} source={characterAudio} controller={controller}
            onPlay={() => { setHeard(true); setInstant(true) }}/>
          <button type="button" className="quiet story-tool" aria-expanded={translated} aria-controls={translationId}
            onClick={() => setTranslation(!translated)}><Languages size={17}/>{translated ? 'Ocultar tradução' : 'Ver tradução'}</button>
        </div>
        <p className="story-translation" id={translationId} hidden={!translated}>{interaction.translation}</p>
      </>}
    </div>
    <div className="story-audio-tools">
      <AudioSpeed controller={controller}/>
      {interaction.translation && !answered && <button type="button" className="quiet story-repeat-toggle" aria-expanded={repeat} aria-controls={repeatId}
        onClick={() => setRepeat(!repeat)}><MessageCircleQuestion size={18}/> Não entendi. Pode repetir?</button>}
      {interaction.translation && <div id={repeatId} className="story-help" hidden={!repeat || answered}>
        <p className="story-speaker"><span/>Você</p>
        <p lang="en-US"><strong>{repeatRequest.line}</strong></p>
        <p>{repeatRequest.translation}</p>
        <div className="story-dialogue-actions">
          <AudioButton text={repeatRequest.line} label="Ouvir meu pedido" controller={controller}/>
          <button type="button" className="quiet story-tool" onClick={replay}><RotateCcw size={17}/> Repetir a fala do personagem</button>
        </div>
      </div>}
    </div>
  </div>
}
