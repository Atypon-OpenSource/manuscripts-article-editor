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
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

interface uploadAttachmentProps {
  submissionId: string
  file: File
  designation: string
}

interface updateAttachmentProps {
  submissionId: string
  file: File
  name: string
}

interface setAttachmentProps {
  submissionId: string
  name: string
  designation: string
}

const UPLOAD_ATTACHMENT = gql`
  mutation Upload($submissionId: ID!, $file: Upload!, $typeId: ID!) {
    uploadAttachment(
      submissionId: $submissionId
      typeId: $typeId
      content: $file
    )
  }
`
const UPDATE_ATTACHMENT = gql`
  mutation Upload($submissionId: ID!, $file: Upload!, $name: ID!) {
    updateAttachment(submissionId: $submissionId, content: $file, name: $name)
  }
`
const SET_ATTACHMENT_TYPE = gql`
  mutation SetAttachmentType($submissionId: ID!, $typeId: ID!, $name: String!) {
    setAttachmentType(submissionId: $submissionId, typeId: $typeId, name: $name)
  }
`

const GET_SUBMISSION = gql`
  query Submission($id: ID!, $type: SubmissionIDType!) {
    submission(id: $id, type: $type) {
      id
    }
  }
`

export const useUploadAttachment = () => {
  const [mutate] = useMutation(UPLOAD_ATTACHMENT)
  return ({
    submissionId,
    file,
    designation, // typeId is designation
  }: uploadAttachmentProps) =>
    mutate({
      context: {
        clientPurpose: 'leanWorkflowManager',
      },
      variables: {
        submissionId,
        file,
        typeId: designation,
      },
    })
}

export const useUpdateAttachmentDesignation = () => {
  const [mutate] = useMutation(SET_ATTACHMENT_TYPE)
  return ({ submissionId, name, designation }: setAttachmentProps) =>
    mutate({
      context: {
        clientPurpose: 'leanWorkflowManager',
      },
      variables: {
        submissionId,
        name,
        typeId: designation,
      },
    })
}

export const useUpdateAttachmentFile = () => {
  const [mutate] = useMutation(UPDATE_ATTACHMENT)
  return ({ submissionId, name, file }: updateAttachmentProps) =>
    mutate({
      context: {
        clientPurpose: 'leanWorkflowManager',
      },
      variables: {
        submissionId,
        name,
        file,
      },
    })
}

export const useGetSubmission = (documentId: string, projectId: string) =>
  useQuery(GET_SUBMISSION, {
    context: {
      clientPurpose: 'leanWorkflowManager',
    },
    variables: {
      id: `${projectId}#${documentId}`,
      type: 'DOCUMENT_ID',
    },
  })
