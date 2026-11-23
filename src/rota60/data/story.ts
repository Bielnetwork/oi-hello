import type { Interaction, Scene } from './scenes'

export type CharacterMood = 'neutral' | 'speaking' | 'positive' | 'questioning'

export interface StoryArt {
  image: string
  positive?: string
  alt: string
  speaker?: string
  cue?: { kind: Interaction['kind']; label: string }
}

const viewpoints: Record<string, StoryArt> = {
  immigration: { image: 'pov-immigration', positive: 'pov-immigration-positive', alt: 'Agente de imigração à sua frente, do outro lado do balcão' },
  baggage: { image: 'pov-baggage', positive: 'pov-baggage-positive', alt: 'Funcionária do aeroporto olha em sua direção na área das esteiras',
    speaker: 'Funcionária do aeroporto', cue: { kind: 'listen', label: 'Esteira 6' },
  },
  transport: { image: 'pov-transport', positive: 'pov-transport-positive', alt: 'O motorista está à sua frente, ao lado do carro violeta' },
  hotel: { image: 'pov-hotel', positive: 'pov-hotel-positive', alt: 'Recepcionista olha em sua direção do outro lado do balcão' },
  restaurant: { image: 'pov-restaurant', positive: 'pov-restaurant-positive', alt: 'O garçom aguarda seu pedido com um bloco de notas na mão' },
}

export const repeatRequest = {
  line: 'Could you repeat that, please?',
  translation: 'Você poderia repetir, por favor?',
}

export type StoryEvent =
  | { type: 'narration'; title: string; text: string }
  | { type: 'character_dialogue' | 'player_choice' | 'character_reaction' | 'learning_feedback'; interaction: Interaction }
  | { type: 'scene_transition'; transition: Scene['transition'] }

export function storyTurn(scene: Scene, turn: number): StoryEvent[] {
  const interaction = scene.interactions[turn]
  if (!interaction) return [{ type: 'scene_transition', transition: scene.transition }]

  const dialogue: StoryEvent[] = [
    { type: 'character_dialogue', interaction },
    { type: 'player_choice', interaction },
    { type: 'character_reaction', interaction },
    { type: 'learning_feedback', interaction },
  ]
  return turn === 0
    ? [{ type: 'narration', title: scene.arrival, text: scene.context }, ...dialogue]
    : dialogue
}

export function storyArt(scene: Scene, transition?: Scene['transition']): StoryArt {
  if (transition) return { image: transition.image ?? scene.image, alt: transition.imageAlt ?? scene.imageAlt }
  return viewpoints[scene.id] ?? { image: scene.image, alt: scene.imageAlt }
}
