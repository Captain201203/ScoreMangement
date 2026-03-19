// src/Repository/StudentRepository.ts
import StudentModel, { IStudent } from "../Entity/StudentEntity.js";

export class StudentRepository {
    async findAll(): Promise<IStudent[]> {
        // Lưu ý: classId là string nên ta không dùng populate nếu Entity không khai báo ref
        return await StudentModel.find().exec();
    }

    async findByStudentId(studentId: string): Promise<IStudent | null> {
        return await StudentModel.findOne({ studentId }).exec();
    }

    async findByClassId(classId: string): Promise<IStudent[]> {
        return await StudentModel.find({ classId }).exec();
    }

    async create(data: Partial<IStudent>): Promise<IStudent> {
        const student = new StudentModel(data);
        return await student.save();
    }

    async update(studentId: string, data: Partial<IStudent>): Promise<IStudent | null> {
        return await StudentModel.findOneAndUpdate({ studentId }, data, { new: true }).exec();
    }

    async delete(studentId: string): Promise<IStudent | null> {
        return await StudentModel.findOneAndDelete({ studentId }).exec();
    }
}

export const studentRepository = new StudentRepository();