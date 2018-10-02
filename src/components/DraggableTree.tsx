import { Fragment, Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import * as React from 'react'
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceCollector,
  DragSourceSpec,
  DropTarget,
  DropTargetCollector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd'
import { findDOMNode } from 'react-dom'
import { Menu } from '../editor/lib/menu'
import { Selected } from '../editor/lib/utils'
import { withDragDropContext } from '../editor/manuscript/lib/drag-drop'
import { nodeTitle, nodeTitlePlaceholder } from '../transformer/node-title'
import { nodeTypeIcon } from '../transformer/node-type-icons'
import { isElementNode } from '../transformer/node-types'
import {
  Outline,
  OutlineDropPreview,
  OutlineItem,
  OutlineItemArrow,
  OutlineItemIcon,
  OutlineItemLink,
  OutlineItemLinkText,
  OutlineItemNoArrow,
  OutlineItemPlaceholder,
} from './Outline'

export type DropSide = 'before' | 'after' | null

interface DragSourceProps {
  tree: TreeItem
  position: DropSide
}

interface DragObject {
  tree: TreeItem
}

interface ConnectedDragSourceProps {
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview
  isDragging: boolean
  canDrag: boolean
  item: DragSourceProps
}

interface ConnectedDropTargetProps {
  connectDropTarget: ConnectDropTarget
  // isOver: boolean
  isOverCurrent: boolean
  canDrop: boolean
  itemType: string | symbol | null
}

type ConnectedProps = ConnectedDragSourceProps & ConnectedDropTargetProps

export interface TreeItem {
  index: number
  isSelected: boolean
  items: TreeItem[]
  node: ProsemirrorNode
  pos: number
  endPos: number
  parent?: ProsemirrorNode
}

interface Props {
  tree: TreeItem
  view: EditorView
}

interface State {
  open: boolean
  dragPosition: DropSide
}

const excludeTypes = ['table']

interface TreeBuilderOptions {
  node: ProsemirrorNode
  pos: number
  index: number
  selected: Selected | null
  parent?: ProsemirrorNode
}

type TreeBuilder = (options: TreeBuilderOptions) => TreeItem

export const buildTree: TreeBuilder = ({
  node,
  pos,
  index,
  selected,
  parent,
}): TreeItem => {
  const items: TreeItem[] = []

  const startPos = pos + 1 // TODO: don't increment this?
  const endPos = pos + node.nodeSize
  const isSelected = selected ? node.attrs.id === selected.node.attrs.id : false

  node.forEach((childNode, offset, index) => {
    if (
      (!childNode.isAtom || isElementNode(childNode)) &&
      childNode.attrs.id &&
      !excludeTypes.includes(childNode.type.name)
    ) {
      items.push(
        buildTree({
          node: childNode,
          pos: startPos + offset,
          index,
          selected,
          parent: node,
        })
      )
    }
  })

  return { node, index, items, pos, endPos, parent, isSelected }
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
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      isDragging,
      isOverCurrent,
      item,
      view,
    } = this.props

    const { open, dragPosition } = this.state

    const { node, items, isSelected } = tree

    const mightDrop = item && isOverCurrent && canDrop

    return connectDropTarget(
      <div>
        <Outline style={this.outlineStyles(isDragging)}>
          <OutlineDropPreview
            style={this.topPreviewStyles(mightDrop, dragPosition)}
          />

          {connectDragSource(
            <div>
              <OutlineItem
                isSelected={isSelected}
                onContextMenu={this.handleContextMenu}
              >
                {items.length ? (
                  <OutlineItemArrow onClick={this.toggle}>
                    {open ? '▼' : '▶'}
                  </OutlineItemArrow>
                ) : (
                  <OutlineItemNoArrow />
                )}

                <OutlineItemLink to={'#' + node.attrs.id}>
                  {connectDragPreview(
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <OutlineItemIcon>
                        {nodeTypeIcon(node.type.name)}
                      </OutlineItemIcon>
                    </span>
                  )}

                  <OutlineItemLinkText
                    className={`outline-text-${node.type.name}`}
                  >
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
                  view={view}
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

  private itemText = (node: ProsemirrorNode) => {
    const text = nodeTitle(node)

    if (text) {
      return text.trim()
    }

    const placeholder = nodeTitlePlaceholder(node.type.name)

    return <OutlineItemPlaceholder>{placeholder}</OutlineItemPlaceholder>
  }

  private handleContextMenu: React.EventHandler<React.MouseEvent> = event => {
    event.preventDefault()
    event.stopPropagation()

    const menu = this.createMenu()
    menu.showEditMenu(event.currentTarget as HTMLAnchorElement)
  }

  private createMenu = () => {
    const { tree, view } = this.props

    // TODO: getPos?
    return new Menu(tree.node, view, () => tree.pos - 1)
  }
}

const dragType = 'outline'

const dragSourceSpec: DragSourceSpec<Props & ConnectedProps, DragObject> = {
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

const dropTargetSpec: DropTargetSpec<Props & ConnectedProps> = {
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
    const offset = monitor.getClientOffset()

    if (!offset) return

    // get the vertical middle
    const verticalMiddle = (bottom - top) / 2

    // get pixels from the top
    const verticalHover = offset.y - top

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

    const source = item.tree
    const target = props.tree
    const side = item.position

    const insertPos =
      side === 'before' ? target.pos - 1 : target.pos + target.node.nodeSize - 1

    let sourcePos = source.pos - 1

    let tr = props.view.state.tr.insert(insertPos, source.node)

    sourcePos = tr.mapping.map(sourcePos)

    // tr = tr.replaceWith(sourcePos, sourcePos + source.node.nodeSize, [])
    tr = tr.delete(sourcePos, sourcePos + source.node.nodeSize)

    props.view.dispatch(tr)
  },
}

const dragSourceCollector: DragSourceCollector<ConnectedDragSourceProps> = (
  connect,
  monitor
) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
  canDrag: monitor.canDrag(),
  item: monitor.getItem(),
})

const dropTargetCollector: DropTargetCollector<ConnectedDropTargetProps> = (
  connect,
  monitor
) => ({
  connectDropTarget: connect.dropTarget(),
  // isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
})

const dragSource = DragSource<Props, ConnectedDragSourceProps, DragObject>(
  dragType,
  dragSourceSpec,
  dragSourceCollector
)

const dropTarget = DropTarget<Props, ConnectedDropTargetProps>(
  dragType,
  dropTargetSpec,
  dropTargetCollector
)

const DraggableTree = dragSource(dropTarget(Tree))

export default withDragDropContext(DraggableTree)
