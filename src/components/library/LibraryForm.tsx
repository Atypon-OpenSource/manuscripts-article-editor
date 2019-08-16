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

import PlusIcon from '@manuscripts/assets/react/PlusIcon'
import { buildKeyword } from '@manuscripts/manuscript-transform'
import {
  BibliographicName,
  BibliographyItem,
  Keyword,
} from '@manuscripts/manuscripts-json-schema'
import { PrimarySubmitButton } from '@manuscripts/style-guide'
import { TitleField } from '@manuscripts/title-editor'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import * as React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import { css, styled } from '../../theme/styled-components'

const Fields = styled.div`
  padding: 10px;
`

const baseTextStyleMixin = css`
  font-family: ${props => props.theme.fontFamily};
  font-size: 16px;
  letter-spacing: -0.2px;
`

const BaseLabel = styled.label`
  ${baseTextStyleMixin}
`

const Label = styled(BaseLabel)<{
  floatStyle?: string
  marginBottom?: string
  color?: string
}>`
  display: flex;
  flex-direction: column;
  letter-spacing: -0.3px;
  float: ${props => (props.floatStyle ? props.floatStyle : 'none')};
  margin-bottom: ${props =>
    props.marginBottom ? props.marginBottom + 'px' : '10px'};
  color: ${props =>
    props.color ? props.color : props.theme.colors.global.text.secondary};
`

const AuthorLabelText = styled(Label)<{ isSelected?: boolean }>`
  padding: 5px;
  color: ${props =>
    props.isSelected
      ? props.theme.colors.global.text.link
      : props.theme.colors.label.text};
`

const FieldLabel = styled(BaseLabel)`
  color: ${props => props.theme.colors.library.sidebar.field.label};
`

const TextFieldContainer = styled.div`
  display: inline-block;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: ${props => props.theme.colors.library.sidebar.field.border};
  background-color: #ffffff;
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

interface CollapsibleProps {
  className?: string
  title: string
}

interface CollapsibleState {
  isExpanded: boolean
}

class CollapsibleContainer extends React.Component<
  CollapsibleProps,
  CollapsibleState
> {
  public state: CollapsibleState = {
    isExpanded: false,
  }

  public toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault()
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  public render() {
    let { title } = this.props
    const { isExpanded } = this.state
    if (title === ' ' && !isExpanded) {
      title = 'Edit author name'
    }
    return (
      <StyledCollapsibleContainer isSelected={isExpanded}>
        <AuthorLabelText
          isSelected={isExpanded}
          onClick={this.toggleExpanded}
          marginBottom="5px"
        >
          {title} {isExpanded && String.fromCharCode(8963)}{' '}
          {!isExpanded && String.fromCharCode(8964)}
        </AuthorLabelText>
        {React.Children.map(this.props.children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...(this.props && { isExpanded: this.state.isExpanded }),
            })
          }
          return child
        })}
      </StyledCollapsibleContainer>
    )
  }
}

const StyledCollapsibleContainer = styled.div<{ isSelected?: boolean }>`
  color: black;
  cursor: default;
  border: none;
  max-width: 450px;
  text-align: left;
  outline: none;
  font-size: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.dialog.shadow};
  background-color: ${props =>
    props && props.isSelected
      ? props.theme.colors.library.sidebar.background.default
      : '#ffffff'};

  &:active,
  &:hover {
    background-color: ${props =>
      props.theme.colors.library.sidebar.background.default};
  }
`

interface CollapsibleItemProp {
  isExpanded?: boolean
  className?: string
}

class CollapsibleItem extends React.Component<CollapsibleItemProp> {
  public render() {
    const { isExpanded } = this.props

    return (
      <StyledCollapsibleItem isExpanded={isExpanded}>
        {React.Children.map(this.props.children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...this.props })
          }
          return child
        })}
      </StyledCollapsibleItem>
    )
  }
}

interface CollapsibleProps {
  height?: number
}

const StyledCollapsibleItem = styled.div<{ isExpanded?: boolean }>`
  display: ${props => (props.isExpanded ? 'block' : 'none')};
  overflow: hidden;
  background-color: ${props =>
    props.theme.colors.library.sidebar.background.default};
  color: black;
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  border-color: #aaa;
  margin: 7px 20px 20px 20px;
`

const StyledTitleField = styled(TitleField)`
  flex: 1;
  ${baseTextStyleMixin};
  line-height: 1.31;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.label.text};

  & .ProseMirror {
    &:focus {
      outline: none;
    }
  }
`

const YearField = styled(Field)`
  font-family: ${props => props.theme.fontFamily};
  padding-left: 5px;
  ${baseTextStyleMixin};
  line-height: 1.31;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.label.text};
  width: 140px;
  height: 40px;
  border-radius: 6px;
  border: solid 1px ${props => props.theme.colors.library.sidebar.field.label};
`

const Button = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.button.primary};
  border: 2px solid transparent;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  float: right;
  justify-content: center;
  padding: 1px 10px 3px;
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
const BaseButton = styled.button`
  ${baseTextStyleMixin};
  background-color: ${props =>
    props.theme.colors.library.sidebar.background.default};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.button.primary};
`

const RemoveButton = styled(BaseButton)<{ isExpanded?: boolean }>`
  display: ${props => (props.isExpanded ? 'block' : 'none')};
  margin-bottom: 20px;
`

const PlainTextButton = styled(BaseButton)`
  background-color: #ffffff;
  text-align: left;
`
const Author = styled.div`
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  border: none;
  width: auto;
  margin: 0px;

  & ${TextField} {
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ActionsGroup = styled.div`
  display: flex;
  align-items: right;
`

const AuthorFormContainer = styled.div`
  border-radius: 6px;
  border: solid 1px ${props => props.theme.colors.dialog.shadow};
  max-width: 450px;
`

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  border-radius: 6px;
  border: solid 1px ${props => props.theme.colors.dialog.shadow};
  padding: 9px 5px 9px 5px;
`

const TitleLink = styled.a`
  ${baseTextStyleMixin};
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.button.primary};
  padding: 0px 20px;
`

interface OptionType {
  label: string
  value: any // tslint:disable-line:no-any
}

interface Props {
  item: BibliographyItem
  handleDelete?: (item: BibliographyItem) => void
  handleSave: (item: BibliographyItem) => void
  projectID: string
}

const buildOptions = (data: Map<string, Keyword>) => {
  const options: OptionType[] = []

  for (const keyword of data.values()) {
    options.push({
      value: keyword._id,
      label: keyword.name,
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

// TODO: a "manage tags" page, where old tags can be deleted

const LibraryForm: React.FC<Props> = ({
  item,
  handleSave,
  handleDelete,
  projectID,
}) => (
  <ProjectKeywordsData projectID={projectID}>
    {(keywords, keywordActions) => (
      <Formik<LibraryFormValues>
        initialValues={buildInitialValues(item)}
        onSubmit={handleSave}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, handleChange }) => (
          <Form>
            <Fields>
              <Label>Title</Label>
              <TitleContainer>
                <StyledTitleField
                  value={values.title || ''}
                  handleChange={data => setFieldValue('title', data)}
                />
              </TitleContainer>

              <Label>
                <FieldArray
                  name={'author'}
                  render={arrayHelpers => (
                    <div
                      onClick={e => {
                        e.preventDefault()
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Label floatStyle="left" marginBottom="5">
                          Authors
                        </Label>
                        <Button
                          type={'button'}
                          onClick={() =>
                            arrayHelpers.push({ given: '', family: '' })
                          }
                        >
                          <PlusIcon height={17} width={17} />
                        </Button>
                      </div>
                      <div>
                        <AuthorFormContainer>
                          {values.author &&
                            values.author.map((author, index) => (
                              <CollapsibleContainer
                                title={
                                  (author.given || '') +
                                  ' ' +
                                  (author.family || '')
                                }
                              >
                                <CollapsibleItem>
                                  <Author key={`author.${index}`}>
                                    <Field
                                      name={`author.${index}.given`}
                                      value={author.given}
                                      onChange={handleChange}
                                    >
                                      {({ field }: FieldProps) => (
                                        <TextFieldContainer>
                                          <TextField
                                            {...field}
                                            placeholder={'Given'}
                                          />
                                          <FieldLabel>Given</FieldLabel>
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
                                            placeholder={'Family'}
                                          />
                                          <FieldLabel>Family</FieldLabel>
                                        </TextFieldContainer>
                                      )}
                                    </Field>
                                  </Author>
                                </CollapsibleItem>
                                <RemoveButton
                                  onClick={e => {
                                    e.preventDefault()
                                    arrayHelpers.remove(index)
                                  }}
                                >
                                  REMOVE
                                </RemoveButton>
                              </CollapsibleContainer>
                            ))}
                        </AuthorFormContainer>
                      </div>
                    </div>
                  )}
                />
              </Label>

              <Label>
                <Label floatStyle="left" marginBottom="5">
                  Year
                </Label>
                <YearField name={"issued['date-parts'][0][0]"} type="text" />
              </Label>
              <Label>
                <Label floatStyle="left" marginBottom="5">
                  Lists
                </Label>

                <Field name={'keywordIDs'}>
                  {(props: FieldProps) => (
                    <CreatableSelect<OptionType>
                      isMulti={true}
                      onChange={async (newValue: OptionsType<OptionType>) => {
                        props.form.setFieldValue(
                          props.field.name,
                          await Promise.all(
                            newValue.map(async option => {
                              const existing = keywords.get(option.value)

                              if (existing) return existing._id

                              const keyword = buildKeyword(String(option.label))

                              await keywordActions.create(keyword, {
                                containerID: projectID,
                              })

                              return keyword._id
                            })
                          )
                        )
                      }}
                      options={buildOptions(keywords)}
                      value={
                        props.field.value
                          ? (props.field.value as string[])
                              .filter(id => keywords.has(id))
                              .map(id => keywords.get(id)!)
                              .map(item => ({
                                value: item._id,
                                label: item.name,
                              }))
                          : null
                      }
                    />
                  )}
                </Field>
              </Label>

              <Actions>
                {handleDelete && (
                  <PlainTextButton onClick={() => handleDelete(item)}>
                    REMOVE FROM LIBRARY
                  </PlainTextButton>
                )}
                <ActionsGroup>
                  <TitleLink
                    href={`https://doi.org/${values.DOI}`}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                  >
                    OPEN
                  </TitleLink>
                  <PrimarySubmitButton>Save</PrimarySubmitButton>
                </ActionsGroup>
              </Actions>
            </Fields>
          </Form>
        )}
      </Formik>
    )}
  </ProjectKeywordsData>
)

export default LibraryForm
