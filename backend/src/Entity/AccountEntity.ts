import mongoose, {Document, Schema} from "mongoose";
import { IRole } from "../Entity/RoleEntity.js"; 

export interface IAccount extends Document {
    accountId: string;
    username: string;
    password: string;
    role: mongoose.Types.ObjectId | IRole; 
}

const AccountSchema: Schema = new Schema({
    accountId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { 
        type: Schema.Types.ObjectId, 
        ref: 'Role',
        required: true 
    },
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);