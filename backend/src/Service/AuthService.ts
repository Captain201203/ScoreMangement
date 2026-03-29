// src/Service/AuthService.ts
import { accountRepository } from "../Repository/AccountRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IRole } from "../Entity/RoleEntity.js";
import { IClaim } from "../Entity/ClaimEntity.js";

export class AuthService {
    async login(username: string, password: string) {
       
        const account = await accountRepository.findByUsername(username);

        if (!account) {
            throw new Error("Tài khoản không tồn tại");
        }

        // 2. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new Error("Mật khẩu không chính xác");
        }
        

    
        const roleData = account.role as unknown as IRole;
        const claims = (roleData.claims as unknown as IClaim[]).map(c => c.slug);

        const secret = process.env.JWT_SECRET;
        
        if (!secret) {
            console.error("❌ LỖI NGHIÊM TRỌNG: JWT_SECRET chưa được cấu hình trong .env");
            throw new Error("Lỗi cấu hình hệ thống (Server missing Secret Key)");
        }
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
        username: account.username, // Phẳng hóa dữ liệu ra ngoài cho dễ đọc
        roleType: roleData.roleType,
        claims: claims, // <--- Đổi tên từ 'permissions' thành 'claims'
        user: {
            username: account.username,
            role: roleData.roleType,
            accountId: account.accountId,
        }
    };
    }
}

export const authService = new AuthService();