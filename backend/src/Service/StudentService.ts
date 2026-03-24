// src/Service/StudentService.ts
import { IStudent } from "../Entity/StudentEntity.js";
import { studentRepository } from "../Repository/StudentRepository.js";
import ClassModel from "../Entity/ClassEntity.js";

export class StudentService {
    async getAll(): Promise<IStudent[]> {
        return await studentRepository.findAll();
    }

    async getByClass(classId: string): Promise<IStudent[]> {
        return await studentRepository.findByClassId(classId);
    }

    async getById(id: string): Promise<IStudent | null> {
        return await studentRepository.findByStudentId(id);
    }

    async create(data: any): Promise<IStudent> {
    
        const targetClass = await ClassModel.findOne({ classId: data.classId });
        if (!targetClass) {
            throw new Error("Lớp học không tồn tại, không thể thêm sinh viên.");
        }

    
        const existing = await studentRepository.findByStudentId(data.studentId);
        if (existing) {
            throw new Error("Mã sinh viên đã tồn tại.");
        }

        return await studentRepository.create(data);
    }

    async update(id: string, data: Partial<IStudent>): Promise<IStudent | null> {
        return await studentRepository.update(id, data);
    }

    async delete(id: string): Promise<IStudent | null> {
        return await studentRepository.delete(id);
    }
}

export const studentService = new StudentService();