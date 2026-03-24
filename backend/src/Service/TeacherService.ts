// src/Service/TeacherService.ts
import { ITeacher } from "../Entity/TeacherEntity.js";
import { teacherRepository } from "../Repository/TeacherRepository.js";

export class TeacherService {
    async getAll(): Promise<ITeacher[]> {
        return await teacherRepository.findAll();
    }

    async getById(id: string): Promise<ITeacher | null> {
        return await teacherRepository.findByTeacherId(id);
    }

    async create(data: any): Promise<ITeacher> {
        const existing = await teacherRepository.findByTeacherId(data.teacherId);
        if (existing) {
            throw new Error("Mã giảng viên đã tồn tại.");
        }
        return await teacherRepository.create(data);
    }

    async update(id: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
        return await teacherRepository.update(id, data);
    }

    async delete(id: string): Promise<ITeacher | null> {
        return await teacherRepository.delete(id);
    }
}

export const teacherService = new TeacherService();