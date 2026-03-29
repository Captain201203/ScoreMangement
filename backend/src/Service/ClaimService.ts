import { IClaim } from "../Entity/ClaimEntity.js";
import { claimRepository } from "../Repository/ClaimRepository.js";
import RoleModel from "../Entity/RoleEntity.js"; // Import để xử lý gỡ quyền

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

    // MỚI: Cập nhật thông tin Claim
    async update(id: string, data: Partial<IClaim>): Promise<IClaim | null> {
        if (data.slug) {
            const existing = await claimRepository.findBySlug(data.slug);
            if (existing && existing._id.toString() !== id) {
                throw new Error("Slug này đã được sử dụng bởi quyền khác.");
            }
        }
        return await claimRepository.update(id, data);
    }

    // MỚI: Xóa Claim và gỡ khỏi các Role liên quan
    async delete(id: string): Promise<boolean> {
        const deletedClaim = await claimRepository.delete(id);
        if (!deletedClaim) throw new Error("Không tìm thấy quyền để xóa.");

        // Logic quan trọng: Gỡ ID của claim này khỏi mảng claims của tất cả Roles
        await RoleModel.updateMany(
            { claims: id },
            { $pull: { claims: id } }
        );

        return true;
    }
}

export const claimService = new ClaimService();