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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  BibliographicName,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import {
  AffiliationsEditorProfile,
  AutoSaveInput,
  FormError,
  TextField,
  TextFieldGroupContainer,
} from '@manuscripts/style-guide'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik'
import React from 'react'
import styled from 'styled-components'

const Fields = styled.div`
  padding: ${(props) => props.theme.grid.unit * 4}px;
`

const Fieldset = styled.fieldset`
  border: none;
`

const Legend = styled.legend`
  font-size: ${(props) => props.theme.font.size.xlarge};
  letter-spacing: -0.4px;
  color: ${(props) => props.theme.colors.text.secondary};
`

export interface ProfileValues {
  bibliographicName: BibliographicName
}

export interface ProfileErrors {
  submit?: Record<string, unknown>
}

const buildProfileValues = (user: UserProfileWithAvatar): ProfileValues => ({
  bibliographicName: user.bibliographicName,
})

interface Props {
  affiliationsMap: Map<string, UserProfileAffiliation>
  userWithAvatar: UserProfileWithAvatar
  createAffiliation: (institution: string) => Promise<UserProfileAffiliation>
  updateAffiliation: (
    data: Partial<UserProfileAffiliation>
  ) => Promise<UserProfileAffiliation>
  removeAffiliation: (data: UserProfileAffiliation) => Promise<string>
  handleSave: (
    values: ProfileValues,
    actions: FormikHelpers<ProfileValues & ProfileErrors>
  ) => void
}

export const ProfileForm: React.FunctionComponent<Props> = ({
  affiliationsMap,
  userWithAvatar,
  handleSave,
  createAffiliation,
  updateAffiliation,
  removeAffiliation,
}) => (
  <React.Fragment>
    <Formik<ProfileValues>
      initialValues={buildProfileValues(userWithAvatar)}
      onSubmit={handleSave}
    >
      {({ errors }: FormikProps<ProfileValues & ProfileErrors>) => (
        <Form noValidate={true}>
          <Fields>
            <Fieldset>
              <Legend>Details</Legend>
              <TextFieldGroupContainer
                errors={{
                  bibliographicNameFamily: errors.bibliographicName
                    ? errors.bibliographicName.family
                    : undefined,
                  bibliographicNameGiven: errors.bibliographicName
                    ? errors.bibliographicName.given
                    : undefined,
                }}
              >
                <Field name={'bibliographicName.given'}>
                  {(props: FieldProps) => (
                    <AutoSaveInput
                      {...props}
                      component={TextField}
                      saveOn={'blur'}
                      placeholder={'given name'}
                    />
                  )}
                </Field>

                <Field name={'bibliographicName.family'}>
                  {(props: FieldProps) => (
                    <AutoSaveInput
                      {...props}
                      component={TextField}
                      saveOn={'blur'}
                      placeholder={'family name'}
                    />
                  )}
                </Field>
              </TextFieldGroupContainer>

              {errors.submit && <FormError>{errors.submit}</FormError>}
            </Fieldset>
          </Fields>
        </Form>
      )}
    </Formik>
    <AffiliationsEditorProfile
      affiliations={affiliationsMap}
      addAffiliation={createAffiliation}
      updateAffiliation={updateAffiliation}
      removeAffiliation={removeAffiliation}
    />
  </React.Fragment>
)
