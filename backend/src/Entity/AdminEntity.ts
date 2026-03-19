import mongoose, {Document, Schema} from "mongoose";

export interface IAdmin extends Document{
    adminId: string;
    adminName: string;
    email: string;
}

export const AdminSchema: Schema = new Schema({
    adminId: {type: String, required: true, unique: true},
    adminName: {type: String, required: true},
    email: {type: String, required: true, unique: true},

});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);