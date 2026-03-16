import ClaimModel, { IClaim } from "../../models/claim/model.js";

export class ClaimService {
    async getAll(): Promise<IClaim[]> {
        return ClaimModel.find().exec();
    }

    async create(data: Partial<IClaim>): Promise<IClaim> {
        const newClaim = new ClaimModel(data);
        return await newClaim.save();
    }
}
export const claimService = new ClaimService();