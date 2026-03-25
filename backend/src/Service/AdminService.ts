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
        
        // 2. Lưu thông tin Admin vào database
        const newAdmin = await adminRepository.create(data);

        // 3. GỌI TẠO TÀI KHOẢN TỰ ĐỘNG TẠI ĐÂY
        // Truyền email và adminId (dùng làm password mặc định)
        try {
            await accountService.createAutoAccountAdmin(newAdmin.email, newAdmin.adminId);
            console.log(`✅ Đã tạo tự động tài khoản cho Admin: ${newAdmin.email}`);
        } catch (error: any) {
            // Lưu ý: Nếu tạo Account lỗi, bạn có thể cân nhắc việc xóa Admin vừa tạo 
            // để đảm bảo tính đồng nhất (Rollback), hoặc chỉ log lỗi.
            console.error("❌ Lỗi khi tạo tài khoản tự động:", error.message);
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