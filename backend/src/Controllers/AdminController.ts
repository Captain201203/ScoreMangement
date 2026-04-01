
import { Router, Request, Response } from "express";
import { adminService } from "../Service/AdminService.js";
import { accountService } from "../Service/AccountService.js";

export class AdminController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req, res) => this.getAll(req, res));
        this.router.get('/:id', (req, res) => this.getById(req, res));
        this.router.post('/', (req, res) => this.create(req, res));
        this.router.put('/:id', (req, res) => this.update(req, res));
        this.router.delete('/:id', (req, res) => this.delete(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const admins = await adminService.getAll();
            res.status(200).json(admins);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const newAdmin = await adminService.create(req.body);

         
            if (newAdmin && newAdmin.email && newAdmin.adminId) {
                await accountService.createAutoAccountAdmin(
                    newAdmin.email, 
                    newAdmin.adminId
                );
            }
            
            res.status(201).json(newAdmin);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async getById(req: Request, res: Response) {
        try {
            const admin = await adminService.getById(req.params.id);
            admin 
                ? res.status(200).json(admin) 
                : res.status(404).json({ message: "Không tìm thấy quản trị viên" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const updateAdmin = await adminService.update(req.params.id, req.body);
            updateAdmin 
                ? res.status(200).json(updateAdmin) 
                : res.status(404).json({ message: "Không tìm thấy quản trị viên" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const result = await adminService.delete(req.params.id);
            result 
                ? res.status(200).json({ message: "Xóa quản trị viên thành công" }) 
                : res.status(404).json({ message: "Không tìm thấy quản trị viên" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}


export const adminController = new AdminController();