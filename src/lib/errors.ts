import { BulkDocsError } from '../sync/types'

class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class BulkCreateError extends CustomError {
  public failures: BulkDocsError[]

  constructor(failures: BulkDocsError[]) {
    super('')
    Object.setPrototypeOf(this, new.target.prototype)
    this.failures = failures
  }
}
