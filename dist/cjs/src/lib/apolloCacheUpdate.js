"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMainManuscriptAttachment = exports.updateSubmissionAttachmentDesignation = exports.updateSubmissionAttachment = void 0;
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
const lean_workflow_gql_1 = require("./lean-workflow-gql");
const updateSubmissionAttachment = (cache, submissionId, attachment) => {
    var _a;
    const cachedSubmission = cache.readQuery({
        query: lean_workflow_gql_1.GET_SUBMISSION,
        variables: { id: submissionId },
    });
    if ((_a = cachedSubmission === null || cachedSubmission === void 0 ? void 0 : cachedSubmission.submission) === null || _a === void 0 ? void 0 : _a.attachments) {
        cache.writeQuery({
            query: lean_workflow_gql_1.GET_SUBMISSION,
            variables: { id: submissionId },
            data: {
                submission: Object.assign(Object.assign({}, cachedSubmission.submission), { attachments: [...cachedSubmission.submission.attachments, attachment] }),
            },
        });
    }
};
exports.updateSubmissionAttachment = updateSubmissionAttachment;
const updateSubmissionAttachmentDesignation = (cache, submissionId, attachmentId, typeId) => {
    var _a;
    const cachedSubmission = cache.readQuery({
        query: lean_workflow_gql_1.GET_SUBMISSION,
        variables: { id: submissionId },
    });
    if ((_a = cachedSubmission === null || cachedSubmission === void 0 ? void 0 : cachedSubmission.submission) === null || _a === void 0 ? void 0 : _a.attachments) {
        cache.writeQuery({
            query: lean_workflow_gql_1.GET_SUBMISSION,
            variables: { id: submissionId },
            data: {
                submission: Object.assign(Object.assign({}, cachedSubmission.submission), { attachments: cachedSubmission.submission.attachments.map((attachment) => (attachment.id === attachmentId && Object.assign(Object.assign({}, attachment), { type: Object.assign(Object.assign({}, attachment.type), { label: typeId }) })) ||
                        attachment) }),
            },
        });
    }
};
exports.updateSubmissionAttachmentDesignation = updateSubmissionAttachmentDesignation;
const updateMainManuscriptAttachment = (cache, submissionId, attachment) => {
    var _a, _b;
    const cachedSubmission = cache.readQuery({
        query: lean_workflow_gql_1.GET_SUBMISSION,
        variables: { id: submissionId },
    });
    /**
     * setMainManuscript mutation will update old main-manuscript attachment to a document
     */
    const replaceMainManuscriptToDocument = (attachments) => attachments.map((attachment) => (attachment.type.label === 'main-manuscript' && Object.assign(Object.assign({}, attachment), { type: Object.assign(Object.assign({}, attachment.type), { label: 'document' }) })) ||
        attachment);
    if ((_a = cachedSubmission === null || cachedSubmission === void 0 ? void 0 : cachedSubmission.submission) === null || _a === void 0 ? void 0 : _a.attachments) {
        cache.writeQuery({
            query: lean_workflow_gql_1.GET_SUBMISSION,
            variables: { id: submissionId },
            data: {
                submission: Object.assign(Object.assign({}, cachedSubmission.submission), { attachments: [
                        ...replaceMainManuscriptToDocument((_b = cachedSubmission === null || cachedSubmission === void 0 ? void 0 : cachedSubmission.submission) === null || _b === void 0 ? void 0 : _b.attachments),
                        attachment,
                    ] }),
            },
        });
    }
};
exports.updateMainManuscriptAttachment = updateMainManuscriptAttachment;
//# sourceMappingURL=apolloCacheUpdate.js.map