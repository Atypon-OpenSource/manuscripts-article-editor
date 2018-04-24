// tslint:disable:max-classes-per-file
import { browserAdaptor } from 'mathjax3/mathjax3/adaptors/browserAdaptor'
import { AbstractMathDocument } from 'mathjax3/mathjax3/core/MathDocument'
import { AbstractMathItem } from 'mathjax3/mathjax3/core/MathItem'
import { TeX } from 'mathjax3/mathjax3/input/tex'
import { CHTML } from 'mathjax3/mathjax3/output/chtml'
import 'mathjax3/mathjax3/util/entities/all'

type Generate = (container: HTMLElement, math: string, display: boolean) => void

export interface Mathjax {
  generate: Generate
}

class GenericMathDocument<N, T, D> extends AbstractMathDocument<N, T, D> {}
class GenericMathItem<N, T, D> extends AbstractMathItem<N, T, D> {}

const InputJax = new TeX({})
const OutputJax = new CHTML({
  fontURL:
    'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-alpha.3/mathjax2/css',
})

const doc = new GenericMathDocument(document, browserAdaptor(), { OutputJax })
document.head.appendChild(OutputJax.styleSheet(doc) as Node)

const typeset = (math: string, display: boolean) => {
  const item = new GenericMathItem(math, InputJax, display)
  item.setMetrics(16, 8, 1000000, 100000, 1)
  item.compile(doc)
  item.typeset(doc)
  return item.typesetRoot
}

export const generate: Generate = (container, math, display) => {
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild as Node)
  }

  if (math) {
    const typesetRoot = typeset(math, display)
    container.appendChild(typesetRoot as Node)
  } else {
    const placeholder = document.createElement('div')
    placeholder.className = 'equation-placeholder'
    placeholder.textContent = '<Equation>'
    container.appendChild(placeholder)
  }
}
