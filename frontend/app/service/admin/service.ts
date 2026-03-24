// src/app/service/admin/service.ts
import { IAdmin } from "../../types/admin/type";
import { BaseApiService } from "../baseApi/service";

class AdminService extends BaseApiService {
    constructor() {
        super('admins'); // Khuyên dùng 'admins' nếu Backend export là accounts/admins
    }

    public async getAll(): Promise<IAdmin[]> {
        return this.apiRequest<IAdmin[]>('GET');
    }

    public async getById(adminId: string): Promise<IAdmin> {
        return this.apiRequest<IAdmin>('GET', `/${adminId}`);
    }

    public async create(data: Omit<IAdmin, '_id'>): Promise<IAdmin> {
        return this.apiRequest<IAdmin>('POST', '', data);
    }

    public async update(adminId: string, data: Partial<IAdmin>): Promise<IAdmin> {
        return this.apiRequest<IAdmin>('PUT', `/${adminId}`, data);
    }

    public async delete(adminId: string): Promise<{ success: boolean; message?: string }> {
        return this.apiRequest('DELETE', `/${adminId}`);
    }
}

export const adminService = new AdminService();