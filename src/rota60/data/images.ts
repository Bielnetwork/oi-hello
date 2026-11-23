export function travelImage(name: string) {
  return import.meta.env['VITE_ROTA60_EMBEDDED'] === 'true'
    ? (window as Window & { rota60Images?: Record<string, string> }).rota60Images?.[name] ?? ''
    : '/images/' + name + '.webp'
}
