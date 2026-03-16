import mongoose, {Document, Schema} from "mongoose";
import { IRole } from "../role/model.js";

export interface IAccount extends Document {
    accountId: string;
    username: string;
    password: string;
    role: mongoose.Types.ObjectId | IRole; // Trỏ tới Collection Role
}

const AccountSchema: Schema = new Schema({
    accountId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { 
        type: Schema.Types.ObjectId, 
        ref: 'Role', // Liên kết tới Role Model
        required: true 
    },
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);