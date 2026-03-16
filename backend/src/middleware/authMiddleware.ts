// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roleType: string;
        roleName: string;
        claims: string[];
    }; 
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY") as any;
        
        // Lưu đầy đủ thông tin từ Claim-based Token vào req.user
        req.user = {
            id: decoded.id,    
            roleType: decoded.roleType,
            roleName: decoded.roleName,
            claims: decoded.claims || []
        }; 
        
        next();
    } catch (error: any) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};
export const authorizeClaim = (requiredClaim: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: "Yêu cầu xác thực" });

        // Admin luôn có mọi quyền
        if (req.user.roleType === 'admin') return next();

        // Kiểm tra xem mã quyền có nằm trong mảng claims của user không
        const hasPermission = req.user.claims.includes(requiredClaim);

        if (!hasPermission) {
            return res.status(403).json({ 
                message: `Bạn không có quyền thực hiện hành động: ${requiredClaim}` 
            });
        }

        next();
    };
};
export const checkStudentOwnData = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Yêu cầu xác thực" });

    // Admin hoặc Giảng viên có quyền 'score:view_all' thì cho qua
    if (req.user.roleType === 'admin' || req.user.claims.includes('score:view_all')) {
        return next();
    }

    // Nếu là sinh viên, kiểm tra ID
    const queryStudentId = req.query.studentId as string;
    if (req.user.roleType === 'student' && queryStudentId !== req.user.id) {
        return res.status(403).json({ message: "Bạn không thể xem dữ liệu của sinh viên khác" });
    }
    
    next();
};