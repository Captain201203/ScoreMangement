// src/Service/DocumentService.ts
import { documentRepository } from "../Repository/DocumentRepository.js";
import { IDocument } from "../Entity/DocumentEntity.js";
import fs from "fs";

export class DocumentService {
    getAll() {
        return documentRepository.findAll();
    }

    getById(id: string) {
        return documentRepository.findById(id);
    }

    async uploadDocument(fileData: any, title: string, userId: string) {
        return documentRepository.create({
            title,
            fileName: fileData.originalname,
            filePath: fileData.path,
            fileType: fileData.mimetype,
            fileSize: fileData.size,
            uploadedBy: userId
        });
    }

    async deleteDocument(id: string) {
        const doc = await documentRepository.findById(id);
        if (doc) {
            // Xóa file vật lý trên server
            if (fs.existsSync(doc.filePath)) {
                fs.unlinkSync(doc.filePath);
            }
            return documentRepository.delete(id);
        }
        return null;
    }
}

export const documentService = new DocumentService();