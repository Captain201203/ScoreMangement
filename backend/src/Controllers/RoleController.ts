
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

        const adminAuth = [verifyToken, authorizeClaim('admin')];
    
        this.router.get("/", verifyToken, authorizeClaim('admin'), (req, res) => this.getAll(req, res));
        this.router.post("/", verifyToken, authorizeClaim('admin'), (req, res) => this.create(req, res));
        this.router.patch("/add-claim", verifyToken, authorizeClaim('admin'), (req, res) => this.addClaimToRole(req, res));

        // Thêm Claim
        this.router.patch("/add-claim", ...adminAuth, (req, res) => this.addClaimToRole(req, res));
        
        // Gỡ Claim
        this.router.patch("/remove-claim", ...adminAuth, (req, res) => this.removeClaimFromRole(req, res));
        
        // Sửa/Xóa Role
        this.router.patch("/:id", ...adminAuth, (req, res) => this.update(req, res));
        this.router.delete("/:id", ...adminAuth, (req, res) => this.delete(req, res));
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
    private async removeClaimFromRole(req: Request, res: Response) {
        try {
            const { roleId, claimId } = req.body;
            const result = await roleService.removeClaimFromRole(roleId, claimId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const updatedRole = await roleService.update(req.params.id, req.body);
            if (!updatedRole) {
                return res.status(404).json({ error: "Vai trò không tồn tại" });
            }
            res.status(200).json(updatedRole);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            await roleService.delete(req.params.id);
            res.status(200).json({ message: "Xóa vai trò thành công." });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const roleController = new RoleController();