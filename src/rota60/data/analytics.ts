type Events = {
  experience_started: undefined
  scene_started: { scene: string }
  answer_selected: { scene: string; interaction: number; option: number; correct: boolean }
  scene_completed: { scene: string }
  audio_played: { rate: number }
  audio_speed_changed: { rate: number }
  experience_completed: undefined
  continue_clicked: undefined
  offer_viewed: undefined
  plans_revealed: undefined
  plan_selected: { plan: 'basic' | 'complete' }
}

export function track<K extends keyof Events>(
  name: K,
  ...args: Events[K] extends undefined ? [] : [details: Events[K]]
) {
  const event = { name, details: args[0], timestamp: new Date().toISOString() }
  console.debug('[Rota 60]', event)
  window.dispatchEvent(new CustomEvent('rota60:analytics', { detail: event }))
}
