import 'react'

const baseProps = {
  width: '22',
  height: '22',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  xmlns: 'http://www.w3.org/2000/svg',
}

export function FacebookIcon({
  className,
  title = 'Facebook',
  color,
}) {
  return (
    <svg
      {...baseProps}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      style={color ? { color } : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H8.08V12h2.36V9.69c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.45V12h2.58l-.41 2.88h-2.17v6.99A10 10 0 0 0 22 12" />
    </svg>
  )
}

export function InstagramIcon({
  className,
  title = 'Instagram',
  color,
}) {
  return (
    <svg
      {...baseProps}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      style={color ? { color } : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.5 2h-8.5A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5a3.75 3.75 0 0 0 3.75-3.75v-8.5A3.75 3.75 0 0 0 16.25 4Zm-4.25 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-2.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  )
}

export function TikTokIcon({
  className,
  title = 'TikTok',
  color,
}) {
  return (
    <svg
      {...baseProps}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      style={color ? { color } : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M16.6 3c.3 2.4 1.7 3.8 3.9 4v3c-1.5.1-3-.3-4.2-1.1v6.3c0 4.4-4.4 7-8.2 5.2-2.1-1-3.4-3.1-3.2-5.4.2-2.2 1.7-4.1 3.8-4.7.8-.2 1.6-.2 2.4 0v3.2c-.4-.2-.8-.2-1.2-.1-1.2.2-2 1.3-2 2.5 0 1.3.9 2.3 2.2 2.5 1.5.2 2.7-.8 2.7-2.5V3h3.3Z" />
    </svg>
  )
}

export function XIcon({
  className,
  title = 'X',
  color,
}) {
  return (
    <svg
      {...baseProps}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      style={color ? { color } : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M18.9 2H22l-6.78 7.75L23 22h-6.5l-5.09-6.69L5.4 22H2.3l7.26-8.31L1 2h6.66l4.6 6.1L18.9 2Zm-1.14 18h1.8L6.12 3.92H4.2L17.76 20Z" />
    </svg>
  )
}

export function WhatsAppIcon({
  className,
  title = 'WhatsApp',
  color,
}) {
  return (
    <svg
      {...baseProps}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      style={color ? { color } : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M20.52 3.48A11.1 11.1 0 0 0 12 1C6.48 1 2 5.48 2 11c0 1.86.51 3.69 1.48 5.28L2 23l6.84-1.46A10.99 10.99 0 0 0 12 21c5.52 0 10-4.48 10-10 0-2.68-1.05-5.2-2.48-7.52ZM12 19c-1.77 0-3.48-.49-4.96-1.43l-.36-.22-4.2.9.9-4.13-.23-.37A8.93 8.93 0 0 1 3 11c0-4.97 4.03-9 9-9 2.41 0 4.68.94 6.38 2.65A8.97 8.97 0 0 1 21 11c0 4.97-4.03 9-9 9Zm4.52-6.9c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-.99-.36-1.89-1.16-.7-.62-1.17-1.39-1.3-1.62-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.77-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64 1.8.78 2.34.63 2.76.59.42-.04 1.35-.55 1.54-1.08.2-.53.2-1 .14-1.08-.06-.08-.22-.14-.46-.26Z" />
    </svg>
  )
}

