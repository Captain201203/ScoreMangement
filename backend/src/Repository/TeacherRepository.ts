// src/Repository/TeacherRepository.ts
import TeacherModel, { ITeacher } from "../Entity/TeacherEntity.js";

export class TeacherRepository {
    async findAll(): Promise<ITeacher[]> {
        return await TeacherModel.find().exec();
    }

    async findByTeacherId(teacherId: string): Promise<ITeacher | null> {
        return await TeacherModel.findOne({ teacherId }).exec();
    }

    async create(data: Partial<ITeacher>): Promise<ITeacher> {
        const teacher = new TeacherModel(data);
        return await teacher.save();
    }

    async update(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
        return await TeacherModel.findOneAndUpdate({ teacherId }, data, { new: true }).exec();
    }

    async delete(teacherId: string): Promise<ITeacher | null> {
        return await TeacherModel.findOneAndDelete({ teacherId }).exec();
    }
}

export const teacherRepository = new TeacherRepository();