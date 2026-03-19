// src/Service/AuthService.ts
import { accountRepository } from "../Repository/AccountRepository.js"; // Dùng Repo thay vì Model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IRole } from "../Entity/RoleEntity.js";
import { IClaim } from "../Entity/ClaimEntity.js";

export class AuthService {
    async login(username: string, password: string) {
        // 1. Dùng Repository để tìm tài khoản (Repo đã có logic populate sẵn)
        const account = await accountRepository.findByUsername(username);

        if (!account) {
            throw new Error("Tài khoản không tồn tại");
        }

        // 2. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new Error("Mật khẩu không chính xác");
        }

        // 3. Chuẩn bị dữ liệu (Lúc này account.role đã được Repo populate)
        const roleData = account.role as unknown as IRole;
        const claims = (roleData.claims as unknown as IClaim[]).map(c => c.slug);

        // 4. Tạo JWT
        const token = jwt.sign(
            { 
                id: account.accountId, 
                roleType: roleData.roleType,
                claims: claims 
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                username: account.username,
                role: roleData.roleType,
                accountId: account.accountId,
                permissions: claims
            }
        };
    }
}

export const authService = new AuthService();