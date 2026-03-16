import { Request, Response } from "express";
import { claimService } from "../../service/claim/service.js";

export class ClaimController {
    async getAll(req: Request, res: Response) {
        try {
            const claims = await claimService.getAll();
            res.status(200).json(claims);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const claim = await claimService.create(req.body);
            res.status(201).json(claim);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
export const claimController = new ClaimController();