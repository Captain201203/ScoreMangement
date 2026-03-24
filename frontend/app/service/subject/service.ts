// src/app/service/subject/service.ts
import { ISubject } from "@/app/types/subject/type";
import { BaseApiService } from "../baseApi/service";

class SubjectService extends BaseApiService {
    constructor() {
        super('subjects');
    }

    public async getAll(): Promise<ISubject[]> {
        return this.apiRequest<ISubject[]>('GET');
    }

    public async getByMajor(majorName: string): Promise<ISubject[]> {
        // Tự động encode URI để tránh lỗi khi tên chuyên ngành có khoảng trắng
        return this.apiRequest<ISubject[]>('GET', `/by-major/${encodeURIComponent(majorName)}`);
    }

    public async getById(subjectId: string): Promise<ISubject> {
        return this.apiRequest<ISubject>('GET', `/${subjectId}`);
    }

    public async create(data: Omit<ISubject, '_id'>): Promise<ISubject> {
        return this.apiRequest<ISubject>('POST', '', data);
    }

    public async update(subjectId: string, data: Partial<ISubject>): Promise<ISubject> {
        return this.apiRequest<ISubject>('PUT', `/${subjectId}`, data);
    }

    public async delete(subjectId: string): Promise<{ success: boolean; message?: string }> {
        return this.apiRequest<{ success: boolean; message?: string }>('DELETE', `/${subjectId}`);
    }
}

export const subjectService = new SubjectService();