// src/app/service/role/service.ts
import { BaseApiService } from "../baseApi/service";
import { IRole, IRoleUpdatePayload } from "@/app/types/role/type";

class RoleService extends BaseApiService {
  constructor() {
    super('roles');
  }

  public async getAll(): Promise<IRole[]> {
    return await this.apiRequest<IRole[]>('GET', '/');
  }

  public async create(data: Partial<IRole>): Promise<IRole> {
    return await this.apiRequest<IRole>('POST', '/', data);
  }

  public async addClaimToRole(payload: IRoleUpdatePayload): Promise<IRole> {
    return await this.apiRequest<IRole>('PATCH', '/add-claim', payload);
  }

  public async removeClaim(roleId: string, claimId: string) {
    return await this.apiRequest('PATCH', '/remove-claim', { roleId, claimId });
  }

  public async update(id: string, data: Partial<IRole>) {
    return await this.apiRequest('PATCH', `/${id}`, data);
  }

  public async deleteRole(id: string) {
        return await this.apiRequest('DELETE', `/${id}`);
 }
}

export const roleService = new RoleService();