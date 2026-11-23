export const bonuses = [
  ['Decifrando os EUA', 'Entenda placas e avisos dos EUA.'],
  ['Minhas Respostas de Viagem', 'Prepare suas respostas para a viagem.'],
  ['Missão Embarque — 7 Dias', 'Organize a semana antes do embarque.'],
  ['Tradutor de Emergência Offline', 'Configure a tradução offline em apps compatíveis.'],
] as const

interface Plan {
  id: 'basic' | 'complete'
  name: string
  price: string
  features: string[]
  extras?: string[]
  button: string
  checkoutUrl?: string
}

export const plans: readonly Plan[] = [
  {
    id: 'basic', name: 'Básico', price: '14,90', button: 'Quero o Básico',
    features: ['120 cards digitais', '60 situações de viagem', 'Seis categorias', 'Perguntas e respostas em inglês', 'Tradução em português', 'Áudio ajustável', 'Acesso pelo celular'],
    extras: ['Versão para impressão', 'Quatro bônus exclusivos'],
  },
  {
    id: 'complete', name: 'Completo', price: '27,90', button: 'Quero o Rota 60 Completo',
    features: ['Tudo do Plano Básico', 'Versão dos 120 cards para impressão'],
  },
]
