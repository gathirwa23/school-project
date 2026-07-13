const IMAGE_FILE_MAP = [
  ['anti dandruff shampoo', 'anti dandruff shampoo.jpg'],
  ['argan oil shampoo', 'argan oil shampoo.jpg'],
  ['sulfate free shampoo', 'sulfate free shampoo.jpg'],
  ['deep conditioning masque', 'deep conditioning masque.jpg'],
  ['keratin conditioner', 'keratin conditioner.jpg'],
  ['hair oil', 'hair oil.jpg'],
  ['olive oil', 'olive oil.jpg'],
  ['conditioner', 'conditioner.jpg'],
  ['shampoo', 'shampoo.jpg'],
  ['treatment', 'treatment.jpg'],
  ['hair food', 'hair food.jpg'],
  ['hair extension glue', 'hair extension glue.webp'],
  ['acrylic liquid monomer', 'acrylic liquid monomer.jpg'],
  ['synthetic braiding hair pack', 'synthetic braiding pack.jpg'],

  ['artificial nail tips', 'artificial nail tips.jpg'],
  ['nail polish', 'nail polish.jpg'],
  ['nail glue', 'nail glue.jpg'],
  ['nail file buffer', 'nail file buffer.jpg'],
  ['setting lotion', 'setting lotion.jpg'],
  ['acrylic powder', 'acrylic powder.jpg'],
  ['cuticle oil', 'cuticle oil.jpg'],
  ['hair relaxer kit', 'hair relaxer.jpg'],
  ['hair dye tube', 'hair dye tube.jpg'],
  ['hair bleach powder', 'hair bleach.jpg'],
  ['hairbleach powder', 'hair bleach.jpg'],
  ['hair bleach', 'hair bleach.jpg'],
  ['hydrogen peroxide developer', 'hydrogen peroxide developer.jpg'],
  ['edge control gel', 'edge control gel.jpg'],
  ['hair serum', 'hair serum.jpg'],
  ['hair spray', 'Hair Spray.jpg'],
  ['gel polish bottle', 'gel polish bottle.jpg'],
  ['body lotion', 'body lotion.jpg'],
  ['facial scrub', 'face scrub.webp'],
  ['facial scrub', 'face scrub.webp'],
  ['setting powder', 'download (20).jpg'],
  ['eyes hagow pallete', 'eye shaddow pallete.jpg'],
  ['eyes haddow pallete', 'eye shaddow pallete.jpg'],
  ['eyes haddow palette', 'eye shaddow pallete.jpg'],
  ['eye shaddow pallete', 'eye shaddow pallete.jpg'],
  ['eye shaddow palette', 'eye shaddow pallete.jpg'],
  ['eyeliner pencil', 'eyeliner pencil.jpg'],
  ['makeup setting spray', 'makeup setting spray.jpg'],
  ['makeup setting spray', 'makeup setting spray.jpg'],
  ['body lotion', 'body lotion.jpg'],
  ['body oil', 'body oil.webp'],
  ['toner', 'toner.jpg'],
  ['moisturizing lotion', 'moisturizing lotion.webp'],
  ['petroleum jelly', 'Petroleum jelly.webp'],
  ['sunscreen', 'Sunscreen.jpg'],
  ['bleaching cream', 'bleaching cream.jpg'],
  ['crochet hair', 'crochet hair.jpg'],
  ['human hair weave', 'human hair weave.jpg'],
  ['human hair wig', 'human hair wig.webp'],
  ['synthetic wig', 'synthetic wig.jpg'],
  ['foundation', 'foundation.jpg'],
  ['concealer', 'concealer.jpg'],
  ['blusher', 'blusher.jpg'],
  ['face wash', 'face wash.webp'],
  ['facial cleanser', 'facial cleanser.jpg'],
  ['face scrub', 'face scrub.webp'],
  ['clay face mask', 'clay face mask.jpg'],
  ['mascara', 'mascara.jpg'],
  ['eye liner', 'eye liner.jpg'],
  ['eye shaddow liner', 'eye shaddow liner.jpg'],
  ['lion', 'download.avif'],
  ['lipstick', 'lipstick.jpg'],
  ['lip gloss', 'lip gloss.jpg'],
]

const GENERIC_IMAGES = [
  'download (1).avif',
  'download (20).jpg',
  'download (4).jpg',
  'download (4).webp',
  'download.avif',
  'download.webp',
  'images (2).jpg',
  'images (3).jpg',
  'images (4).jpg',
  'images (8).jpg',
  'images.jpg',
]


function getImageUrl(fileName) {
  try {
    return new URL(`../assets/images/${fileName}`, import.meta.url).href
  } catch {
    return null
  }
}

function slugify(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeProductName(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?\s*(?:ml|l|g|kg|oz)\b/g, '')
    .replace(/\b(?:ml|l|g|kg|oz)\b/g, '')
    .replace(/[^a-z0-9\s-]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function findKnownImageUrl(rawName, normalizedName) {
  const rawLower = String(rawName ?? '').toLowerCase()
  const normalizedLower = String(normalizedName ?? '').toLowerCase()

  for (const [imageKey, fileName] of IMAGE_FILE_MAP) {
    if (rawLower.includes(imageKey) || normalizedLower.includes(imageKey)) {
      return getImageUrl(fileName)
    }
  }

  return null
}




/**
 * Tries to map a product to a real image in `frontend/src/assets/images`.
 *
 * Supported approaches:
 * 1) Filename includes slugified product name (preferred):
 *    - image: `iphone-cases.jpg`
 *    - product: `iPhone Cases`
 * 2) Optional fallback for known patterns via custom mapping.
 * 3) Falls back to generic images if no specific match found.
 *
 * If no real image is found, caller should render a generated placeholder.
 */
export function resolveProductImageUrl({ name, id }) {
  const rawName = String(name ?? '')
  const normalized = normalizeProductName(rawName)
  const slug = slugify(rawName)
  const normalizedSlug = slugify(normalized)

  const knownUrl = findKnownImageUrl(rawName, normalized)
  if (knownUrl) return knownUrl

  if (slug) {
    const slugFile = `${slug}.jpg`
    const slugUrl = getImageUrl(slugFile)
    if (slugUrl) return slugUrl
  }

  if (normalizedSlug && normalizedSlug !== slug) {
    const normalizedFile = `${normalizedSlug}.jpg`
    const normalizedUrl = getImageUrl(normalizedFile)
    if (normalizedUrl) return normalizedUrl
  }

  const idStr = String(id ?? '').trim()
  if (idStr) {
    const idUrl = getImageUrl(`${idStr}.jpg`)
    if (idUrl) return idUrl
  }

  // Fallback to generic images - use ID to determine which generic image to use
  const idNum = Number(id) || 0
  const genericIndex = idNum % GENERIC_IMAGES.length
  return getImageUrl(GENERIC_IMAGES[genericIndex])
}

