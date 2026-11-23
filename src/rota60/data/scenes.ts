type ChallengeKind = 'reply' | 'listen' | 'ask' | 'complete'

export interface Interaction {
  kind: ChallengeKind
  speaker: string
  line: string
  translation?: string
  prompt: string
  blank?: string
  options: readonly string[]
  correct: number
  answer: string
  answerTranslation: string
  success: string
  explanation: string
}

export interface Scene {
  id: string
  title: string
  image: string
  imageAlt: string
  arrival: string
  context: string
  interactions: readonly Interaction[]
  transition: { title: string; text?: string; action: string; image?: string; imageAlt?: string }
}

export const scenes: readonly Scene[] = [
  {
    id: 'immigration', title: 'Chegada e imigração', image: 'immigration',
    imageAlt: 'A viajante entrega o passaporte ao agente de imigração',
    arrival: 'Você chegou aos Estados Unidos!',
    context: 'Depois de horas de voo, o agente olha seu passaporte e faz a primeira pergunta.',
    interactions: [
      {
        kind: 'reply', speaker: 'Agente de imigração', line: 'What is the purpose of your visit?',
        translation: 'Qual é o motivo da sua visita?', prompt: 'Você está viajando de férias. O que responderia?',
        options: ["I'm here on vacation.", "I'm staying for ten days.", "I'm staying at a hotel."], correct: 0,
        answer: "I'm here on vacation.", answerTranslation: 'Estou aqui de férias.',
        success: 'Boa! Você explicou o motivo da viagem.',
        explanation: 'As outras frases dizem por quanto tempo você vai ficar ou onde vai se hospedar.',
      },
      {
        kind: 'reply', speaker: 'Agente de imigração', line: 'How long will you be staying?',
        translation: 'Quanto tempo você vai ficar?', prompt: 'Nesta história, sua viagem dura dez dias. Como você responderia?',
        options: ['At a hotel.', 'For ten days.', "I'm from Brazil."], correct: 1,
        answer: 'For ten days.', answerTranslation: 'Por dez dias.',
        success: 'Isso! Você informou a duração da sua estadia.',
        explanation: '“How long” pergunta sobre a duração. “For ten days” responde diretamente.',
      },
    ],
    transition: {
      title: 'Tudo certo! Você terminou essa etapa da simulação.',
      text: 'Na imigração, use respostas verdadeiras e adequadas à sua viagem. Agora, siga para a retirada de bagagens.',
      action: 'Ir buscar minha mala',
    },
  },
  {
    id: 'baggage', title: 'Retirada de bagagens', image: 'baggage',
    imageAlt: 'A viajante encontra sua mala violeta na esteira do aeroporto',
    arrival: 'Você passou pela imigração. Mas onde está sua mala?',
    context: 'O aeroporto é grande. Você avista um funcionário e decide pedir ajuda.',
    interactions: [
      {
        kind: 'ask', speaker: 'Você', line: 'Onde fica a retirada de bagagens?',
        prompt: 'Qual pergunta você faria ao funcionário?',
        options: ['Where is baggage claim?', 'Where is the restaurant?', 'Where is the hotel?'], correct: 0,
        answer: 'Where is baggage claim?', answerTranslation: 'Onde fica a retirada de bagagens?',
        success: 'Isso! O funcionário sabe para onde você quer ir.',
        explanation: 'Nos aeroportos dos EUA, procure por “Baggage Claim” nas placas para chegar às esteiras de bagagem.',
      },
      {
        kind: 'listen', speaker: 'Funcionário do aeroporto', line: 'Your bag is on carousel six.',
        translation: 'Sua mala está na esteira 6.', prompt: 'Ouça ou leia a frase. Qual foi a indicação do funcionário?',
        options: ['Sua mala está na esteira 6.', 'Sua mala está no portão 6.', 'Sua mala está no balcão 6.'], correct: 0,
        answer: 'Your bag is on carousel six.', answerTranslation: 'Sua mala está na esteira 6.',
        success: 'Você encontrou a esteira certa!',
        explanation: 'No aeroporto, “carousel” é a esteira que gira com as bagagens. “Gate” é portão e “counter” é balcão.',
      },
    ],
    transition: { title: 'Mala encontrada! Agora é hora de ir para o hotel.', action: 'Continuar viagem' },
  },
  {
    id: 'transport', title: 'Transporte', image: 'transport',
    imageAlt: 'A viajante conversa com o motorista na área de embarque do aeroporto',
    arrival: 'Você saiu do aeroporto e encontrou seu transporte.',
    context: 'O motorista está ao lado do carro e pergunta qual é o seu destino.',
    interactions: [
      {
        kind: 'reply', speaker: 'Motorista', line: 'Where are you headed?',
        translation: 'Para onde você vai?', prompt: 'Seu destino é um hotel em Orlando. Como responderia?',
        options: ["I'm coming from Brazil.", 'To my hotel in Orlando, please.', 'My flight arrived an hour ago.'], correct: 1,
        answer: 'To my hotel in Orlando, please.', answerTranslation: 'Para o meu hotel em Orlando, por favor.',
        success: 'Isso! O motorista já sabe para onde levar você.',
        explanation: '“Where are you headed?” pergunta o destino. “To” introduz o lugar para onde você vai.',
      },
      {
        kind: 'ask', speaker: 'Você', line: 'Este é o local certo para embarcar?',
        prompt: 'Antes de entrar no carro, confirme se você está na área correta.',
        options: ['Is this the drop-off area?', 'Where can I find a taxi?', 'Is this the right pickup area?'], correct: 2,
        answer: 'Is this the right pickup area?', answerTranslation: 'Este é o local certo para embarcar?',
        success: 'Boa! Você confirmou o ponto de embarque.',
        explanation: '“Pickup” indica onde pegam passageiros. “Drop-off” indica o local de desembarque.',
      },
    ],
    transition: {
      title: 'Você chegou ao hotel! Vamos fazer o check-in.', action: 'Ir para a recepção',
      image: 'hotel-arrival', imageAlt: 'O carro chega à entrada do hotel em Orlando',
    },
  },
  {
    id: 'hotel', title: 'Hotel', image: 'hotel',
    imageAlt: 'A viajante apresenta sua reserva à recepcionista do hotel',
    arrival: 'Depois de uma longa viagem, finalmente chegou a hora de entrar no quarto.',
    context: 'Você vai até o balcão e a recepcionista começa a conversa.',
    interactions: [
      {
        kind: 'reply', speaker: 'Recepcionista', line: 'Do you have a reservation?',
        translation: 'Você tem uma reserva?', prompt: 'Sua reserva está em nome de Silva. O que você diria?',
        options: ["Yes, it's under Silva.", 'Yes, the room is on the second floor.', "Yes, I'm staying for ten days."], correct: 0,
        answer: "Yes, it's under Silva.", answerTranslation: 'Sim, está em nome de Silva.',
        success: 'Muito bem! A recepcionista já pode localizar sua reserva.',
        explanation: 'Em reservas, “it’s under” seguido de um nome significa “está em nome de”.',
      },
      {
        kind: 'complete', speaker: 'Recepcionista', line: 'May I see your passport, please?',
        translation: 'Posso ver seu passaporte, por favor?', prompt: 'Complete a frase para entregar seu passaporte.', blank: 'Of course. Here ____.',
        options: ['it is', 'I am'], correct: 0,
        answer: 'Of course. Here it is.', answerTranslation: 'Claro. Aqui está.',
        success: 'Tudo certo com o seu documento.',
        explanation: 'Use “Here it is” ao entregar ou mostrar algo que a pessoa pediu.',
      },
    ],
    transition: {
      title: 'Check-in concluído! Agora você vai sair para comer.', action: 'Ir ao restaurante',
      image: 'hotel-key', imageAlt: 'A recepcionista entrega o cartão-chave à viajante',
    },
  },
  {
    id: 'restaurant', title: 'Restaurante', image: 'restaurant',
    imageAlt: 'O garçom anota o pedido da viajante em um restaurante',
    arrival: 'Primeira noite nos EUA. Você chegou a um restaurante.',
    context: 'Você abre o cardápio e o garçom se aproxima da sua mesa.',
    interactions: [
      {
        kind: 'reply', speaker: 'Garçom', line: 'Would you like anything to drink?',
        translation: 'Você gostaria de beber alguma coisa?', prompt: 'Você quer pedir água. O que diria?',
        options: ['Water, please.', 'Just the menu, please.'], correct: 0,
        answer: 'Water, please.', answerTranslation: 'Água, por favor.',
        success: 'Perfeito! Seu pedido de água está feito.',
        explanation: '“Water, please” é uma maneira simples e educada de pedir água.',
      },
      {
        kind: 'reply', speaker: 'Garçom', line: 'Are you ready to order?',
        translation: 'Você já pode fazer o pedido?', prompt: 'Você encontrou o prato e aponta para ele no cardápio. O que diria?',
        options: ['Could I have one more minute?', 'Yes, I’d like this, please.', 'Could I have the check, please?'], correct: 1,
        answer: 'Yes, I’d like this, please.', answerTranslation: 'Sim, eu gostaria deste aqui, por favor.',
        success: 'Pedido feito! Agora é só aproveitar a refeição.',
        explanation: 'Use “this” ao apontar para o item no cardápio. “I’d like” é uma forma educada de fazer um pedido.',
      },
    ],
    transition: {
      title: 'Seu primeiro pedido saiu!', action: 'Concluir minha missão',
      image: 'meal', imageAlt: 'A viajante aproveita sua primeira refeição',
    },
  },
]
