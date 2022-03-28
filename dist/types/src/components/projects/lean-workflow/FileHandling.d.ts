declare const useFileHandling: () => {
    handleReplaceAttachment: (submissionId: string, attachmentId: string, name: string, file: File, typeId: string) => Promise<any>;
    handleChangeAttachmentDesignation: (submissionId: string, attachmentId: string, designation: string, name: string) => Promise<any>;
    handleUploadAttachment: (submissionId: string, file: File, designation: string) => Promise<any>;
};
export default useFileHandling;
