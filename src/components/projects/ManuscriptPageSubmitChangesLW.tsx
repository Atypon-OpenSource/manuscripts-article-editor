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
import { Manuscript } from '@manuscripts/manuscripts-json-schema'
import {
  AlertMessage,
  AlertMessageType,
  Category,
  Dialog,
  PrimaryButton,
} from '@manuscripts/style-guide'
import React, { useState } from 'react'
import styled from 'styled-components'

import { useGetSubmission, useProceed } from '../../lib/lean-workflow-gql'
import { MediumTextArea } from './inputs'

export const TextAreaWrapper = styled.div`
  margin-top: 16px;
`
const ManuscriptPageSubmitChangesLW: React.FC<{
  manuscript: Manuscript
}> = ({ manuscript }) => {
  const submissionData = useGetSubmission(
    manuscript._id,
    manuscript.containerID
  )
  const submitProceedMutation = useProceed()
  const [noteValue, setNoteValue] = useState<string>('')
  const [submitChangesDialog, toggleSubmitChangesDialog] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (!submitChangesDialog) {
      setError(undefined)
    }
  }, [submitChangesDialog])

  const submitChanges = () => {
    if (submissionData.error) {
      setError(submissionData.error.message)
      return
    }

    submitProceedMutation({
      submissionId: submissionData.data.submission.id,
      statusId: 'success',
      note: noteValue,
    })
      .then(() => {
        toggleSubmitChangesDialog(false)
      })
      .catch((result) => {
        setError(result)
      })
  }

  const submitChangesDialogActions = {
    primary: {
      action: submitChanges,
      title: 'Confirm',
    },
    secondary: {
      action: () => toggleSubmitChangesDialog(false),
      title: 'Cancel',
    },
  }

  return (
    <>
      <PrimaryButton onClick={() => toggleSubmitChangesDialog(true)}>
        Submit Changes
      </PrimaryButton>
      {submitChangesDialog && (
        <Dialog
          isOpen={submitChangesDialog}
          actions={submitChangesDialogActions}
          category={Category.confirmation}
          header={'Are you sure?'}
          message={
            'You are about to complete your task. If you confirm, you will no longer be able to make any changes.'
          }
        >
          <TextAreaWrapper>
            <MediumTextArea
              value={noteValue}
              onChange={(event) => setNoteValue(event.target.value)}
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
    </>
  )
}

export default ManuscriptPageSubmitChangesLW
