import { EditorState } from 'prosemirror-state'
import React from 'react'
import { componentsKey, INSERT } from '../editor/config/plugins/components'
import { objectsKey, Target } from '../editor/config/plugins/objects'
import schema from '../editor/config/schema'
import { Dispatch } from '../editor/config/types'
import { buildAuxiliaryObjectReference } from '../lib/commands'
// import Title from '../editor/Title'
import { CrossReferenceItems } from './CrossReferenceItems'

interface Props {
  state: EditorState
  dispatch: Dispatch
  handleClose: () => void
}

class CrossReferencePickerContainer extends React.Component<Props> {
  public render() {
    return (
      <CrossReferenceItems
        handleSelect={this.handleSelect}
        targets={this.getTargets()}
      />
    )
  }

  private getTargets = () => {
    const targets = objectsKey.getState(this.props.state) as Map<string, Target>

    return Array.from(targets.values())
  }

  private handleSelect = (id: string) => {
    const { state, dispatch } = this.props

    // TODO: is this enough/needed?
    const containingObject = state.tr.selection.$anchor.parent

    const auxiliaryObjectReference = buildAuxiliaryObjectReference(
      containingObject.attrs.id,
      id
    )

    const crossReferenceNode = schema.nodes.cross_reference.create({
      rid: auxiliaryObjectReference.id,
    })

    const tr = state.tr
      .setMeta(componentsKey, { [INSERT]: [auxiliaryObjectReference] })
      .insert(state.tr.selection.to, crossReferenceNode)

    // TODO: restore selection

    dispatch(tr)

    this.props.handleClose()
  }
}

export default CrossReferencePickerContainer
