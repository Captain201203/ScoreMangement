import mongoose, { Document, Schema } from "mongoose";

export interface ISemester extends Document {
    semesterId: string;
    semesterName: string;
    startDate: Date;
    endDate: Date;
}

const SemesterSchema: Schema = new Schema({
    semesterId: { type: String, required: true, unique: true },
    semesterName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

export default mongoose.models.Semester || mongoose.model<ISemester>('Semester', SemesterSchema);