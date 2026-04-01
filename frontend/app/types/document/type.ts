// src/app/types/document/type.ts
export interface IDocument {
    _id?: string;
    title: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    createdAt?: string;
    updatedAt?: string;
}