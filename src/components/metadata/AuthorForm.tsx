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

import {
  Affiliation,
  BibliographicName,
  Contributor,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import AlertMessage, { AlertMessageType } from '../../components/AlertMessage'
import { AffiliationMap } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import AutoSaveInput from '../AutoSaveInput'
import { TextField } from '../TextField'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'
import { AffiliationsSelect } from './AffiliationsSelect'
import { AuthorAffiliation } from './Author'
import InviteAuthorButton from './InviteAuthorButton'
import RemoveAuthorButton from './RemoveAuthorButton'

const Fields = styled.div`
  padding: 16px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const LabelText = styled.div`
  font-size: 14px;
  letter-spacing: -0.2px;
  color: ${props => props.theme.colors.global.text.primary};
`

const CheckboxField = styled.input.attrs({
  type: 'checkbox',
})<{ type?: string }>``

const CheckboxLabel = styled.label`
  color: #444;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 24px;

  & ${LabelText} {
    margin-left: 4px;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
`

const Fieldset = styled.fieldset`
  border: none;
`

const Legend = styled.legend`
  font-size: 20px;
  letter-spacing: -0.4px;
  color: ${props => props.theme.colors.global.text.secondary};
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`
const FormMessage = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 450px;
`
interface BibliographicNameValues extends Partial<BibliographicName> {
  _id: string
  objectType: 'MPBibliographicName'
  given: string
  family: string
  suffix?: string
}

interface AffiliationValues extends Partial<Affiliation> {
  _id: string
  address?: string
  city?: string
  institution?: string
  department?: string
}

// interface GrantValues {
//   _id: string
//   organization: string
//   code: string
//   title: string
//   fundingBody: string
// }

export interface AuthorValues {
  _id: string
  priority: number
  email: string
  isCorresponding: boolean
  isJointContributor: boolean
  bibliographicName: BibliographicNameValues
  affiliations: AffiliationValues[]
  // grants: GrantValues[]
}

const ensureString = (value: string | undefined) => value || ''

const buildInitialValues = (
  author: Contributor,
  authorAffiliations: AuthorAffiliation[]
  // authorGrants: AuthorGrant[]
): AuthorValues => {
  return {
    _id: author._id,
    priority: Number(author.priority), // TODO: ordering = priority
    email: ensureString(author.email),
    isCorresponding: Boolean(author.isCorresponding),
    isJointContributor: Boolean(author.isJointContributor),
    affiliations: (authorAffiliations || []).map(item => item.data),
    // grants: authorGrants,
    bibliographicName: {
      _id: author.bibliographicName._id,
      objectType: author.bibliographicName.objectType,
      given: ensureString(author.bibliographicName.given),
      family: ensureString(author.bibliographicName.family),
      suffix: ensureString(author.bibliographicName.suffix),
    },
  }
}

interface AuthorProps {
  project: Project
  author: Contributor
  affiliations: AffiliationMap
  authorAffiliations: AuthorAffiliation[]
  isRemoveAuthorOpen: boolean
  createAffiliation: (name: string) => Promise<Affiliation>
  removeAuthor: (data: Contributor) => void
  isRejected: (invitationID: string) => boolean
  updateAuthor: (author: Contributor, email: string) => void
  getAuthorName: (author: Contributor) => string
  handleSave: (values: AuthorValues) => Promise<void>
  handleRemoveAuthor: () => void
}

export const AuthorForm: React.FunctionComponent<AuthorProps> = ({
  author,
  affiliations,
  authorAffiliations,
  handleSave,
  createAffiliation,
  removeAuthor,
  isRemoveAuthorOpen,
  handleRemoveAuthor,
  isRejected,
  project,
  updateAuthor,
  getAuthorName,
}) => (
  <React.Fragment>
    <Formik<AuthorValues>
      initialValues={buildInitialValues(author, authorAffiliations)}
      onSubmit={handleSave}
    >
      {({ values }) => (
        <Form>
          <Fields>
            <Fieldset>
              <Container>
                <Legend>Details</Legend>

                <RemoveAuthorButton
                  author={author}
                  removeAuthor={() => {
                    removeAuthor(author)
                  }}
                  isOpen={isRemoveAuthorOpen}
                  handleOpen={handleRemoveAuthor}
                />
              </Container>
              <TextFieldGroupContainer>
                <Field name={'bibliographicName.given'}>
                  {(props: FieldProps) => (
                    <AutoSaveInput
                      {...props}
                      component={TextField}
                      saveOn={'blur'}
                      placeholder={'Given name'}
                    />
                  )}
                </Field>

                <Field name={'bibliographicName.family'}>
                  {(props: FieldProps) => (
                    <AutoSaveInput
                      {...props}
                      component={TextField}
                      saveOn={'blur'}
                      placeholder={'Family name'}
                    />
                  )}
                </Field>
              </TextFieldGroupContainer>

              <CheckboxLabel>
                <Field name={'isCorresponding'}>
                  {(props: FieldProps) => (
                    <AutoSaveInput
                      {...props}
                      component={CheckboxField}
                      saveOn={'change'}
                    />
                  )}
                </Field>
                <LabelText>Corresponding Author</LabelText>
              </CheckboxLabel>

              {values.isCorresponding && (
                <Label>
                  <Field name={'email'} type={'email'}>
                    {(props: FieldProps) => (
                      <AutoSaveInput
                        {...props}
                        component={TextField}
                        saveOn={'blur'}
                        placeholder={'Email address'}
                      />
                    )}
                  </Field>
                </Label>
              )}

              <CheckboxLabel>
                <Field name={'isJointContributor'}>
                  {(props: FieldProps) => (
                    <AutoSaveInput
                      {...props}
                      component={CheckboxField}
                      saveOn={'change'}
                    />
                  )}
                </Field>
                <LabelText>Joint Authorship with Next Author</LabelText>
              </CheckboxLabel>
            </Fieldset>

            <Fieldset>
              <Legend>Affiliations</Legend>

              <Label>
                <Field name={'affiliations'}>
                  {(props: FieldProps) => (
                    <AffiliationsSelect
                      affiliations={affiliations}
                      createAffiliation={createAffiliation}
                      {...props}
                    />
                  )}
                </Field>
              </Label>
            </Fieldset>

            {/*<Fieldset>
        <Legend>Grants</Legend>

          <Field name={'grants'}>
            {(props: FieldProps) => (
              <GrantsSelect
                grants={grants}
                createGrant={createGrant}
                {...props}
              />
            )}
          </Field>
        </Fieldset>*/}
          </Fields>
        </Form>
      )}
    </Formik>
    {!author.userID &&
      !author.invitationID && (
        <FormMessage>
          <AlertMessage type={AlertMessageType.info} hideCloseButton={true}>
            {getAuthorName(author) + ' '}
            does not have access to the project.
            <InviteAuthorButton
              author={author}
              project={project}
              updateAuthor={updateAuthor}
            />
          </AlertMessage>
        </FormMessage>
      )}
    {author.invitationID &&
      isRejected(author.invitationID) && (
        <FormMessage>
          <AlertMessage type={AlertMessageType.info} hideCloseButton={true}>
            {getAuthorName(author) + ' '}
            does not have access to the project.
            <InviteAuthorButton
              author={author}
              project={project}
              updateAuthor={updateAuthor}
            />
          </AlertMessage>
        </FormMessage>
      )}
  </React.Fragment>
)
