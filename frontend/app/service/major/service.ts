// src/app/service/major/service.ts
import { IMajor } from "../../types/major/type";
import { BaseApiService } from "../baseApi/service";

class MajorService extends BaseApiService {
    constructor() {
        super('majors');
    }

    public async getAll(): Promise<IMajor[]> {
        return this.apiRequest<IMajor[]>('GET');
    }

    public async getById(majorId: string): Promise<IMajor> {
        return this.apiRequest<IMajor>('GET', `/${majorId}`);
    }

    public async create(data: Omit<IMajor, '_id'>): Promise<IMajor> {
        return this.apiRequest<IMajor>('POST', '', data);
    }

    public async update(majorId: string, data: Partial<IMajor>): Promise<IMajor> {
        return this.apiRequest<IMajor>('PUT', `/${majorId}`, data);
    }

    public async delete(majorId: string): Promise<{ success: boolean; message?: string }> {
        return this.apiRequest<{ success: boolean; message?: string }>('DELETE', `/${majorId}`);
    }
}

export const majorService = new MajorService();