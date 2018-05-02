import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

type CreateEditor = (value: string, mode: string) => Promise<CodeMirror.Editor>

export interface CodeMirrorCreator {
  createEditor: CreateEditor
}

export const createEditor: CreateEditor = async (value, mode) => {
  await import(`codemirror/mode/${mode}/${mode}.js`)
  // TODO: tell webpack to only match js files in this path

  // tslint:disable-next-line:no-empty
  return CodeMirror(() => {}, {
    lineNumbers: true,
    lineWrapping: true,
    mode,
    value,
  })
}
