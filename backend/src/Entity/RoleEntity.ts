import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
    roleName: string;    // "Giảng viên bộ môn", "Trưởng khoa", "Sinh viên"
    roleType: string;    // 'admin' | 'teacher' | 'student' (để giữ logic cũ của bạn)
    claims: mongoose.Types.ObjectId[]; // Tham chiếu tới các Claim
}

const RoleSchema = new Schema({
    roleName: { type: String, required: true, unique: true },
    roleType: { 
        type: String, 
        required: true, 
        enum: ['admin', 'teacher', 'student'] 
    },
    claims: [{ type: Schema.Types.ObjectId, ref: 'Claim' }]
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);