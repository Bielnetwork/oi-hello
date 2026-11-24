const standalone = typeof window !== 'undefined' && window.location.protocol === 'file:'

export function currentRoute() {
  return standalone ? window.location.hash.slice(1) : window.location.pathname
}

export function routeHref(path: '/experiencia' | '/oferta') {
  return standalone ? '#' + path : path + (typeof window === 'undefined' ? '' : window.location.search)
}

export function checkoutHref(checkoutUrl: string) {
  const url = new URL(checkoutUrl)
  const tracking = /^(utm_.+|fbclid|gclid|dclid|gbraid|wbraid|msclkid|ttclid|twclid|li_fat_id|sck|src)$/i
  const fixedParams = new Set(url.searchParams.keys())
  for (const [name, value] of new URLSearchParams(window.location.search)) {
    if (tracking.test(name) && !fixedParams.has(name)) url.searchParams.append(name, value)
  }
  return url.href
}
