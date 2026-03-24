import mongoose from "mongoose";

export interface IMajor extends mongoose.Document {
    majorId: string;
    majorName: string;
}

const MajorSchema = new mongoose.Schema({
    majorId: { type: String, required: true, unique: true },
    majorName: { type: String, required: true }
});

export default mongoose.models.Major || mongoose.model<IMajor>('Major', MajorSchema);