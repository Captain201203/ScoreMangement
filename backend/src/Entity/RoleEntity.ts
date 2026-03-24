import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
    roleName: string;    
    roleType: string;    
    claims: mongoose.Types.ObjectId[]; 
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