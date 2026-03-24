// src/Repository/SemesterRepository.ts
import SemesterModel, { ISemester } from "../Entity/SemesterEntity.js";

export class SemesterRepository {
    async findAll(): Promise<ISemester[]> {
        return await SemesterModel.find({}).sort({ startDate: -1 }).exec();
    }

    async findBySemesterId(semesterId: string): Promise<ISemester | null> {
        return await SemesterModel.findOne({ semesterId }).exec();
    }

    async create(data: Partial<ISemester>): Promise<ISemester> {
        const semester = new SemesterModel(data);
        return await semester.save();
    }

    async update(semesterId: string, data: Partial<ISemester>): Promise<ISemester | null> {
        return await SemesterModel.findOneAndUpdate({ semesterId }, data, { new: true }).exec();
    }

    async delete(semesterId: string): Promise<ISemester | null> {
        return await SemesterModel.findOneAndDelete({ semesterId }).exec();
    }
}

export const semesterRepository = new SemesterRepository();