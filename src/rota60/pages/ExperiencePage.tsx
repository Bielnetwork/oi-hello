import { useEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'
import { BadgeCheck, Check, ChevronLeft, CircleHelp, KeyRound, Languages, Plane, Utensils, Volume2, X } from 'lucide-react'
import { Header, Footer } from '../components/Layout'
import { AudioButton, AudioSpeed, useTravelAudio, type AudioController } from '../components/Audio'
import { scenes, type Interaction, type Scene } from '../data/scenes'
import { categories } from '../data/categories'
import { travelImage } from '../data/images'
import { track } from '../data/analytics'
import airportSmall from '../assets/airport-420.webp'
import airportMedium from '../assets/airport-720.webp'
import airportLarge from '../assets/airport-1100.webp'
import airportAvifSmall from '../assets/airport-420.avif'
import airportAvifMedium from '../assets/airport-720.avif'
import airportAvifLarge from '../assets/airport-1100.avif'

const embedded = import.meta.env['VITE_ROTA60_EMBEDDED'] === 'true'
const airportSources = `${airportSmall} 420w, ${airportMedium} 720w, ${airportLarge} 1100w`
const airportAvifSources = `${airportAvifSmall} 420w, ${airportAvifMedium} 720w, ${airportAvifLarge} 1100w`
const airportSizes = '(max-width: 650px) calc(100vw - 68px), (max-width: 800px) 45vw, (max-width: 1184px) 42vw, 495px'

const transitionIcons = [BadgeCheck, KeyRound, Utensils]
const count = scenes.reduce((total, scene) => total + scene.interactions.length, 0)

function useScreenFocus() {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo(0, 0)
    heading.current?.focus({ preventScroll: true })
  }, [])
  return heading
}

function Intro({ onStart }: { onStart: () => void }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!embedded) {
    preload(airportAvifMedium, {
      as: 'image', type: 'image/avif', fetchPriority: 'high',
      imageSrcSet: airportAvifSources, imageSizes: airportSizes,
    })
  }
  return <main className="shell intro-page">
    <section className="intro">
      <div className="intro-copy">
        <span className="eyebrow"><Plane size={15}/> Sua primeira missão nos EUA</span>
        <h1>Você acabou de chegar aos EUA. <em>Conseguiria se virar em inglês?</em></h1>
        <button className="primary" disabled={!ready} onClick={onStart}><Plane size={19}/> Começar minha viagem</button>
        <div className="intro-details"><span>Gratuito</span><span>Sem cadastro</span><span><Volume2 size={15}/> Com áudio e tradução</span></div>
      </div>
      <figure className="hero-image">
        <picture>
          {!embedded && <source type="image/avif" srcSet={airportAvifSources} sizes={airportSizes}/>}
          <img src={embedded ? travelImage('airport') : airportMedium}
            srcSet={embedded ? undefined : airportSources} sizes={embedded ? undefined : airportSizes}
            alt="Viajante brasileira com mala em um aeroporto americano" fetchPriority="high"/>
        </picture>
        <figcaption><span className="destination-icon"><Plane size={19}/></span><span><small>DESTINO</small><strong>Estados Unidos</strong></span></figcaption>
      </figure>
    </section>
  </main>
}

const challengeTitles = {
  reply: 'Responda em inglês',
  listen: 'Entenda o que ouviu',
  ask: 'Faça uma pergunta',
  complete: 'Complete a frase',
}

function Dialogue({ interaction, controller }: { interaction: Interaction; controller: AudioController }) {
  const [translated, setTranslated] = useState(false)
  const { speaker, line, translation, kind } = interaction
  return <div className={'conversation ' + (kind === 'ask' ? 'your-conversation' : '')}>
    <p className="speaker">{speaker}</p>
    <div className="dialogue-line">
      <p className="question" lang={translation ? 'en-US' : undefined}>{line}</p>
      {translation && <AudioButton text={line} label="Ouvir fala" controller={controller}/>}
    </div>
    {translation && <>
      <button className="quiet translation-toggle" aria-expanded={translated} aria-controls="translation" onClick={() => setTranslated(!translated)}><Languages size={17}/>{translated ? 'Ocultar tradução' : 'Ver tradução'}</button>
      <p className="translation" id="translation" hidden={!translated}>{translation}</p>
    </>}
    <AudioSpeed controller={controller}/>
  </div>
}

function Challenge({ interaction, selected, controller, onSelect, onNext }: {
  interaction: Interaction
  selected: number | undefined
  controller: AudioController
  onSelect: (value: number) => void
  onNext: () => void
}) {
  const answered = selected !== undefined
  const correct = selected === interaction.correct
  return <>
    <Dialogue interaction={interaction} controller={controller}/>
    <p className="challenge-kind">{challengeTitles[interaction.kind]}</p>
    <h2 className="challenge" id="challenge">{interaction.prompt}</h2>
    {interaction.blank && <p className="fill-in" lang="en-US">{interaction.blank.replace('____', answered ? (interaction.options[interaction.correct] ?? '____') : '____')}</p>}
    <div className={'options ' + (interaction.kind === 'complete' ? 'word-options' : '')} role="group" aria-labelledby="challenge">
      {interaction.options.map((option, index) => {
        const picked = selected === index
        const right = answered && interaction.correct === index
        return <button type="button" key={option} className={'option' + (right ? ' right' : picked ? ' wrong' : '')}
          aria-pressed={picked} aria-disabled={answered} onClick={() => { if (!answered) onSelect(index) }}>
          {interaction.kind !== 'complete' && <span className="option-letter">{String.fromCharCode(65 + index)}</span>}
          <span lang={interaction.kind === 'listen' ? undefined : 'en-US'}>{option}</span>
          {right && <span className="option-mark"><Check size={17}/> Correta</span>}
          {picked && !right && <span className="option-mark"><X size={17}/> Sua escolha</span>}
        </button>
      })}
    </div>
    {answered && <section className={'feedback screen-in ' + (correct ? 'positive' : 'try-again')}>
      <div role="status">
        <h3>{correct ? <BadgeCheck size={20}/> : <CircleHelp size={20}/>} {correct ? interaction.success : 'Vamos ver uma opção melhor'}</h3>
        <p>{interaction.explanation}</p>
        <p><strong lang="en-US">{interaction.answer}</strong> <span className="answer-translation">{interaction.answerTranslation}</span></p>
      </div>
      <AudioButton text={interaction.answer} label={interaction.kind === 'listen' ? 'Repetir fala' : 'Ouvir resposta'} controller={controller}/>
    </section>}
    <button className="primary mission-next" disabled={!answered} onClick={onNext}>Continuar</button>
  </>
}

function Mission({ scene, index, interaction, selected, controller, onSelect, onNext, onBack }: {
  scene: Scene
  index: number
  interaction: number
  selected: number | undefined
  controller: AudioController
  onSelect: (value: number) => void
  onNext: () => void
  onBack: () => void
}) {
  const heading = useScreenFocus()
  const challenge = scene.interactions[interaction]
  const TransitionIcon = transitionIcons[index] ?? BadgeCheck
  const number = scenes.slice(0, index).reduce((total, item) => total + item.interactions.length, 0) + interaction + 1
  const image = challenge ? scene.image : scene.transition.image ?? scene.image
  const alt = challenge ? scene.imageAlt : scene.transition.imageAlt ?? scene.imageAlt
  return <main className="mission-shell screen-in">
    <div className="mission-nav">
      <button className="quiet" onClick={onBack}><ChevronLeft size={18}/> {index || interaction ? 'Voltar uma etapa' : 'Voltar ao início'}</button>
      <strong>Cenário {index + 1} de {scenes.length}</strong>
    </div>
    <div className="progress" role="progressbar" aria-label="Progresso da viagem" aria-valuemin={0} aria-valuemax={scenes.length} aria-valuenow={index + 1}>
      {scenes.map((item, step) => <span key={item.id} className={step === index ? 'filled current' : step < index ? 'filled' : ''}/>)}
    </div>
    <section className="mission-card">
      <img className="scene-image" src={travelImage(image)} alt={alt}/>
      <div className="mission-content">
        {challenge ? <>
          <div className="scene-meta"><span>{scene.title}</span><span>Interação {number} de {count}</span></div>
          <h1 tabIndex={-1} ref={heading}>{interaction === 0 ? scene.arrival : scene.title}</h1>
          <p className="context">{challenge.context ?? scene.context}</p>
          <Challenge interaction={challenge} selected={selected} controller={controller} onSelect={onSelect} onNext={onNext}/>
        </> : <div className="mission-transition">
          <div className="completion-symbol" aria-hidden="true"><TransitionIcon size={33}/></div>
          <h1 tabIndex={-1} ref={heading}>{scene.transition.title}</h1>
          {scene.transition.text && <p className="context">{scene.transition.text}</p>}
          <button className="primary mission-next" onClick={onNext}>{scene.transition.action}</button>
        </div>}
      </div>
    </section>
  </main>
}

function Completion({ onOffer, onReset }: { onOffer: () => void; onReset: () => void }) {
  const heading = useScreenFocus()
  return <main className="mission-shell completion screen-in">
    <div className="completion-symbol"><BadgeCheck size={39}/></div>
    <h1 tabIndex={-1} ref={heading}>Sua viagem está só começando. Continue sua preparação.</h1>
    <img className="completion-image scene-image" src={travelImage('meal')} alt="A viajante aproveita a primeira refeição nos Estados Unidos"/>
    <section className="completion-product">
      <div className="stats">
        <div><strong>60</strong><span>situações</span></div>
        <div><strong>120</strong><span>cards</span></div>
        <div><strong>6</strong><span>categorias</span></div>
      </div>
      <ul className="category-chips">{categories.map(({ name, icon: Icon }) => <li key={name}><Icon size={18}/>{name}</li>)}</ul>
    </section>
    <button className="primary" onClick={onOffer}><Plane size={19}/> Quero continuar minha preparação</button>
    <button className="quiet reset-link" onClick={onReset}>Refazer minha missão</button>
  </main>
}

type Position = { scene: number; interaction: number }

export function ExperiencePage({ onOffer, experienceHref }: { onOffer: () => void; experienceHref?: string | undefined }) {
  const [position, setPosition] = useState<Position>({ scene: -1, interaction: 0 })
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const controller = useTravelAudio()
  const { scene: index, interaction } = position
  const scene = scenes[index]
  const key = scene?.id + ':' + interaction

  function goTo(next: Position) {
    controller.stop()
    setPosition(next)
    const nextScene = scenes[next.scene]
    if (next.scene !== index && nextScene) track('scene_started', { scene: nextScene.id })
  }

  function reset() {
    setAnswers({})
    goTo({ scene: -1, interaction: 0 })
    window.scrollTo(0, 0)
  }

  function next() {
    if (!scene) return
    if (interaction < scene.interactions.length) {
      goTo({ scene: index, interaction: interaction + 1 })
    } else {
      track('scene_completed', { scene: scene.id })
      if (index === scenes.length - 1) track('experience_completed')
      goTo({ scene: index + 1, interaction: 0 })
    }
  }

  function back() {
    if (interaction > 0) goTo({ scene: index, interaction: interaction - 1 })
    else if (index > 0) goTo({ scene: index - 1, interaction: scenes[index - 1]?.interactions.length ?? 0 })
    else reset()
  }

  return <div className="experience-app">
    <Header mission experienceHref={experienceHref} onReset={index >= 0 ? reset : undefined}/>
    {index === -1 && <Intro onStart={() => { track('experience_started'); goTo({ scene: 0, interaction: 0 }) }}/>}
    {scene && <Mission key={key} index={index} scene={scene} interaction={interaction} selected={answers[key]} controller={controller}
      onSelect={option => {
        controller.stop()
        setAnswers(previous => ({ ...previous, [key]: option }))
        track('answer_selected', { scene: scene.id, interaction: interaction + 1, option, correct: option === scene.interactions[interaction]?.correct })
      }} onNext={next} onBack={back}/>}
    {index === scenes.length && <Completion onReset={reset} onOffer={() => { track('continue_clicked'); onOffer() }}/>}
    <Footer/>
  </div>
}
