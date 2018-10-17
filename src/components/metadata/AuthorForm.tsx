import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import React from 'react'
import { AffiliationMap } from '../../lib/authors'
import { styled } from '../../theme'
import { Affiliation, BibliographicName, Contributor } from '../../types/models'
import AutoSaveInput from '../AutoSaveInput'
import { TextField } from '../TextField'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'
import { AffiliationsSelect } from './AffiliationsSelect'
import { AuthorAffiliation } from './Author'

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
  color: #353535;
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
  color: #949494;
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
  author: Contributor
  affiliations: AffiliationMap
  authorAffiliations: AuthorAffiliation[]
  manuscript: string
  handleSave: (values: AuthorValues) => Promise<void>
  createAffiliation: (name: string) => Promise<Affiliation>
}

export const AuthorForm: React.SFC<AuthorProps> = ({
  author,
  affiliations,
  authorAffiliations,
  manuscript,
  handleSave,
  createAffiliation,
}) => (
  <Formik
    initialValues={buildInitialValues(author, authorAffiliations)}
    onSubmit={handleSave}
  >
    {({ values }: FormikProps<AuthorValues>) => (
      <Form>
        <Fields>
          <Fieldset>
            <Legend>Details</Legend>

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
)
