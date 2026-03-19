// src/Repository/ScoreRepository.ts
import ScoreModel, { IScore } from "../Entity/ScoreEntity.js";

export class ScoreRepository {
    async findAll(query: any): Promise<IScore[]> {
        return await ScoreModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<IScore | null> {
        return await ScoreModel.findById(id).exec();
    }

    async findOne(filter: any): Promise<IScore | null> {
        return await ScoreModel.findOne(filter).exec();
    }

    async create(data: any): Promise<IScore> {
        const score = new ScoreModel(data);
        return await score.save();
    }

    async update(id: string, data: any): Promise<IScore | null> {
        const score = await ScoreModel.findById(id);
        if (!score) return null;
        Object.assign(score, data);
        return await score.save(); // Phải dùng .save() để trigger pre-save hook
    }

    async delete(id: string): Promise<IScore | null> {
        return await ScoreModel.findByIdAndDelete(id).exec();
    }

    async findByStudentId(studentId: string): Promise<IScore[]> {
        return await ScoreModel.find({ studentId }).exec();
    }
}

export const scoreRepository = new ScoreRepository();