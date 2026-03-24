// src/Controllers/TeacherController.ts
import { Router, Request, Response } from "express";
import { teacherService } from "../Service/TeacherService.js";
import { accountService } from "../Service/AccountService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class TeacherController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Mọi người đã đăng nhập có thể xem thông tin giảng viên
        this.router.get("/", verifyToken, (req, res) => this.getAll(req, res));
        this.router.get("/:id", verifyToken, (req, res) => this.getById(req, res));

        // Chỉ Admin mới có quyền quản lý nhân sự giảng viên
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.put("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.update(req, res));
        this.router.delete("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.delete(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const teachers = await teacherService.getAll();
            res.status(200).json(teachers);
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách giảng viên." });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const teacher = await teacherService.getById(req.params.id);
            teacher 
                ? res.status(200).json(teacher) 
                : res.status(404).json({ message: "Không tìm thấy giảng viên này." });
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi khi lấy giảng viên." });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            // 1. Tạo giảng viên
            const newTeacher = await teacherService.create(req.body);

            // 2. Tự động tạo tài khoản cho giảng viên
            if (newTeacher && newTeacher.teacherEmail && newTeacher.teacherId) {
                await accountService.createAutoAccountTeacher(
                    newTeacher.teacherEmail, 
                    newTeacher.teacherId
                );
            }
            
            res.status(201).json(newTeacher);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const teacher = await teacherService.update(req.params.id, req.body);
            teacher 
                ? res.status(200).json(teacher) 
                : res.status(404).json({ message: "Không tìm thấy giảng viên này." });
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi khi cập nhật giảng viên." });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const teacher = await teacherService.delete(req.params.id);
            teacher 
                ? res.status(200).json({ success: true, message: "Đã xóa giảng viên thành công." }) 
                : res.status(404).json({ message: "Không tìm thấy giảng viên này." });
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi khi xóa giảng viên." });
        }
    }
}

export const teacherController = new TeacherController();