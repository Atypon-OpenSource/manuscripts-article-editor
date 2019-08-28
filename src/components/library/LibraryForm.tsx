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

import ArrowDownBlack from '@manuscripts/assets/react/ArrowDownBlack'
import PlusIcon from '@manuscripts/assets/react/PlusIcon'
import { buildLibraryCollection } from '@manuscripts/manuscript-transform'
import {
  BibliographicName,
  BibliographyItem,
  LibraryCollection,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { ButtonGroup, PrimarySubmitButton } from '@manuscripts/style-guide'
import { TitleField } from '@manuscripts/title-editor'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import React, { useCallback, useState } from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { Collection } from '../../sync/Collection'
import { aliceBlue, manuscriptsGrey } from '../../theme/colors'
import { styled } from '../../theme/styled-components'

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`

const Label = styled.label`
  font-family: ${props => props.theme.fontFamily};
  font-size: 16px;
  display: flex;
  color: ${props => props.theme.colors.global.text.secondary};
`

const AuthorHeading = styled.button.attrs({
  type: 'button',
})<{ isExpanded?: boolean }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: inherit;
  color: inherit;
  color: ${props =>
    props.isExpanded
      ? props.theme.colors.global.text.link
      : props.theme.colors.label.text};
`

const FieldLabel = styled.label`
  font-family: ${props => props.theme.fontFamily};
  font-size: 16px;
  color: ${props => props.theme.colors.library.sidebar.field.label};
  width: 50%;
`

const TextFieldContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid
    ${props => props.theme.colors.library.sidebar.field.border};
  background-color: #ffffff;
`

const TextField = styled.input`
  font-size: 14px;
  padding: 8px 16px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  width: 50%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  &:hover::placeholder {
    color: #777;
  }
`

const CollapsibleAuthorContainer: React.FC<{
  title: string
  action: JSX.Element
}> = ({ children, title, action }) => {
  const [expanded, setExpanded] = useState(!title)

  const toggleExpanded = useCallback(() => {
    setExpanded(value => !value)
  }, [])

  return (
    <AuthorContainer isExpanded={expanded}>
      <AuthorHeading
        isExpanded={expanded}
        onClick={toggleExpanded}
        tabIndex={0}
      >
        <span>{!title ? 'Edit author name' : title}</span>

        <ArrowDownBlack
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </AuthorHeading>

      {expanded && <AuthorContent>{children}</AuthorContent>}

      {expanded && <AuthorActions>{action}</AuthorActions>}
    </AuthorContainer>
  )
}

const AuthorContainer = styled.div<{ isExpanded?: boolean }>`
  font-size: 15px;
  background-color: ${props => (props.isExpanded ? aliceBlue : 'transparent')};
  overflow: hidden;

  &:active,
  &:hover {
    background-color: ${aliceBlue};
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid
      ${props => props.theme.colors.textField.border.default};
  }

  &:first-of-type {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &:last-of-type {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`

const AuthorContent = styled.div`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.textField.border.default};
  margin: 0 12px;
`

const StyledTitleField = styled(TitleField)`
  font-family: ${props => props.theme.fontFamily};
  font-size: 16px;
  line-height: 1.25;
  color: ${manuscriptsGrey};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.textField.border.default};
  padding: 8px;

  & .ProseMirror {
    &:focus {
      outline: none;
    }
  }
`

const YearField = styled(Field)`
  font-family: ${props => props.theme.fontFamily};
  padding: 8px;
  font-size: 16px;
  color: ${manuscriptsGrey};
  border-radius: 4px;
  border: solid 1px ${props => props.theme.colors.textField.border.default};
`

const Button = styled.button.attrs({
  type: 'button',
})`
  background-color: transparent;
  color: ${props => props.theme.colors.button.primary};
  border: 2px solid transparent;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  font-family: ${props => props.theme.fontFamily};
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => (props.disabled ? 'text' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.5' : '1.0')};
  transition: border 0.1s, color 0.1s, background-color 0.1s;

  &:hover {
    background-color: #fff;
    color: ${props => props.theme.colors.button.primary};
    border-color: ${props => props.theme.colors.button.primary};
  }

  &:active {
    background-color: ${props => props.theme.colors.button.primary};
    border-color: ${props => props.theme.colors.button.primary};
    color: white;
  }
`
const BaseButton = styled.button.attrs({
  type: 'button',
})`
  font-family: ${props => props.theme.fontFamily};
  font-size: 16px;
  background-color: ${props =>
    props.theme.colors.library.sidebar.background.default};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.button.primary};
`

const PlainTextButton = styled(BaseButton)`
  background-color: #ffffff;
  text-align: left;
`

const Author = styled.div``

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`

const AuthorActions = styled(Actions)`
  justify-content: flex-end;
`

const AuthorFormContainer = styled.div`
  border-radius: 4px;
  border: solid 1px ${props => props.theme.colors.textField.border.default};
`

const TitleLink = styled.a`
  font-family: ${props => props.theme.fontFamily};
  font-size: 16px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.button.primary};
  padding: 0px 20px;
`

const FormField = styled.div`
  padding: 10px;
`

interface OptionType {
  label: string
  value: any // tslint:disable-line:no-any
}

const buildOptions = (data: Map<string, LibraryCollection>) => {
  const options: OptionType[] = []

  for (const libraryCollection of data.values()) {
    options.push({
      value: libraryCollection._id,
      label: libraryCollection.name,
    })
  }

  return options
}

interface LibraryFormValues {
  _id: string
  title?: string
  author?: BibliographicName[]
  keywordIDs?: string[]
  DOI?: string
  issued?: {
    _id: string
    'date-parts'?: Array<Array<string | number>>
  }
}

const buildInitialValues = (item: BibliographyItem): LibraryFormValues => ({
  _id: item._id,
  title: item.title,
  author: item.author,
  keywordIDs: item.keywordIDs,
  DOI: item.DOI,
  issued: item.issued,
})

// TODO: a "manage library collections" page, where unused library collections can be deleted

const LibraryForm: React.FC<{
  item: BibliographyItem
  handleDelete?: (item: BibliographyItem) => void
  handleSave: (item: BibliographyItem) => void
  projectID: string
  projectLibraryCollections: Map<string, LibraryCollection>
  projectLibraryCollectionsCollection: Collection<LibraryCollection>
  user: UserProfile
}> = ({
  item,
  handleSave,
  handleDelete,
  projectID,
  projectLibraryCollections,
  projectLibraryCollectionsCollection,
  user,
}) => (
  <Formik<LibraryFormValues>
    initialValues={buildInitialValues(item)}
    onSubmit={handleSave}
    enableReinitialize={true}
  >
    {({ values, setFieldValue, handleChange }) => (
      <Form>
        <FormField>
          <LabelContainer>
            <Label>Title</Label>
          </LabelContainer>

          <StyledTitleField
            value={values.title || ''}
            handleChange={data => setFieldValue('title', data)}
          />
        </FormField>

        <FieldArray
          name={'author'}
          render={arrayHelpers => (
            <FormField>
              <LabelContainer>
                <Label>Authors</Label>

                <Button
                  onClick={() => arrayHelpers.push({ given: '', family: '' })}
                >
                  <PlusIcon height={17} width={17} />
                </Button>
              </LabelContainer>

              <AuthorFormContainer>
                {values.author &&
                  values.author.map((author, index) => (
                    <CollapsibleAuthorContainer
                      key={author._id || `author.${index}`}
                      title={[author.given, author.family].join(' ').trim()}
                      action={
                        <BaseButton
                          onClick={() => {
                            if (window.confirm('Remove this author?')) {
                              arrayHelpers.remove(index)
                            }
                          }}
                        >
                          REMOVE
                        </BaseButton>
                      }
                    >
                      <Author>
                        <Field
                          name={`author.${index}.given`}
                          value={author.given}
                          onChange={handleChange}
                        >
                          {({ field }: FieldProps) => (
                            <TextFieldContainer>
                              <TextField
                                {...field}
                                id={field.name}
                                placeholder={'Given'}
                                autoFocus={true}
                              />
                              <FieldLabel htmlFor={field.name}>
                                Given
                              </FieldLabel>
                            </TextFieldContainer>
                          )}
                        </Field>

                        <Field
                          name={`author.${index}.family`}
                          value={author.family}
                          onChange={handleChange}
                        >
                          {({ field }: FieldProps) => (
                            <TextFieldContainer>
                              <TextField
                                {...field}
                                id={field.name}
                                placeholder={'Family'}
                              />
                              <FieldLabel htmlFor={field.name}>
                                Family
                              </FieldLabel>
                            </TextFieldContainer>
                          )}
                        </Field>
                      </Author>
                    </CollapsibleAuthorContainer>
                  ))}
              </AuthorFormContainer>
            </FormField>
          )}
        />

        <FormField>
          <LabelContainer>
            <Label htmlFor={"issued['date-parts'][0][0]"}>Year</Label>
          </LabelContainer>

          <YearField
            name={"issued['date-parts'][0][0]"}
            type={'number'}
            step={1}
          />
        </FormField>

        <FormField>
          <LabelContainer>
            <Label htmlFor={'keywordIDs'}>Lists</Label>
          </LabelContainer>

          <Field name={'keywordIDs'}>
            {(props: FieldProps) => (
              <CreatableSelect<OptionType>
                isMulti={true}
                onChange={async (newValue: OptionsType<OptionType>) => {
                  props.form.setFieldValue(
                    props.field.name,
                    await Promise.all(
                      newValue.map(async option => {
                        const existing = projectLibraryCollections.get(
                          option.value
                        )

                        if (existing) return existing._id

                        const libraryCollection = buildLibraryCollection(
                          user.userID,
                          String(option.label)
                        )

                        await projectLibraryCollectionsCollection.create(
                          libraryCollection,
                          {
                            containerID: projectID,
                          }
                        )

                        return libraryCollection._id
                      })
                    )
                  )
                }}
                options={buildOptions(projectLibraryCollections)}
                value={
                  props.field.value
                    ? (props.field.value as string[])
                        .filter(id => projectLibraryCollections.has(id))
                        .map(id => projectLibraryCollections.get(id)!)
                        .map(item => ({
                          value: item._id,
                          label: item.name,
                        }))
                    : null
                }
              />
            )}
          </Field>
        </FormField>

        <Actions>
          {handleDelete && (
            <PlainTextButton type={'button'} onClick={() => handleDelete(item)}>
              REMOVE FROM LIBRARY
            </PlainTextButton>
          )}

          <ButtonGroup>
            <TitleLink
              href={`https://doi.org/${values.DOI}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              OPEN
            </TitleLink>

            <PrimarySubmitButton>Save</PrimarySubmitButton>
          </ButtonGroup>
        </Actions>
      </Form>
    )}
  </Formik>
)

export default LibraryForm
