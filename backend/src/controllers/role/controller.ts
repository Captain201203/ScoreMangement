import { Request, Response } from "express";
import { roleService } from "../../service/role/service.js";

export class RoleController {
    async getAll(req: Request, res: Response) {
        try {
            const roles = await roleService.getAll();
            res.status(200).json(roles);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const role = await roleService.create(req.body);
            res.status(201).json(role);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
export const roleController = new RoleController();