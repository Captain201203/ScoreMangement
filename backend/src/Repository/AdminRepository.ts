// src/Repository/AdminRepository.ts
import AdminModel, { IAdmin } from "../Entity/AdminEntity.js";

export class AdminRepository {
    async findAll(): Promise<IAdmin[]> {
        return await AdminModel.find().exec();
    }

    async findById(id: string): Promise<IAdmin | null> {
        return await AdminModel.findOne({ adminId: id }).exec();
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        return await AdminModel.findOne({ email }).exec();
    }

    async create(data: Partial<IAdmin>): Promise<IAdmin> {
        const admin = new AdminModel(data);
        return await admin.save();
    }

    async update(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
        return await AdminModel.findOneAndUpdate({ adminId: id }, data, { new: true }).exec();
    }

    async delete(id: string): Promise<IAdmin | null> {
        return await AdminModel.findOneAndDelete({ adminId: id }).exec();
    }
}

export const adminRepository = new AdminRepository();