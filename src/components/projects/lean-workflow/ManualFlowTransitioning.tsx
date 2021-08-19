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
import {
  AlertMessage,
  AlertMessageType,
  Category,
  Dialog,
  PrimaryButton,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useDropdown } from '../../../hooks/use-dropdown'
import { Submission, useProceed } from '../../../lib/lean-workflow-gql'
import { ProjectRole } from '../../../lib/roles'
import { Loading, LoadingOverlay } from '../../Loading'
import { Dropdown, DropdownButton, DropdownContainer } from '../../nav/Dropdown'
import { MediumTextArea } from '../inputs'
import { AnnotatorIcon } from './icons/AnnotatorIcon'
import { EditIcon } from './icons/EditIcon'
import { ReadingIcon } from './icons/ReadingIcon'

const Editing = { label: 'Editing', icon: EditIcon }

const MapUserRole: {
  [key in ProjectRole]: {
    label: string
    icon: React.FC<React.SVGAttributes<SVGElement>>
  }
} = {
  [ProjectRole.editor]: Editing,
  [ProjectRole.owner]: Editing,
  [ProjectRole.writer]: Editing,
  [ProjectRole.annotator]: { label: 'Suggesting...', icon: AnnotatorIcon },
  [ProjectRole.viewer]: { label: 'Reading', icon: ReadingIcon },
}

export const ManualFlowTransitioning: React.FC<{
  submission: Submission
  userRole: ProjectRole | null
}> = ({ submission, userRole, children }) => {
  const can = usePermissions()
  const submitProceedMutation = useProceed()

  const [confirmationDialog, toggleConfirmationDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [noteValue, setNoteValue] = useState<string>('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [
    selectedTransitionIndex,
    setSelectedTransitionIndex,
  ] = useState<number>()

  const continueDialogAction = useCallback(async () => {
    if (!submission || !selectedTransitionIndex) {
      return
    }

    const { status } = submission.currentStep.type.transitions[
      selectedTransitionIndex
    ]

    setLoading(true)

    return await submitProceedMutation({
      submissionId: submission?.id,
      statusId: status.id,
      note: noteValue,
    })
      .then(({ data }) => {
        if (data?.proceed) {
          // TODO:: we should redirect user to the dashboard, LIT-396503
          toggleConfirmationDialog(false)
        } else {
          setError('Server refused to proceed with your submission')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to proceed with your submission.')
        setLoading(false)
      })
  }, [
    submitProceedMutation,
    setError,
    toggleConfirmationDialog,
    selectedTransitionIndex,
    submission,
    noteValue,
  ])

  const onTransitionClick = useCallback(
    (event) => {
      toggleConfirmationDialog(true)
      setSelectedTransitionIndex(event.target.value)
    },
    [setSelectedTransitionIndex, toggleConfirmationDialog]
  )

  const onCancelClick = useCallback(() => {
    toggleConfirmationDialog(false)
    setSelectedTransitionIndex(undefined)
    setError(undefined)
  }, [toggleConfirmationDialog, setSelectedTransitionIndex, setError])

  const onNoteChange = useCallback(
    (event) => setNoteValue(event.target.value),
    [setNoteValue]
  )

  const currentStepTransition = submission?.currentStep.type.transitions
  const disable = !currentStepTransition || !can.completeTask

  return (
    <Wrapper>
      {(currentStepTransition && currentStepTransition?.length > 1 && (
        <DropdownWrapper button={'Complete task'} disabled={disable} primary>
          <TaskDropdown>
            {currentStepTransition &&
              currentStepTransition.map((transition, index) => (
                <Task
                  key={'task_' + transition.type.id}
                  className={
                    transition.status.id === 'success' ? 'happyPath' : ''
                  }
                  value={index}
                  onClick={onTransitionClick}
                >
                  <strong>{transition.type.label}</strong>
                  {transition.type.description}
                </Task>
              ))}
          </TaskDropdown>
        </DropdownWrapper>
      )) || (
        <PrimaryButton value={0} onClick={onTransitionClick} disabled={disable}>
          Complete task
        </PrimaryButton>
      )}

      {(loading && (
        <LoadingOverlay>
          <Loading>proceeding with your submission…</Loading>
        </LoadingOverlay>
      )) || (
        <Dialog
          isOpen={confirmationDialog && !loading}
          category={Category.confirmation}
          header={'Are you sure?'}
          message={
            'You are about to complete your task. If you confirm, you will no longer be able to make any changes.'
          }
          actions={{
            primary: {
              action: continueDialogAction,
              title: 'Continue',
            },
            secondary: {
              action: onCancelClick,
              title: 'Cancel',
            },
          }}
        >
          <TextAreaWrapper>
            <MediumTextArea
              value={noteValue}
              onChange={onNoteChange}
              rows={5}
              placeholder={'Add any additional comment here...'}
            />
          </TextAreaWrapper>

          {error && (
            <AlertMessage type={AlertMessageType.error} hideCloseButton={true}>
              {error}
            </AlertMessage>
          )}
        </Dialog>
      )}

      <DropdownWrapper
        button={
          <>
            {userRole && React.createElement(MapUserRole[userRole].icon)}
            <span>{userRole && MapUserRole[userRole].label}</span>
          </>
        }
        disabled={true}
      />
      <ChildWrapper>{children}</ChildWrapper>
    </Wrapper>
  )
}

const DropdownWrapper: React.FC<{
  button: any | string
  disabled: boolean
  primary?: boolean
}> = ({ disabled, button, primary, children }) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()
  const onDropdownButtonClick = useCallback(() => toggleOpen(), [toggleOpen])

  return (
    <DropdownContainer id={'user-dropdown'} ref={wrapperRef}>
      <DropdownButton
        as={(primary && PrimaryButton) || undefined}
        disabled={disabled}
        isOpen={isOpen}
        onClick={onDropdownButtonClick}
      >
        {button}
      </DropdownButton>
      {isOpen && <Dropdown direction="left">{children}</Dropdown>}
    </DropdownContainer>
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
  ${PrimaryButton} + ${DropdownContainer} {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`

const TaskDropdown = styled.div`
  display: flex;
  flex-direction: column;
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

const TextAreaWrapper = styled.div`
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
`

const ChildWrapper = styled.div`
  display: inline-flex;
  margin: 0 2em;
  flex-direction: row;
  align-items: center;
`
