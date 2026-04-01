// src/Repository/DocumentRepository.ts
import DocumentModel, { IDocument } from "../Entity/DocumentEntity.js";

export class DocumentRepository {
    findAll(): Promise<IDocument[]> {
        return DocumentModel.find().sort({ createdAt: -1 }).exec();
    }

    findById(id: string): Promise<IDocument | null> {
        return DocumentModel.findById(id).exec();
    }

    create(data: Partial<IDocument>): Promise<IDocument> {
        const doc = new DocumentModel(data);
        return doc.save();
    }

    delete(id: string): Promise<IDocument | null> {
        return DocumentModel.findByIdAndDelete(id).exec();
    }
}

export const documentRepository = new DocumentRepository();