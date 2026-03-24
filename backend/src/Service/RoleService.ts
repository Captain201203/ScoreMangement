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
}

export const roleService = new RoleService();