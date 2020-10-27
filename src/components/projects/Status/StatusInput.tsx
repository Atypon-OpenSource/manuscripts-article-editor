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
import { buildStatusLabel } from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  Section,
  StatusLabel,
} from '@manuscripts/manuscripts-json-schema'
import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import React, { useCallback } from 'react'
import {
  components,
  IndicatorProps,
  MenuProps,
  OptionProps,
  OptionTypeBase,
  SingleValueProps,
} from 'react-select'
import CreatableSelect from 'react-select/creatable'

import { AnyElement } from '../../inspector/ElementStyleInspector'
import { SaveModel } from '../ManuscriptInspector'
import StatusDnD from './StatusDnD'
import RenderIcon, {
  calculateCircumference,
  CloseIcon,
  PlusIcon,
} from './StatusIcons'
import {
  AlertContainer,
  customStyles,
  DndItemButton,
  DndZone,
  IconSpan,
  StatusInputWrapper,
} from './StatusInputStyling'

interface StatusInputProps {
  labels: StatusLabel[]
  saveModel: SaveModel
  target: AnyElement | Section | Manuscript
  isOverdue?: boolean
  isDueSoon?: boolean
}

export const StatusInput: React.FC<StatusInputProps> = ({
  labels,
  saveModel,
  target,
  isOverdue,
  isDueSoon,
}) => {
  const sortedLabels = React.useMemo(
    () =>
      [...labels].sort((a, b) =>
        a.priority && b.priority ? (a.priority > b.priority ? 1 : -1) : 0
      ),
    [labels]
  )
  const [newLabel, setNewLabel] = React.useState('')
  const [alertVisible, setAlertVisible] = React.useState(false)
  const [displayDndZone, setDisplayDndZone] = React.useState(false)
  const [forceMenuOpen, setForceMenuOpen] = React.useState(undefined)
  // const [showTooltip, setShowTooltip] = React.useState(false)
  const label = sortedLabels.filter((label) => label._id === target.status)

  const updateTargetStatus = useCallback(
    async (status: StatusLabel) => {
      await saveModel<AnyElement | Section | Manuscript>({
        ...target,
        status: status ? status._id : undefined,
      })
    },
    [saveModel, target]
  )

  React.useEffect(() => {
    if (labels.length > 0 && !!newLabel && !forceMenuOpen) {
      setAlertVisible(!!newLabel)
      // wait a small amount of time so the alert is read
      window.setTimeout(() => {
        window.setTimeout(() => {
          // hide the alert
          setAlertVisible(false)
        }, 2000)
      }, 500)
    }
  }, [newLabel, labels, forceMenuOpen])

  const ClearIndicator = (clearIProps: IndicatorProps<OptionTypeBase>) =>
    components.ClearIndicator && (
      <components.ClearIndicator {...clearIProps}>
        <CloseIcon />
      </components.ClearIndicator>
    )

  const Menu = (menuProps: MenuProps<OptionTypeBase>) =>
    components.Menu && (
      <components.Menu {...menuProps}>
        <>
          {displayDndZone ? (
            <DndZone>
              <StatusDnD
                tasks={sortedLabels}
                newTask={newLabel}
                saveOrder={handleCreateOption}
              />
            </DndZone>
          ) : (
            menuProps.children
          )}
        </>
      </components.Menu>
    )

  const renderCreateOptionIcon = (data: StatusLabel) => {
    const isNewLabel = data.name.startsWith('Create ')
    return isNewLabel ? <PlusIcon /> : RenderIcon(data._id, sortedLabels)
  }
  const Option = (optionProps: OptionProps<OptionTypeBase>) =>
    components.Option && (
      <components.Option {...optionProps}>
        <DndItemButton
          className="padded"
          isDisabled={optionProps.isDisabled}
          isSelected={optionProps.isSelected}
          isFocused={optionProps.isFocused}
          pie={calculateCircumference(optionProps.data._id, sortedLabels)}
        >
          {renderCreateOptionIcon(optionProps.data)}
          {optionProps.data.name}
        </DndItemButton>
      </components.Option>
    )

  const SingleValue = (singleValueProps: SingleValueProps<OptionTypeBase>) => {
    return (
      components.SingleValue && (
        <components.SingleValue {...singleValueProps}>
          <DndItemButton
            isOverdue={isOverdue}
            isDueSoon={isDueSoon}
            pie={calculateCircumference(
              singleValueProps.data._id,
              sortedLabels
            )}
          >
            <IconSpan
            // onMouseEnter={() => setShowTooltip(true)}
            // onMouseLeave={() => setShowTooltip(false)}
            >
              {RenderIcon(singleValueProps.data._id, sortedLabels)}
            </IconSpan>
            {singleValueProps.data.name}
          </DndItemButton>
        </components.SingleValue>
      )
    )
  }

  const handleCreateOptionAfter = useCallback(() => {
    // reset the menu
    setDisplayDndZone(false)
    setForceMenuOpen(undefined)
  }, [])
  const handleCreateOptionBefore = useCallback((term: string) => {
    setNewLabel(term)

    // toggle menu to dnd mode
    setDisplayDndZone(true)
    // @ts-ignore
    setForceMenuOpen(true)
  }, [])
  const handleCreateOption = useCallback(
    async (label: StatusLabel | string, priority: number) => {
      let status
      if (typeof label === 'string') {
        status = { ...buildStatusLabel(label), priority }
      } else {
        status = {
          ...label,
          priority,
        }
      }

      await saveModel<StatusLabel>(status).then((newStatus) => {
        if (typeof label === 'string') {
          // Make the newly created label as the new status
          updateTargetStatus(newStatus)
          handleCreateOptionAfter()
        }
      })
    },
    [handleCreateOptionAfter, saveModel, updateTargetStatus]
  )

  return (
    <StatusInputWrapper>
      <CreatableSelect
        components={{
          ClearIndicator,
          Menu,
          Option,
          SingleValue,
        }}
        createOptionPosition="first"
        isClearable={true}
        isSearchable={true}
        getNewOptionData={(inputValue) => {
          const option = {
            name: `Create "${inputValue}"`,
          }
          return option as StatusLabel
        }}
        getOptionValue={(option) => option._id}
        getOptionLabel={(option) => option.name}
        menuIsOpen={forceMenuOpen}
        menuPortalTarget={document.body}
        onChange={updateTargetStatus}
        onCreateOption={handleCreateOptionBefore}
        options={sortedLabels}
        styles={customStyles}
        value={label}
        placeholder={'None'}
      />

      {/* {showTooltip && (
        <Tooltip>
          <StatusInputTipDropdown
            target={target}
            selectedLabelPriority={label[0].priority || 0}
            sortedLabels={sortedLabels}
            isDueSoon={isDueSoon}
            isOverdue={isOverdue}
          />
        </Tooltip>
      )} */}

      {alertVisible && (
        <AlertContainer>
          <AlertMessage type={AlertMessageType.success} hideCloseButton={true}>
            The &quot;{newLabel}&quot; status is created
          </AlertMessage>
        </AlertContainer>
      )}
    </StatusInputWrapper>
  )
}
