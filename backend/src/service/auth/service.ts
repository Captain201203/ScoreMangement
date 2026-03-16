// src/service/auth/service.ts
import AccountModel from "../../models/account/model.js";
import { IRole } from "../../models/role/model.js"; // Import interface Role
import { IClaim } from "../../models/claim/model.js"; // Import interface Claim
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    async login(username: string, password: string) {
        // 1. Tìm tài khoản và POPULATE sâu vào Role và Claims
        const account = await AccountModel.findOne({ username })
            .populate({
                path: 'role',
                populate: { path: 'claims' }
            })
            .exec();

        if (!account) {
            throw new Error("Tài khoản không tồn tại");
        }

        // 2. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new Error("Mật khẩu không chính xác");
        }

        // 3. Chuẩn bị dữ liệu từ Role đã populate
        // Ép kiểu vì chúng ta đã populate
        const roleData = account.role as unknown as IRole;
        const claims = (roleData.claims as unknown as IClaim[]).map(c => c.slug);

        // 4. Tạo JWT Token với đầy đủ thông tin (Claims-based)
        const token = jwt.sign(
            { 
                id: account.accountId, 
                roleType: roleData.roleType, // Ví dụ: 'teacher'
                roleName: roleData.roleName, // Ví dụ: 'Trưởng bộ môn'
                claims: claims                // Ví dụ: ['score:update', 'class:view']
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // 5. Trả về thông tin (ẩn các thông tin nhạy cảm)
        return {
            token,
            user: {
                username: account.username,
                role: roleData.roleType,
                roleDisplayName: roleData.roleName,
                accountId: account.accountId,
                permissions: claims
            }
        };
    }
}

export const authService = new AuthService();