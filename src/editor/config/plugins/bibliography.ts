import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { Citation, CitationItem } from '../../../types/components'
import { EditorProps } from '../../Editor'
import { getChildOfType } from '../../lib/utils'

type NodesWithPositions = Array<[ProsemirrorNode, number]>

export default (props: EditorProps) => {
  const {
    getCitationProcessor,
    getComponent,
    getLibraryItem,
    getManuscript,
  } = props

  let oldCitationsString: string = '[]'

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
        const [
          bibmeta,
          generatedBibliographyItems,
        ] = bibliography as Citeproc.Bibliography

        if (bibmeta.bibliography_errors.length) {
          console.warn(bibmeta.bibliography_errors) // tslint:disable-line:no-console
        }

        // TODO: remove if no citations?

        if (!getChildOfType(tr.doc, 'bibliography_section')) {
          const section = newState.schema.nodes.bibliography_section.createAndFill(
            {},
            newState.schema.nodes.section_title.create(
              {},
              newState.schema.text('Bibliography')
            ) as ProsemirrorNode
          ) as ProsemirrorNode

          tr = tr.insert(tr.doc.content.size, section)
        }

        tr.doc.descendants((node, pos) => {
          if (node.type.name === 'bibliography_element') {
            const contents = generatedBibliographyItems.length
              ? `<div class="csl-bib-body">${generatedBibliographyItems.join(
                  '\n'
                )}</div>`
              : `<div class="csl-bib-body empty-node" data-placeholder="${
                  node.attrs.placeholder
                }"></div>`

            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              contents,
            })
          }
        })
      }

      console.timeEnd('generate bibliography') // tslint:disable-line:no-console

      return tr.setMeta('addToHistory', false)
    },
  })
}
