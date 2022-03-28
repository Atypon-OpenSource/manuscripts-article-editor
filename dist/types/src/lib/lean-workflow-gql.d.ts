import { DataProxy } from 'apollo-cache/src/types/DataProxy';
import { ApolloError } from 'apollo-client';
import { FetchResult } from 'apollo-link';
interface uploadAttachmentProps {
    submissionId: string;
    file: File;
    designation: string;
}
interface updateAttachmentProps {
    submissionId: string;
    attachmentId: string;
    file: File;
    name: string;
}
interface setAttachmentProps {
    submissionId: string;
    attachmentId: string;
    name: string;
    designation: string;
}
interface mainManuscriptProps {
    submissionId: string;
    attachmentId: string;
    name: string;
    uploadAttachment?: SubmissionAttachment;
}
interface Transition {
    status: {
        id: string;
        label: string;
    };
    type: {
        id: string;
        description: string;
        label: string;
    };
}
export declare type SubmissionAttachment = {
    id: string;
    name: string;
    type: SubmissionAttachmentType;
    link: string;
};
export declare type SubmissionAttachmentType = {
    id: string;
    label?: string;
};
export interface SubmissionStepType {
    label: string;
    description: string;
    role: {
        label: string;
    };
    transitions: Transition[];
}
export interface Submission {
    id: string;
    attachments: SubmissionAttachment[];
    currentStep: {
        type: SubmissionStepType;
    };
    nextStep: {
        type: SubmissionStepType;
    };
}
export interface Person {
    id: string;
    displayName: string;
    role: {
        id: string;
        label: string;
    };
}
export declare const UPDATE_ATTACHMENT: import("apollo-link").DocumentNode;
export declare const SET_ATTACHMENT_TYPE: import("apollo-link").DocumentNode;
export declare const GET_SUBMISSION: import("apollo-link").DocumentNode;
export declare const SET_MAIN_MANUSCRIPT: import("apollo-link").DocumentNode;
export declare const useUploadAttachment: () => {
    uploadAttachment: ({ submissionId, file, designation, }: uploadAttachmentProps) => Promise<import("@apollo/react-common").ExecutionResult<any>>;
    uploadAttachmentError: string | undefined;
};
export declare const useUpdateAttachmentDesignation: () => ({ submissionId, attachmentId, name, designation, }: setAttachmentProps) => Promise<import("@apollo/react-common").ExecutionResult<any>>;
export declare const useUpdateAttachmentFile: () => {
    updateAttachmentFile: ({ submissionId, name, file, }: updateAttachmentProps) => Promise<import("@apollo/react-common").ExecutionResult<any>>;
    updateAttachmentFileError: string | undefined;
};
export declare const useGetSubmissionAndPerson: (documentId: string, projectId: string) => import("@apollo/react-common").QueryResult<any, {
    id: string;
    type: string;
}>;
export declare const useGetCurrentSubmissionStep: (documentId: string, projectId: string) => import("@apollo/react-common").QueryResult<any, {
    id: string;
    type: string;
}>;
interface proceedProps {
    submissionId: string;
    statusId: string;
    note: string;
    update: (cache: DataProxy, data: FetchResult<{
        proceed: Submission;
    }>) => void;
}
export declare const useProceed: () => {
    submitProceedMutation: ({ submissionId, statusId, note, update, }: proceedProps) => Promise<import("@apollo/react-common").ExecutionResult<{
        proceed: Submission;
    }>>;
    mutationError: ApolloError | undefined;
};
export declare const useSetMainManuscript: () => {
    setMainManuscript: ({ submissionId, attachmentId, name, uploadAttachment, }: mainManuscriptProps) => Promise<import("@apollo/react-common").ExecutionResult<any>>;
    setMainManuscriptError: string | undefined;
};
interface onHoldProps {
    submissionId: string;
    errorCode: string;
}
export declare const useSetTaskOnHold: () => ({ submissionId, errorCode }: onHoldProps) => Promise<import("@apollo/react-common").ExecutionResult<{
    setTaskOnHold: Submission;
}>>;
export declare const useGetStep: (documentId: string, projectId: string, stage?: string) => import("@apollo/react-common").QueryResult<any, {
    id: string;
    type: string;
}>;
export declare const useGetPerson: () => import("@apollo/react-common").QueryResult<any, import("@apollo/react-common").OperationVariables>;
export declare const useGetPermittedActions: (submissionId: string) => import("@apollo/react-common").QueryResult<any, {
    id: string;
}>;
export declare const getErrorCode: (apolloError: ApolloError | undefined) => string | undefined;
export {};
