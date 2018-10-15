import { TextSelection } from 'prosemirror-state'
import React from 'react'
import { componentsKey, INSERT } from '../../editor/config/plugins/components'
import { objectsKey, Target } from '../../editor/config/plugins/objects'
import schema from '../../editor/config/schema/index'
import { ToolbarDropdownProps } from '../../editor/Toolbar'
import { buildAuxiliaryObjectReference } from '../../lib/commands'
// import Title from '../editor/Title'
import { CrossReferenceItems } from './CrossReferenceItems'

class CrossReferencePickerContainer extends React.Component<
  ToolbarDropdownProps
> {
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
    const { state, view } = this.props

    const { selection } = state

    // TODO: is this enough/needed?
    const containingObject = selection.$anchor.parent

    const auxiliaryObjectReference = buildAuxiliaryObjectReference(
      containingObject.attrs.id,
      id
    )

    const crossReferenceNode = schema.nodes.cross_reference.create({
      rid: auxiliaryObjectReference._id,
    })

    const pos = selection.to

    let tr = state.tr
      .setMeta(componentsKey, { [INSERT]: [auxiliaryObjectReference] })
      .insert(pos, crossReferenceNode)

    // restore the selection
    tr = tr.setSelection(
      TextSelection.create(tr.doc, pos + crossReferenceNode.nodeSize)
    )

    view.focus()
    view.dispatch(tr)

    this.props.handleClose()
  }
}

export default CrossReferencePickerContainer
