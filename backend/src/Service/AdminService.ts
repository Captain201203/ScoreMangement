// src/Service/AdminService.ts
import { IAdmin } from "../Entity/AdminEntity.js";
import { adminRepository } from "../Repository/AdminRepository.js";
// 1. Import accountService để tạo tài khoản
import { accountService } from "./AccountService.js"; 

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
        
      
        const newAdmin = await adminRepository.create(data);

    
        try {
            await accountService.createAutoAccountAdmin(newAdmin.email, newAdmin.adminId);
            console.log(`Đã tạo tự động tài khoản cho Admin: ${newAdmin.email}`);
        } catch (error: any) {
     
            console.error("Lỗi khi tạo tài khoản tự động:", error.message);
        }

        return newAdmin;
    }

    async update(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
        return await adminRepository.update(id, data);
    }

    async delete(id: string): Promise<IAdmin | null> {
        return await adminRepository.delete(id);
    }
}

export const adminService = new AdminService();