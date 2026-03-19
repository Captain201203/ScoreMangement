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

    async findByUsername(username: string) {
        return await accountRepository.findByUsername(username);
    }

    async create(data: Partial<IAccount>) {
        return await accountRepository.create(data);
    }

    async createAutoAccount(email: string, id: string, type: 'admin' | 'teacher' | 'student') {
        const existing = await accountRepository.findByUsername(email);
        if (existing) return existing;

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