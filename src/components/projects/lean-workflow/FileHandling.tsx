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
import { useCallback } from 'react'

import {
  getErrorCode,
  useSetMainManuscript,
  useUpdateAttachmentDesignation,
  useUpdateAttachmentFile,
  useUploadAttachment,
} from '../../../lib/lean-workflow-gql'
import { useStore } from '../../../store'

const useFileHandling = () => {
  const [fileManagementErrors, dispatchStore] = useStore(
    (store) => store.fileManagementErrors || []
  )

  const handleDialogError = useCallback(
    (errorMessage: string, errorHeader: string, showDialog: boolean) => {
      dispatchStore({
        errorDialogHeader: errorHeader,
        errorDialogMessage: errorMessage,
        showErrorDialog: showDialog,
      })
    },
    [dispatchStore]
  )
  const { setMainManuscript, setMainManuscriptError } = useSetMainManuscript()

  const changeAttachmentDesignation = useUpdateAttachmentDesignation()
  const handleSubmissionMutation = useCallback(
    (mutaton: Promise<any>, errorLog: string) => {
      return mutaton
        .then((res) => {
          if (!res) {
            handleDialogError(errorLog, 'Error', true)
          }
          return res
        })
        .catch((e) => {
          const errorCode = getErrorCode(e)
          if (!errorCode) {
            handleDialogError(
              e.graphQLErrors[0] ? e.graphQLErrors[0].message : e && e.message,
              'Something went wrong while updating submission.',
              true
            )
          }
          return false
        })
    },
    [handleDialogError]
  )

  const handleChangeAttachmentDesignation = useCallback(
    (submissionId: string, designation: string, name: string) => {
      if (designation == 'main-manuscript') {
        return handleSubmissionMutation(
          setMainManuscript({
            submissionId: submissionId,
            name: name,
          }),
          'Something went wrong while setting main manuscript.'
        )
      }
      return handleSubmissionMutation(
        changeAttachmentDesignation({
          submissionId: submissionId,
          name: name,
          designation: designation,
        }),
        'Something went wrong while updating attachment designation.'
      )
    },
    [changeAttachmentDesignation, handleSubmissionMutation, setMainManuscript]
  )

  const { uploadAttachment, uploadAttachmentError } = useUploadAttachment()

  const handleUploadAttachment = useCallback(
    (submissionId: string, file: File, designation: string) => {
      return handleSubmissionMutation(
        uploadAttachment({
          submissionId: submissionId,
          file: file,
          designation: designation,
        }),
        'Something went wrong while uploading attachment.'
      )
    },
    [uploadAttachment, handleSubmissionMutation]
  )

  const {
    updateAttachmentFile,
    updateAttachmentFileError,
  } = useUpdateAttachmentFile()

  if (updateAttachmentFileError) {
    dispatchStore({
      fileManagementErrors: [
        ...fileManagementErrors,
        updateAttachmentFileError,
        uploadAttachmentError,
        setMainManuscriptError,
      ],
    })
  }

  const handleReplaceAttachment = useCallback(
    (submissionId: string, name: string, file: File, typeId: string) => {
      // to replace main manuscript we need first to upload the file and then change its designation to main-manuscript
      if (typeId == 'main-manuscript') {
        return uploadAttachment({
          submissionId: submissionId,
          file: file,
          designation: 'sumbission-file',
        }).then(() => {
          return handleSubmissionMutation(
            setMainManuscript({
              submissionId,
              name,
            }),
            'Something went wrong while setting main manuscript.'
          )
        })
      }

      return handleSubmissionMutation(
        updateAttachmentFile({
          submissionId,
          file,
          name,
        }),
        'Something went wrong while replacing attachment.'
      )
    },
    [
      updateAttachmentFile,
      handleSubmissionMutation,
      setMainManuscript,
      uploadAttachment,
    ]
  )

  return {
    handleReplaceAttachment,
    handleChangeAttachmentDesignation,
    handleUploadAttachment,
  }
}

export default useFileHandling
