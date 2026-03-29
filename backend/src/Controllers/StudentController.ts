
import { Router, Request, Response } from "express";
import { studentService } from "../Service/StudentService.js";
import { accountService } from "../Service/AccountService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class StudentController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Mọi người đã đăng nhập có thể xem danh sách
        this.router.get("/", verifyToken, (req, res) => this.getAll(req, res));
        this.router.get("/:id", verifyToken, (req, res) => this.getById(req, res));
        this.router.get("/by-class/:classId", verifyToken, (req, res) => this.getByClass(req, res));

        // Chỉ Admin mới được Thêm/Sửa/Xóa sinh viên
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.put("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.update(req, res));
        this.router.delete("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.delete(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const students = await studentService.getAll();
            res.status(200).json(students);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            // 1. Tạo sinh viên
            const newStudent = await studentService.create(req.body);

            // 2. Tự động tạo tài khoản (Email làm username, studentId làm password)
            await accountService.createAutoAccountStudent(
                newStudent.email, 
                newStudent.studentId
            );

            res.status(201).json(newStudent);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const student = await studentService.getById(req.params.id);
            student ? res.status(200).json(student) : res.status(404).json({ message: "Không tìm thấy sinh viên" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async getByClass(req: Request, res: Response) {
        try {
            const students = await studentService.getByClass(req.params.classId);
            res.status(200).json(students);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const updated = await studentService.update(req.params.id, req.body);
            updated ? res.status(200).json(updated) : res.status(404).json({ message: "Không tìm thấy sinh viên" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const result = await studentService.delete(req.params.id);
            result ? res.status(200).json({ message: "Xóa thành công" }) : res.status(404).json({ message: "Không tìm thấy sinh viên" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const studentController = new StudentController();