"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorCode = exports.useGetPermittedActions = exports.useGetPerson = exports.useGetStep = exports.useSetTaskOnHold = exports.useSetMainManuscript = exports.useProceed = exports.useGetCurrentSubmissionStep = exports.useGetSubmissionAndPerson = exports.useUpdateAttachmentFile = exports.useUpdateAttachmentDesignation = exports.useUploadAttachment = exports.SET_MAIN_MANUSCRIPT = exports.GET_SUBMISSION = exports.SET_ATTACHMENT_TYPE = exports.UPDATE_ATTACHMENT = void 0;
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
const react_hooks_1 = require("@apollo/react-hooks");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const config_1 = __importDefault(require("../config"));
const apolloCacheUpdate_1 = require("../lib/apolloCacheUpdate");
const UPLOAD_ATTACHMENT = graphql_tag_1.default `
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
`;
exports.UPDATE_ATTACHMENT = graphql_tag_1.default `
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
`;
exports.SET_ATTACHMENT_TYPE = graphql_tag_1.default `
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
`;
const TransitionsFragment = {
    transitions: graphql_tag_1.default `
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
};
exports.GET_SUBMISSION = graphql_tag_1.default `
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
`;
const PROCEED = graphql_tag_1.default `
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
`;
exports.SET_MAIN_MANUSCRIPT = graphql_tag_1.default `
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
`;
const SET_TASK_ON_HOLD = graphql_tag_1.default `
  mutation SetTaskOnHold($submissionId: ID!, $errorCode: ID!) {
    setTaskOnHold(submissionId: $submissionId, errorCode: $errorCode) {
      id
    }
  }
`;
const GET_STEP = (stage) => graphql_tag_1.default `
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
`;
const GET_PERSON = () => graphql_tag_1.default `
  query Person {
    person {
      id
      role {
        id
      }
    }
  }
`;
const GET_PERMITTED_ACTIONS = (id) => graphql_tag_1.default `
  query PermitedActions($id: ID!) {
    permittedActions(submissionId: $id)
  }
`;
const GET_CURRENT_SUBMISSION_STEP = graphql_tag_1.default `
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
`;
const useUploadAttachment = () => {
    const [mutate, { error }] = react_hooks_1.useMutation(UPLOAD_ATTACHMENT);
    return {
        uploadAttachment: ({ submissionId, file, designation, // typeId is designation
         }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield mutate({
                context: {
                    clientPurpose: 'leanWorkflowManager',
                },
                variables: {
                    submissionId,
                    file,
                    typeId: designation,
                },
                update(cache, { data }) {
                    if (data === null || data === void 0 ? void 0 : data.uploadAttachment) {
                        apolloCacheUpdate_1.updateSubmissionAttachment(cache, submissionId, data.uploadAttachment);
                    }
                },
            });
        }),
        uploadAttachmentError: exports.getErrorCode(error),
    };
};
exports.useUploadAttachment = useUploadAttachment;
const useUpdateAttachmentDesignation = () => {
    const [mutate] = react_hooks_1.useMutation(exports.SET_ATTACHMENT_TYPE);
    return ({ submissionId, attachmentId, name, designation, }) => __awaiter(void 0, void 0, void 0, function* () {
        const fetchResult = yield mutate({
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
                var _a;
                if ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.setAttachmentType) {
                    apolloCacheUpdate_1.updateSubmissionAttachmentDesignation(cache, submissionId, attachmentId, designation);
                }
            },
        });
        return fetchResult;
    });
};
exports.useUpdateAttachmentDesignation = useUpdateAttachmentDesignation;
const useUpdateAttachmentFile = () => {
    const [mutate, { error }] = react_hooks_1.useMutation(exports.UPDATE_ATTACHMENT);
    return {
        updateAttachmentFile: ({ submissionId, name, file, }) => mutate({
            context: {
                clientPurpose: 'leanWorkflowManager',
            },
            variables: {
                submissionId,
                name,
                file,
            },
        }),
        updateAttachmentFileError: exports.getErrorCode(error),
    };
};
exports.useUpdateAttachmentFile = useUpdateAttachmentFile;
const useGetSubmissionAndPerson = (documentId, projectId) => react_hooks_1.useQuery(exports.GET_SUBMISSION, {
    context: {
        clientPurpose: 'leanWorkflowManager',
    },
    variables: config_1.default.submission.id
        ? {
            id: config_1.default.submission.id,
            type: 'URI',
        }
        : {
            id: `${projectId}#${documentId}`,
            type: 'DOCUMENT_ID',
        },
});
exports.useGetSubmissionAndPerson = useGetSubmissionAndPerson;
const useGetCurrentSubmissionStep = (documentId, projectId) => react_hooks_1.useQuery(GET_CURRENT_SUBMISSION_STEP, {
    context: {
        clientPurpose: 'leanWorkflowManager',
    },
    variables: {
        id: `${projectId}#${documentId}`,
        type: 'DOCUMENT_ID',
    },
});
exports.useGetCurrentSubmissionStep = useGetCurrentSubmissionStep;
const useProceed = () => {
    const [mutate, { error }] = react_hooks_1.useMutation(PROCEED, {
        errorPolicy: 'all',
    });
    return {
        submitProceedMutation: ({ submissionId, statusId, note, update, }) => mutate({
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
    };
};
exports.useProceed = useProceed;
const useSetMainManuscript = () => {
    const [mutate, { error }] = react_hooks_1.useMutation(exports.SET_MAIN_MANUSCRIPT);
    return {
        setMainManuscript: ({ submissionId, attachmentId, name, uploadAttachment, }) => mutate({
            context: {
                clientPurpose: 'leanWorkflowManager',
            },
            variables: {
                submissionId,
                attachmentId,
                name,
            },
            update(cache, { data }) {
                if ((data === null || data === void 0 ? void 0 : data.setMainManuscript) && uploadAttachment) {
                    apolloCacheUpdate_1.updateMainManuscriptAttachment(cache, submissionId, uploadAttachment);
                }
            },
        }),
        setMainManuscriptError: exports.getErrorCode(error),
    };
};
exports.useSetMainManuscript = useSetMainManuscript;
const useSetTaskOnHold = () => {
    const [mutate] = react_hooks_1.useMutation(SET_TASK_ON_HOLD);
    return ({ submissionId, errorCode }) => mutate({
        context: {
            clientPurpose: 'leanWorkflowManager',
        },
        variables: {
            submissionId,
            errorCode,
        },
    });
};
exports.useSetTaskOnHold = useSetTaskOnHold;
const useGetStep = (documentId, projectId, stage = 'current') => react_hooks_1.useQuery(GET_STEP(stage), {
    context: {
        clientPurpose: 'leanWorkflowManager',
    },
    variables: {
        id: `${projectId}#${documentId}`,
        type: 'DOCUMENT_ID',
    },
});
exports.useGetStep = useGetStep;
const useGetPerson = () => react_hooks_1.useQuery(GET_PERSON(), {
    context: {
        clientPurpose: 'leanWorkflowManager',
    },
});
exports.useGetPerson = useGetPerson;
const useGetPermittedActions = (submissionId) => react_hooks_1.useQuery(GET_PERMITTED_ACTIONS(submissionId), {
    context: {
        clientPurpose: 'leanWorkflowManager',
    },
    variables: {
        id: submissionId,
    },
    skip: submissionId === undefined,
});
exports.useGetPermittedActions = useGetPermittedActions;
const getErrorCode = (apolloError) => {
    var _a, _b;
    return (_b = (_a = apolloError === null || apolloError === void 0 ? void 0 : apolloError.graphQLErrors.find((error) => { var _a; return (_a = error === null || error === void 0 ? void 0 : error.extensions) === null || _a === void 0 ? void 0 : _a.code; })) === null || _a === void 0 ? void 0 : _a.extensions) === null || _b === void 0 ? void 0 : _b.code.name;
};
exports.getErrorCode = getErrorCode;
//# sourceMappingURL=lean-workflow-gql.js.map