import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { Citation, CitationItem } from '../../../types/components'
import { EditorProps } from '../../Editor'
import Bibliography = Citeproc.Bibliography

type NodesWithPositions = Array<[ProsemirrorNode, number]>

export default (props: EditorProps) => {
  const {
    getCitationProcessor,
    getComponent,
    getLibraryItem,
    getManuscript,
  } = props

  let oldCitationsString: string = ''

  return new Plugin({
    appendTransaction: (transactions, oldState, newState) => {
      // TODO: use setMeta to notify of updates when the doc hasn't changed?
      // if (!transactions.some(transaction => transaction.docChanged)) {
      //   return null
      // }

      const citationNodes: NodesWithPositions = []

      newState.doc.descendants((node, pos) => {
        if (node.type.name === 'citation') {
          citationNodes.push([node, pos])
        }
      })

      // TODO: https://gitlab.com/mpapp-private/manuscripts-frontend/issues/156
      const citations: Citeproc.CitationByIndex = citationNodes
        .filter(([node]) => node.attrs.rid && node.attrs.rid !== 'null')
        .map(([node]) => {
          const citation = getComponent<Citation>(node.attrs.rid)

          if (!citation) {
            throw new Error('Citation not found: ' + node.attrs.rid)
          }

          return {
            citationID: citation.id,
            citationItems: citation.embeddedCitationItems.map(
              (citationItem: CitationItem) => ({
                id: citationItem.bibliographyItem,
                data: getLibraryItem(citationItem.bibliographyItem), // for comparison
              })
            ),
            properties: { noteIndex: 0 },
            manuscript: getManuscript(), // for comparison
          }
        })

      const newCitationsString = JSON.stringify(citations)

      if (newCitationsString === oldCitationsString) {
        return null
      }

      oldCitationsString = newCitationsString

      console.time('generate bibliography') // tslint:disable-line:no-console

      // TODO: move this into a web worker and/or make it asynchronous?

      const citationProcessor = getCitationProcessor()

      const generatedCitations = citationProcessor
        .rebuildProcessorState(citations)
        .map(item => item[2]) // id, noteIndex, output

      let tr = newState.tr

      citationNodes.forEach(([node, pos], index) => {
        tr = tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          contents: generatedCitations[index],
        })
      })

      // generate the bibliography

      const bibliography = citationProcessor.makeBibliography()

      if (bibliography) {
        // item at index 0 is unused, hence using this syntax.
        const generatedBibliographyItems = (bibliography as Bibliography)[1]

        tr.doc.descendants((node, pos) => {
          if (node.type.name === 'bibliography') {
            const html = generatedBibliographyItems.join('\n')

            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              contents: `<div class="csl-bib-body">${html}</div>`,
            })
          }
        })
      }

      console.timeEnd('generate bibliography') // tslint:disable-line:no-console

      return tr.setMeta('addToHistory', false)
    },
  })
}
