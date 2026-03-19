// src/Service/ClaimService.ts
import { IClaim } from "../Entity/ClaimEntity.js";
import { claimRepository } from "../Repository/ClaimRepository.js";

export class ClaimService {
    async getAll(): Promise<IClaim[]> {
        return await claimRepository.findAll();
    }

    async create(data: Partial<IClaim>): Promise<IClaim> {
        if (!data.slug) throw new Error("Slug là bắt buộc.");
        
        const existing = await claimRepository.findBySlug(data.slug);
        if (existing) throw new Error("Mã định danh (slug) này đã tồn tại.");

        return await claimRepository.create(data);
    }
}

export const claimService = new ClaimService();