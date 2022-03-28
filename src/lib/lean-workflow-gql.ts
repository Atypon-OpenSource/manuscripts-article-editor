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
import { DataProxy } from 'apollo-cache/src/types/DataProxy'
import { ApolloError } from 'apollo-client'
import { FetchResult } from 'apollo-link'
import gql from 'graphql-tag'

import config from '../config'
import {
  updateMainManuscriptAttachment,
  updateSubmissionAttachment,
  updateSubmissionAttachmentDesignation,
} from '../lib/apolloCacheUpdate'

interface uploadAttachmentProps {
  submissionId: string
  attachmentId: string
  file: File
  designation: string
}

interface updateAttachmentProps {
  submissionId: string
  attachmentId: string
  file: File
  name: string
}

interface setAttachmentProps {
  submissionId: string
  attachmentId: string
  name: string
  designation: string
}

interface mainManuscriptProps {
  submissionId: string
  attachmentId: string
  name: string
  uploadAttachment?: SubmissionAttachment
}

interface Transition {
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

export type SubmissionAttachment = {
  id: string
  name: string
  type: SubmissionAttachmentType
  link: string
}

export type SubmissionAttachmentType = {
  id: string
  label?: string
}

export interface SubmissionStepType {
  label: string
  description: string
  role: { label: string }
  transitions: Transition[]
}

export interface Submission {
  id: string
  attachments: SubmissionAttachment[]
  currentStep: {
    type: SubmissionStepType
  }
  nextStep: {
    type: SubmissionStepType
  }
}

export interface Person {
  id: string
  displayName: string
  role: {
    id: string
    label: string
  }
}

const UPLOAD_ATTACHMENT = gql`
  mutation Upload($submissionId: ID!, $file: Upload!, $typeId: ID!) {
    uploadAttachment(
      submissionId: $submissionId
      typeId: $typeId
      content: $file
    ) {
      name
      link
      type {
        id
      }
    }
  }
`

export const UPDATE_ATTACHMENT = gql`
  mutation Update(
    $submissionId: ID
    $attachmentId: ID
    $name: String
    $file: Upload
  ) {
    updateAttachment(
      submissionId: $submissionId
      attachmentId: $attachmentId
      content: $file
      name: $name
    )
  }
`

export const SET_ATTACHMENT_TYPE = gql`
  mutation SetAttachmentType(
    $submissionId: ID
    $attachmentId: ID
    $name: String
    $typeId: ID!
  ) {
    setAttachmentType(
      submissionId: $submissionId
      attachmentId: $attachmentId
      typeId: $typeId
      name: $name
    )
  }
`

const TransitionsFragment = {
  transitions: gql`
    fragment transitions on SubmissionStepTransition {
      status {
        id
        label
      }
      type {
        id
        description
        label
      }
    }
  `,
}

export const GET_SUBMISSION = gql`
  query Submission($id: ID!, $type: SubmissionIDType!) {
    submission(id: $id, type: $type) {
      id
      currentStep {
        type {
          label
          role {
            label
          }
          description
          transitions {
            ...transitions
          }
        }
      }
      nextStep {
        type {
          label
          role {
            label
          }
          description
        }
      }
    }
    person {
      id
      displayName
      role {
        id
        label
      }
    }
  }
  ${TransitionsFragment.transitions}
`

const PROCEED = gql`
  mutation Proceed($submissionId: ID!, $statusId: ID!, $note: String!) {
    proceed(submissionId: $submissionId, statusId: $statusId, note: $note) {
      currentStep {
        type {
          label
          role {
            label
          }
          description
        }
      }
      nextStep {
        type {
          label
          role {
            label
          }
          description
        }
      }
    }
  }
`

export const SET_MAIN_MANUSCRIPT = gql`
  mutation SetMainManuscript(
    $submissionId: ID
    $attachmentId: ID
    $name: String
  ) {
    setMainManuscript(
      submissionId: $submissionId
      attachmentId: $attachmentId
      name: $name
    )
  }
`

const SET_TASK_ON_HOLD = gql`
  mutation SetTaskOnHold($submissionId: ID!, $errorCode: ID!) {
    setTaskOnHold(submissionId: $submissionId, errorCode: $errorCode) {
      id
    }
  }
`

const GET_STEP = (stage: string) => gql`
  query Submission($id: ID!, $type: SubmissionIDType!) {
    submission(id: $id, type: $type) {
      id
       ${stage}Step {
        id
        type {
          id
          stage {
            id
          }
        }
        status {
          id
        }
        assignee {
          id
          displayName
        }
       }
    }
  }
`

const GET_PERSON = () => gql`
  query Person {
    person {
      id
      role {
        id
      }
    }
  }
`

const GET_PERMITTED_ACTIONS = (id: string) => gql`
  query PermitedActions($id: ID!) {
    permittedActions(submissionId: $id)
  }
`

const GET_CURRENT_SUBMISSION_STEP = gql`
  query Submission($id: ID!, $type: SubmissionIDType!) {
    submission(id: $id, type: $type) {
      id
      attachments {
        id
        name
        link
        type {
          id
          label
        }
      }
      currentStep {
        type {
          id
          transitions {
            status {
              id
              label
            }
            type {
              id
              description
              label
            }
          }
        }
      }
    }
  }
`

export const useUploadAttachment = () => {
  const [mutate, { error }] = useMutation(UPLOAD_ATTACHMENT)
  return {
    uploadAttachment: async ({
      submissionId,
      file,
      designation, // typeId is designation
    }: uploadAttachmentProps) => {
      return await mutate({
        context: {
          clientPurpose: 'leanWorkflowManager',
        },
        variables: {
          submissionId,
          file,
          typeId: designation,
        },
        update(cache, { data }) {
          if (data?.uploadAttachment) {
            updateSubmissionAttachment(
              cache,
              submissionId,
              data.uploadAttachment
            )
          }
        },
      })
    },
    uploadAttachmentError: getErrorCode(error),
  }
}

export const useUpdateAttachmentDesignation = () => {
  const [mutate] = useMutation(SET_ATTACHMENT_TYPE)
  return async ({
    submissionId,
    attachmentId,
    name,
    designation,
  }: setAttachmentProps) => {
    const fetchResult = await mutate({
      context: {
        clientPurpose: 'leanWorkflowManager',
      },
      variables: {
        submissionId,
        attachmentId,
        name,
        typeId: designation,
      },
      update(cache, data) {
        if (data?.data?.setAttachmentType) {
          updateSubmissionAttachmentDesignation(
            cache,
            submissionId,
            attachmentId,
            designation
          )
        }
      },
    })
    return fetchResult
  }
}

export const useUpdateAttachmentFile = () => {
  const [mutate, { error }] = useMutation(UPDATE_ATTACHMENT)
  return {
    updateAttachmentFile: ({
      submissionId,
      name,
      file,
    }: updateAttachmentProps) =>
      mutate({
        context: {
          clientPurpose: 'leanWorkflowManager',
        },
        variables: {
          submissionId,
          name,
          file,
        },
      }),
    updateAttachmentFileError: getErrorCode(error),
  }
}

export const useGetSubmissionAndPerson = (
  documentId: string,
  projectId: string
) =>
  useQuery(GET_SUBMISSION, {
    context: {
      clientPurpose: 'leanWorkflowManager',
    },
    variables: config.submission.id
      ? {
          id: config.submission.id,
          type: 'URI',
        }
      : {
          id: `${projectId}#${documentId}`,
          type: 'DOCUMENT_ID',
        },
  })

export const useGetCurrentSubmissionStep = (
  documentId: string,
  projectId: string
) =>
  useQuery(GET_CURRENT_SUBMISSION_STEP, {
    context: {
      clientPurpose: 'leanWorkflowManager',
    },
    variables: {
      id: `${projectId}#${documentId}`,
      type: 'DOCUMENT_ID',
    },
  })

interface proceedProps {
  submissionId: string
  statusId: string
  note: string
  update: (cache: DataProxy, data: FetchResult<{ proceed: Submission }>) => void
}

export const useProceed = () => {
  const [mutate, { error }] = useMutation<{ proceed: Submission }>(PROCEED, {
    errorPolicy: 'all',
  })
  return {
    submitProceedMutation: ({
      submissionId,
      statusId,
      note,
      update,
    }: proceedProps) =>
      mutate({
        context: {
          clientPurpose: 'leanWorkflowManager',
        },
        variables: {
          submissionId,
          statusId,
          note,
        },
        update,
      }),
    mutationError: error,
  }
}

export const useSetMainManuscript = () => {
  const [mutate, { error }] = useMutation(SET_MAIN_MANUSCRIPT)
  return {
    setMainManuscript: ({
      submissionId,
      attachmentId,
      name,
      uploadAttachment,
    }: mainManuscriptProps) =>
      mutate({
        context: {
          clientPurpose: 'leanWorkflowManager',
        },
        variables: {
          submissionId,
          attachmentId,
          name,
        },
        update(cache, { data }) {
          if (data?.setMainManuscript && uploadAttachment) {
            updateMainManuscriptAttachment(
              cache,
              submissionId,
              uploadAttachment
            )
          }
        },
      }),
    setMainManuscriptError: getErrorCode(error),
  }
}

interface onHoldProps {
  submissionId: string
  errorCode: string
}

export const useSetTaskOnHold = () => {
  const [mutate] = useMutation<{ setTaskOnHold: Submission }>(SET_TASK_ON_HOLD)
  return ({ submissionId, errorCode }: onHoldProps) =>
    mutate({
      context: {
        clientPurpose: 'leanWorkflowManager',
      },
      variables: {
        submissionId,
        errorCode,
      },
    })
}

export const useGetStep = (
  documentId: string,
  projectId: string,
  stage = 'current'
) =>
  useQuery(GET_STEP(stage), {
    context: {
      clientPurpose: 'leanWorkflowManager',
    },
    variables: {
      id: `${projectId}#${documentId}`,
      type: 'DOCUMENT_ID',
    },
  })

export const useGetPerson = () =>
  useQuery(GET_PERSON(), {
    context: {
      clientPurpose: 'leanWorkflowManager',
    },
  })

export const useGetPermittedActions = (submissionId: string) =>
  useQuery(GET_PERMITTED_ACTIONS(submissionId), {
    context: {
      clientPurpose: 'leanWorkflowManager',
    },
    variables: {
      id: submissionId,
    },
    skip: submissionId === undefined,
  })

export const getErrorCode = (
  apolloError: ApolloError | undefined
): string | undefined =>
  apolloError?.graphQLErrors.find((error) => error?.extensions?.code)
    ?.extensions?.code.name
