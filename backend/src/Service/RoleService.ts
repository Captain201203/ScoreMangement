// src/Service/RoleService.ts
import { IRole } from "../Entity/RoleEntity.js";
import { roleRepository } from "../Repository/RoleRepository.js";

export class RoleService {
    async getAll(): Promise<IRole[]> {
        return await roleRepository.findAll();
    }

    async create(data: Partial<IRole>): Promise<IRole> {
      
        return await roleRepository.create(data);
    }

    async addClaimToRole(roleId: string, claimId: string): Promise<IRole | null> {
        return await roleRepository.updateClaims(roleId, claimId);
    }

    async update(id: string, data: Partial<IRole>): Promise<IRole | null> {
        return await roleRepository.update(id, data);
    }

    async removeClaimFromRole(roleId: string, claimId: string): Promise<IRole | null> {
        return await roleRepository.removeClaim(roleId, claimId);
    }

    async delete(id: string): Promise<boolean> {
        const role = await roleRepository.findById(id);
        if (!role) throw new Error("Role không tồn tại.");
        
        // Bảo vệ vai trò quản trị tối cao
        if (role.roleType === 'admin') {
            throw new Error("Không thể xóa vai trò Quản trị viên hệ thống.");
        }

        await roleRepository.delete(id);
        return true;
    }
}

export const roleService = new RoleService();