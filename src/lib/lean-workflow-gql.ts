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

interface mainManuscriptProps {
  submissionId: string
  name: string
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

export interface SubmissionStepType {
  label: string
  description: string
  role: { label: string }
  transitions: Transition[]
}

export interface Submission {
  id: string
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
const UPDATE_ATTACHMENT = gql`
  mutation Update($submissionId: ID!, $file: Upload!, $name: ID!) {
    updateAttachment(submissionId: $submissionId, content: $file, name: $name)
  }
`
const SET_ATTACHMENT_TYPE = gql`
  mutation SetAttachmentType($submissionId: ID!, $typeId: ID!, $name: String!) {
    setAttachmentType(submissionId: $submissionId, typeId: $typeId, name: $name)
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
const SET_MAIN_MANUSCRIPT = gql`
  mutation SetMainManuscript($submissionId: ID!, $name: String!) {
    setMainManuscript(submissionId: $submissionId, name: $name)
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
      })
    },
    uploadAttachmentError: getErrorCode(error),
  }
}

export const useUpdateAttachmentDesignation = () => {
  const [mutate] = useMutation(SET_ATTACHMENT_TYPE)
  return async ({ submissionId, name, designation }: setAttachmentProps) => {
    const fetchResult = await mutate({
      context: {
        clientPurpose: 'leanWorkflowManager',
      },
      variables: {
        submissionId,
        name,
        typeId: designation,
      },
    })
    return fetchResult
  }
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

export const useGetSubmissionAndPerson = (
  documentId: string,
  projectId: string
) =>
  useQuery(GET_SUBMISSION, {
    context: {
      clientPurpose: 'leanWorkflowManager',
    },
    variables: {
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
    setMainManuscript: ({ submissionId, name }: mainManuscriptProps) =>
      mutate({
        context: {
          clientPurpose: 'leanWorkflowManager',
        },
        variables: {
          submissionId,
          name,
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
