import { resolveProductImageUrl } from './productImageResolver'

export function productImageDataUri({ id, name, width = 320, height = 220 }) {
  const resolved = resolveProductImageUrl({ name, id })
  if (resolved) return resolved

  const safeName = String(name ?? '').slice(0, 26) || 'Product'

  const safeId = String(id ?? '')
  const text = safeName.toUpperCase()

  // Deterministic “random” colors from id/name
  const seedStr = `${safeId}-${text}`
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0

  const hue1 = hash % 360
  const hue2 = (hue1 + 55 + (hash % 40)) % 360
  const hue3 = (hue2 + 35) % 360

  const bg1 = `hsl(${hue1} 45% 35%)`
  const bg2 = `hsl(${hue2} 55% 55%)`
  const bg3 = `hsl(${hue3} 55% 40%)`

  // SVG pattern: soft blobs + product initials
  const initials = text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .slice(0, 2) || 'P'

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="0.55" stop-color="${bg2}"/>
      <stop offset="1" stop-color="${bg3}"/>
    </linearGradient>
    <radialGradient id="r" cx="30%" cy="20%" r="80%">
      <stop offset="0" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="rgba(0,0,0,0.25)"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="url(#g)"/>
  <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="url(#r)" opacity="0.9"/>


  <g opacity="0.35">
    <circle cx="${width * 0.18}" cy="${height * 0.25}" r="${height * 0.28}" fill="rgba(255,255,255,0.35)"/>
    <circle cx="${width * 0.78}" cy="${height * 0.18}" r="${height * 0.22}" fill="rgba(0,0,0,0.15)"/>
    <circle cx="${width * 0.62}" cy="${height * 0.78}" r="${height * 0.34}" fill="rgba(255,255,255,0.2)"/>
  </g>

  <g filter="url(#shadow)">
    <rect x="18" y="${height - 68}" width="${width - 36}" height="50" rx="12" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.28)"/>
  </g>

  <text x="${width / 2}" y="${height - 37}" text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="18" font-weight="800" fill="rgba(255,255,255,0.95)">
    ${text}
  </text>

  <g>
    <text x="${width / 2}" y="${height / 2 + 8}" text-anchor="middle"
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          font-size="56" font-weight="900" fill="rgba(255,255,255,0.92)">
      ${initials}
    </text>
  </g>


</svg>`

  const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')
  return `data:image/svg+xml;charset=UTF-8,${encoded}`
}

