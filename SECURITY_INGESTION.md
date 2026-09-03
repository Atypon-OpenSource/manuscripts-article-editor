# Security: External File Ingestion

## Overview

The external file ingestion feature allows importing files from remote URLs or workbooks with comprehensive security validations and chain-of-custody tracking.

## Security Validations

### 1. Protocol Restriction
- **Only HTTPS allowed** by default
- HTTP and other protocols are blocked to prevent man-in-the-middle attacks
- Configurable via `allowedProtocols` option

### 2. Network Protection
All requests to private/internal networks are blocked:
- `localhost` (127.0.0.1, 0.0.0.0)
- Private IPv4 ranges:
  - `10.0.0.0/8`
  - `172.16.0.0/12`
  - `192.168.0.0/16`

This prevents Server-Side Request Forgery (SSRF) attacks against internal infrastructure.

### 3. File Type Restrictions

**Allowed MIME types:**
- `application/pdf`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)
- `application/msword` (DOC)
- `application/xml`, `text/xml`
- `application/x-tex` (LaTeX)
- `text/plain`
- `text/csv`
- `text/tab-separated-values`

**Allowed file extensions:**
- `.pdf`, `.docx`, `.doc`, `.xml`, `.tex`, `.txt`, `.csv`, `.tsv`

Executable files (`.exe`, `.sh`, `.bat`, `.js`, etc.) are explicitly blocked.

### 4. File Size Limits
- **Maximum file size:** 100 MB (configurable)
- Empty files (0 bytes) are rejected
- Size is validated both from `Content-Length` header and actual blob size

## Chain of Custody

Every imported file generates a cryptographically verifiable audit record:

```typescript
{
  sourceUrl: string        // Original download URL
  fileName: string         // Final filename
  mimeType: string         // Validated MIME type
  size: number            // File size in bytes
  sha256: string          // SHA-256 hash of content
  importedAt: string      // ISO 8601 timestamp
  validatedAt: string     // ISO 8601 validation timestamp
}
```

### SHA-256 Verification
- Computed using Web Crypto API (`crypto.subtle.digest`)
- Allows independent verification of file integrity
- Detects tampering or corruption

### Export & Restoration
- Audit trail can be exported as JSON
- Files can be restored from original URLs
- Re-validation occurs on every restore

## Error Handling

Security violations throw `SecurityValidationError` with specific error codes:

- `INVALID_URL` - Malformed URL
- `FORBIDDEN_PROTOCOL` - Non-HTTPS protocol
- `PRIVATE_NETWORK` - Localhost or private IP
- `FORBIDDEN_EXTENSION` - Disallowed file extension
- `FORBIDDEN_MIME_TYPE` - Disallowed content type
- `FILE_TOO_LARGE` - Exceeds size limit
- `EMPTY_FILE` - Zero-byte file

Errors are surfaced in the UI with "Security:" prefix for user awareness.

## Configuration

All validations can be customized via `SecurityValidationOptions`:

```typescript
type SecurityValidationOptions = {
  maxFileSizeBytes?: number           // Default: 100 MB
  allowedMimeTypes?: Set<string>      // Default: academic document types
  allowedExtensions?: Set<string>     // Default: .pdf, .docx, etc.
  allowedProtocols?: Set<string>      // Default: ['https:']
}
```

## Compliance & Peer Review

This implementation supports:
- **Digital forensics** - SHA-256 hashes provide non-repudiation
- **Peer review workflows** - Audit trail documents file provenance
- **Regulatory compliance** - Chain of custody for academic/legal contexts
- **Breach prevention** - Blocks SSRF, arbitrary file execution, and oversized payloads

## Testing

Security validations are covered by 13 dedicated test cases in:
- `src/lib/__tests__/external-ingestion.test.ts`

Run tests: `npm test` or `npx vitest run`
