import { resolveProductImageUrl } from './productImageResolver'

const KNOWN_PRODUCTS = [
  'conditioner',
  'hair oil',
  'olive oil',
  'shampoo',
  'treatment',
  'anti dandruff shampoo',
  'argan oil shampoo',
  'sulfate free shampoo',
  'deep conditioning masque',
  'keratin conditioner',
  'hair food',
  'hair extension glue',
  'artificial nail tips',
  'nail polish',
  'nail glue',
  'nail buffer',
  'acrylic liquid monomer',
  'lipstick',
  'lip gloss',
  'mascara',
  'eye liner',
  'eye shadow liner',
  'foundation',
  'concealer',
  'blusher',
  'face wash',
  'facial cleanser',
  'face scrub',
  'clay face mask',
  'toner',
  'moisturizing lotion',
  'body oil',
  'petroleum jelly',
  'sunscreen',
  'bleaching cream',
  'crochet hair',
  'human hair weave',
  'human hair wig',
  'synthetic wig',
]

export function getKnownProductImageDebug() {
  return KNOWN_PRODUCTS.map((n, idx) => ({
    product: n,
    url: resolveProductImageUrl({ name: n, id: idx + 1 }),
  }))
}

