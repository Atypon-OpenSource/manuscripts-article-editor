import { Fragment, Node as ProsemirrorNode } from 'prosemirror-model'
import * as React from 'react'
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
  DragDropContext,
  DragSource,
  DragSourceCollector,
  DragSourceSpec,
  DropTarget,
  DropTargetCollector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd'
import HTML5DragDropBackend from 'react-dnd-html5-backend'
import { findDOMNode } from 'react-dom'
import { nodeNames } from '../transformer/node-names'
import {
  Outline,
  OutlineDropPreview,
  OutlineItem,
  OutlineItemArrow,
  OutlineItemIcon,
  OutlineItemLink,
  OutlineItemLinkText,
  OutlineItemNoArrow,
} from './Outline'

export type DropSide = 'before' | 'after' | null

interface DragSourceProps {
  tree: TreeItem
  position: DropSide
}

interface ConnectedDragSourceProps {
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview
  isDragging: boolean
  canDrag: boolean
  item: DragSourceProps
}

interface ConnectedDragTargetProps {
  connectDropTarget: ConnectDropTarget
  // isOver: boolean
  isOverCurrent: boolean
  canDrop: boolean
  item: DragSourceProps
}

type ConnectedProps = ConnectedDragSourceProps & ConnectedDragTargetProps

type DropHandler = (
  source: TreeItem,
  target: TreeItem,
  position: DropSide
) => void

export interface DraggableTreeProps {
  doc: ProsemirrorNode | null
  onDrop: DropHandler
}

export interface TreeItem {
  index: number
  items: TreeItem[]
  node: ProsemirrorNode
  pos: number
  endPos: number
  parent?: ProsemirrorNode
}

interface Props {
  tree: TreeItem
  onDrop: DropHandler
}

interface State {
  open: boolean
  dragPosition: DropSide
}

const excludeTypes = ['table']

export const buildTree = (
  node: ProsemirrorNode,
  pos: number,
  index: number,
  parent?: ProsemirrorNode
): TreeItem => {
  const items: TreeItem[] = []

  const startPos = pos + 1
  const endPos = pos + node.nodeSize

  node.forEach((childNode, offset, index) => {
    if (childNode.attrs.id && !excludeTypes.includes(childNode.type.name)) {
      items.push(buildTree(childNode, startPos + offset, index, node))
    }
  })

  return { node, index, items, pos, endPos, parent }
}

class Tree extends React.Component<Props & ConnectedProps, State> {
  public state: State = {
    open: true,
    dragPosition: null,
  }

  public render(): React.ReactNode {
    const {
      tree,
      canDrop,
      onDrop,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      isDragging,
      isOverCurrent,
      item,
    } = this.props

    const { open, dragPosition } = this.state

    const { node, items } = tree

    const mightDrop = item && isOverCurrent && canDrop

    return connectDropTarget(
      <div>
        <Outline style={this.outlineStyles(isDragging)}>
          <OutlineDropPreview
            style={this.topPreviewStyles(mightDrop, dragPosition)}
          />

          {connectDragSource(
            <div>
              <OutlineItem>
                {items.length ? (
                  <OutlineItemArrow onClick={this.toggle}>
                    {open ? '▼' : '▶'}
                  </OutlineItemArrow>
                ) : (
                  <OutlineItemNoArrow />
                )}

                <OutlineItemLink href={'#' + node.attrs.id}>
                  {connectDragPreview(
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <OutlineItemIcon>
                        {this.nodeTypeLetter(node)}
                      </OutlineItemIcon>
                    </span>
                  )}

                  <OutlineItemLinkText>
                    {this.itemText(node)}
                  </OutlineItemLinkText>
                </OutlineItemLink>
              </OutlineItem>
            </div>
          )}

          {items.length ? (
            <div style={{ display: open ? '' : 'none' }}>
              {items.map(tree => (
                <DraggableTree // tslint:disable-line:no-use-before-declare
                  key={tree.node.attrs.id}
                  tree={tree}
                  onDrop={onDrop}
                />
              ))}
            </div>
          ) : null}

          <OutlineDropPreview
            style={this.bottomPreviewStyles(mightDrop, dragPosition)}
          />
        </Outline>
      </div>
    )
  }

  private outlineStyles = (isDragging: boolean): React.CSSProperties => ({
    opacity: isDragging ? 0.5 : 1,
  })

  private bottomPreviewStyles = (
    mightDrop: boolean,
    dragPosition: DropSide
  ): React.CSSProperties => ({
    bottom: '-1px',
    visibility: mightDrop && dragPosition === 'after' ? 'visible' : 'hidden',
  })

  private topPreviewStyles = (
    mightDrop: boolean,
    dragPosition: DropSide
  ): React.CSSProperties => ({
    top: '0px',
    visibility: mightDrop && dragPosition === 'before' ? 'visible' : 'hidden',
  })

  private toggle = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  private chooseItemText = (node: ProsemirrorNode) => {
    switch (node.type.name) {
      case 'manuscript':
        return this.getTextOfNodeType(node, 'title')

      case 'section':
        return this.getTextOfNodeType(node, 'section_title')

      case 'figure':
      case 'table_figure':
        return this.getTextOfNodeType(node, 'figcaption')

      default:
        return node.textContent
    }
  }

  private itemText = (node: ProsemirrorNode) => {
    const text =
      this.chooseItemText(node) || nodeNames.get(node.type.name) || ''

    return text.trim()
  }

  private nodeTypeLetter = (node: ProsemirrorNode) =>
    node.type.name.substr(0, 1).toUpperCase()

  private getTextOfNodeType = (node: ProsemirrorNode, type: string) => {
    let output = null

    node.forEach(node => {
      if (node.type.name === type) {
        output = node.textContent
      }
    })

    return output
  }
}

const dragType = 'outline'

const dragSourceSpec: DragSourceSpec<Props> = {
  // return data about the item that's being dragged, for later use
  beginDrag(props: Props) {
    return {
      tree: props.tree,
    }
  },

  canDrag(props: Props) {
    return !!props.tree.parent
  },
}

const dropTargetSpec: DropTargetSpec<Props> = {
  canDrop(props: Props, monitor: DropTargetMonitor) {
    const item = monitor.getItem() as DragSourceProps

    if (!props.tree.parent) {
      return false
    }

    // can't drop on itself
    if (item.tree.node.attrs.id === props.tree.node.attrs.id) {
      return false
    }

    // can't drop within itself
    if (
      item.tree.pos <= props.tree.pos &&
      item.tree.endPos >= props.tree.endPos
    ) {
      return false
    }

    const index =
      item.position === 'before' ? props.tree.index : props.tree.index + 1

    // TODO: canInsert, leaving the current node in place (needed for subsections after paragraphs, etc)

    return props.tree.parent.canReplace(
      index,
      index,
      Fragment.from(item.tree.node)
    )
  },

  hover(
    props: Props,
    monitor: DropTargetMonitor,
    component: React.Component<Props>
  ) {
    // if (!monitor.canDrop()) return null

    if (!monitor.isOver({ shallow: true })) return

    // get the target DOM node
    const node = findDOMNode(component) as Element

    // get the rectangle on screen
    const { bottom, top } = node.getBoundingClientRect()

    // Determine mouse position
    const { y } = monitor.getClientOffset()

    // get the vertical middle
    const verticalMiddle = (bottom - top) / 2

    // get pixels from the top
    const verticalHover = y - top

    // get the dragged item
    const item = monitor.getItem() as DragSourceProps

    // store the position on the dragged item
    item.position = verticalHover < verticalMiddle ? 'before' : 'after'

    // from https://github.com/react-dnd/react-dnd/issues/179#issuecomment-236226301
    component.setState({
      dragPosition: item.position,
    })
  },

  drop(props: Props, monitor: DropTargetMonitor) {
    if (monitor.didDrop()) return // already dropped on something else

    const item = monitor.getItem() as DragSourceProps

    props.onDrop(item.tree, props.tree, item.position)
  },
}

const dragSourceCollector: DragSourceCollector = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
  canDrag: monitor.canDrag(),
  item: monitor.getItem(),
})

const dropTargetCollector: DropTargetCollector = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  // isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
})

const dragSource = DragSource(dragType, dragSourceSpec, dragSourceCollector)
const dropTarget = DropTarget(dragType, dropTargetSpec, dropTargetCollector)

const DraggableTree = dragSource(dropTarget(Tree))

const dragContext = DragDropContext(HTML5DragDropBackend)

export default dragContext(DraggableTree)
