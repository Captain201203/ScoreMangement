// src/Entity/DocumentEntity.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IDocument extends Document {
    title: string;
    fileName: string;     // Tên file gốc
    filePath: string;     // Đường dẫn lưu trên server
    fileType: string;     // pdf hoặc docx
    fileSize: number;     // Kích thước file (bytes)
    uploadedBy: string;   // accountId của người upload
}

const DocumentSchema: Schema = new Schema({
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number },
    uploadedBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);