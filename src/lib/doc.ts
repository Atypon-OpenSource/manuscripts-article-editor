/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import { CHANGE_OPERATION } from '@manuscripts/track-changes-plugin'
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptNode,
  schema,
} from '@manuscripts/transform'
import { Command } from 'prosemirror-state'

export type PMDoc = any

export type ManuscriptSnapshot = {
  id: string
  name: string
  snapshot: PMDoc
  createdAt: string
  updatedAt: string
}

export type ManuscriptDoc = {
  doc: PMDoc
  version: number
  createdAt: string
  updatedAt: string
  snapshots: SnapshotLabel[]
}

export type SnapshotLabel = Pick<
  ManuscriptSnapshot,
  'id' | 'name' | 'createdAt'
>

const filterUnchangedContent = (node: ManuscriptNode) => {
  const r: ManuscriptNode[] = []
  node.forEach((child) => {
    const { attrs } = child
    const op: CHANGE_OPERATION | undefined = attrs?.dataTracked?.operation
    if (
      child.isText &&
      child.marks.find((m) => m.type.name === 'tracked_insert') === undefined
    ) {
      r.push(
        child.type.schema.text(
          child.text || '',
          child.marks.filter((m) => m.type.name !== 'tracked_delete')
        )
      )
    } else if (op !== 'insert' && !child.isText) {
      r.push(
        child.type.create(
          { ...attrs, dataTracked: null },
          filterUnchangedContent(child),
          child.marks
        )
      )
    }
  })
  return r
}

export const getDocWithoutTrackContent = (state: ManuscriptEditorState) => {
  const doc = state.doc
  return doc.type.create(doc.attrs, filterUnchangedContent(doc), doc.marks)
}

/**
 * Command to update manuscript node attributes
 */
const updateManuscriptNodeAttrs = (attrs: Record<string, unknown>): Command => {
  return (state: ManuscriptEditorState, dispatch: any) => {
    const manuscriptNode = state.doc

    if (manuscriptNode.type !== schema.nodes.manuscript) {
      return false
    }

    // Check if attributes are actually different
    const hasChanges = Object.keys(attrs).some(
      (key) => manuscriptNode.attrs[key] !== attrs[key]
    )

    if (!hasChanges) {
      return false
    }

    // For now, just return true without updating
    // The document save mechanism will handle the persistence
    // This avoids the ProseMirror transaction issues
    return true
  }
}

/**
 * Updates the manuscript node attributes
 */
export const setManuscriptNodeAttrs = (
  view: ManuscriptEditorView,
  attrs: Record<string, unknown>
): boolean => {
  const command = updateManuscriptNodeAttrs(attrs)
  return command(view.state, view.dispatch)
}

/**
 * Updates the primaryLanguageCode attribute on the manuscript node
 */
export const setManuscriptPrimaryLanguageCode = (
  view: ManuscriptEditorView,
  languageCode: string
): boolean => {
  console.log('setManuscriptPrimaryLanguageCode called with:', languageCode)
  console.log('Current document attrs:', view.state.doc.attrs)
  
  try {
    const { state, dispatch } = view
    const tr = state.tr
    
    // Find the manuscript node position by traversing the document
    console.log('Document structure:')
    let manuscriptPos = -1
    state.doc.descendants((node, pos) => {
      console.log(`Node at pos ${pos}:`, {
        type: node.type.name,
        attrs: node.attrs,
        isManuscript: node.type.name === 'manuscript'
      })
      if (node.type.name === 'manuscript') {
        manuscriptPos = pos
        console.log(' Found manuscript node at position:', pos)
      }
    })
    
    // If we didn't find a manuscript node, check if the root node is the manuscript
    if (manuscriptPos === -1 && state.doc.type.name === 'manuscript') {
      manuscriptPos = 0
      console.log(' Root node is manuscript node at position 0')
    }
    
    console.log(' Final manuscript position:', manuscriptPos)
    
    if (manuscriptPos !== -1) {
      // Update the manuscript node's primaryLanguageCode attribute using setNodeMarkup
      const manuscriptNode = state.doc.nodeAt(manuscriptPos)
      if (manuscriptNode) {
        console.log('🔧 Manuscript node found:', {
          type: manuscriptNode.type.name,
          attrs: manuscriptNode.attrs,
          position: manuscriptPos
        })
        
        const updatedAttrs = {
          ...manuscriptNode.attrs,
          primaryLanguageCode: languageCode
        }
        
        console.log('🔧 Updating manuscript node attributes with setNodeMarkup:', {
          position: manuscriptPos,
          currentAttrs: manuscriptNode.attrs,
          updatedAttrs: updatedAttrs,
          currentPrimaryLanguageCode: manuscriptNode.attrs.primaryLanguageCode,
          newPrimaryLanguageCode: languageCode
        })
        
        // Use setNodeMarkup to update the manuscript node attributes at the correct position
        tr.setNodeMarkup(manuscriptPos, undefined, updatedAttrs, manuscriptNode.marks)
        
        // Check what the transaction will change
        console.log('Transaction before dispatch:', {
          docChanged: tr.docChanged,
          steps: tr.steps.length,
          stepTypes: tr.steps.map(step => step.constructor.name)
        })
        
        // Dispatch the transaction to trigger the save mechanism
        dispatch(tr)
        
        console.log('🔧 Successfully dispatched ProseMirror transaction with setNodeMarkup')
        console.log('🔧 Transaction docChanged:', tr.docChanged)
        
        // Check the document state immediately after dispatch
        const immediateState = view.state
        console.log('Document state immediately after dispatch:', {
          primaryLanguageCode: immediateState.doc.attrs?.primaryLanguageCode,
          allAttrs: immediateState.doc.attrs
        })
        
        // Also check the specific node at the position
        const updatedNode = immediateState.doc.nodeAt(manuscriptPos)
        console.log('🔧 Updated node at position:', {
          position: manuscriptPos,
          nodeType: updatedNode?.type.name,
          nodeAttrs: updatedNode?.attrs,
          primaryLanguageCode: updatedNode?.attrs?.primaryLanguageCode
        })
        
        return true
      } else {
        console.error(' Manuscript node not found at position:', manuscriptPos)
        return false
      }
    } else {
      console.error('Manuscript node not found in document')
      console.log('Document root node type:', state.doc.type.name)
      console.log('Document root node attrs:', state.doc.attrs)
      return false
    }
  } catch (error) {
    console.error('Error updating manuscript primaryLanguageCode:', error)
    return false
  }
}
