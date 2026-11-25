import type { RefObject } from 'react'
import { Check, X } from 'lucide-react'
import { bonuses, upgradeOffer } from '../data/plans'

export function UpgradeOffer({ dialogRef, onAccept, onDecline }: {
  dialogRef: RefObject<HTMLDialogElement | null>
  onAccept: () => void
  onDecline: () => void
}) {
  return <dialog ref={dialogRef} className="upgrade-offer" aria-labelledby="upgrade-heading">
    <div className="upgrade-content">
      <button type="button" className="quiet upgrade-close" aria-label="Fechar oferta especial"
        onClick={() => dialogRef.current?.close()}><X size={21} aria-hidden="true"/></button>
      <span className="eyebrow">Oferta especial</span>
      <h2 id="upgrade-heading">Leve o Rota 60 Completo por <strong>apenas R$5 a mais!</strong></h2>
      <p>Tenha acesso a tudo do plano Básico, mais:</p>
      <ul className="upgrade-features">
        {['120 cards para imprimir', ...bonuses.map(([name]) => name)].map(name =>
          <li key={name}><Check size={16} aria-hidden="true"/>{name}.</li>,
        )}
      </ul>
      <p className="upgrade-price">De <s>R$27,90</s> por apenas <strong>R${upgradeOffer.price}</strong>.</p>
      <p className="upgrade-terms">Pagamento único • Acesso vitalício • Garantia de 7 dias.</p>
      <div className="upgrade-actions">
        <button type="button" className="primary" onClick={onAccept}>Quero o acesso completo</button>
        <button type="button" className="quiet upgrade-decline" onClick={onDecline}>Não, prefiro continuar com o Básico.</button>
      </div>
    </div>
  </dialog>
}
