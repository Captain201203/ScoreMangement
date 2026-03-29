
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
        this.router.get("/", verifyToken, authorizeClaim('admin'), (req, res) => this.getAll(req, res));
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));

        this.router.patch("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.update(req, res));
        this.router.delete("/:id", verifyToken, authorizeClaim('admin'), (req, res) => this.remove(req, res));
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

    private async update(req: Request, res: Response) {
        try {
            const updatedClaim = await claimService.update(req.params.id, req.body);
            updatedClaim 
                ? res.status(200).json(updatedClaim)
                : res.status(404).json({ error: "Quyền không tồn tại" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    private async remove(req: Request, res: Response) {
        try {
            await claimService.delete(req.params.id);
            res.status(200).json({ message: "Xóa quyền thành công và đã cập nhật các vai trò liên quan." });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const claimController = new ClaimController();