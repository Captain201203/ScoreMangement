// src/Service/ScoreService.ts
import { scoreRepository } from "../Repository/ScoreRepository.js";
import { IScore } from "../Entity/ScoreEntity.js";
import StudentModel from "../Entity/StudentEntity.js";
import SubjectModel from "../Entity/SubjectEntity.js";
import SemesterModel from "../Entity/SemesterEntity.js";

export class ScoreService {
    async createScore(data: any): Promise<IScore> {
        const { studentId, subjectId, semester } = data;

        const [student, subject, semesterExists] = await Promise.all([
            StudentModel.findOne({ studentId }),
            SubjectModel.findOne({ subjectId }),
            SemesterModel.findOne({ semesterId: semester })
        ]);

        if (!student) throw new Error(`Không tìm thấy sinh viên ID: ${studentId}`);
        if (!subject) throw new Error(`Không tìm thấy môn học ID: ${subjectId}`);
        if (!semesterExists) throw new Error(`Không tìm thấy học kỳ: ${semester}`);

        let score = await scoreRepository.findOne({ studentId, subjectId, semester });

        if (score) {
            return await scoreRepository.update(score._id as string, data) as IScore;
        } else {
            return await scoreRepository.create({
                ...data,
                subjectName: subject.subjectName,
                className: student.className,
            });
        }
    }

    async getAllScores(filter: any): Promise<IScore[]> {
        const query: any = {};
        ['studentId', 'subjectId', 'semester', 'className'].forEach(field => {
            if (filter[field]) query[field] = filter[field];
        });
        return await scoreRepository.findAll(query);
    }

    async getScoreById(id: string) {
        return await scoreRepository.findById(id);
    }

    async updateScore(id: string, data: Partial<IScore>) {
        return await scoreRepository.update(id, data);
    }

    async deleteScore(id: string) {
        return await scoreRepository.delete(id);
    }
}

export const scoreService = new ScoreService();