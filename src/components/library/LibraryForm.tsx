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

import AddAuthor from '@manuscripts/assets/react/AddAuthor'
import ArrowDownBlack from '@manuscripts/assets/react/ArrowDownBlack'
import {
  buildBibliographicDate,
  buildBibliographicName,
  buildLibraryCollection,
} from '@manuscripts/manuscript-transform'
import {
  BibliographicName,
  BibliographyItem,
  LibraryCollection,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import {
  ButtonGroup,
  IconButton,
  PrimaryButton,
  TertiaryButton,
} from '@manuscripts/style-guide'
import { TitleField } from '@manuscripts/title-editor'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import React, { useCallback, useState } from 'react'
import { OptionsType } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'
import { selectStyles } from '../../lib/select-styles'
import { Collection } from '../../sync/Collection'

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.grid.unit}px;
`

const Label = styled.label`
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size.medium};
  display: flex;
  color: ${props => props.theme.colors.text.secondary};
`

const AuthorHeading = styled.button.attrs({
  type: 'button',
})<{ isExpanded?: boolean }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 3}px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: inherit;
  color: ${props =>
    props.isExpanded
      ? props.theme.colors.brand.default
      : props.theme.colors.text.primary};
`

const FieldLabel = styled.label`
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size.medium};
  color: ${props => props.theme.colors.text.muted};
  width: 50%;
`

const TextFieldContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.text.muted};
  background-color: ${props => props.theme.colors.background.primary};
`

const TextField = styled.input`
  font-size: ${props => props.theme.font.size.normal};
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 4}px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  width: 50%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }

  &:hover::placeholder {
    color: ${props => props.theme.colors.text.secondary};
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
  font-size: ${props => props.theme.font.size.medium};
  background-color: ${props =>
    props.isExpanded ? props.theme.colors.background.secondary : 'transparent'};
  overflow: hidden;

  &:active,
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid ${props => props.theme.colors.text.muted};
  }

  &:first-of-type {
    border-top-left-radius: ${props => props.theme.grid.radius.default};
    border-top-right-radius: ${props => props.theme.grid.radius.default};
  }

  &:last-of-type {
    border-bottom-left-radius: ${props => props.theme.grid.radius.default};
    border-bottom-right-radius: ${props => props.theme.grid.radius.default};
  }
`

const AuthorContent = styled.div`
  border-radius: ${props => props.theme.grid.radius.small};
  border: 1px solid ${props => props.theme.colors.text.muted};
  margin: 0 ${props => props.theme.grid.unit * 3}px;
`

const StyledTitleField = styled(TitleField)`
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size.medium};
  line-height: 1.25;
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.grid.radius.small};
  border: 1px solid ${props => props.theme.colors.text.muted};
  padding: ${props => props.theme.grid.unit * 2}px;

  & .ProseMirror {
    &:focus {
      outline: none;
    }
  }
`

const YearField = styled(Field)`
  font-family: ${props => props.theme.font.family.sans};
  padding: ${props => props.theme.grid.unit * 2}px;
  font-size: ${props => props.theme.font.size.medium};
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.grid.radius.small};
  border: solid 1px ${props => props.theme.colors.text.muted};
`

const Button = styled(IconButton).attrs({
  defaultColor: true,
  size: 24,
})`
  circle,
  use {
    fill: ${props => props.theme.colors.brand.default};
  }

  path {
    mask: none;
  }
`

const BaseButton = styled.button.attrs({
  type: 'button',
})`
  font-family: ${props => props.theme.font.family.sans};
  background-color: ${props => props.theme.colors.background.secondary};
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.medium};
  color: ${props => props.theme.colors.brand.default};
`

const PlainTextButton = styled(TertiaryButton)``

const Author = styled.div``

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.grid.unit * 2}px;
  padding-left: ${props => props.theme.grid.unit * 8}px;
`

const AuthorActions = styled(Actions)`
  justify-content: flex-end;
`

const AuthorFormContainer = styled.div`
  border-radius: ${props => props.theme.grid.radius.small};
  border: solid 1px ${props => props.theme.colors.text.muted};
`

const TitleLink = styled.a`
  align-items: center;
  border-radius: ${props => props.theme.grid.radius.small};
  cursor: pointer;
  display: inline-flex;
  font: ${props => props.theme.font.weight.normal}
    ${props => props.theme.font.size.medium} /
    ${props => props.theme.font.lineHeight.large}
    ${props => props.theme.font.family.sans};
  justify-content: center;
  outline: none;
  padding: 7px ${props => props.theme.grid.unit * 3}px;
  text-decoration: none;
  transition: border 0.1s, color 0.1s, background-color 0.1s;
  vertical-align: middle;
  white-space: nowrap;

  color: ${props => props.theme.colors.button.secondary.color.default};
  background-color: ${props =>
    props.theme.colors.button.secondary.background.default};
  border: 1px solid
    ${props => props.theme.colors.button.secondary.border.default};

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    color: ${props => props.theme.colors.button.secondary.color.hover};
    background-color: ${props =>
      props.theme.colors.button.secondary.background.hover};
    border-color: ${props => props.theme.colors.button.secondary.border.hover};
  }
  &:not([disabled]):active {
    color: ${props => props.theme.colors.button.secondary.color.active};
    background-color: ${props =>
      props.theme.colors.button.secondary.background.active};
    border-color: ${props => props.theme.colors.button.secondary.border.active};
  }
`

const FormField = styled.div`
  padding: ${props => props.theme.grid.unit * 3}px;
  padding-left: ${props => props.theme.grid.unit * 8}px;
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
            autoFocus={!values.title}
          />
        </FormField>

        <FieldArray
          name={'author'}
          render={({ push, remove }) => (
            <FormField>
              <LabelContainer>
                <Label>Authors</Label>

                <Button
                  onClick={() =>
                    push(
                      buildBibliographicName({
                        given: '',
                        family: '',
                      })
                    )
                  }
                >
                  <AddAuthor height={17} width={17} />
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
                              remove(index)
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = event.target

              if (value) {
                if (values.issued) {
                  // NOTE: this assumes that "issued" is already a complete object
                  setFieldValue("issued['date-parts'][0][0]", Number(value))
                } else {
                  setFieldValue(
                    'issued',
                    buildBibliographicDate({
                      'date-parts': [[Number(value)]],
                    })
                  )
                }
              } else {
                // NOTE: not undefined due to https://github.com/jaredpalmer/formik/issues/2180
                setFieldValue('issued', '')
              }
            }}
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
                  setFieldValue(
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
                styles={selectStyles}
              />
            )}
          </Field>
        </FormField>

        <Actions>
          {handleDelete && (
            <PlainTextButton
              danger={true}
              type={'button'}
              onClick={() => handleDelete(item)}
            >
              Remove
            </PlainTextButton>
          )}

          <ButtonGroup>
            <TitleLink
              href={`https://doi.org/${values.DOI}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              🔗 Open
            </TitleLink>

            <PrimaryButton type="submit">Save</PrimaryButton>
          </ButtonGroup>
        </Actions>
      </Form>
    )}
  </Formik>
)

export default LibraryForm
