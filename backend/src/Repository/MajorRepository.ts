// src/Repository/MajorRepository.ts
import MajorModel, { IMajor } from "../Entity/MajorEntity.js";

export class MajorRepository {
    async findAll(): Promise<IMajor[]> {
        return await MajorModel.find().exec();
    }

    async findByMajorId(majorId: string): Promise<IMajor | null> {
        return await MajorModel.findOne({ majorId }).exec();
    }

    async create(data: Partial<IMajor>): Promise<IMajor> {
        const major = new MajorModel(data);
        return await major.save();
    }

    async update(majorId: string, data: Partial<IMajor>): Promise<IMajor | null> {
        return await MajorModel.findOneAndUpdate({ majorId }, data, { new: true }).exec();
    }

    async delete(majorId: string): Promise<IMajor | null> {
        return await MajorModel.findOneAndDelete({ majorId }).exec();
    }
}

export const majorRepository = new MajorRepository();