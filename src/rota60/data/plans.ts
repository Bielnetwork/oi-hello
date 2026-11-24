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
  button: string
  checkoutUrl: string
}

export const plans: readonly Plan[] = [
  {
    id: 'basic', name: 'Básico', price: '14,90', button: 'Quero o Básico',
    checkoutUrl: 'https://pay.wiapy.com/bE5X22BknqCi',
    features: ['60 situações práticas', '120 cards digitais', 'Exercícios interativos', 'Áudio em inglês com velocidade ajustável', 'Guia de Bolso', 'Favoritos e progresso'],
  },
  {
    id: 'complete', name: 'Completo', price: '27,90', button: 'Quero o Rota 60 Completo',
    checkoutUrl: 'https://pay.wiapy.com/pBFz_Yel1mbP',
    features: ['Cards para Imprimir', ...bonuses.map(([name]) => name)],
  },
]
