/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import AutoSaveInput from '../AutoSaveInput'
import { FormError } from '../Form'
import { AffiliationsSelect } from '../metadata/AffiliationsSelect'
import { TextField } from '../TextField'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'

const Fields = styled.div`
  padding: 16px;
`

const Fieldset = styled.fieldset`
  border: none;
`

const Legend = styled.legend`
  font-size: 20px;
  letter-spacing: -0.4px;
  color: ${props => props.theme.colors.global.text.secondary};
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

export interface ProfileValues {
  bibliographicName: BibliographicName
  affiliations: UserProfileAffiliation[]
}

export interface ProfileErrors {
  submit?: object
}

const buildProfileValues = (
  user: UserProfileWithAvatar,
  affiliationMap: Map<string, UserProfileAffiliation>
): ProfileValues => ({
  bibliographicName: user.bibliographicName,
  affiliations: user.affiliations
    ? user.affiliations.map(affiliationID => affiliationMap.get(affiliationID)!)
    : [],
})

interface Props {
  affiliationsMap: Map<string, UserProfileAffiliation>
  userWithAvatar: UserProfileWithAvatar
  createAffiliation: (institution: string) => Promise<UserProfileAffiliation>
  handleSave: (
    values: ProfileValues,
    actions: FormikActions<ProfileValues & ProfileErrors>
  ) => void
}

export const ProfileForm: React.FunctionComponent<Props> = ({
  affiliationsMap,
  userWithAvatar,
  handleSave,
  createAffiliation,
}) => (
  <Formik<ProfileValues>
    initialValues={buildProfileValues(userWithAvatar, affiliationsMap)}
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

          <Fieldset>
            <Legend>Affiliations</Legend>
            <Label>
              <Field name={'affiliations'}>
                {(props: FieldProps) => (
                  <AffiliationsSelect
                    affiliations={affiliationsMap}
                    createAffiliation={createAffiliation}
                    {...props}
                  />
                )}
              </Field>
            </Label>
          </Fieldset>
        </Fields>
      </Form>
    )}
  </Formik>
)
