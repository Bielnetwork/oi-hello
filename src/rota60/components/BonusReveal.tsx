import { useState } from 'react'
import { Gift } from 'lucide-react'
import { bonusCards } from '../data/offerBenefits'

export function BonusReveal() {
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set())

  return <section className="bonus-reveal" aria-labelledby="offer-bonuses">
    <h2 id="offer-bonuses">+4 bônus para sua viagem</h2>
    <p className="bonus-exclusive"><Gift size={16} aria-hidden="true"/> Bônus exclusivos do Plano Completo</p>
    <div className="benefit-deck">
      {bonusCards.map(({ title, description, icon: Icon }, index) => {
        const isOpen = opened.has(title)
        const detailsId = 'bonus-details-' + index
        return <button type="button" key={title} className="benefit-ticket"
          aria-expanded={isOpen} aria-disabled={isOpen} aria-controls={detailsId}
          aria-label={isOpen ? title : 'Revelar bônus ' + (index + 1)}
          aria-describedby={isOpen ? detailsId : undefined}
          onClick={() => setOpened(previous => previous.has(title) ? previous : new Set([...previous, title]))}>
          <span className="ticket-turn">
            <span className="ticket-face ticket-front" aria-hidden="true">
              <span className="ticket-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="ticket-question">?</span>
              <span className="ticket-invite">Toque para revelar</span>
            </span>
            <span className="ticket-face ticket-back" aria-hidden={!isOpen}>
              <span className="ticket-bonus-icon" aria-hidden="true"><Icon size={25}/></span>
              <strong>{title}</strong>
              <span className="ticket-description" id={detailsId}>{description}</span>
            </span>
          </span>
        </button>
      })}
    </div>
  </section>
}
