// src/Repository/ClassRepository.ts
import ClassModel, { IClass } from "../Entity/ClassEntity.js";

export class ClassRepository {
    async findAll(): Promise<IClass[]> {
        return await ClassModel.find().exec();
    }

    async findById(classId: string): Promise<IClass | null> {
        return await ClassModel.findOne({ classId }).exec();
    }

    async create(data: Partial<IClass>): Promise<IClass> {
        const newClass = new ClassModel(data);
        return await newClass.save();
    }

    async update(classId: string, data: Partial<IClass>): Promise<IClass | null> {
        return await ClassModel.findOneAndUpdate({ classId }, data, { new: true }).exec();
    }

    async delete(classId: string): Promise<IClass | null> {
        return await ClassModel.findOneAndDelete({ classId }).exec();
    }
}

export const classRepository = new ClassRepository();