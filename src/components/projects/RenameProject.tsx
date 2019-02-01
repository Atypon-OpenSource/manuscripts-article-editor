import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import { Project } from '@manuscripts/manuscripts-json-schema/dist/types'
import { Formik, FormikErrors } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  RenameProjectForm,
  RenameProjectValues,
} from '../collaboration/RenameProjectForm'
import { FormErrors } from '../Form'
import { ProjectRenameMessage } from '../Messages'
import { CloseButton } from '../SimpleModal'

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fontFamily};
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

interface Props {
  handleComplete: () => void
  project: Project
  saveProjectTitle: (title: string) => Promise<Project>
}

const RenameProject: React.FunctionComponent<Props> = ({
  handleComplete,
  project,
  saveProjectTitle,
}) => (
  <ModalContainer>
    <ModalHeader>
      <CloseButton onClick={() => handleComplete()}>
        <CloseIconDark />
      </CloseButton>
    </ModalHeader>
    <ModalMain>
      <ModalTitle>{<ProjectRenameMessage />}</ModalTitle>
      <ModalBody>
        {
          <Formik<RenameProjectValues>
            initialValues={{
              title: project.title || '',
            }}
            isInitialValid={true}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values, actions) => {
              actions.setErrors({})

              try {
                await saveProjectTitle(values.title)

                actions.setSubmitting(false)
                handleComplete()
              } catch (error) {
                actions.setSubmitting(false)

                const errors: FormikErrors<RenameProjectValues & FormErrors> = {
                  submit: error.response && 'There was an error',
                }

                actions.setErrors(errors)
              }
            }}
            component={RenameProjectForm}
          />
        }
      </ModalBody>
    </ModalMain>
  </ModalContainer>
)

export default RenameProject
