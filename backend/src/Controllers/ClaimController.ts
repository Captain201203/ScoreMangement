// src/Controllers/ClaimController.ts
import { Router, Request, Response } from "express";
import { claimService } from "../Service/ClaimService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class ClaimController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Chỉ Admin mới được phép quản lý danh sách các quyền (Claims)
        this.router.get("/", verifyToken, authorizeClaim('admin'), (req, res) => this.getAll(req, res));
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const claims = await claimService.getAll();
            res.status(200).json(claims);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const claim = await claimService.create(req.body);
            res.status(201).json(claim);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const claimController = new ClaimController();