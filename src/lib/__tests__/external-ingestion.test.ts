/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE.
 */

import {
  extractUrlsFromText,
  fetchRemoteFileWithRecord,
  readManifestUrls,
  SecurityValidationError,
  validateFileExtension,
  validateFileSize,
  validateMimeType,
  validateUrl,
} from '../external-ingestion'

describe('external ingestion', () => {
  it('extracts unique URLs from plain text', () => {
    const text = `Source list:
      https://example.org/a.pdf
      https://example.org/a.pdf
      and https://example.org/b.xml,`

    expect(extractUrlsFromText(text)).toEqual([
      'https://example.org/a.pdf',
      'https://example.org/b.xml',
    ])
  })

  it('reads URLs from a manifest file', async () => {
    const manifest = new File(
      ['url\nhttps://example.org/a.pdf\nhttps://example.org/b.pdf'],
      'manifest.csv',
      { type: 'text/csv' }
    )

    expect(await readManifestUrls(manifest)).toEqual([
      'https://example.org/a.pdf',
      'https://example.org/b.pdf',
    ])
  })

  it('creates file plus custody record from URL response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => new Blob(['hello'], { type: 'text/plain' }),
      headers: {
        get: (name: string) => {
          if (name === 'content-disposition') {
            return 'attachment; filename="evidence.txt"'
          }
          if (name === 'content-length') {
            return '5'
          }
          return null
        },
      },
    })

    const result = await fetchRemoteFileWithRecord(
      'https://example.org/download?id=1',
      mockFetch as unknown as typeof fetch
    )

    expect(result.file.name).toBe('evidence.txt')
    expect(result.record.fileName).toBe('evidence.txt')
    expect(result.record.sourceUrl).toBe('https://example.org/download?id=1')
    expect(result.record.sha256).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    )
    expect(result.record.validatedAt).toBeDefined()
  })

  describe('security validations', () => {
    it('blocks non-HTTPS URLs by default', () => {
      expect(() => validateUrl('http://example.org/file.pdf')).toThrow(
        SecurityValidationError
      )
      expect(() => validateUrl('http://example.org/file.pdf')).toThrow(
        /Protocol http: is not allowed/
      )
    })

    it('blocks localhost URLs', () => {
      expect(() => validateUrl('https://localhost/file.pdf')).toThrow(
        SecurityValidationError
      )
      expect(() => validateUrl('https://127.0.0.1/file.pdf')).toThrow(
        /localhost or private network/
      )
    })

    it('blocks private network addresses', () => {
      expect(() => validateUrl('https://192.168.1.1/file.pdf')).toThrow(
        SecurityValidationError
      )
      expect(() => validateUrl('https://10.0.0.1/file.pdf')).toThrow(
        /private network/
      )
      expect(() => validateUrl('https://172.16.0.1/file.pdf')).toThrow(
        /private network/
      )
    })

    it('allows HTTPS URLs to public domains', () => {
      expect(() => validateUrl('https://example.org/file.pdf')).not.toThrow()
    })

    it('blocks disallowed file extensions', () => {
      expect(() => validateFileExtension('malware.exe')).toThrow(
        SecurityValidationError
      )
      expect(() => validateFileExtension('script.sh')).toThrow(
        /File extension .sh is not allowed/
      )
    })

    it('allows permitted file extensions', () => {
      expect(() => validateFileExtension('document.pdf')).not.toThrow()
      expect(() => validateFileExtension('paper.docx')).not.toThrow()
      expect(() => validateFileExtension('data.csv')).not.toThrow()
    })

    it('blocks files exceeding size limit', () => {
      const largeSize = 101 * 1024 * 1024 // 101 MB
      expect(() => validateFileSize(largeSize)).toThrow(SecurityValidationError)
      expect(() => validateFileSize(largeSize)).toThrow(/exceeds maximum/)
    })

    it('blocks empty files', () => {
      expect(() => validateFileSize(0)).toThrow(SecurityValidationError)
      expect(() => validateFileSize(0)).toThrow(/empty/)
    })

    it('allows files within size limit', () => {
      expect(() => validateFileSize(1024)).not.toThrow()
      expect(() => validateFileSize(50 * 1024 * 1024)).not.toThrow()
    })

    it('blocks disallowed MIME types', () => {
      expect(() => validateMimeType('application/x-executable')).toThrow(
        SecurityValidationError
      )
      expect(() => validateMimeType('application/javascript')).toThrow(
        /MIME type .* is not allowed/
      )
    })

    it('allows permitted MIME types', () => {
      expect(() => validateMimeType('application/pdf')).not.toThrow()
      expect(() =>
        validateMimeType(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ).not.toThrow()
    })
  })

  describe('manifest URL validation', () => {
    it('rejects manifest with blocked URLs', async () => {
      const manifest = new File(
        ['url\nhttp://example.org/a.pdf\nhttps://localhost/b.pdf'],
        'manifest.csv',
        { type: 'text/csv' }
      )

      await expect(readManifestUrls(manifest)).rejects.toThrow(
        SecurityValidationError
      )
    })

    it('accepts manifest with valid URLs', async () => {
      const manifest = new File(
        ['url\nhttps://example.org/a.pdf\nhttps://example.com/b.pdf'],
        'manifest.csv',
        { type: 'text/csv' }
      )

      const urls = await readManifestUrls(manifest)
      expect(urls).toEqual([
        'https://example.org/a.pdf',
        'https://example.com/b.pdf',
      ])
    })
  })
})
