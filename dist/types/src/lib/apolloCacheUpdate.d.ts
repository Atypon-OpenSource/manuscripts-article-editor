import { SubmissionAttachment } from './lean-workflow-gql';
export declare const updateSubmissionAttachmentDesignation: (cache: any, submissionId: string, attachmentId: string, typeId: string, documentId: string) => void;
export declare const updateMainManuscriptAttachment: <T>(cache: any, submissionId: string, documentId: string, attachment: SubmissionAttachment) => void;
