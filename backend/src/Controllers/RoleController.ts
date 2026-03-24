// src/Controllers/RoleController.ts
import { Router, Request, Response } from "express";
import { roleService } from "../Service/RoleService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";

export class RoleController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Chỉ Admin mới có quyền xem và tạo Role/Cấu hình quyền hạn
        this.router.get("/", verifyToken, authorizeClaim('admin'), (req, res) => this.getAll(req, res));
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.patch("/add-claim", verifyToken, authorizeClaim('admin'), (req, res) => this.addClaimToRole(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const roles = await roleService.getAll();
            res.status(200).json(roles);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const role = await roleService.create(req.body);
            res.status(201).json(role);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async addClaimToRole(req: Request, res: Response) {
        try {
            const { roleId, claimId } = req.body;
            const updatedRole = await roleService.addClaimToRole(roleId, claimId);
            updatedRole 
                ? res.status(200).json(updatedRole)
                : res.status(404).json({ error: "Role không tồn tại" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const roleController = new RoleController();