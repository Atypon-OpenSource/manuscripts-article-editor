import { Node as ProsemirrorNode } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import React from 'react'
import ReactDOM from 'react-dom'
import Select, { Option } from 'react-select'
import { buildName } from '../../../lib/comments'
import PopperManager from '../../lib/popper'
import { GetCollaborators, GetUser } from '../config'
import { MentionSelect } from '../MentionSelect'

const popperManager = new PopperManager()

export const createMentionView = (getUser: GetUser) => (
  node: ProsemirrorNode
): NodeView => {
  const user = getUser(node.attrs.userID)

  const content = '@' + (user ? buildName(user.bibliographicName) : '?')

  const dom = document.createElement('span')
  dom.style.color = '#92c6ed'
  dom.textContent = content

  const profileCard = document.createElement('div')
  profileCard.style.background = 'white'
  profileCard.style.boxShadow = '0 1px 2px #ddd'
  profileCard.style.padding = '16px'
  profileCard.textContent = content // TODO: avatar etc

  return {
    dom,
    deselectNode: () => {
      popperManager.destroy()
    },
    selectNode: () => {
      popperManager.show(dom, profileCard, 'top')
    },
    destroy: () => {
      popperManager.destroy()
    },
  }
}

export const createEditableMentionView = (
  getCollaborators: GetCollaborators
) => (
  node: ProsemirrorNode,
  view: EditorView,
  getPos: () => number
): NodeView => {
  const dom = document.createElement('span')
  dom.style.display = 'inline-flex'
  dom.style.alignItems = 'center'

  const prefix = document.createElement('span')
  prefix.textContent = '@'
  dom.appendChild(prefix)

  const select = document.createElement('span')
  select.style.display = 'inline-block'
  dom.appendChild(select)

  const selectRef = React.createRef<Select>()
  const portal = document.getElementById('menu') as HTMLDivElement

  const handleChange = (userID: string) => {
    view.focus()

    let tr = view.state.tr

    tr = tr.setNodeMarkup(getPos(), undefined, {
      ...node.attrs,
      userID,
    })

    const $anchor = tr.doc.resolve(getPos() + node.nodeSize)

    tr = tr.setSelection(TextSelection.between($anchor, $anchor))

    view.dispatch(tr)
  }

  const updateContents = () => {
    const options: Option[] = getCollaborators().map(item => ({
      value: item.id,
      label: item.name,
    }))

    // TODO: sort options?
    // TODO: use menuRenderer to render in popper

    ReactDOM.render(
      <MentionSelect
        options={options}
        portal={portal}
        selectRef={selectRef}
        selected={node.attrs.userID}
        handleChange={handleChange}
      />,
      select
    )
  }

  updateContents()

  return {
    dom,
    stopEvent: event => {
      return !event.type.startsWith('drag')
    },
    update: (newNode: ProsemirrorNode) => {
      if (newNode.type.name !== node.type.name) return false
      node = newNode
      updateContents()
      return true
    },
    selectNode: () => {
      if (selectRef.current) {
        selectRef.current.focus()
      }
    },
    ignoreMutation: () => true,
  }
}
