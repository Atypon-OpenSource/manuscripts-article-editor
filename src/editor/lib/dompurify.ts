import purify from 'dompurify'

type Sanitize = (dirty: string) => string

export interface Purify {
  sanitize: Sanitize
}

export const sanitize: Sanitize = dirty => purify.sanitize(dirty) // TODO: options
