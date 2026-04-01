
import { Router, Request, Response } from "express";
import { classService } from "../Service/ClassService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class ClassController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        
        this.router.get("/", verifyToken, (req, res) => this.getAll(req, res));
        this.router.get("/:id", verifyToken, (req, res) => this.getById(req, res));
        this.router.get("/count/:classId", verifyToken, (req, res) => this.countStudents(req, res));
        
       
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.put("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.update(req, res));
        this.router.delete("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.delete(req, res));
        this.router.delete("/delete-all-students/:classId", verifyToken, authorizeClaim('admin'), (req, res) => this.deleteAllStudents(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
          
            const user = (req as any).user; 

            const classes = await classService.getAll(user);
            
            res.status(200).json(classes);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const newClass = await classService.create(req.body);
            res.status(201).json(newClass);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const result = await classService.getById(req.params.id);
            result ? res.status(200).json(result) : res.status(404).json({ message: "Lớp học không tồn tại" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const result = await classService.update(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            await classService.delete(req.params.id);
            res.status(200).json({ message: "Xóa lớp học thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async countStudents(req: Request, res: Response) {
        try {
            const count = await classService.countStudentsInClass(req.params.classId);
            res.status(200).json({ classId: req.params.classId, studentCount: count });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async deleteAllStudents(req: Request, res: Response) {
        try {
            await classService.deleteAllStudentsInClass(req.params.classId);
            res.status(200).json({ message: "Xóa toàn bộ sinh viên trong lớp thành công" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const classController = new ClassController();