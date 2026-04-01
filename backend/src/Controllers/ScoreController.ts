
import { Router, Request, Response } from "express";
import { scoreService } from "../Service/ScoreService.js";
import { verifyToken, checkStudentOwnData } from "../middleware/authMiddleware.js";

export class ScoreController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(verifyToken); 

        
        this.router.get("/", (req: any, res, next) => {
            if (req.user.roleType === 'student') {
                return checkStudentOwnData(req, res, next);
            }
            next(); 
        }, (req, res) => this.getAll(req, res));

       
        this.router.post("/", (req, res) => this.create(req, res));

       
        this.router.get("/:id", (req, res) => this.getById(req, res));

     
        this.router.put("/:id", (req, res) => this.update(req, res));

    
        this.router.delete("/:id", (req, res) => this.remove(req, res));
    }

    private async create(req: Request, res: Response) {
        try {
            const score = await scoreService.createScore(req.body);
            res.status(201).json({ success: true, data: score });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    private async getAll(req: Request, res: Response) {
        try {
            const scores = await scoreService.getAllScores(req.query);
            res.status(200).json({ success: true, count: scores.length, data: scores });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const score = await scoreService.getScoreById(req.params.id);
            score 
                ? res.status(200).json({ success: true, data: score })
                : res.status(404).json({ message: "Không tìm thấy bản ghi điểm" });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const score = await scoreService.updateScore(req.params.id, req.body);
            res.status(200).json({ success: true, message: "Cập nhật thành công", data: score });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    private async remove(req: Request, res: Response) {
        try {
            await scoreService.deleteScore(req.params.id);
            res.status(200).json({ success: true, message: "Đã xóa bản ghi điểm" });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export const scoreController = new ScoreController();