import HorizontalEllipsis from '@manuscripts/assets/react/HorizontalEllipsis'
import { Project } from '@manuscripts/manuscripts-json-schema/dist/types'
import React from 'react'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { styled } from '../../theme'
import { IconButton } from '../Button'
import { ModalProps, withModal } from '../ModalProvider'
import { Dropdown, DropdownContainer } from '../nav/Dropdown'
import ProjectContextMenu from './ProjectContextMenu'

const ContextMenuIconButton = styled(IconButton)`
  height: unset;
  width: unset;

  &:focus {
    outline: none;
  }
`

interface State {
  isOpen: boolean
}

interface Props {
  project: Project
}

type CombinedProps = Props & ModelsProps & ModalProps

class ProjectContextMenuButton extends React.Component<CombinedProps, State> {
  public state: State = {
    isOpen: false,
  }

  private nodeRef: React.RefObject<HTMLDivElement> = React.createRef()

  public componentWillUnmount() {
    this.setOpen(false)
  }

  public render() {
    const { isOpen } = this.state
    const { project } = this.props

    return (
      <DropdownContainer
        // @ts-ignore: styled
        ref={this.nodeRef}
      >
        <ContextMenuIconButton onClick={() => this.setOpen(!isOpen)}>
          <HorizontalEllipsis />
        </ContextMenuIconButton>
        {isOpen && (
          <Dropdown>
            <ProjectContextMenu project={project} />
          </Dropdown>
        )}
      </DropdownContainer>
    )
  }

  private setOpen = (isOpen: boolean) => {
    this.setState({ isOpen })
    this.updateListener(isOpen)
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.nodeRef.current &&
      !this.nodeRef.current.contains(event.target as Node)
    ) {
      this.setOpen(false)
    }
  }

  private updateListener = (isOpen: boolean) => {
    if (isOpen) {
      document.addEventListener('mousedown', this.handleClickOutside)
    } else {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
  }
}

export default withModal<Props>(withModels(ProjectContextMenuButton))
