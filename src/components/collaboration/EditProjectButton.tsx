import HorizontalEllipsis from '@manuscripts/assets/react/HorizontalEllipsis'
import { Project } from '@manuscripts/manuscripts-json-schema/dist/types'
import { parse as parseTitle } from '@manuscripts/title-editor'
import React from 'react'
import { Manager, Reference } from 'react-popper'
import { manuscriptsBlue } from '../../colors'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { styled } from '../../theme'
import { IconButton } from '../Button'
import { Category, Dialog } from '../Dialog'
import { ModalProps, withModal } from '../ModalProvider'
import { Dropdown, DropdownContainer, DropdownElement } from '../nav/Dropdown'
import RenameProject from '../projects/RenameProject'

const EditIconButton = styled(IconButton)`
  height: 28px;
  width: 28px;

  &:focus {
    outline: none;
  }
`

interface State {
  isOpen: boolean
  confirmDeleteIsOpen: boolean
  renameIsOpen: boolean
}

interface Props {
  project: Project
}

type CombinedProps = Props & ModelsProps & ModalProps

class EditProjectButton extends React.Component<CombinedProps, State> {
  public state: State = {
    isOpen: false,
    confirmDeleteIsOpen: false,
    renameIsOpen: false,
  }

  private node: Node

  public componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false)
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false)
  }

  public render() {
    const { isOpen, confirmDeleteIsOpen, renameIsOpen } = this.state

    const actions = {
      primary: {
        action: () =>
          this.setState({
            confirmDeleteIsOpen: false,
          }),
        title: 'Cancel',
      },
      secondary: {
        action: () => this.props.models.deleteModel(this.props.project._id),
        title: 'Delete',
        isDestructive: true,
      },
    }

    const confirmDeleteProjectMessage = (title: string) => {
      const node = parseTitle(title)
      return `Are you sure you wish to delete the project with title "${
        node.textContent
      }"?`
    }

    const message = this.props.project.title
      ? confirmDeleteProjectMessage(this.props.project.title)
      : 'Are you sure you wish to delete this untitled project?'

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <EditIconButton
              // @ts-ignore: styled
              ref={ref}
              onClick={this.openDropdown}
            >
              <HorizontalEllipsis color={manuscriptsBlue} />
            </EditIconButton>
          )}
        </Reference>
        {isOpen && (
          <DropdownContainer
            // @ts-ignore: styled
            ref={this.nodeRef}
          >
            <Dropdown style={{ right: 0, left: 'auto' }}>
              <div ref={(node: HTMLDivElement) => (this.node = node)}>
                <DropdownElement
                  onClick={() =>
                    this.setState({
                      renameIsOpen: true,
                    })
                  }
                  style={{ width: 140 }}
                >
                  Rename project
                </DropdownElement>
                <DropdownElement
                  onClick={() =>
                    this.setState({
                      confirmDeleteIsOpen: true,
                    })
                  }
                  style={{ width: 140 }}
                >
                  Delete project
                </DropdownElement>
              </div>
            </Dropdown>
          </DropdownContainer>
        )}
        {confirmDeleteIsOpen && (
          <Dialog
            isOpen={confirmDeleteIsOpen}
            actions={actions}
            category={Category.confirmation}
            header={'Delete project'}
            message={message}
          />
        )}
        {renameIsOpen &&
          this.props.addModal('rename-project', ({ handleClose }) => (
            <RenameProject
              project={this.props.project}
              handleComplete={() => {
                handleClose()
                this.setState({
                  renameIsOpen: false,
                })
              }}
            />
          ))}
      </Manager>
    )
  }

  private openDropdown = () => {
    this.setState({
      isOpen: true,
    })
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (this.node && !this.node.contains(event.target as Node)) {
      this.setState({
        isOpen: false,
      })
    }
  }
}

export default withModal<Props>(withModels(EditProjectButton))
