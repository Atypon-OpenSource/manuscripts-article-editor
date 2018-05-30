import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import AutoSaveInput from '../../components/AutoSaveInput'
import { styled } from '../../theme'
import { Affiliation, Contributor } from '../../types/components'
import { AffiliationsSelect } from './AffiliationsSelect'
import { AuthorAffiliation } from './Author'
import { AffiliationMap } from './lib/authors'

const FormHeader = styled.div`
  //display: flex;
  //justify-content: flex-end;
  display: none;
`

const Fields = styled.div`
  padding: 10px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const LabelText = styled.div`
  margin-bottom: 5px;
  color: #777;
`

const SaveButton = styled.button`
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #4388d8;
  font-weight: bold;
  color: white;
  padding: 4px 24px;
`

const TextField = styled.input`
  font-size: 14px;
  padding: 8px 16px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: transparent;
  display: block;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  &:hover {
    &::placeholder {
      color: #777;
    }
  }
`

const CheckboxField = styled.input.attrs({
  type: 'checkbox',
})``

const Checkboxes = styled.div`
  display: flex;
`

const CheckboxLabel = styled.label`
  color: #444;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  & ${LabelText} {
    margin-left: 4px;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
`

interface BibliographicNameValues {
  id: string
  objectType: string
  given: string
  family: string
  suffix?: string
}

interface AffiliationValues {
  id: string
  name: string
  address?: string
  city?: string
  institution?: string
}

// interface GrantValues {
//   id: string
//   organization: string
//   code: string
//   title: string
//   fundingBody: string
// }

export interface AuthorValues {
  id: string
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
    id: author.id,
    priority: Number(author.priority), // TODO: ordering = priority
    email: ensureString(author.email),
    isCorresponding: Boolean(author.isCorresponding),
    isJointContributor: Boolean(author.isJointContributor),
    affiliations: (authorAffiliations || []).map(item => item.data),
    // grants: authorGrants,
    bibliographicName: {
      id: author.bibliographicName.id,
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
    enableReinitialize={true}
  >
    <Form>
      <FormHeader>
        <SaveButton type={'submit'}>SAVE</SaveButton>
      </FormHeader>

      <Checkboxes>
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
          <LabelText>Corresponding author</LabelText>
        </CheckboxLabel>
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
          <LabelText>Joint authorship with next author</LabelText>
        </CheckboxLabel>
      </Checkboxes>

      <Fields>
        <Label>
          <LabelText>NAME/s</LabelText>
          <Field name={'bibliographicName.given'}>
            {(props: FieldProps) => (
              <AutoSaveInput {...props} component={TextField} saveOn={'blur'} />
            )}
          </Field>
        </Label>

        <Label>
          <LabelText>SURNAME</LabelText>
          <Field name={'bibliographicName.family'}>
            {(props: FieldProps) => (
              <AutoSaveInput {...props} component={TextField} saveOn={'blur'} />
            )}
          </Field>
        </Label>

        <Label>
          <LabelText>CONTACT EMAIL</LabelText>
          <Field name={'email'} type={'email'}>
            {(props: FieldProps) => (
              <AutoSaveInput {...props} component={TextField} saveOn={'blur'} />
            )}
          </Field>
        </Label>

        <Label>
          <LabelText>AFFILIATIONS</LabelText>

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
      </Fields>
    </Form>
  </Formik>
)
