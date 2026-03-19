import { Document, Schema, model } from "mongoose";

export interface ISubject extends Document {
    subjectId: string;
    subjectName: string;
    majorName: string;
    
}

const SubjectSchema: Schema = new Schema({
    subjectId: { type: String, required: true, unique: true },
    subjectName: { type: String, required: true },
    majorName: { type: String, required: true },
});

export default model<ISubject>("Subject", SubjectSchema);
