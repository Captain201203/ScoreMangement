// src/Service/AdminService.ts
import { IAdmin } from "../Entity/AdminEntity.js";
import { adminRepository } from "../Repository/AdminRepository.js";

export class AdminService {
    async getAll(): Promise<IAdmin[]> {
        return await adminRepository.findAll();
    }

    async getById(id: string): Promise<IAdmin | null> {
        return await adminRepository.findById(id);
    }

    async create(data: any): Promise<IAdmin> {
        const existingAdmin = await adminRepository.findById(data.adminId);
        if (existingAdmin) throw new Error("Quản trị viên đã tồn tại.");
        
        return await adminRepository.create(data);
    }

    async update(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
        return await adminRepository.update(id, data);
    }

    async delete(id: string): Promise<IAdmin | null> {
        return await adminRepository.delete(id);
    }
}

export const adminService = new AdminService();