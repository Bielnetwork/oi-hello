import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Check, Plane } from 'lucide-react'
import { offerBenefits } from '../data/offerBenefits'
import { track } from '../data/analytics'

type Phase = 'cards' | 'confirm' | 'leaving' | 'entering' | 'shown'
const allOpen = (1 << offerBenefits.length) - 1

export function OfferReveal({ heading, children }: {
  heading: RefObject<HTMLHeadingElement | null>
  children: ReactNode
}) {
  const [opened, setOpened] = useState(0)
  const [phase, setPhase] = useState<Phase>('cards')
  const section = useRef<HTMLElement>(null)
  const reported = useRef(false)
  const focusPlans = useRef(false)
  const showPlans = phase === 'entering' || phase === 'shown'
  const openedCount = offerBenefits.filter((_, index) => (opened & (1 << index)) !== 0).length

  useEffect(() => {
    if (opened !== allOpen || phase !== 'cards') return
    setPhase(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'shown' : 'confirm')
  }, [opened, phase])

  useEffect(() => {
    const duration = { confirm: 750, leaving: 250, entering: 645 }
    const next = { confirm: 'leaving', leaving: 'entering', entering: 'shown' } as const
    if (phase !== 'confirm' && phase !== 'leaving' && phase !== 'entering') return
    const timer = window.setTimeout(() => setPhase(current => current === phase ? next[phase] : current), duration[phase])
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (!showPlans || reported.current) return
    reported.current = true
    track('plans_revealed')
    const active = document.activeElement
    if (focusPlans.current || active === document.body || section.current?.contains(active)) {
      heading.current?.focus()
    }
  }, [showPlans, heading])

  function reveal(index: number) {
    setOpened(previous => previous | (1 << index))
  }

  return <section ref={section} id="oferta-planos" className={'plans-section offer-reveal reveal-' + phase}>
    <h2 tabIndex={-1} ref={heading}>{showPlans ? 'Escolha como quer continuar sua preparação.' : 'Antes de escolher, descubra o que o Rota 60 oferece.'}</h2>
    {!showPlans && <>
      <p className="section-description">Toque nas três cartas para revelar.</p>
      <div className="reveal-meter" role="status">
        {opened === allOpen ? <><Check size={16}/> Benefícios revelados</> : <>{openedCount} de {offerBenefits.length} revelados</>}
      </div>
      <div className="benefit-deck">
        {offerBenefits.map(({ title, description, icon: Icon }, index) => {
          const isOpen = Boolean(opened & (1 << index))
          const number = String(index + 1).padStart(2, '0')
          return <button type="button" key={number} className="benefit-ticket" aria-expanded={isOpen}
            aria-disabled={isOpen || phase !== 'cards'} aria-controls={'benefit-' + number}
            aria-label={isOpen ? 'Carta ' + number + ', ' + title : 'Revelar carta ' + number}
            aria-describedby={isOpen ? 'benefit-description-' + number : undefined}
            onClick={() => { if (!isOpen && phase === 'cards') reveal(index) }}>
            <span className="ticket-turn">
              <span className="ticket-face ticket-front" aria-hidden="true">
                <span className="ticket-number"><Plane size={14}/> {number}</span>
                <span className="ticket-question">?</span>
                <span className="ticket-invite">Toque para revelar</span>
              </span>
              <span className="ticket-face ticket-back" id={'benefit-' + number} aria-hidden={!isOpen}>
                <Check className="ticket-check" size={16} aria-hidden="true"/>
                <Icon size={24} aria-hidden="true"/>
                <strong>{title}</strong>
                <span id={'benefit-description-' + number}>{description}</span>
              </span>
            </span>
          </button>
        })}
      </div>
      <button type="button" className="quiet reveal-skip" onClick={() => {
        focusPlans.current = true
        setPhase('shown')
      }}>Ver planos diretamente</button>
    </>}
    {showPlans && children}
  </section>
}
