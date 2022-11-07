const global = Function('return this')()
if (!('crypto' in global)) {
  await import('node:crypto').then((crypto) => {
    global.crypto = crypto
  })
}


export const algorithm = {
  name: 'AES-GCM',
  // IV can be public, it's not a secret
  iv: new Uint8Array([204, 17, 10, 52, 60, 109, 233, 164, 110, 39, 108, 206, 124, 28, 100, 43]),
  length: 256,
}

export function generateIv() {
  return global.crypto.getRandomValues(new Uint8Array(16))
}

export function fromBase64url(b64) {
  return atob(b64.replace(/-/g, '+').replace(/_/g, '/'))
}

export function toBase64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_')//.replace(/=/g, '')
}

/**
 * @param {String} data
 * @param {*} key
 * @returns {Promise<Blob>}
 */
export async function encryptString(key, data) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const ciphertext = await crypto.subtle.encrypt(algorithm, key, bytes)
  return new Blob([ciphertext])
}
/**
 * @param {Blob} ciphertext
 * @param {*} key
 * @returns {Promise<String>}
 */
export async function decryptString(key, ciphertext) {
  const bytes = await ciphertext.arrayBuffer()
  const out = await crypto.subtle.decrypt(algorithm, key, bytes)
  return new TextDecoder('utf-8').decode(out)
}

export function blobFromBase64(base64) {
  const bytes = fromBase64url(base64)
  const buffer = new ArrayBuffer(bytes.length)
  const intArray = new Uint8Array(buffer)
  for (let i = 0; i < bytes.length; i++) {
    intArray[i] = bytes.charCodeAt(i)
  }
  return new Blob([intArray], { type: 'application/octet-stream' })
}

export async function blobToBase64(blob) {
  // if nodejs, use Buffer
  if (typeof Buffer !== 'undefined') {
    return blob.arrayBuffer().then((buffer) => Buffer.from(buffer).toString('base64'))
  }

  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, _onError) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const s = reader.result
      const b64 = s.substr(s.indexOf(',')+1)
      const b64url = b64.replace(/\+/g, '-').replace(/\//g, '_')//.replace(/=/g, '')
      resolve(b64url)
    }
    reader.readAsDataURL(blob)
  })
}

export async function generateKeyB64() {
  const randomKey = await global.crypto.subtle.generateKey(algorithm, true, ['encrypt', 'decrypt'])
  const keyArrayBuffer = await global.crypto.subtle.exportKey('raw', randomKey)
  const keyString = await blobToBase64(new Blob([keyArrayBuffer]))
  return keyString
}

export async function importKeyFromBase64(keyB64) {
  const keyBlob = blobFromBase64(keyB64)
  const keyBytes = await keyBlob.arrayBuffer()
  return global.crypto.subtle.importKey(
    'raw', keyBytes,'AES-GCM', true, ['encrypt', 'decrypt'])
}

export async function exportKeyToBase64(key) {
  const keyBytes = await global.crypto.subtle.exportKey('raw', key)
  const keyBlob = new Blob([keyBytes])
  return blobToBase64(keyBlob)
}

export function downloadBlob(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }, 25)
  }
}
