import mongoose, { Schema, Document } from "mongoose";

export interface IScore extends Document {
  studentId: string;
  subjectId: string; 
  subjectName?: string;
  className?: string;
  ex1Score: number; 
  ex2Score: number; 
  examScore: number; 
  finalScore: number; 
  GPA?: number;      
  letterGrade?: string; 
  semester: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreSchema: Schema = new Schema({
  studentId: { type: String, required: true, index: true },
  subjectId: { type: String, required: true, index: true }, 
  subjectName: { type: String },
  className: { type: String, index: true },
  ex1Score: { type: Number, required: true, min: 0, max: 10 },
  ex2Score: { type: Number, required: true, min: 0, max: 10 },
  examScore: { type: Number, required: true, min: 0, max: 10 }, // Điểm thi đầu vào
  finalScore: { type: Number, default: 0 }, // Sẽ được ghi đè bởi pre-save
  GPA: { type: Number, min: 0, max: 4 },
  letterGrade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'] },
  semester: { type: String, required: true },
}, {
  timestamps: true
});


ScoreSchema.index({ studentId: 1, subjectId: 1, semester: 1, academicYear: 1 }, { unique: true });

ScoreSchema.pre('save', function (next) {
  const score = this as any;


  const rawFinal = (score.ex1Score * 0.1) + (score.ex2Score * 0.3) + (score.examScore * 0.6);
  score.finalScore = Math.round(rawFinal * 10) / 10; 

  const f = score.finalScore;


  if (f >= 9.0) { score.letterGrade = 'A+'; score.GPA = 4.0; }
  else if (f >= 8.5) { score.letterGrade = 'A';  score.GPA = 3.7; }
  else if (f >= 8.0) { score.letterGrade = 'B+'; score.GPA = 3.3; }
  else if (f >= 7.0) { score.letterGrade = 'B';  score.GPA = 3.0; }
  else if (f >= 6.5) { score.letterGrade = 'C+'; score.GPA = 2.7; }
  else if (f >= 6.3) { score.letterGrade = 'C';  score.GPA = 2.3; }
  else if (f >= 4.8) { score.letterGrade = 'D+'; score.GPA = 2.0; }
  else if (f >= 4.0) { score.letterGrade = 'D';  score.GPA = 1.7; }
  else { score.letterGrade = 'F'; score.GPA = 0.0; }

  next();
});

export default mongoose.model<IScore>('Score', ScoreSchema);