
import { Router, Request, Response } from "express";
import { semesterService } from "../Service/SemesterService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class SemesterController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get("/", verifyToken, (req, res) => this.getAll(req, res));
        this.router.get("/:id", verifyToken, (req, res) => this.getById(req, res));

    
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.put("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.update(req, res));
        this.router.delete("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.delete(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const semesters = await semesterService.getAll();
            res.status(200).json(semesters);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const semester = await semesterService.getById(req.params.id);
            if (!semester) return res.status(404).json({ message: "Không tìm thấy học kỳ" });
            res.status(200).json(semester);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const newSemester = await semesterService.create(req.body);
            res.status(201).json(newSemester);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const updated = await semesterService.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ message: "Không tìm thấy học kỳ" });
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const result = await semesterService.delete(req.params.id);
            if (!result) return res.status(404).json({ message: "Không tìm thấy học kỳ" });
            res.status(200).json({ message: "Xóa học kỳ thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const semesterController = new SemesterController();