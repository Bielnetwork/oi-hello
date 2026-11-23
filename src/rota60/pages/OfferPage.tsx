import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, CalendarDays, Check, ClipboardList, Gift, Languages, Plane, Printer, Signpost, Smartphone, Volume2 } from 'lucide-react'
import { Footer, Header } from '../components/Layout'
import { OfferReveal } from '../components/OfferReveal'
import { plans, bonuses } from '../data/plans'
import { track } from '../data/analytics'

import { categories } from '../data/categories'
import { travelImage } from '../data/images'

function PhonePreview() {
  return <div className="preview-phone" aria-hidden="true">
    <div className="phone-camera"/>
    <strong><Plane size={14}/> ROTA 60</strong>
    <img src={travelImage('sightseeing')} alt=""/>
    <div className="phone-phrase"><span>How much is a ticket?</span><Volume2 size={13}/></div>
    <div className="phone-card-detail"><span>Quanto custa um ingresso?</span><b>One ticket, please.</b></div>
    <div className="phone-categories">{categories.slice(-2).map(({ name, icon: Icon }) => <span key={name}><Icon size={12}/> {name}</span>)}</div>
  </div>
}

const printableCards = [
  { image: 'shopping', line: 'Do you have this in a larger size?' },
  { image: 'boarding', line: 'Is this the gate for Orlando?' },
  { image: 'sightseeing', line: 'What time does the tour start?' },
]

function PrintPreview({ hero = false }: { hero?: boolean }) {
  return <div className={hero ? 'hero-cards' : 'print-cards'} aria-hidden="true">
    {printableCards.map(({ image, line }) => <div className="print-card" key={image}>
      <img src={travelImage(image)} alt=""/><strong>{line}</strong>
      <span><Volume2 size={12}/> ROTA 60</span>
    </div>)}
  </div>
}

function ProductPreview() {
  return <div className="product-preview" role="img" aria-label="Miniapp no celular com um card sobre ingressos, ao lado de cards sobre compras, embarque e passeios">
    <PrintPreview hero/>
    <PhonePreview/>
  </div>
}

function ProductContents() {
  return <section className="receive product-contents">
    <h2>Muito além das situações que você acabou de praticar.</h2>
    <div className="stats product-stats">
      <div><strong>60</strong><span>situações</span></div>
      <div><strong>120</strong><span>cards</span></div>
      <div><strong>6</strong><span>categorias</span></div>
    </div>
    <div className="benefits offer-categories">{categories.map(({ name, icon: Icon }) => (
      <article key={name}><span className="stop-icon" aria-hidden="true"><Icon size={22}/></span><h3>{name === 'Passeios e transporte' ? <><span>Passeios</span><span className="category-detail"> e transporte</span></> : name}</h3></article>
    ))}</div>
  </section>
}

function ProductFormats() {
  return <section className="receive offer-formats">
    <h2>Pratique no celular. Leve seus cards na mala.</h2>
    <div className="format-grid">
      <article className="format-panel">
        <h3><Smartphone size={21}/> Miniapp digital</h3>
        <div className="format-visual" role="img" aria-label="Card no celular com pergunta, tradução, exemplo de resposta e botão de áudio"><PhonePreview/></div>
      </article>
      <article className="format-panel">
        <h3><Printer size={21}/> Versão imprimível</h3>
        <div className="format-visual" role="img" aria-label="Três cards ilustrados com exemplos de compras, aeroporto e passeios"><PrintPreview/></div>
      </article>
    </div>
  </section>
}

const bonusIcons = [Signpost, ClipboardList, CalendarDays, Languages]

function ProductBonuses() {
  return <section className="bonus-preview" aria-labelledby="bonus-title">
    <span className="eyebrow"><Gift size={15}/> Exclusivos do Plano Completo</span>
    <h2 id="bonus-title">+4 bônus para sua viagem</h2>
    <ul className="bonus-preview-grid">
      {bonuses.map(([name, description], index) => {
        const Icon = bonusIcons[index] ?? Gift
        return <li key={name}>
          <span className="stop-icon"><Icon size={20}/></span>
          <h3>{name}</h3>
          <p>{description}</p>
        </li>
      })}
    </ul>
  </section>
}

type Plan = (typeof plans)[number]
const featuredFirstPlans = [...plans].sort((a, b) => Number(b.id === 'complete') - Number(a.id === 'complete'))

function OfferPlan({ plan, selected, onSelect }: {
  plan: Plan; selected: boolean; onSelect: () => void
}) {
  const complete = plan.id === 'complete'
  return <article className={'plan ' + (complete ? 'plan-complete' : '')} aria-labelledby={'plan-' + plan.id}>
    <h3 id={'plan-' + plan.id}>Rota 60 {plan.name}</h3>
    <div className="plan-body">
      <p className="price"><span>R$</span> {plan.price}</p>
      {complete && <p className="plan-includes">Inclui tudo do Básico +</p>}
      <ul className="features">
        {plan.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true"/>{feature}</li>)}
      </ul>
      <button className={complete ? 'primary' : 'outline'} aria-pressed={selected} onClick={onSelect}>{plan.button}</button>
    </div>
  </article>
}

function readSelection() {
  try {
    const value = localStorage.getItem('rota60:plan')
    return value === 'basic' || value === 'complete' ? value : undefined
  } catch {
    return undefined
  }
}

export function OfferPage() {
  const [selected, setSelected] = useState(readSelection)
  const selectedPlan = plans.find(plan => plan.id === selected)
  const heading = useRef<HTMLHeadingElement>(null)
  const plansHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    track('offer_viewed')
    window.scrollTo(0, 0)
    heading.current?.focus({ preventScroll: true })
  }, [])

  function selectPlan(plan: Plan) {
    setSelected(plan.id)
    try {
      localStorage.setItem('rota60:plan', plan.id)
    } catch {
      // A seleção continua disponível em memória se o armazenamento estiver bloqueado.
    }
    track('plan_selected', { plan: plan.id })
    if (plan.checkoutUrl) window.location.assign(plan.checkoutUrl)
  }

  return <>
    <Header/>
    <main className="shell offer-page screen-in">
      <section className="offer-hero">
        <div>
          <span className="eyebrow"><Plane size={16}/> Rota 60 — Inglês para Viagem</span>
          <h1 ref={heading} tabIndex={-1}>Você já começou. <em>Agora prepare-se para o resto da viagem.</em></h1>
          <button className="primary offer-hero-cta" onClick={() => {
            const target = plansHeading.current
            target?.focus({ preventScroll: true })
            target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
          }}>Quero ver o Rota 60 Completo</button>
        </div>
        <ProductPreview/>
      </section>
      <ProductContents/>
      <ProductFormats/>
      <ProductBonuses/>
      <OfferReveal heading={plansHeading}>
        <div className="plans-grid" id="plans">{featuredFirstPlans.map(plan => <OfferPlan key={plan.id} plan={plan}
          selected={selected === plan.id} onSelect={() => selectPlan(plan)}/>)}</div>
        {selectedPlan && <p className="selection-feedback" role="status"><Check size={17}/> Plano {selectedPlan.name} selecionado. Esta é uma prévia demonstrativa.</p>}
      </OfferReveal>
      <section className="guarantee">
        <span className="stop-icon"><BadgeCheck size={27}/></span>
        <div><h2>7 dias para conhecer o Rota 60.</h2><p>Explore o material e conheça os recursos. Se não atender às suas expectativas, você poderá solicitar reembolso dentro de 7 dias, conforme as condições da plataforma.</p></div>
      </section>
    </main>
    <Footer/>
  </>
}
