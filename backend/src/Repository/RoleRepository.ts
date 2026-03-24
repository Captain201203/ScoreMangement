// src/Repository/RoleRepository.ts
import RoleModel, { IRole } from "../Entity/RoleEntity.js";

export class RoleRepository {
    async findAll(): Promise<IRole[]> {
        return await RoleModel.find()
            .populate('claims')
            .lean()
            .exec() as unknown as IRole[];
    }

    async findById(id: string): Promise<IRole | null> {
        return await RoleModel.findById(id).populate('claims').exec();
    }

    async findByType(type: string): Promise<IRole | null> {
        return await RoleModel.findOne({ roleType: type }).exec();
    }

    async create(data: Partial<IRole>): Promise<IRole> {
        const role = new RoleModel(data);
        return await role.save();
    }

    async updateClaims(roleId: string, claimId: string): Promise<IRole | null> {
        return await RoleModel.findByIdAndUpdate(
            roleId,
            { $addToSet: { claims: claimId } }, // Thêm vào mảng nếu chưa tồn tại
            { new: true }
        ).populate('claims').exec();
    }
}

export const roleRepository = new RoleRepository();