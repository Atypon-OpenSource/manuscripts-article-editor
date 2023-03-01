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
import Trashcan from '@manuscripts/assets/react/AnnotationRemove'
import ArrowDownBlue from '@manuscripts/assets/react/ArrowDownBlue'
import { BibliographicName, BibliographyItem } from '@manuscripts/json-schema'
import { bibliographyItemTypes } from '@manuscripts/library'
import {
  ButtonGroup,
  Category,
  Dialog,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  TextField,
} from '@manuscripts/style-guide'
import { TitleField } from '@manuscripts/title-editor'
import {
  buildBibliographicDate,
  buildBibliographicName,
} from '@manuscripts/transform'
import {
  Field,
  FieldArray,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { OptionsType } from 'react-select'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import { DeleteIcon } from '../projects/lean-workflow/icons/DeleteIcon'
import { LinkIcon } from '../projects/lean-workflow/icons/LinkIcon'
import { SelectField } from '../SelectField'

export const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.grid.unit}px;
`

const Label = styled.label`
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: ${(props) => props.theme.font.size.medium};
  display: flex;
  color: ${(props) => props.theme.colors.text.secondary};
`

const FieldLabel = styled.label`
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: ${(props) => props.theme.font.size.medium};
  color: ${(props) => props.theme.colors.text.muted};
  padding-right: ${(props) => props.theme.grid.unit * 3}px;
`

const NameFieldContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.background.primary};
  :not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.text.muted};
  }
`

const NameField = styled.input`
  font-size: ${(props) => props.theme.font.size.normal};
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  width: 50%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.muted};
  }

  &:hover::placeholder {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`

const StyledTitleField = styled(TitleField)`
  & .ProseMirror {
    font-family: ${(props) => props.theme.font.family.sans};
    font-size: ${(props) => props.theme.font.size.medium};
    line-height: 1.25;
    color: ${(props) => props.theme.colors.text.primary};
    border-radius: ${(props) => props.theme.grid.radius.small};
    border: 1px solid ${(props) => props.theme.colors.text.muted};
    padding: ${(props) => props.theme.grid.unit * 2}px
      ${(props) => props.theme.grid.unit * 3}px;
    min-height: ${(props) => props.theme.grid.unit * 21}px;
    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colors.border.field.hover};
      background-color: ${(props) => props.theme.colors.background.fifth};
    }
  }

  &:hover {
    & .ProseMirror {
      background-color: ${(props) => props.theme.colors.background.fifth};
    }
  }
`

const FormTextField = styled(TextField)`
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
`

const ContainerTextField = styled(FormTextField)`
  min-height: ${(props) => props.theme.grid.unit * 15}px;
`

const YearField = styled(Field)`
  font-family: ${(props) => props.theme.font.family.sans};
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
  font-size: ${(props) => props.theme.font.size.medium};
  color: ${(props) => props.theme.colors.text.primary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  border: solid 1px ${(props) => props.theme.colors.text.muted};
`

const Button = styled(IconButton).attrs({
  defaultColor: true,
  size: 24,
})`
  circle,
  use {
    fill: ${(props) => props.theme.colors.brand.default};
  }

  path {
    mask: none;
  }
`

const Actions = styled.div`
  flex-shrink: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 8}px;

  .tooltip {
    max-width: ${(props) => props.theme.grid.unit * 39}px;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    border-radius: 6px;
  }
`

export const FormField = styled.div`
  padding: ${(props) => props.theme.grid.unit * 3}px;
  padding-left: ${(props) => props.theme.grid.unit * 8}px;
`

export const FlexForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const FormFields = styled.div`
  flex: 1;
  overflow-y: auto;
`

interface OptionType {
  label: string
  value: any
}

export interface ReferenceFormValues {
  _id: string
  title?: string
  author?: BibliographicName[]
  keywordIDs?: string[]
  DOI?: string
  issued?: {
    _id: string
    'date-parts'?: Array<Array<string | number>>
  }
  type: string
  'container-title'?: string
  URL?: string
  issue?: string | number
  volume?: string | number
  page?: string | number
}

const AuthorDropDown: React.FC<{
  author: BibliographicName
  index: number
  remove: (index: number) => void
  handleChange: (e: React.ChangeEvent<any>) => void
}> = ({ author, index, remove, handleChange }) => {
  const [isOpen, setIsOpen] = useState(!!author['isNew'])
  const fullName = [author.given, author.family].join(' ').trim()
  const title = fullName.length > 0 ? fullName : 'Edit author name'

  return (
    <Section key={author._id}>
      <Title>
        <ToggleButton
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
        >
          <DropdownIndicator>
            <ArrowDownBlue />
          </DropdownIndicator>
          {title}
        </ToggleButton>
        <RemoveButton
          type="button"
          aria-label="Delete this affiliation"
          onClick={() => remove(index)}
        >
          <Trashcan />
        </RemoveButton>
      </Title>
      {isOpen && (
        <AuthorForm>
          <Field
            name={`author.${index}.given`}
            value={author.given}
            onChange={handleChange}
          >
            {({ field }: FieldProps) => (
              <NameFieldContainer>
                <NameField
                  {...field}
                  id={field.name}
                  placeholder={'Given'}
                  autoFocus={true}
                />
                <FieldLabel htmlFor={field.name}>Given</FieldLabel>
              </NameFieldContainer>
            )}
          </Field>

          <Field
            name={`author.${index}.family`}
            value={author.family}
            onChange={handleChange}
          >
            {({ field }: FieldProps) => (
              <NameFieldContainer>
                <NameField
                  {...field}
                  id={field.name}
                  placeholder={'Family'}
                  autoFocus={true}
                />
                <FieldLabel htmlFor={field.name}>Family</FieldLabel>
              </NameFieldContainer>
            )}
          </Field>
        </AuthorForm>
      )}
    </Section>
  )
}

export const buildInitialValues = (
  item: BibliographyItem
): ReferenceFormValues => ({
  _id: item._id,
  title: item.title,
  author: item.author,
  keywordIDs: item.keywordIDs,
  DOI: item.DOI,
  issued: item.issued,
  type: item.type,
  'container-title': item['container-title'],
  URL: item.URL,
  issue: item.issue ? String(item.issue) : undefined,
  volume: item.volume ? String(item.volume) : undefined,
  page: item.page ? String(item.page) : undefined,
})

export const bibliographyItemTypeOptions: OptionsType<OptionType> = Array.from(
  bibliographyItemTypes.entries()
)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label))

const ReferenceForm: React.FC<{
  item: BibliographyItem
  formMikRef: React.Ref<FormikProps<ReferenceFormValues>>
  disableDelete: boolean
  deleteCallback: () => void
  handleCancel: () => void
  saveCallback: (item: BibliographyItem) => void
}> = ({
  item,
  formMikRef,
  disableDelete,
  deleteCallback,
  handleCancel,
  saveCallback,
}) => {
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTop = 0
    }
  }, [item])

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const deleteClickCallback = useCallback(() => setShowDeleteDialog(true), [])

  return (
    <Formik<ReferenceFormValues>
      initialValues={buildInitialValues(item)}
      onSubmit={saveCallback}
      innerRef={formMikRef}
      enableReinitialize={true}
    >
      {({ values, setFieldValue, handleChange }) => {
        return (
          <FlexForm>
            <Dialog
              isOpen={showDeleteDialog}
              category={Category.confirmation}
              header="Delete Reference"
              message="Are you sure you want to delete this reference from the list?"
              actions={{
                secondary: {
                  action: () => {
                    deleteCallback()
                    setShowDeleteDialog(false)
                  },
                  title: 'Delete',
                },
                primary: {
                  action: () => setShowDeleteDialog(false),
                  title: 'Cancel',
                },
              }}
            />
            <Actions>
              <ButtonGroup>
                <IconButton
                  defaultColor
                  as="a"
                  href={`https://doi.org/${values.DOI}`}
                  target={'_blank'}
                >
                  <LinkIcon />
                </IconButton>
                <div data-tip={true} data-for={'delete-button'}>
                  <DeleteButton
                    defaultColor
                    disabled={disableDelete}
                    onClick={deleteClickCallback}
                  >
                    <DeleteIcon />
                  </DeleteButton>
                  <ReactTooltip
                    disable={!disableDelete}
                    id={'delete-button'}
                    place="bottom"
                    effect="solid"
                    offset={{ top: 15 }}
                    className="tooltip"
                  >
                    Unable to delete because the item is used in the document
                  </ReactTooltip>
                </div>
              </ButtonGroup>
              <ButtonGroup>
                <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
                <PrimaryButton type="submit">Save</PrimaryButton>
              </ButtonGroup>
            </Actions>

            <FormFields ref={formRef}>
              <FormField>
                <LabelContainer>
                  <Label htmlFor={'citation-item-type'}>Type</Label>
                </LabelContainer>

                <Field
                  id={'citation-item-type'}
                  name={'type'}
                  component={SelectField}
                  options={bibliographyItemTypeOptions}
                />
              </FormField>

              <FormField>
                <LabelContainer>
                  <Label>Title</Label>
                </LabelContainer>

                <StyledTitleField
                  value={values.title || ''}
                  handleChange={(data) => setFieldValue('title', data)}
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
                              isNew: true,
                            })
                          )
                        }
                      >
                        <AddAuthor height={17} width={17} />
                      </Button>
                    </LabelContainer>

                    <div>
                      {values.author &&
                        values.author.map((author, index) => (
                          <AuthorDropDown
                            key={index}
                            index={index}
                            author={author}
                            remove={remove}
                            handleChange={handleChange}
                          />
                        ))}
                    </div>
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
                        setFieldValue(
                          "issued['date-parts'][0][0]",
                          Number(value)
                        )
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
                  <Label htmlFor={'container-title'}>Container Title</Label>
                </LabelContainer>

                <Field name={'container-title'}>
                  {(props: FieldProps) => (
                    <ContainerTextField
                      id={'container-title'}
                      {...props.field}
                    />
                  )}
                </Field>
              </FormField>

              <FormField>
                <LabelContainer>
                  <Label htmlFor={'volume'}>Volume</Label>
                </LabelContainer>

                <Field name={'volume'}>
                  {(props: FieldProps) => (
                    <FormTextField id={'volume'} {...props.field} />
                  )}
                </Field>
              </FormField>

              <FormField>
                <LabelContainer>
                  <Label htmlFor={'issue'}>Issue</Label>
                </LabelContainer>

                <Field name={'issue'}>
                  {(props: FieldProps) => (
                    <FormTextField id={'issue'} {...props.field} />
                  )}
                </Field>
              </FormField>

              <FormField>
                <LabelContainer>
                  <Label htmlFor={'page'}>Page</Label>
                </LabelContainer>

                <Field name={'page'}>
                  {(props: FieldProps) => (
                    <FormTextField id={'page'} {...props.field} />
                  )}
                </Field>
              </FormField>

              <FormField>
                <LabelContainer>
                  <Label htmlFor={'url'}>URL</Label>
                </LabelContainer>

                <Field name={'URL'}>
                  {(props: FieldProps) => (
                    <FormTextField type={'url'} id={'url'} {...props.field} />
                  )}
                </Field>
              </FormField>

              <FormField>
                <LabelContainer>
                  <Label htmlFor={'doi'}>DOI</Label>
                </LabelContainer>

                <Field name={'DOI'}>
                  {(props: FieldProps) => (
                    <FormTextField
                      id={'doi'}
                      pattern={'(https://doi.org/)?10..+'}
                      {...props.field}
                    />
                  )}
                </Field>
              </FormField>

              <FormField>
                <LabelContainer>
                  <Label htmlFor={'supplement'}>Supplement</Label>
                </LabelContainer>

                <Field name={'supplement'}>
                  {(props: FieldProps) => (
                    <FormTextField
                      type={'supplement'}
                      id={'supplement'}
                      {...props.field}
                    />
                  )}
                </Field>
              </FormField>
            </FormFields>
          </FlexForm>
        )
      }}
    </Formik>
  )
}

export default ReferenceForm

const DeleteButton = styled(IconButton)`
  background-color: ${(props) =>
    props.theme.colors.background.primary} !important;
  border-color: ${(props) => props.theme.colors.background.primary} !important;
  .icon_element {
    fill: ${(props) => (props.disabled && '#c9c9c9') || '#F35143'} !important;
  }
`

const Section = styled.section`
  border: 1px solid ${(props) => props.theme.colors.border.field.default};
  border-radius: ${(props) => props.theme.grid.radius.default};
  background: ${(props) => props.theme.colors.background.primary};
  margin-bottom: ${(props) => props.theme.grid.unit * 3}px;
  overflow: hidden;
`

const AuthorForm = styled(Section)`
  margin: ${(props) => props.theme.grid.unit * 3}px;
`

const Title = styled.h4<{
  isInvalid?: boolean
}>`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding-right: 0.5rem;
  background: ${(props) =>
    props.isInvalid ? props.theme.colors.background.warning : 'transparent'};
  color: ${(props) =>
    props.isInvalid ? props.theme.colors.text.warning : 'inherit'};
`

const DropdownIndicator = styled(ArrowDownBlue)`
  border: 0;
  border-radius: 50%;
  margin-right: 0.6em;
  min-width: 20px;
`

const ToggleButton = styled.button<{
  isOpen: boolean
}>`
  flex-grow: 1;
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: 1rem;
  padding: 0.6em 0.5em;

  outline: none;

  &:focus {
    color: ${(props) => props.theme.colors.button.primary.border.hover};
  }

  svg {
    transform: ${(props) => (props.isOpen ? 'rotateX(180deg)' : 'initial')};
  }
`

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;

  outline: none;

  &:focus path {
    fill: ${(props) => props.theme.colors.button.primary.color.hover};
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`

export const AddAffiliationContainer = styled.div`
  padding-right: 0.71rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  circle,
  use {
    fill: ${(props) => props.theme.colors.brand.default};
  }

  path {
    mask: none;
  }
`
