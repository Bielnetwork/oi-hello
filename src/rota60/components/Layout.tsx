import { Compass, Plane, RotateCcw } from 'lucide-react'
import { routeHref } from '../routes'

export function Header({ onReset, mission = false, experienceHref }: { onReset?: (() => void) | undefined; mission?: boolean; experienceHref?: string | undefined }) {
  return <header className="site-header"><div className="header-inner">
    <a href={experienceHref ?? routeHref('/experiencia')} className="brand" aria-label="Rota 60, início da experiência" onClick={onReset ? event => {
      event.preventDefault()
      onReset()
    } : undefined}>
      <span className="brand-icon"><Plane size={21} strokeWidth={2.2}/></span>
      <span className="brand-copy"><strong>ROTA<span>60</span></strong><small>{mission ? 'Sua primeira missão nos EUA' : 'INGLÊS PARA VIAGEM'}</small></span>
    </a>
    {onReset
      ? <button className="header-action" onClick={onReset}><RotateCcw size={16}/> Reiniciar</button>
      : <span className="header-tag"><Compass size={16}/> Inglês na prática</span>}
  </div></header>
}

export function Footer() {
  return <footer className="site-footer"><span><Plane size={15}/> Rota 60</span><span>Inglês para Viagem</span></footer>
}
