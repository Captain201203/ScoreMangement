// src/Controllers/SubjectController.ts
import { Router, Request, Response } from "express";
import { subjectService } from "../Service/SubjectService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class SubjectController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // User đã login có thể xem môn học
        this.router.get("/", verifyToken, (req, res) => this.getAll(req, res));
        this.router.get("/:id", verifyToken, (req, res) => this.getById(req, res));
        this.router.get("/by-major/:majorName", verifyToken, (req, res) => this.getByMajor(req, res));

        // Chỉ Admin mới được quản lý môn học
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.put("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.update(req, res));
        this.router.delete("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.delete(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const subjects = await subjectService.getAll();
            res.status(200).json(subjects);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const subject = await subjectService.getById(req.params.id);
            if (!subject) return res.status(404).json({ message: "Không tìm thấy môn học" });
            res.status(200).json(subject);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async getByMajor(req: Request, res: Response) {
        try {
            const subjects = await subjectService.getByMajor(req.params.majorName);
            res.status(200).json(subjects);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const newSubject = await subjectService.create(req.body);
            res.status(201).json(newSubject);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const updated = await subjectService.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ message: "Không tìm thấy môn học" });
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const deleted = await subjectService.delete(req.params.id);
            if (!deleted) return res.status(404).json({ message: "Không tìm thấy môn học" });
            res.status(200).json({ message: "Xóa môn học thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const subjectController = new SubjectController();