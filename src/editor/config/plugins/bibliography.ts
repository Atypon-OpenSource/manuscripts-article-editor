import isEqual from 'lodash-es/isEqual'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { Citation, CitationItem } from '../../../types/models'
import { EditorProps } from '../../Editor'
import { getChildOfType } from '../../lib/utils'

type NodesWithPositions = Array<[ProsemirrorNode, number]>

interface PluginState {
  citationNodes: NodesWithPositions
  citations: Citeproc.CitationByIndex
}

const needsBibliographySection = (
  hadBibliographySection: boolean,
  hasBibliographySection: boolean,
  oldCitations: Citeproc.CitationByIndex,
  citations: Citeproc.CitationByIndex
) => {
  if (hasBibliographySection) return false // not if already exists
  if (hadBibliographySection) return false // not if being deleted
  if (citations.length === 0) return false //  not if no citations

  return oldCitations.length === 0 // only when creating the first citation
}

const needsUpdate = (
  hadBibliographySection: boolean,
  hasBibliographySection: boolean,
  oldCitations: Citeproc.CitationByIndex,
  citations: Citeproc.CitationByIndex
) =>
  hadBibliographySection !== hasBibliographySection ||
  !isEqual(citations, oldCitations)

const createBibliographySection = (state: EditorState) =>
  state.schema.nodes.bibliography_section.createAndFill(
    {},
    state.schema.nodes.section_title.create(
      {},
      state.schema.text('Bibliography')
    )
  ) as ProsemirrorNode

export default (props: EditorProps) => {
  const {
    getCitationProcessor,
    getModel,
    getLibraryItem,
    getManuscript,
  } = props

  const buildCitationNodes = (state: EditorState): NodesWithPositions => {
    let citationNodes: NodesWithPositions = []

    state.doc.descendants((node, pos) => {
      if (node.type.name === 'citation') {
        citationNodes.push([node, pos])
      }
    })

    // TODO: handle missing objects?
    // https://gitlab.com/mpapp-private/manuscripts-frontend/issues/395
    citationNodes = citationNodes.filter(
      ([node]) =>
        node.attrs.rid &&
        node.attrs.rid !== 'null' &&
        getModel<Citation>(node.attrs.rid)
    )

    return citationNodes
  }

  const buildCitations = (
    citationNodes: NodesWithPositions
  ): Citeproc.CitationByIndex =>
    citationNodes
      .map(([node]) => getModel<Citation>(node.attrs.rid))
      .map((citation: Citation) => ({
        citationID: citation._id,
        citationItems: citation.embeddedCitationItems.map(
          (citationItem: CitationItem) => ({
            id: citationItem.bibliographyItem,
            data: getLibraryItem(citationItem.bibliographyItem), // for comparison
          })
        ),
        properties: { noteIndex: 0 },
        manuscript: getManuscript(), // for comparison
      }))

  return new Plugin({
    state: {
      init(config, instance): PluginState {
        const citationNodes = buildCitationNodes(instance)
        const citations = buildCitations(citationNodes)

        return {
          citationNodes,
          citations,
        }
      },

      apply(tr, value, oldState, newState): PluginState {
        const citationNodes = buildCitationNodes(newState)
        const citations = buildCitations(citationNodes)

        return {
          citationNodes,
          citations,
        }
      },
    },

    appendTransaction(transactions, oldState, newState) {
      // TODO: use setMeta to notify of updates when the doc hasn't changed?
      // if (!transactions.some(transaction => transaction.docChanged)) {
      //   return null
      // }

      const { citations: oldCitations } = (this as Plugin).getState(
        oldState
      ) as PluginState

      const { citationNodes, citations } = (this as Plugin).getState(
        newState
      ) as PluginState

      const hadBibliographySection = getChildOfType(
        oldState.tr.doc,
        'bibliography_section'
      )

      const hasBibliographySection = getChildOfType(
        newState.tr.doc,
        'bibliography_section'
      )

      if (
        !needsUpdate(
          hadBibliographySection,
          hasBibliographySection,
          oldCitations,
          citations
        )
      ) {
        return null
      }

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

      if (
        needsBibliographySection(
          hadBibliographySection,
          hasBibliographySection,
          oldCitations,
          citations
        )
      ) {
        tr = tr.insert(tr.doc.content.size, createBibliographySection(newState))
      }

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

      return tr.setMeta('addToHistory', false)
    },
  })
}
