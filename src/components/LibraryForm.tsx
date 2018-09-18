import {
  Field,
  FieldArray,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import * as React from 'react'
import { Option } from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import { TitleField } from '../editor/title/TitleField'
import { buildKeyword } from '../lib/commands'
import {
  KeywordsMap,
  KeywordsProps,
  withKeywords,
} from '../store/KeywordsProvider'
import { styled } from '../theme'
import { BibliographyItem, Keyword } from '../types/components'
import { DeleteButton, PrimaryButton, ThemedButtonProps } from './Button'

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
`

const TextField = styled.input`
  font-size: 14px;
  padding: 8px 16px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;

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

const StyledTitleField = styled(TitleField)`
  flex: 1;

  & .ProseMirror {
    font-weight: bold;
    cursor: pointer;
    font-size: 13pt;
    font-family: 'IBM Plex Sans', sans-serif;

    &:focus {
      outline: none;
    }
  }
`

const Button = styled.button`
  background-color: transparent;
  color: ${(props: ThemedButtonProps) => props.theme.colors.primary.blue};
  border: 2px solid transparent;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 10px 3px;
  font-family: ${(props: ThemedButtonProps) => props.theme.fontFamily};
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props: ThemedButtonProps) =>
    props.disabled ? 'text' : 'pointer'};
  opacity: ${(props: ThemedButtonProps) => (props.disabled ? '0.5' : '1.0')};
  transition: border 0.1s, color 0.1s, background-color 0.1s;

  &:hover {
    background-color: #fff;
    color: ${(props: ThemedButtonProps) => props.theme.colors.primary.blue};
    border-color: #4489d8;
  }

  &:active {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.primary.blue};
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.primary.blue};
    color: white;
  }
`

const Author = styled.div`
  display: inline-flex;
  border-radius: 5px;
  border: none;
  width: auto;
  box-shadow: 0 1px 3px #aaa;
  margin-bottom: 5px;
  margin-right: 5px;

  & ${TextField} {
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`

const TitleLink = styled.a`
  text-decoration: none;
`

interface Props {
  item: BibliographyItem
  handleDelete?: (item: Partial<BibliographyItem>) => void
  handleSave: (item: Partial<BibliographyItem>) => void
  projectID: string
}

const buildOptions = (data: KeywordsMap) => {
  const options = []

  for (const keyword of data.values()) {
    options.push({
      value: keyword.id,
      label: keyword.name,
    })
  }

  return options
}

const buildInitialValues = (
  item: BibliographyItem
): Partial<BibliographyItem> => ({
  id: item.id,
  title: item.title,
  author: item.author,
  keywordIDs: item.keywordIDs,
  DOI: item.DOI,
})

// TODO: a "manage tags" page, where old tags can be deleted

const LibraryForm: React.SFC<Props & KeywordsProps> = ({
  item,
  handleSave,
  handleDelete,
  keywords,
  projectID,
}) => (
  <Formik
    initialValues={buildInitialValues(item)}
    onSubmit={handleSave}
    enableReinitialize={true}
  >
    {({
      values,
      setFieldValue,
      handleChange,
    }: FormikProps<BibliographyItem>) => (
      <Form>
        <Fields>
          <TitleContainer>
            <StyledTitleField
              value={values.title || ''}
              handleChange={(data: string) => setFieldValue('title', data)}
            />
            <TitleLink
              href={`https://doi.org/${values.DOI}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              ↗️
            </TitleLink>
          </TitleContainer>

          <Label>
            <LabelText>Authors</LabelText>
            <FieldArray
              name={'author'}
              render={arrayHelpers => (
                <div>
                  {values.author &&
                    values.author.map((author, index) => (
                      <Author key={`author.${index}`}>
                        <Field
                          name={`author.${index}.given`}
                          value={author.given}
                          onChange={handleChange}
                        >
                          {({ field }: FieldProps) => (
                            <TextField {...field} placeholder={'Given'} />
                          )}
                        </Field>

                        <Field
                          name={`author.${index}.family`}
                          value={author.family}
                          onChange={handleChange}
                        >
                          {({ field }: FieldProps) => (
                            <TextField {...field} placeholder={'Family'} />
                          )}
                        </Field>

                        <Button
                          type={'button'}
                          onClick={() => arrayHelpers.remove(index)}
                          tabIndex={-1}
                        >
                          -
                        </Button>
                      </Author>
                    ))}
                  <Button
                    type={'button'}
                    onClick={() => arrayHelpers.push({ given: '', family: '' })}
                  >
                    +
                  </Button>
                </div>
              )}
            />
          </Label>

          <Label>
            <LabelText>Keywords</LabelText>

            <Field name={'keywordIDs'}>
              {(props: FieldProps) => (
                <CreatableSelect
                  isMulti={true}
                  onChange={async (newValue: [Option]) => {
                    props.form.setFieldValue(
                      props.field.name,
                      await Promise.all(
                        newValue.map(async option => {
                          const existing = keywords.data.get(
                            option.value as string
                          )

                          if (existing) return existing.id

                          const keyword = buildKeyword(String(option.label))

                          await keywords.create(keyword, projectID)

                          return keyword.id
                        })
                      )
                    )
                  }}
                  options={buildOptions(keywords.data)}
                  value={(props.field.value || [])
                    .filter((id: string) => keywords.data.has(id))
                    .map((id: string) => keywords.data.get(id))
                    .map((item: Keyword) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                />
              )}
            </Field>
          </Label>

          <Actions>
            <PrimaryButton type={'submit'}>Save</PrimaryButton>
            {handleDelete && (
              <DeleteButton onClick={() => handleDelete(item)}>
                Delete
              </DeleteButton>
            )}
          </Actions>
        </Fields>
      </Form>
    )}
  </Formik>
)

export default withKeywords<Props>(LibraryForm)
