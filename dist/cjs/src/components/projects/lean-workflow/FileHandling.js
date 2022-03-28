"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const react_1 = require("react");
const lean_workflow_gql_1 = require("../../../lib/lean-workflow-gql");
const store_1 = require("../../../store");
const useFileHandling = () => {
    const [fileManagementErrors, dispatchStore] = store_1.useStore((store) => store.fileManagementErrors || []);
    const handleDialogError = react_1.useCallback((errorMessage, errorHeader, showDialog) => {
        dispatchStore({
            errorDialogHeader: errorHeader,
            errorDialogMessage: errorMessage,
            showErrorDialog: showDialog,
        });
    }, [dispatchStore]);
    const { setMainManuscript, setMainManuscriptError } = lean_workflow_gql_1.useSetMainManuscript();
    const changeAttachmentDesignation = lean_workflow_gql_1.useUpdateAttachmentDesignation();
    const handleSubmissionMutation = react_1.useCallback((mutaton, errorLog) => {
        return mutaton
            .then((res) => {
            if (!res) {
                handleDialogError(errorLog, 'Error', true);
            }
            return res;
        })
            .catch((e) => {
            const errorCode = lean_workflow_gql_1.getErrorCode(e);
            if (!errorCode) {
                handleDialogError(e.graphQLErrors[0] ? e.graphQLErrors[0].message : e && e.message, 'Something went wrong while updating submission.', true);
            }
            return false;
        });
    }, [handleDialogError]);
    const handleChangeAttachmentDesignation = react_1.useCallback((submissionId, attachmentId, designation, name) => {
        if (designation == 'main-manuscript') {
            return handleSubmissionMutation(setMainManuscript({ submissionId, attachmentId, name }), 'Something went wrong while setting main manuscript.');
        }
        return handleSubmissionMutation(changeAttachmentDesignation({
            submissionId,
            attachmentId,
            name,
            designation,
        }), 'Something went wrong while updating attachment designation.');
    }, [changeAttachmentDesignation, handleSubmissionMutation, setMainManuscript]);
    const { uploadAttachment, uploadAttachmentError } = lean_workflow_gql_1.useUploadAttachment();
    const handleUploadAttachment = react_1.useCallback((submissionId, file, designation) => {
        return handleSubmissionMutation(uploadAttachment({
            submissionId: submissionId,
            file: file,
            designation: designation,
        }), 'Something went wrong while uploading attachment.');
    }, [uploadAttachment, handleSubmissionMutation]);
    const { updateAttachmentFile, updateAttachmentFileError, } = lean_workflow_gql_1.useUpdateAttachmentFile();
    if (updateAttachmentFileError) {
        dispatchStore({
            fileManagementErrors: [
                ...fileManagementErrors,
                updateAttachmentFileError,
                uploadAttachmentError,
                setMainManuscriptError,
            ],
        });
    }
    const handleReplaceAttachment = react_1.useCallback((submissionId, attachmentId, name, file, typeId) => {
        // to replace main manuscript we need first to upload the file and then change its designation to main-manuscript
        if (typeId == 'main-manuscript') {
            return uploadAttachment({
                submissionId: submissionId,
                file: file,
                designation: 'sumbission-file',
            }).then((result) => {
                var _a;
                if (!((_a = result.data) === null || _a === void 0 ? void 0 : _a.uploadAttachment)) {
                    return null;
                }
                const { uploadAttachment } = result.data;
                return handleSubmissionMutation(setMainManuscript({
                    submissionId,
                    attachmentId,
                    name,
                    uploadAttachment,
                }), 'Something went wrong while setting main manuscript.');
            });
        }
        return handleSubmissionMutation(updateAttachmentFile({
            submissionId,
            attachmentId,
            file,
            name,
        }), 'Something went wrong while replacing attachment.');
    }, [
        updateAttachmentFile,
        handleSubmissionMutation,
        setMainManuscript,
        uploadAttachment,
    ]);
    return {
        handleReplaceAttachment,
        handleChangeAttachmentDesignation,
        handleUploadAttachment,
    };
};
exports.default = useFileHandling;
//# sourceMappingURL=FileHandling.js.map