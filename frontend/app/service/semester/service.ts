// src/app/service/semester/service.ts
import { ISemester } from "@/app/types/semester/type";
import { BaseApiService } from "../baseApi/service";

class SemesterService extends BaseApiService {
    constructor() {
        super('semesters'); 
    }

    public async getAll(): Promise<ISemester[]> {
        
        return this.apiRequest<ISemester[]>('GET');
    }

    public async getById(semesterId: string): Promise<ISemester> {
        return this.apiRequest<ISemester>('GET', `/${semesterId}`);
    }

    public async create(data: Omit<ISemester, '_id'>): Promise<ISemester> {
        const response = await this.apiRequest<{ success: boolean; data: ISemester }>('POST', '', data);
        return response.data;
    }

    public async update(semesterId: string, data: Partial<ISemester>): Promise<ISemester> {
        const response = await this.apiRequest<{ success: boolean; data: ISemester }>('PUT', `/${semesterId}`, data);
        return response.data;
    }

    public async delete(semesterId: string): Promise<{ success: boolean; message?: string }> {
        return this.apiRequest('DELETE', `/${semesterId}`);
    }
}

export const semesterService = new SemesterService();