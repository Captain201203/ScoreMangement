import mongoose, { Document, Schema } from "mongoose";

export interface IClaim extends Document {
    name: string;        // Tên hiển thị: "Sửa điểm", "Xem danh sách lớp"
    slug: string;        // Mã định danh: "score:update", "class:view"
    description: string;
}

const ClaimSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String
}, { timestamps: true });

export default mongoose.models.Claim || mongoose.model<IClaim>('Claim', ClaimSchema);