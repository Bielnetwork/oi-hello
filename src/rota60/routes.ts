const standalone = typeof window !== 'undefined' && window.location.protocol === 'file:'

export function currentRoute() {
  return standalone ? window.location.hash.slice(1) : window.location.pathname
}

export function routeHref(path: '/experiencia' | '/oferta') {
  return standalone ? '#' + path : path
}
