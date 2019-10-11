/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { Project } from '@manuscripts/manuscripts-json-schema'
import {
  CloseButton,
  FormErrors,
  ModalContainer,
  ModalHeader,
  ModalMain,
} from '@manuscripts/style-guide'
import { Formik, FormikErrors } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  RenameProjectForm,
  RenameProjectValues,
} from '../collaboration/RenameProjectForm'
import { ProjectRenameMessage } from '../Messages'

const ModalContainerInner = styled(ModalMain)`
  width: 100vw;
  max-width: 480px;
`

const ModalTitle = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  margin-bottom: ${props => props.theme.grid.unit * 4}px;
`

const ModalBody = styled.div``

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
      <CloseButton onClick={handleComplete} />
    </ModalHeader>
    <ModalContainerInner>
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
    </ModalContainerInner>
  </ModalContainer>
)

export default RenameProject
