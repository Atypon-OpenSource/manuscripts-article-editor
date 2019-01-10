import { Project } from '@manuscripts/manuscripts-json-schema/dist/types'
import { Formik, FormikActions, FormikErrors } from 'formik'
import React from 'react'
import Close from '../../icons/close'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { styled, ThemedProps } from '../../theme'
import { RenameProjectForm, Values } from '../collaboration/RenameProjectForm'
import { FormErrors } from '../Form'
import { ProjectRenameMessage } from '../Messages'
import { CloseButton } from '../SimpleModal'

interface Props {
  project: Project
  handleComplete: () => void
}
type ThemedDivProps = ThemedProps<HTMLDivElement>

type CombinedProps = Props & ModelsProps

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  width: 480px;
  max-width: 70vw;

  @media (max-width: 450px) {
    width: 100%;
    max-width: unset;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
`

const ModalMain = styled.div`
  flex: 1;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 10px 20px 0 rgba(107, 134, 164, 0.19);
  background: #fff;
  border-radius: 8px;
`

const ModalTitle = styled.div`
  font-size: 24px;
  padding: 16px;
`

const ModalBody = styled.div`
  padding: 16px;
`
class RenameProject extends React.Component<CombinedProps> {
  public render() {
    const title = this.props.project.title

    const initialValues = {
      projectTitle: title,
    }

    return (
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={() => this.props.handleComplete()}>
            <Close size={24} />
          </CloseButton>
        </ModalHeader>
        <ModalMain>
          <ModalTitle>{<ProjectRenameMessage />}</ModalTitle>
          <ModalBody>
            {
              <Formik
                initialValues={initialValues}
                isInitialValid={true}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={this.handleSubmit}
                component={RenameProjectForm}
              />
            }
          </ModalBody>
        </ModalMain>
      </ModalContainer>
    )
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
      this.props.handleComplete()
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<FormErrors> = {
        submit: error.response && 'There was an error',
      }

      setErrors(errors)
    }
  }
}

export default withModels(RenameProject)
