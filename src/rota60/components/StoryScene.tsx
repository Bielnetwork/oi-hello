import type { ElementType, RefObject } from 'react'
import { BadgeCheck, ChevronRight, CircleHelp, Luggage, MapPin, RotateCcw, Volume2 } from 'lucide-react'
import { AudioButton, type AudioController } from './Audio'
import { characterAudio, StoryDialogue } from './StoryDialogue'
import { storyArt, storyTurn, type CharacterMood, type StoryArt } from '../data/story'
import type { Interaction, Scene } from '../data/scenes'
import { travelImage } from '../data/images'

function StoryCharacter({ art, mood, name, location, cue }: {
  art: StoryArt
  mood: CharacterMood
  name?: string | undefined
  location: string
  cue?: string | undefined
}) {
  return <div className="story-camera" data-mood={mood}>
    <div className="story-art">
      <img src={travelImage(art.image)} alt={art.alt} fetchPriority="high"/>
      {art.positive && <img className="story-expression" src={travelImage(art.positive)} alt="" aria-hidden="true"/>}
    </div>
    <div className="story-light" aria-hidden="true"/>
    <div className="story-location"><MapPin size={15}/>{location}</div>
    {cue && <span className="story-cue"><Luggage size={17}/>{cue}</span>}
    {name && mood === 'speaking' && <span className="story-speaking" aria-hidden="true"><Volume2 size={16}/> Falando</span>}
  </div>
}

function StoryChoices({ interaction, muted, onSelect, heading }: {
  interaction: Interaction; muted: boolean; heading: RefObject<HTMLHeadingElement | null>; onSelect: (option: number) => void
}) {
  if (muted) return null
  return <div className="story-choices" role="group" aria-labelledby="story-choice">
    <span className="story-turn-label">Sua vez</span>
    <h2 id="story-choice" tabIndex={-1} ref={heading}>{interaction.prompt}</h2>
    {interaction.blank && <p className="fill-in" lang="en-US">{interaction.blank}</p>}
    <div className="story-options">
      {interaction.options.map((option, index) => <button type="button" className="story-option" key={option}
        lang={interaction.kind === 'listen' ? undefined : 'en-US'} onClick={() => onSelect(index)}>
        <span>{option}</span><ChevronRight size={18} aria-hidden="true"/>
      </button>)}
    </div>
  </div>
}

function CharacterReaction({ interaction, selection, art }: { interaction: Interaction; selection: number; art: StoryArt }) {
  const correct = selection === interaction.correct
  const label = interaction.kind === 'listen' ? 'Você entendeu' : 'Você'
  const line = interaction.options[selection] ?? ''
  return <div className="story-reaction" data-correct={correct}>
    <div className="player-line">
      <span>{label}</span>
      <strong lang={interaction.kind === 'listen' ? undefined : 'en-US'}>
        {interaction.blank ? interaction.blank.replace('____', line) : line}
      </strong>
    </div>
    <span className="story-result">
      <img className="story-reaction-portrait" src={travelImage(correct ? art.positive ?? art.image : art.image)} alt="" aria-hidden="true"/>
      {correct ? <BadgeCheck size={17}/> : <CircleHelp size={17}/>}
      {correct ? 'Resposta adequada' : 'Vamos ajustar a resposta'}
    </span>
  </div>
}

function LearningFeedback({ interaction, correct, controller, onRetry, onNext, feedbackHeading }: {
  interaction: Interaction; correct: boolean; controller: AudioController; onRetry: () => void
  onNext: () => void; feedbackHeading: RefObject<HTMLHeadingElement | null>
}) {
  return <section className="story-learning" aria-labelledby="story-learning-title">
    <h2 tabIndex={-1} ref={feedbackHeading} id="story-learning-title">
      {correct ? interaction.success : 'Essa frase serve para outro momento.'}
    </h2>
    <p>{interaction.explanation}</p>
    <div className="story-expected">
      <div><strong lang="en-US">{interaction.answer}</strong><p>{interaction.answerTranslation}</p></div>
      <AudioButton text={interaction.answer} label={interaction.kind === 'listen' ? 'Repetir fala' : 'Ouvir resposta'} controller={controller}/>
    </div>
    <div className="story-next">
      {!correct && <button className="outline" onClick={onRetry}><RotateCcw size={16}/> Tentar novamente</button>}
      <button className="primary" onClick={onNext}>Continuar <ChevronRight size={18}/></button>
    </div>
  </section>
}

export function StoryScene({ scene, turn, number, total, selected, controller, heading, choiceHeading, feedbackHeading, transitionIcon: Icon,
  onSelect, onRetry, onNext }: {
  scene: Scene; turn: number; number: number; total: number; selected: number | undefined; controller: AudioController
  heading: RefObject<HTMLHeadingElement | null>; choiceHeading: RefObject<HTMLHeadingElement | null>; feedbackHeading: RefObject<HTMLHeadingElement | null>; transitionIcon: ElementType
  onSelect: (value: number) => void; onRetry: () => void; onNext: () => void
}) {
  const events = storyTurn(scene, turn)
  const narration = events.find(event => event.type === 'narration')
  const transition = events.find(event => event.type === 'scene_transition')?.transition
  const interaction = scene.interactions[turn]
  const speaking = controller.audio.source === characterAudio && controller.audio.status === 'playing'
  const answered = selected !== undefined
  const correct = answered && selected === interaction?.correct
  const mood = speaking ? 'speaking' : answered ? (correct ? 'positive' : 'questioning') : 'neutral'
  const art = storyArt(scene, transition)
  const cue = correct && art.cue?.kind === interaction?.kind ? art.cue?.label : undefined

  return <>
    <div className="story-stage" data-scene={scene.id}>
      <StoryCharacter art={art} mood={mood} name={interaction?.speaker} location={scene.title} cue={cue}/>
      {transition
        ? <div className="story-transition">
          <span className="stop-icon"><Icon size={24}/></span>
          <h1 tabIndex={-1} ref={heading}>{transition.title}</h1>
          {transition.text && <p>{transition.text}</p>}
          <button className="primary" onClick={onNext}>{transition.action} <ChevronRight size={18}/></button>
        </div>
        : <div className="story-overlay">
          <div className="story-narration">
            <div className="story-moment"><span>Conversa {number} de {total}</span></div>
            <h1 tabIndex={-1} ref={heading}>{narration?.title ?? scene.title}</h1>
            {narration && <p>{narration.text}</p>}
          </div>
          {events.map(event => event.type === 'character_dialogue'
            ? <StoryDialogue key={event.type} interaction={event.interaction} controller={controller} answered={answered} speakerOverride={art.speaker}/>
            : null)}
        </div>}
    </div>
    <div className="story-continuation">
      {events.map(event => {
        switch (event.type) {
          case 'player_choice':
            return <StoryChoices key={event.type} interaction={event.interaction} muted={answered} heading={choiceHeading} onSelect={onSelect}/>
          case 'character_reaction':
            return selected === undefined ? null : <CharacterReaction key={event.type} interaction={event.interaction} selection={selected} art={art}/>
          case 'learning_feedback':
            return !answered ? null : <LearningFeedback key={event.type} interaction={event.interaction} correct={correct}
              controller={controller} onRetry={onRetry} onNext={onNext} feedbackHeading={feedbackHeading}/>
          default:
            return null
        }
      })}
    </div>
  </>
}
