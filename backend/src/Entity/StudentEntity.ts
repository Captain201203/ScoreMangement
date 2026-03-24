import mongoose, { Document, Schema } from 'mongoose';


export interface IStudent extends Document {
    studentId: string;
    studentName: string;
    dateOfBirth: Date;
    email: string;
    classId: string; 
    majorName: string;
}

const StudentSchema: Schema = new Schema({
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true },
    classId: { 
        type: String, 
        required: true 
    }
});


export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);