/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE.
 */

const urlPattern = /https?:\/\/[^\s"'<>]+/gi

const contentDispositionFileNamePattern =
  /filename\*?=(?:UTF-8''|")?([^";\r\n]+)/i

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/xml',
  'text/xml',
  'application/x-tex',
  'text/plain',
  'text/csv',
  'text/tab-separated-values',
])

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.doc',
  '.xml',
  '.tex',
  '.txt',
  '.csv',
  '.tsv',
])

export type SecurityValidationOptions = {
  maxFileSizeBytes?: number
  allowedMimeTypes?: Set<string>
  allowedExtensions?: Set<string>
  allowedProtocols?: Set<string>
}

export class SecurityValidationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'SecurityValidationError'
  }
}

export const validateUrl = (
  url: string,
  options: SecurityValidationOptions = {}
): void => {
  const { allowedProtocols = new Set(['https:']) } = options

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch (error) {
    throw new SecurityValidationError(
      `Invalid URL format: ${url}`,
      'INVALID_URL'
    )
  }

  if (!allowedProtocols.has(parsedUrl.protocol)) {
    throw new SecurityValidationError(
      `Protocol ${parsedUrl.protocol} is not allowed. Only HTTPS is permitted for security.`,
      'FORBIDDEN_PROTOCOL'
    )
  }

  const hostname = parsedUrl.hostname.toLowerCase()
  
  // Block localhost and internal network ranges
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)
  ) {
    throw new SecurityValidationError(
      'URLs to localhost or private network addresses are not allowed',
      'PRIVATE_NETWORK'
    )
  }
}

export const extractUrlsFromText = (text: string): string[] => {
  if (!text) {
    return []
  }

  const matches = text.match(urlPattern)
  if (!matches) {
    return []
  }

  const uniqueUrls = new Set(
    matches
      .map((url) => url.trim())
      .map((url) => url.replace(/[),.;]+$/, ''))
      .filter(Boolean)
  )

  return Array.from(uniqueUrls)
}

export const getFilenameFromUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url)
    const segments = parsedUrl.pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    const decoded = decodeURIComponent(lastSegment || '')
    if (decoded) {
      return decoded
    }
  } catch (error) {
    // no-op; fallback below
  }
  return 'remote-file'
}

const getFilenameFromContentDisposition = (
  contentDisposition: string | null
): string | undefined => {
  if (!contentDisposition) {
    return
  }

  const match = contentDisposition.match(contentDispositionFileNamePattern)
  if (!match?.[1]) {
    return
  }

  return decodeURIComponent(match[1].replace(/^"|"$/g, ''))
}

export const validateFileExtension = (
  fileName: string,
  options: SecurityValidationOptions = {}
): void => {
  const { allowedExtensions = ALLOWED_EXTENSIONS } = options
  const extension = fileName.toLowerCase().match(/\.[^.]+$/)?.[0]

  if (!extension || !allowedExtensions.has(extension)) {
    throw new SecurityValidationError(
      `File extension ${extension || 'unknown'} is not allowed. Permitted: ${Array.from(allowedExtensions).join(', ')}`,
      'FORBIDDEN_EXTENSION'
    )
  }
}

export const validateFileSize = (
  sizeBytes: number,
  options: SecurityValidationOptions = {}
): void => {
  const { maxFileSizeBytes = MAX_FILE_SIZE_BYTES } = options

  if (sizeBytes > maxFileSizeBytes) {
    throw new SecurityValidationError(
      `File size ${sizeBytes} bytes exceeds maximum allowed size of ${maxFileSizeBytes} bytes (${Math.round(maxFileSizeBytes / 1024 / 1024)} MB)`,
      'FILE_TOO_LARGE'
    )
  }

  if (sizeBytes === 0) {
    throw new SecurityValidationError(
      'File is empty (0 bytes)',
      'EMPTY_FILE'
    )
  }
}

export const validateMimeType = (
  mimeType: string,
  options: SecurityValidationOptions = {}
): void => {
  const { allowedMimeTypes = ALLOWED_MIME_TYPES } = options

  if (!allowedMimeTypes.has(mimeType)) {
    throw new SecurityValidationError(
      `MIME type ${mimeType} is not allowed. Permitted types: ${Array.from(allowedMimeTypes).join(', ')}`,
      'FORBIDDEN_MIME_TYPE'
    )
  }
}

export const fetchRemoteFile = async (
  url: string,
  fetchImpl: typeof fetch = fetch,
  options: SecurityValidationOptions = {}
): Promise<File> => {
  validateUrl(url, options)

  const response = await fetchImpl(url)
  if (!response.ok) {
    throw new Error(`Could not download URL (${response.status})`)
  }

  const contentLength = response.headers.get('content-length')
  if (contentLength) {
    validateFileSize(parseInt(contentLength, 10), options)
  }

  const blob = await response.blob()
  validateFileSize(blob.size, options)

  const contentDisposition = response.headers.get('content-disposition')
  const fileName =
    getFilenameFromContentDisposition(contentDisposition) || getFilenameFromUrl(url)
  
  validateFileExtension(fileName, options)

  const mimeType = blob.type || 'application/octet-stream'
  validateMimeType(mimeType, options)

  return new File([blob], fileName, { type: mimeType })
}

export const readManifestUrls = async (
  file: File,
  options: SecurityValidationOptions = {}
): Promise<string[]> => {
  const text = await file.text()
  const urls = extractUrlsFromText(text)
  
  // Validate all URLs before returning
  for (const url of urls) {
    validateUrl(url, options)
  }
  
  return urls
}

const byteToHex = (byte: number): string => byte.toString(16).padStart(2, '0')

export const getSha256 = async (blob: Blob): Promise<string> => {
  const buffer = await blob.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest)).map(byteToHex).join('')
}

export type IngestionRecord = {
  sourceUrl: string
  fileName: string
  mimeType: string
  size: number
  sha256: string
  importedAt: string
  validatedAt: string
}

export const fetchRemoteFileWithRecord = async (
  url: string,
  fetchImpl: typeof fetch = fetch,
  options: SecurityValidationOptions = {}
): Promise<{ file: File; record: IngestionRecord }> => {
  const validatedAt = new Date().toISOString()
  const file = await fetchRemoteFile(url, fetchImpl, options)
  const sha256 = await getSha256(file)
  return {
    file,
    record: {
      sourceUrl: url,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      sha256,
      importedAt: new Date().toISOString(),
      validatedAt,
    },
  }
}
