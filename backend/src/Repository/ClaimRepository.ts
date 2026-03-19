// src/Repository/ClaimRepository.ts
import ClaimModel, { IClaim } from "../Entity/ClaimEntity.js";

export class ClaimRepository {
    async findAll(): Promise<IClaim[]> {
        return await ClaimModel.find().exec();
    }

    async findBySlug(slug: string): Promise<IClaim | null> {
        return await ClaimModel.findOne({ slug }).exec();
    }

    async create(data: Partial<IClaim>): Promise<IClaim> {
        const claim = new ClaimModel(data);
        return await claim.save();
    }

    async delete(id: string): Promise<IClaim | null> {
        return await ClaimModel.findByIdAndDelete(id).exec();
    }
}

export const claimRepository = new ClaimRepository();