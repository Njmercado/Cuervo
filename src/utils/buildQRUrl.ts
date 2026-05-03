/**
 * Builds a QR code image URL using the qrserver.com API.
 * @param path - Relative path to encode, e.g. `/public/abc123`. The full URL
 *   is composed from `window.location.origin + path`.
 */
export function buildQRUrl(path: string): string {
  const data = `${window.location.origin}${path}`
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200&margin=20&bgcolor=ffffff&format=png&ecc=L`
}
