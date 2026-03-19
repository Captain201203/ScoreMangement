// src/Controllers/MajorController.ts
import { Router, Request, Response } from "express";
import { majorService } from "../Service/MajorService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class MajorController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Mọi người (đã đăng nhập) có thể xem danh sách chuyên ngành
        this.router.get("/", verifyToken, (req, res) => this.getAll(req, res));
        this.router.get("/:id", verifyToken, (req, res) => this.getById(req, res));

        // Chỉ Admin mới được quản lý (Thêm/Sửa/Xóa)
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.put("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.update(req, res));
        this.router.delete("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.delete(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const majors = await majorService.getAll();
            res.status(200).json(majors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const major = await majorService.getById(req.params.id);
            major ? res.status(200).json(major) : res.status(404).json({ error: 'Major not found' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const major = await majorService.create(req.body);
            res.status(201).json(major);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const major = await majorService.update(req.params.id, req.body);
            major ? res.status(200).json(major) : res.status(404).json({ error: 'Major not found' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const major = await majorService.delete(req.params.id);
            major ? res.status(200).json({ message: "Xóa thành công" }) : res.status(404).json({ error: 'Major not found' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const majorController = new MajorController();