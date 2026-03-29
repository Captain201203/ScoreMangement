// src/Service/AccountService.ts
import { accountRepository } from "../Repository/AccountRepository.js";
import RoleModel from "../Entity/RoleEntity.js";
import { IAccount } from "../Entity/AccountEntity.js";
import bcrypt from "bcrypt";

export class AccountService {
    private async getDefaultRoleId(type: 'admin' | 'teacher' | 'student'): Promise<string> {
        const role = await RoleModel.findOne({ roleType: type });
        if (!role) throw new Error(`Role ${type} not found.`);
        return role._id as string;
    }

    async getAll() {
        return await accountRepository.findAll();
    }

    async findByAccountId(accountId: string) {
    // Gọi repository để tìm theo đúng field accountId trong DB
        return await accountRepository.findByAccountId(accountId);
    }

    async findByUsername(username: string) {
        return await accountRepository.findByUsername(username);
    }

    async create(data: any) {
            const { username, password, roleId, accountId } = data;
            
            // 1. Kiểm tra trùng lặp
            const existing = await accountRepository.findByUsername(username);
            if (existing) throw new Error("Email đã tồn tại trong hệ hệ thống.");

            // 2. Hash mật khẩu (Dùng accountId làm pass mặc định nếu không có pass)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password || accountId, salt);

            // 3. Tạo account với Role được chọn từ Frontend
            return await accountRepository.create({
                accountId,
                username,
                password: hashedPassword,
                role: roleId // Gán trực tiếp ID Role từ giao diện Admin chọn
            });
        }

        // Logic auto-account cho các chức năng import hoặc tạo nhanh
        async createAutoAccount(email: string, id: string, type: 'admin' | 'teacher' | 'student') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(id, salt);
            const roleId = await this.getDefaultRoleId(type);

            return await accountRepository.create({
                accountId: id,
                username: email,
                password: hashedPassword,
                role: roleId as any
            });
        }

  
    async createAutoAccountStudent(email: string, mssv: string) {
        return this.createAutoAccount(email, mssv, 'student');
    }

    async createAutoAccountTeacher(email: string, id: string) {
        return this.createAutoAccount(email, id, 'teacher');
    }

    async createAutoAccountAdmin(email: string, id: string) {
        return this.createAutoAccount(email, id, 'admin');
    }

    async updateAccount(id: string, data: Partial<IAccount>) {
        return await accountRepository.update(id, data);
    }

    async deleteAccount(id: string) {
        return await accountRepository.delete(id);
    }
}

export const accountService = new AccountService();