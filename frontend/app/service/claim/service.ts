// src/app/service/claim/service.ts

import { BaseApiService } from "../baseApi/service";
import { IClaim, ICreateClaimPayload } from "@/app/types/claim/type";

class ClaimService extends BaseApiService {
  constructor() {
    super('claims'); // Khớp với app.use('/api/claims', ...) ở Backend
  }

  public async getAll(): Promise<IClaim[]> {
    const response = await this.apiRequest<IClaim[]>('GET', '/');
    return response;
  }

  public async create(data: ICreateClaimPayload): Promise<IClaim> {
    return await this.apiRequest<IClaim>('POST', '/', data);
  }

  public async update(id: string, data: Partial<IClaim>): Promise<IClaim> {
    return await this.apiRequest<IClaim>('PATCH', `/${id}`, data);
}

    public async delete(id: string): Promise<{ message: string }> {
        return await this.apiRequest('DELETE', `/${id}`);
    }
}

export const claimService = new ClaimService();