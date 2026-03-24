// src/app/service/teacher/service.ts
import { ITeacher } from "@/app/types/teacher/type";
import { BaseApiService } from "../baseApi/service";

class TeacherService extends BaseApiService {
    constructor() {
        super('teachers');
    }

    public async getAll(): Promise<ITeacher[]> {
        return this.apiRequest<ITeacher[]>('GET');
    }

    public async getById(teacherId: string): Promise<ITeacher> {
        return this.apiRequest<ITeacher>('GET', `/${teacherId}`);
    }

    public async create(data: Omit<ITeacher, '_id'>): Promise<ITeacher> {
        return this.apiRequest<ITeacher>('POST', '', data);
    }

    public async update(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher> {
        return this.apiRequest<ITeacher>('PUT', `/${teacherId}`, data);
    }

    public async delete(teacherId: string): Promise<{ success: boolean; message?: string }> {
        return this.apiRequest<{ success: boolean; message?: string }>('DELETE', `/${teacherId}`);
    }
}

export const teacherService = new TeacherService();