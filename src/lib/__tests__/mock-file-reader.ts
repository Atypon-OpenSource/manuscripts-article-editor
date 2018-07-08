import * as fs from 'fs'
import * as path from 'path'

// tslint:disable-next-line:no-any
type LoadCallback = (event: any) => Promise<any>

export class MockFile {
  public type?: string
  constructor(
    readonly path: string,
    readonly lastModified: number = 0,
    type?: string
  ) {
    this.type = type
  }
  get name(): string {
    return path.basename(this.path)
  }
}

// tslint:disable-next-line:max-classes-per-file
export class MockReader {
  protected loadCallback: LoadCallback
  protected error?: Error
  protected result?: string
  protected addEventListener(eventName: string, callback: LoadCallback) {
    this.loadCallback = callback
  }
  protected readAsText(file: MockFile, encoding: string) {
    this.result = fs.readFileSync(file.path, encoding)
    const event = { target: this }
    /* istanbul ignore next */
    this.loadCallback(event).catch((e: Error) => {
      // tslint:disable-next-line:no-console
      fail(`Unexpected error: ${e}`)
    })
  }
}
