import RoleModel, { IRole } from "../../models/role/model.js";

export class RoleService {
    async getAll(): Promise<IRole[]> {
        const roles = await RoleModel.find()
            .populate('claims')
            .lean() // Chuyển về Plain Object
            .exec();

        return roles as unknown as IRole[]; 
    }

    async create(data: Partial<IRole>): Promise<IRole> {
        const newRole = new RoleModel(data);
        return await newRole.save();
    }

    // Cập nhật thêm quyền cho Role
    async addClaimToRole(roleId: string, claimId: string): Promise<IRole | null> {
        return RoleModel.findByIdAndUpdate(
            roleId,
            { $addToSet: { claims: claimId } }, // Tránh trùng lặp ID
            { new: true }
        );
    }
}
export const roleService = new RoleService();