export const META_PIXEL_ID = '1049905914800024'

type PixelCall = unknown[]
type Pixel = {
  (...args: PixelCall): void
  callMethod?: (...args: PixelCall) => void
  queue: PixelCall[]
  push: Pixel
  loaded: boolean
  version: string
  disablePushState?: boolean
}

type PixelWindow = Window & { fbq?: Pixel; _fbq?: Pixel }
let initialized = false
let lastPath: string | undefined

function getPixel() {
  const browser = window as PixelWindow
  let pixel = browser.fbq

  if (!pixel) {
    const queue = function (...args: PixelCall) {
      if (queue.callMethod) queue.callMethod(...args)
      else queue.queue.push(args)
    } as Pixel
    queue.queue = []
    queue.push = queue
    queue.loaded = true
    queue.version = '2.0'
    queue.disablePushState = true
    browser.fbq = browser._fbq = pixel = queue

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.append(script)
  }

  if (!initialized) {
    initialized = true
    pixel('set', 'autoConfig', false, META_PIXEL_ID)
    pixel('init', META_PIXEL_ID)
  }

  return pixel
}

export function trackMetaPage(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === lastPath) return
  lastPath = path
  if (path !== '/' && path !== '/experiencia' && path !== '/oferta') return

  const pixel = getPixel()
  pixel('trackSingle', META_PIXEL_ID, 'PageView')
  if (path === '/oferta') pixel('trackSingle', META_PIXEL_ID, 'ViewContent')
}

export function trackMetaCheckout(value: number) {
  getPixel()('trackSingle', META_PIXEL_ID, 'InitiateCheckout', { value, currency: 'BRL' })
}
