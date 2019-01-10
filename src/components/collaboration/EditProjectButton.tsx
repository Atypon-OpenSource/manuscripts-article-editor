import HorizontalEllipsis from '@manuscripts/assets/react/HorizontalEllipsis'
import { Project } from '@manuscripts/manuscripts-json-schema/dist/types'
import { parse as parseTitle } from '@manuscripts/title-editor'
import { Formik, FormikActions, FormikErrors } from 'formik'
import React from 'react'
import { Manager, Reference } from 'react-popper'
import { manuscriptsBlue } from '../../colors'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { styled } from '../../theme'
import { IconButton } from '../Button'
import { Category, Dialog } from '../Dialog'
import { FormErrors } from '../Form'
import { ProjectRenameMessage } from '../Messages'
import ModalForm from '../ModalForm'
import { Dropdown, DropdownContainer, DropdownElement } from '../nav/Dropdown'
import { RenameProjectForm, Values } from './RenameProjectForm'

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

type CombinedProps = Props & ModelsProps

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

    const title = this.props.project.title

    const initialValues = {
      projectTitle: title,
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
        {renameIsOpen && (
          <ModalForm title={<ProjectRenameMessage />}>
            <Formik
              initialValues={initialValues}
              isInitialValid={true}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={this.handleSubmit}
              component={RenameProjectForm}
            />
          </ModalForm>
        )}
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

  private saveProject = async (project: Project) => {
    await this.props.models.saveModel(project, {
      projectID: project._id,
    })
  }

  private handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikActions<Values | FormErrors>
  ) => {
    setErrors({})

    try {
      await this.saveProject({
        ...this.props.project,
        title: values.projectTitle,
      })
      setSubmitting(false)
      this.setState({
        renameIsOpen: false,
      })
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<FormErrors> = {
        submit: error.response && 'There was an error',
      }

      setErrors(errors)
    }
  }
}

export default withModels(EditProjectButton)
