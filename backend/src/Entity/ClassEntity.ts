import mongoose, {Document, Schema} from "mongoose";

export interface IClass extends Document {
    classId: string;
    majorName: string;
    teacherName: string;
}

const ClassSchema: Schema = new Schema({
    classId: { type: String, required: true, unique: true },
    majorName: { type: String, required: true },
    teacherName: { type: String, required: true },
});

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);