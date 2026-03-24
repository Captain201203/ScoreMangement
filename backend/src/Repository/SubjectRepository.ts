// src/Repository/SubjectRepository.ts
import SubjectModel, { ISubject } from "../Entity/SubjectEntity.js";

export class SubjectRepository {
    async findAll(): Promise<ISubject[]> {
        return await SubjectModel.find().exec();
    }

    async findById(subjectId: string): Promise<ISubject | null> {
        return await SubjectModel.findOne({ subjectId }).exec();
    }

    async findByMajor(majorName: string): Promise<ISubject[]> {
        return await SubjectModel.find({ majorName }).exec();
    }

    async create(data: Partial<ISubject>): Promise<ISubject> {
        const subject = new SubjectModel(data);
        return await subject.save();
    }

    async update(subjectId: string, data: Partial<ISubject>): Promise<ISubject | null> {
        return await SubjectModel.findOneAndUpdate({ subjectId }, data, { new: true }).exec();
    }

    async delete(subjectId: string): Promise<ISubject | null> {
        return await SubjectModel.findOneAndDelete({ subjectId }).exec();
    }
}

export const subjectRepository = new SubjectRepository();