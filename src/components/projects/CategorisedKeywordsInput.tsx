/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
import AddIcon from '@manuscripts/assets/react/AddIcon'
import AnnotationRemove from '@manuscripts/assets/react/AnnotationRemove'
import Artboard from '@manuscripts/assets/react/Artboard'
import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import Highlight from '@manuscripts/assets/react/ToolbarIconHighlight'
import VerticalEllipsis from '@manuscripts/assets/react/VerticalEllipsis'
import {
  Build,
  buildKeyword,
  buildKeywordGroup,
} from '@manuscripts/manuscript-transform'
import {
  Keyword,
  KeywordGroup,
  Manuscript,
  Model,
  Section,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog, IconButton } from '@manuscripts/style-guide'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Manager, Popper } from 'react-popper'
import { OptionProps } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'

import { useSyncedData } from '../../hooks/use-synced-data'
import { selectStyles } from '../../lib/select-styles'
import { AnyElement } from '../inspector/ElementStyleInspector'
import { MediumTextField } from './inputs'
import { SaveModel } from './ManuscriptInspector'
import { PlusIcon } from './Status/StatusIcons'
import {
  Container,
  EditingPopper,
  OptionWrapper,
  OuterContainer,
} from './TagsInput'

const OptionLabel = styled.div`
  width: fit-content;
  font-size: ${(props) => props.theme.font.size.normal};
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  border-radius: 6px;
`

const KeywordButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  position: relative;
  color: #545454;
  padding: 8px 0;
  margin-bottom: 2px;
  cursor: pointer;
  svg {
    margin-right: 6px;
  }
`
const KeywordDeleteButton = styled(KeywordButton)`
  color: #f35143;
  path {
    fill: #f35143;
  }
`

const Separator = styled.div`
  margin: ${(props) => props.theme.grid.unit * 2}px 0
    ${(props) => props.theme.grid.unit * 2}px 0;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  height: 1px;
`
const LabelContainer = styled.div<{ isCreate: boolean }>`
  display: flex;
  align-items: ${(props) => (props.isCreate && 'center') || 'flex-start'};
  ${(props) => !props.isCreate && 'flex-flow: column'};
`
const KeywordCategory = styled.div`
  color: #6e6e6e;
  font-size: 10px;
  padding: 0 ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
`
const EditKeyword = styled(IconButton)<{
  focused: boolean
}>`
  height: ${(props) => props.theme.grid.unit * 4}px;
  border: none;
  svg {
    height: ${(props) => props.theme.grid.unit * 4}px;

    g {
      fill: none;
    }
  }
  &:hover {
    g {
      fill: ${(props) => props.theme.colors.brand.medium};
    }
  }
  ${(props) => props.focused && 'g { fill: #1a9bc7 !important; }'};
`

const CategoryInput = styled.input`
  border-radius: 6px;
  background: #f2fbfc;
  border: 1px solid #bce7f6;
  margin-left: 14px;
  padding: 3px 6px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:disabled {
    border: none;
    background: transparent;
  }
`
const CategoryEditButton = styled.button`
  border: none;
  background: transparent;
  &:hover {
    background: #f2fbfc;
  }
  path {
    fill: #6e6e6e;
    stroke: #6e6e6e;
  }
`
const CategoryEditWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  margin: 0 -16px;
  position: relative;
  cursor: pointer;
  &:hover {
    background: #f2fbfc;
  }
`
const Tick = styled(Artboard)`
  min-width: 13px;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  path:first-child {
    fill: transparent;
  }
  path {
    fill: grey;
  }
`

const KeywordField = styled(MediumTextField)`
  margin-bottom: 16px;
`

interface CategoriesMap {
  [key: string]: KeywordGroup
}

export const CategorisedKeywordsInput: React.FC<{
  saveModel: SaveModel
  target: AnyElement | Section | Manuscript
  modelMap: Map<string, Model>
  deleteModel: (id: string) => Promise<string>
}> = ({ saveModel, target, modelMap, deleteModel }) => {
  const [keywordToEdit, setKeywordToEdit] = useState<Keyword>()
  const [isOpen, setOpen] = useState<boolean>(false)

  const nodeRef = useRef<HTMLDivElement>(null)

  const keywords: Keyword[] = []
  const categories: CategoriesMap = {}
  for (const model of modelMap.values()) {
    if (model._id.startsWith('MPKeyword:')) {
      keywords.push(model as Keyword)
    }
    if (model._id.startsWith('MPKeywordGroup:')) {
      const group = model as KeywordGroup
      if (group.title) {
        const categoryName = group.title.trim().replace(/:/i, '')
        categories[categoryName] = group
      }
    }
  }

  const getCategoryTitleById = (id: string) => {
    const cat = Object.entries(categories).find(
      ([, keywordsGroup]) => keywordsGroup._id === id
    )
    return cat && cat[0] ? cat[0] : ''
  }

  const handleClickOutside = useCallback(
    async (event: Event) => {
      if (
        nodeRef.current &&
        !(event.target as Element).classList.contains('VerticalEllipsis') &&
        !nodeRef.current.contains(event.target as Node) &&
        !isOpen
      ) {
        setKeywordToEdit(undefined)
      }
    },
    [isOpen]
  )

  useEffect(() => {
    if (keywordToEdit) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside, keywordToEdit])

  const editKeyword = useCallback(
    (event: React.MouseEvent, tag: Keyword) => {
      event.stopPropagation()
      setKeywordToEdit(tag)
    },
    [setKeywordToEdit]
  )

  const setCatForKeyword = (keyword: Keyword, category: KeywordGroup) => {
    const newKeyword = {
      ...keyword,
      containedGroup: category._id,
    }
    saveModel<Keyword>(newKeyword)
    return newKeyword
  }

  const addCategory = async (title: string) => {
    if (!Object.keys(categories).includes(title)) {
      const category = await saveModel(
        buildKeywordGroup({ title, type: 'author' })
      )
      if (keywordToEdit) {
        const keyword = setCatForKeyword(keywordToEdit, category)
        setKeywordToEdit(keyword)
      }
    }
  }

  const deleteCategory = (id: string) => {
    keywords.map((tag) => {
      if (tag.containedGroup === id) {
        saveModel({
          ...tag,
          containedGroup: undefined,
        })
      }
    })
    deleteModel(id)
  }
  const deleteKeyword = async (id: string) => {
    await deleteModel(id) // why async/await here? a mystery to me but it doesn seesm to work w/o it
    // remove the model
    await saveModel<AnyElement | Section | Manuscript>({
      ...target,
      keywordIDs: keywordIDs.filter((kid) => kid !== id),
    })
  }
  const changeTitle = (category: KeywordGroup, title: string) => {
    saveModel<KeywordGroup>({
      ...category,
      title,
    })
  }

  const keywordIDs = target.keywordIDs || []
  const options = keywords.filter(
    (keyword) => !keywordIDs.includes(keyword._id)
  )
  const optionIndex = (keyword: Keyword) => {
    return options
      .map((keyword) => {
        return keyword._id
      })
      .indexOf(keyword._id)
  }

  const OptionComponent: React.FC<OptionProps<Keyword, true>> = ({
    innerRef,
    innerProps,
    children,
    data,
  }) => {
    const isCreate = data.name.startsWith('Create keyword')
    const category = getCategoryTitleById(data.containedGroup)
    return (
      <OptionWrapper
        focused={keywordToEdit ? data._id === keywordToEdit._id : false}
        ref={innerRef}
        {...innerProps}
      >
        <LabelContainer isCreate={isCreate}>
          {isCreate && <PlusIcon />}
          <OptionLabel>{children}</OptionLabel>
          {category && <KeywordCategory>{category}</KeywordCategory>}
        </LabelContainer>
        {!isCreate && (
          <EditKeyword
            onClick={(event) => editKeyword(event, data)}
            className="VerticalEllipsis"
            focused={keywordToEdit ? data._id === keywordToEdit._id : false}
          >
            <VerticalEllipsis />
          </EditKeyword>
        )}
      </OptionWrapper>
    )
  }
  return (
    <Manager>
      <OuterContainer>
        <CreatableSelect<Keyword, true>
          getNewOptionData={(inputValue) => {
            const option = {
              name: `Create keyword "${inputValue}"`,
            }

            return option as Keyword
          }}
          onCreateOption={async (inputValue) => {
            const keyword: Build<Keyword> = buildKeyword(inputValue)

            await saveModel<AnyElement | Section | Manuscript>({
              ...target,
              keywordIDs: [...keywordIDs, keyword._id],
            })

            await saveModel<Keyword>(keyword)
          }}
          options={keywords}
          isOptionDisabled={(option) => {
            const isCreate = option.name.startsWith('Create keyword')
              ? true
              : false
            return !isCreate
          }}
          placeholder={'Add new or edit existing...'}
          getOptionValue={(option) => option._id}
          getOptionLabel={(option) => option.name}
          styles={{
            ...selectStyles,
            multiValueLabel: () => ({
              paddingRight: 2,
              alignItems: 'center',
              display: 'flex',
            }),
            multiValue: (base, { data }) => ({
              ...base,
              backgroundColor: '#F2F2F2',
              color: '#F2F2F2',
              alignItems: 'center',
              paddingRight: 8,
              paddingLeft: 8,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 6,
            }),
            multiValueRemove: (base, { data }) => ({
              color: '#ffffff',
              borderRadius: '50%',
              height: 14,
              width: 14,
              cursor: 'pointer',
            }),
            menu: (base) => ({
              ...base,
              boxShadow: '0 10px 17px 0 rgba(84,83,83,0.3)',
              borderRadius: 8,
            }),
            menuList: (base) => ({
              ...base,
              paddingBottom: 8,
              paddingTop: 8,
            }),
          }}
          menuPortalTarget={document.body}
          menuIsOpen={keywordToEdit ? true : undefined}
          components={{ Option: OptionComponent }}
        />

        {keywordToEdit && (
          <Container ref={nodeRef}>
            <Popper>
              {({ ref, placement }) => (
                <div
                  ref={ref}
                  style={{
                    zIndex: 100,
                    position: 'absolute',
                    bottom: '100%',
                    right: '0',
                    marginBottom: -40 * optionIndex(keywordToEdit),
                  }}
                  data-placement={placement}
                >
                  <EditingPopper>
                    <TagNameInput
                      value={keywordToEdit.name}
                      handleChange={async (name) => {
                        const keyword = await saveModel<Keyword>({
                          ...keywordToEdit,
                          name,
                        })
                        setKeywordToEdit(keyword)
                      }}
                    />
                    <Separator />
                    <EditKeywordCat
                      tag={keywordToEdit}
                      categories={categories}
                      setTag={setKeywordToEdit}
                      setCatForKeyword={setCatForKeyword}
                      changeTitle={changeTitle}
                      deleteCategory={deleteCategory}
                      deleteKeyword={deleteKeyword}
                      addCategory={addCategory}
                      closeEdit={() => {
                        setKeywordToEdit(undefined)
                      }}
                      isOpen={isOpen}
                      setOpen={setOpen}
                    />
                  </EditingPopper>
                </div>
              )}
            </Popper>
          </Container>
        )}
      </OuterContainer>
    </Manager>
  )
}

const TagNameInput: React.FC<{
  value: string
  handleChange: (name: string) => void
}> = ({ value, handleChange }) => {
  const [currentValue, handleLocalChange] = useSyncedData<string>(
    value,
    handleChange,
    500
  )

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleLocalChange(event.target.value)
    },
    [handleLocalChange]
  )

  return (
    <KeywordField
      value={currentValue}
      onChange={handleInputChange}
      autoFocus={true}
    />
  )
}

const NewCategoryInput: React.FC<{
  addCategory: (title: string) => void
  onCancel: () => void
}> = ({ addCategory, onCancel }) => {
  const [inputValue, setInputValue] = useState('')

  return (
    <CategoryEditWrapper>
      <CategoryInput
        type="text"
        value={inputValue}
        placeholder="New Category..."
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            addCategory(inputValue)
            onCancel()
          }
        }}
        onBlur={onCancel}
      />

      <CategoryEditButton onClick={() => onCancel()}>
        <CloseIconDark height={10} width={10} />
      </CategoryEditButton>
    </CategoryEditWrapper>
  )
}
const EditCategoryTitle: React.FC<{
  category: KeywordGroup
  name: string
  deleteCategory: (id: string) => void
  changeTitle: (category: KeywordGroup, title: string) => void
  setCatForKeyword: () => void
  current: boolean
}> = ({
  category,
  name,
  changeTitle,
  deleteCategory,
  setCatForKeyword,
  current,
}) => {
  const [inputValue, setInputValue] = useState(name)
  const [inputEnabled, toggleEnabled] = useState(false)

  const completeEdit = () => {
    changeTitle(category, inputValue)
    toggleEnabled(false)
  }

  return (
    <CategoryEditWrapper
      onClick={() => {
        if (!inputEnabled) {
          setCatForKeyword()
        }
      }}
    >
      {current && <Tick />}
      <CategoryInput
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            completeEdit()
          }
        }}
        onBlur={completeEdit}
        disabled={!inputEnabled}
      />
      {!inputEnabled ? (
        <CategoryEditButton onClick={() => toggleEnabled(true)}>
          <Highlight height={12} width={12} />
        </CategoryEditButton>
      ) : (
        <CategoryEditButton onClick={() => deleteCategory(category._id)}>
          <CloseIconDark height={10} width={10} />
        </CategoryEditButton>
      )}
    </CategoryEditWrapper>
  )
}

const EditKeywordCat: React.FC<{
  tag: Keyword
  categories: CategoriesMap
  isOpen: boolean
  setOpen: (value: boolean) => void
  setTag: (value: Keyword | undefined) => void
  setCatForKeyword: (keyword: Keyword, cat: KeywordGroup) => Keyword
  deleteCategory: (id: string) => void
  changeTitle: (category: KeywordGroup, title: string) => void
  deleteKeyword: (id: string) => void
  addCategory: (title: string) => void
  closeEdit: () => void
}> = ({
  tag,
  categories,
  isOpen,
  setCatForKeyword,
  deleteCategory,
  changeTitle,
  deleteKeyword,
  addCategory,
  closeEdit,
  setTag,
  setOpen,
}) => {
  const [inputEnabled, toggleEnabled] = useState<boolean>(false)
  const actions = {
    primary: {
      action: () => {
        setOpen(false)
        closeEdit()
      },
      title: 'Cancel',
    },
    secondary: {
      action: () => {
        deleteKeyword(tag._id)
        setOpen(false)
        closeEdit()
      },
      title: 'Remove',
    },
  }
  return (
    <div>
      {Object.entries(categories).map(([name, cat]) => (
        <EditCategoryTitle
          key={name}
          category={cat}
          name={name}
          current={tag.containedGroup === cat._id}
          setCatForKeyword={() => {
            const newTag = setCatForKeyword(tag, cat)
            setTag(newTag)
          }}
          deleteCategory={deleteCategory}
          changeTitle={changeTitle}
        />
      ))}
      {inputEnabled ? (
        <NewCategoryInput
          addCategory={addCategory}
          onCancel={() => toggleEnabled(false)}
        />
      ) : (
        <KeywordButton onClick={() => toggleEnabled(true)} type={'button'}>
          <AddIcon width={16} height={16} />
          <span>New Category</span>
        </KeywordButton>
      )}
      <Separator />
      <KeywordDeleteButton
        type={'button'}
        onClick={() => {
          setOpen(true)
        }}
      >
        <AnnotationRemove fill={'#F35143'} width={16} height={16} />
        <span>Delete Keyword</span>
      </KeywordDeleteButton>
      {isOpen && (
        <Dialog
          isOpen={isOpen}
          actions={actions}
          category={Category.confirmation}
          header={'Remove keyword'}
          message={`Are you sure you want to remove ${tag.name} from the keywords list?`}
        />
      )}
    </div>
  )
}
