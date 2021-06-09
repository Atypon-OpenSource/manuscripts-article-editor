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
import { Category, Dialog, PrimaryButton } from '@manuscripts/style-guide'
import React, { useState } from 'react'
import styled from 'styled-components'

import {
  useGetCurrentSubmissionStep,
  useProceed,
} from '../../../lib/lean-workflow-gql'
import { Dropdown, DropdownButton, DropdownContainer } from '../../nav/Dropdown'
import { EditIcon } from './EditIcon'

type ManualFlowTransitioningProps = {
  manuscriptId: string
  containerId: string
}

type TransitionType = {
  status: {
    id: string
    label: string
  }
  type: {
    id: string
    description: string
    label: string
  }
}

export const ManualFlowTransitioning: React.FC<ManualFlowTransitioningProps> = ({
  containerId,
  manuscriptId,
}) => {
  const [confirmationDialog, toggleConfirmationDialog] = useState(false)
  const [completeTaskDropdown, toggleCompleteTaskDropdown] = useState(false)
  const [editingDropdown, toggleEditingDropdown] = useState(false)
  const [selectedTransition, setSelectedTransition] = useState<TransitionType>()

  const proceedMutation = useProceed()
  const submissionData = useGetCurrentSubmissionStep(manuscriptId, containerId)

  const continueDialogAction = React.useCallback(() => {
    selectedTransition &&
      proceedMutation({
        submissionId: submissionData.data.submission.id,
        statusId: selectedTransition.status.id,
        note: '',
      }).then(() => {
        toggleConfirmationDialog(false)
      })
  }, [proceedMutation, selectedTransition, submissionData])

  const returnDropdownOption = React.useCallback(
    (transition: TransitionType) => (
      <Task
        onClick={() => {
          setSelectedTransition(transition)
          toggleConfirmationDialog(true)
        }}
        key={'task_' + transition.type.id}
        className={transition.status.id === 'success' ? 'happyPath' : ''}
      >
        <strong>{transition.type.label}</strong>
        {transition.type.description}
      </Task>
    ),
    []
  )

  const currentStepTransition =
    submissionData?.data?.submission?.currentStep?.type.transitions

  return (
    <Wrapper>
      <DropdownContainer>
        <DropdownButton
          as={PrimaryButton}
          disabled={submissionData.data === undefined}
          isOpen={completeTaskDropdown}
          onClick={() => toggleCompleteTaskDropdown(!completeTaskDropdown)}
        >
          Complete task
        </DropdownButton>
        {completeTaskDropdown && (
          <TaskDropdown direction="left">
            {currentStepTransition &&
              currentStepTransition.map((transition: any) => {
                return returnDropdownOption(transition)
              })}
          </TaskDropdown>
        )}
      </DropdownContainer>
      {selectedTransition && (
        <Dialog
          isOpen={confirmationDialog}
          category={Category.confirmation}
          header={
            'You are about to reassign the content to the ' +
            selectedTransition.type.label +
            ' step.'
          }
          message="Do you wish to continue?"
          actions={{
            primary: {
              action: continueDialogAction,
              title: 'Continue',
            },
            secondary: {
              action: () => toggleConfirmationDialog(false),
              title: 'Cancel',
            },
          }}
        />
      )}

      <DropdownContainer>
        <DropdownButton
          disabled={true}
          isOpen={editingDropdown}
          onClick={() => toggleEditingDropdown(!editingDropdown)}
        >
          <EditIcon />
          <span>Editing</span>
        </DropdownButton>
        {editingDropdown && <Dropdown direction="left" />}
      </DropdownContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 15}px 0;
  margin-top: ${(props) => props.theme.grid.unit * 4}px;

  ${DropdownContainer} + ${DropdownContainer} {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`
const TaskDropdown = styled(Dropdown)`
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`
const Task = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  font: ${(props) => props.theme.font.weight.normal}
    ${(props) => props.theme.font.size.small} /
    ${(props) => props.theme.font.lineHeight.normal}
    ${(props) => props.theme.font.family.sans};
  order: 1;
  outline: none;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  text-align: left;
  width: ${(props) => props.theme.grid.unit * 66}px;

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    background-color: ${(props) =>
      props.theme.colors.button.default.background.hover};
  }

  strong {
    color: ${(props) => props.theme.colors.text.primary};
    display: block;
    font-size: ${(props) => props.theme.font.size.normal};
    line-height: ${(props) => props.theme.font.lineHeight.normal};
  }

  &.happyPath {
    border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
    order: 0;
  }
`
