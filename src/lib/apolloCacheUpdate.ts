/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { GET_SUBMISSION, SubmissionAttachment } from './lean-workflow-gql'

export const updateSubmissionAttachment = (
  cache: any,
  submissionId: string,
  attachment: SubmissionAttachment
) => {
  const cachedSubmission = cache.readQuery({
    query: GET_SUBMISSION,
    variables: { id: submissionId },
  })
  if (cachedSubmission?.submission?.attachments) {
    cache.writeQuery({
      query: GET_SUBMISSION,
      variables: { id: submissionId },
      data: {
        submission: {
          ...cachedSubmission.submission,
          attachments: [...cachedSubmission.submission.attachments, attachment],
        },
      },
    })
  }
}

export const updateSubmissionAttachmentDesignation = (
  cache: any,
  submissionId: string,
  attachmentId: string,
  typeId: string
) => {
  const cachedSubmission = cache.readQuery({
    query: GET_SUBMISSION,
    variables: { id: submissionId },
  })
  if (cachedSubmission?.submission?.attachments) {
    cache.writeQuery({
      query: GET_SUBMISSION,
      variables: { id: submissionId },
      data: {
        submission: {
          ...cachedSubmission.submission,
          attachments: cachedSubmission.submission.attachments.map(
            (attachment: SubmissionAttachment) =>
              (attachment.id === attachmentId && {
                ...attachment,
                type: { ...attachment.type, label: typeId },
              }) ||
              attachment
          ),
        },
      },
    })
  }
}

export const updateMainManuscriptAttachment = <T>(
  cache: any,
  submissionId: string,
  attachment: SubmissionAttachment
) => {
  const cachedSubmission = cache.readQuery({
    query: GET_SUBMISSION,
    variables: { id: submissionId },
  })

  /**
   * setMainManuscript mutation will update old main-manuscript attachment to a document
   */
  const replaceMainManuscriptToDocument = (
    attachments: SubmissionAttachment[]
  ) =>
    attachments.map(
      (attachment) =>
        (attachment.type.label === 'main-manuscript' && {
          ...attachment,
          type: {
            ...attachment.type,
            label: 'document',
          },
        }) ||
        attachment
    )

  if (cachedSubmission?.submission?.attachments) {
    cache.writeQuery({
      query: GET_SUBMISSION,
      variables: { id: submissionId },
      data: {
        submission: {
          ...cachedSubmission.submission,
          attachments: [
            ...replaceMainManuscriptToDocument(
              cachedSubmission?.submission?.attachments
            ),
            attachment,
          ],
        },
      },
    })
  }
}
