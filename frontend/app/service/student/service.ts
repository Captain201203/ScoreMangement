// src/app/service/student/service.ts
import { IStudent } from "@/app/types/student/type";
import { BaseApiService } from "../baseApi/service";

class StudentService extends BaseApiService {
    constructor() {
        super('students');
    }

    public async getAll(): Promise<IStudent[]> {
        return this.apiRequest<IStudent[]>('GET');
    }

    public async getByClass(classId: string): Promise<IStudent[]> {
        if (!classId) return [];
        // URL: /api/students/by-class/:classId
        return this.apiRequest<IStudent[]>('GET', `/by-class/${encodeURIComponent(classId)}`);
    }

    public async getById(studentId: string): Promise<IStudent> {
        return this.apiRequest<IStudent>('GET', `/${studentId}`);
    }

    public async create(data: Omit<IStudent, '_id'>): Promise<IStudent> {
        return this.apiRequest<IStudent>('POST', '', data);
    }

    public async update(studentId: string, data: Partial<IStudent>): Promise<IStudent> {
        return this.apiRequest<IStudent>('PUT', `/${studentId}`, data);
    }

    public async delete(studentId: string): Promise<{ success: boolean; message?: string }> {
        return this.apiRequest<{ success: boolean; message?: string }>('DELETE', `/${studentId}`);
    }
}

export const studentService = new StudentService();