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
import VerticalEllipsis from '@manuscripts/assets/react/VerticalEllipsis'
import {
  Build,
  buildColor,
  generateID,
} from '@manuscripts/manuscript-transform'
import {
  Color,
  ColorScheme,
  Manuscript,
  ObjectTypes,
  Section,
  Tag,
} from '@manuscripts/manuscripts-json-schema'
import {
  IconButton,
  PrimaryButton,
  SecondaryButton,
} from '@manuscripts/style-guide'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ChromePicker, ColorResult } from 'react-color'
import { Manager, Popper } from 'react-popper'
import { OptionProps } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'

import { useSyncedData } from '../../hooks/use-synced-data'
import { PlusIcon } from '../../Icons'
import { buildColors, nextColorPriority } from '../../lib/colors'
import { selectStyles } from '../../lib/select-styles'
import { ascendingPriority } from '../../lib/sort'
import { useStore } from '../../store'
import { AnyElement } from '../inspector/ElementStyleInspector'
import { Popup } from '../nav/Updates'
import { MediumTextField } from './inputs'
import { SaveModel } from './ManuscriptInspector'

const ColorPopper = styled(Popup)`
  z-index: 10;
  position: absolute;
  right: 50%;
  width: fit-content;
  max-width: 200px;
  min-width: 140px;
  height: fit-content;
  padding: ${(props) => props.theme.grid.unit * 4}px;
`
export const OptionWrapper = styled.div<{ focused?: boolean }>`
  padding-left: ${(props) => props.theme.grid.unit * 4}px;
  padding-top: ${(props) => props.theme.grid.unit * 2}px;
  padding-bottom: ${(props) => props.theme.grid.unit * 2}px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${(props) =>
    props.focused ? props.theme.colors.background.fifth : 'transparent'};

  &:hover {
    background-color: ${(props) => props.theme.colors.background.fifth};
    g {
      fill: ${(props) => props.theme.colors.text.secondary};
    }
  }
`
const OptionLabel = styled.div<{
  backgroundColor: string
  textColor: string
}>`
  background-color: ${(props) => props.backgroundColor};
  width: fit-content;
  font-size: ${(props) => props.theme.font.size.normal};
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  border-radius: 6px;
  color: ${(props) => props.textColor};
`
export const OuterContainer = styled.div`
  width: 100%;
`

export const Container = styled.div`
  position: relative;
`
const ColorButton = styled.button<{
  color?: string
  isActive: boolean
}>`
  background: ${(props) => props.color};
  box-shadow: ${(props) => (props.isActive ? '0 0 1px 1px #BCE7F6' : 'none')};
  height: ${(props) => props.theme.grid.unit * 6}px;
  width: ${(props) => props.theme.grid.unit * 6}px;
  border-radius: 50%;
  margin: 4px 2px;
  padding: 0;
  border: 1px solid ${(props) => props.theme.colors.border.tertiary};
  cursor: pointer;
  flex-shrink: 0;

  ${(props) => props.isActive && 'border: 1px solid white;'};

  &:hover {
    ${(props) => !props.isActive && `border: 1px solid #F2FBFC`};
  }

  &:focus {
    outline: none;
  }
`
// const DeleteButton = styled(IconTextButton)`
//   color: ${props => props.theme.colors.text.error};
//   font-size: ${props => props.theme.font.size.normal};
// `
const AddColorButton = styled(ColorButton)`
  background: transparent;
  border: 1px dashed #e2e2e2;
  position: relative;

  ::before,
  ::after {
    background-color: #e2e2e2;
    border-radius: 2px;
    content: ' ';
    display: block;
    height: 14px;
    transform: rotate(90deg);
    width: 2px;
    position: absolute;
    top: calc(50% - 7px);
    left: calc(50% - 1px);
  }
  ::after {
    transform: rotate(180deg);
  }

  &:hover {
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    background: ${(props) => props.theme.colors.background.fifth};

    ::before,
    ::after {
      background-color: #1a9bc7 !important;
    }
  }
`
const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const PopperContent = styled.div`
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  padding: ${(props) => props.theme.grid.unit * 2}px;

  .chrome-picker {
    box-shadow: none !important;
    width: unset !important;
  }
`
export const EditingPopper = styled(PopperContent)`
  width: fit-content;
  max-width: 200px;
  min-width: 140px;
  height: fit-content;
  padding: ${(props) => props.theme.grid.unit * 4}px;
`
const Separator = styled.div`
  margin: ${(props) => props.theme.grid.unit * 4}px 0;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  height: 1px;
`
const LabelContainer = styled.div`
  display: flex;
  align-items: center;
`
const EditTag = styled(IconButton)<{
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
export const TagsInput: React.FC<{
  target: AnyElement | Section | Manuscript
}> = ({ target }) => {
  const [saveModel] = useStore((store) => store.saveModel)
  const [tags] = useStore((store) => store.tags || [])
  const [modelMap] = useStore((store) => store.modelMap)
  const [createdTag, setCreatedTag] = useState<Tag>()
  const [openPicker, setOpen] = useState(false)
  const [pickedColor, setColor] = useState('#ffffff')
  const [tagToEdit, setTagToEdit] = useState<Tag>()

  const nodeRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(async (event: Event) => {
    if (
      nodeRef.current &&
      !(event.target as Element).className.includes('VerticalEllipsis') &&
      !nodeRef.current.contains(event.target as Node)
    ) {
      setTagToEdit(undefined)
      setOpen(false)
      setColor('#ffffff')
    }
  }, [])

  useEffect(() => {
    if (tagToEdit) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside, tagToEdit])

  const editTag = useCallback(
    (event: React.MouseEvent, tag: Tag) => {
      event.stopPropagation()
      setTagToEdit(tag)
    },
    [setTagToEdit]
  )

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      setColor(color.hex)
    },
    [setColor]
  )

  const { colors, colorScheme } = buildColors(modelMap, 'MPColorScheme:tags')

  const handleAddColor = useCallback(async () => {
    if (!colorScheme) {
      return null
    }

    if (pickedColor) {
      for (const color of colors) {
        if (color.value === pickedColor) {
          return null
        }
      }

      const color = buildColor(pickedColor, nextColorPriority(colors)) as Color

      await saveModel<Color>({
        ...color,
        prototype: color._id,
      })

      await saveModel<ColorScheme>({
        ...colorScheme,
        colors: [...(colorScheme.colors || []), color._id],
      })
    }

    setOpen(false)
    setColor('#ffffff')
  }, [colorScheme, colors, pickedColor, saveModel])

  if (!colorScheme) {
    return null
  }

  const colorsMap = new Map<string, Color>()

  for (const color of colors) {
    colorsMap.set(color._id, color)
  }

  const keywordIDs = target.keywordIDs || []
  const targetTags = tags.filter((tag) => keywordIDs.includes(tag._id))
  const ordered = targetTags.sort(ascendingPriority)

  const options = tags.filter((tag) => !keywordIDs.includes(tag._id))
  const optionIndex = (tag: Tag) => {
    return options
      .map((tag) => {
        return tag._id
      })
      .indexOf(tag._id)
  }

  const OptionComponent: React.FC<OptionProps<Tag, true>> = ({
    innerRef,
    innerProps,
    children,
    data,
  }) => {
    const isCreate = data.name.startsWith('Create tag')
    const backgroundColor = colorsMap.get(data.color)
      ? colorsMap.get(data.color)!.value
      : isCreate
      ? 'unset'
      : '#F2F2F2'

    const color = isCreate ? '#000000' : textColor(backgroundColor!)

    return (
      <OptionWrapper
        focused={tagToEdit ? data._id === tagToEdit._id : false}
        ref={innerRef}
        {...innerProps}
      >
        <LabelContainer>
          {isCreate && <PlusIcon />}
          <OptionLabel backgroundColor={backgroundColor!} textColor={color}>
            {children}
          </OptionLabel>
        </LabelContainer>
        {!isCreate && (
          <EditTag
            onClick={(event) => editTag(event, data)}
            className="VerticalEllipsis"
            focused={tagToEdit ? data._id === tagToEdit._id : false}
          >
            <VerticalEllipsis />
          </EditTag>
        )}
      </OptionWrapper>
    )
  }

  const removeBackgroundColor = (data: any) => {
    return textColor(
      colorsMap.get(data.color) ? colorsMap.get(data.color)!.value! : '#F2F2F2'
    ) === '#ffffff'
      ? '#ffffff'
      : '#6E6E6E'
  }

  return (
    <Manager>
      <OuterContainer>
        <CreatableSelect<Tag, true>
          getNewOptionData={(inputValue) => {
            const option = {
              name: `Create tag for "${inputValue}"`,
            }

            return option as Tag
          }}
          onCreateOption={async (inputValue) => {
            const tag: Build<Tag> = {
              _id: generateID(ObjectTypes.Tag),
              objectType: ObjectTypes.Tag,
              name: inputValue,
              priority: tags.length,
            }

            const createdTag = await saveModel<Tag>(tag)
            await saveModel<AnyElement | Section | Manuscript>({
              ...target,
              keywordIDs: [...keywordIDs, tag._id],
            })
            setCreatedTag(createdTag)
          }}
          options={tags}
          value={ordered}
          getOptionValue={(option) => option._id}
          getOptionLabel={(option) => option.name}
          onMenuOpen={() => setCreatedTag(undefined)}
          onChange={async (tags: Tag[]) => {
            await saveModel<AnyElement | Section | Manuscript>({
              ...target,
              keywordIDs: tags ? tags.map((tag) => tag._id) : [],
            })
          }}
          styles={{
            ...selectStyles,
            multiValueLabel: () => ({
              paddingRight: 2,
              alignItems: 'center',
              display: 'flex',
            }),
            multiValue: (base, { data }) => ({
              ...base,
              backgroundColor:
                colorsMap.get(data.color || '')?.value || '#F2F2F2',
              color: textColor(
                colorsMap.get(data.color || '')?.value || '#F2F2F2'
              ),
              alignItems: 'center',
              paddingRight: 8,
              paddingLeft: 8,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 6,
            }),
            multiValueRemove: (base, { data }) => ({
              backgroundColor: removeBackgroundColor(data),
              color:
                removeBackgroundColor(data) === '#ffffff'
                  ? '#6E6E6E'
                  : '#ffffff',
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
          menuIsOpen={tagToEdit ? true : undefined}
          components={{ Option: OptionComponent }}
        />

        {createdTag && (
          <Container>
            <Popper placement={'bottom'}>
              {({ ref, placement }) => (
                <div ref={ref} data-placement={placement}>
                  <ColorPopper>
                    <EditColor
                      tag={createdTag}
                      colors={colors}
                      setTag={setCreatedTag}
                      saveModel={saveModel}
                      openPicker={setOpen}
                    />
                  </ColorPopper>
                </div>
              )}
            </Popper>
            {openPicker && (
              <div
                style={{
                  zIndex: 10,
                  position: 'absolute',
                  right: '50%',
                }}
              >
                <ColorPicker
                  pickedColor={pickedColor}
                  handleAddColor={handleAddColor}
                  handleColorChange={handleColorChange}
                  handleCancel={setOpen}
                />
              </div>
            )}
          </Container>
        )}

        {tagToEdit && (
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
                    marginBottom: -40 * optionIndex(tagToEdit),
                  }}
                  data-placement={placement}
                >
                  <EditingPopper>
                    <TagNameInput
                      value={tagToEdit.name}
                      handleChange={async (name) => {
                        const tag = await saveModel<Tag>({
                          ...tagToEdit,
                          name,
                        })
                        setTagToEdit(tag)
                      }}
                    />
                    <Separator />

                    <EditColor
                      tag={tagToEdit}
                      colors={colors}
                      setTag={setTagToEdit}
                      saveModel={saveModel}
                      openPicker={setOpen}
                    />
                    <Separator />
                    {/* <Action>
                      <DeleteButton
                        onClick={async () => {
                          // await deleteModel(tagToEdit._id)
                          setTagToEdit(undefined)
                        }}
                      >
                        Delete Tag
                      </DeleteButton>
                    </Action> */}
                  </EditingPopper>
                </div>
              )}
            </Popper>
            {openPicker && (
              <div
                style={{
                  zIndex: 100,
                  position: 'absolute',
                  bottom: '100%',
                  right: '0',
                  marginBottom: -40 * optionIndex(tagToEdit),
                }}
              >
                <ColorPicker
                  pickedColor={pickedColor}
                  handleAddColor={handleAddColor}
                  handleColorChange={handleColorChange}
                  handleCancel={setOpen}
                />
              </div>
            )}
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
    <MediumTextField
      value={currentValue}
      onChange={handleInputChange}
      autoFocus={true}
    />
  )
}

const EditColor: React.FC<{
  tag: Tag
  colors: Color[]
  setTag: (value: Tag | undefined) => void
  saveModel: SaveModel
  openPicker: (value: boolean) => void
}> = ({ tag, colors, setTag, saveModel, openPicker }) => {
  return (
    <div>
      {colors.map((color) => (
        <ColorButton
          key={color._id}
          type={'button'}
          color={color.value}
          isActive={
            tag.color === color._id ||
            (tag.color === undefined && color.value === '#E2E2E2')
          }
          onClick={async () => {
            await saveModel<Tag>({
              ...tag,
              color: color._id,
            })
            setTag(undefined)
          }}
        />
      ))}
      <AddColorButton
        type={'button'}
        isActive={false}
        onClick={() => openPicker(true)}
      />
    </div>
  )
}

const ColorPicker: React.FC<{
  pickedColor: string
  handleColorChange: (color: ColorResult) => void
  handleAddColor: () => void
  handleCancel: (value: boolean) => void
}> = ({ pickedColor, handleColorChange, handleAddColor, handleCancel }) => {
  return (
    <Popper placement={'bottom'}>
      {() => (
        <PopperContent>
          <ChromePicker
            onChangeComplete={handleColorChange}
            color={pickedColor}
          />

          <Actions>
            <PrimaryButton mini={true} onClick={handleAddColor}>
              Add color
            </PrimaryButton>

            <SecondaryButton mini={true} onClick={() => handleCancel(false)}>
              Cancel
            </SecondaryButton>
          </Actions>
        </PopperContent>
      )}
    </Popper>
  )
}

const textColor = (backgroundColor: string) => {
  const r = parseInt(backgroundColor.substr(1, 2), 16)
  const g = parseInt(backgroundColor.substr(3, 2), 16)
  const b = parseInt(backgroundColor.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq > 186 ? '#000000' : '#ffffff'
}
