// src/Controllers/AccountController.ts
import { Router, Request, Response } from "express";
import { AccountService } from "../Service/AccountService.js";

export class AccountController {
    public router: Router;
    private accountService: AccountService;

    constructor() {
        this.router = Router();
        this.accountService = new AccountService();
        this.initializeRoutes();
    }

    /**
     * Định nghĩa tất cả các Route liên quan đến Account ngay tại đây
     */
    private initializeRoutes() {
        // Cấu trúc: this.router.[method](path, handler)
        this.router.get('/', (req, res) => this.getAll(req, res));
        this.router.get('/:username', (req, res) => this.findByUsername(req, res));
        
        this.router.post('/', (req, res) => this.create(req, res));
        this.router.post('/auto-student', (req, res) => this.createAutoAccountStudent(req, res));
        this.router.post('/auto-admin', (req, res) => this.createAutoAccountAdmin(req, res));
        this.router.post('/auto-teacher', (req, res) => this.createAutoAccountTeacher(req, res));

        this.router.put('/:id', (req, res) => this.update(req, res));
        this.router.delete('/:id', (req, res) => this.delete(req, res));
    }

    // --- Logic xử lý Request ---

    private async getAll(req: Request, res: Response) {
        try {
            const accounts = await this.accountService.getAll();
            res.status(200).json(accounts);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async findByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params;
            const account = await this.accountService.findByUsername(username);
            account 
                ? res.status(200).json(account) 
                : res.status(404).json({ error: 'Account not found' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const account = await this.accountService.create(req.body);
            res.status(201).json(account);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async createAutoAccountStudent(req: Request, res: Response) {
        try {
            const { email, mssv } = req.body;
            if (!email || !mssv) return res.status(400).json({ error: 'Thiếu email hoặc mssv' });
            
            const account = await this.accountService.createAutoAccountStudent(email, mssv);
            res.status(201).json(account);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async createAutoAccountAdmin(req: Request, res: Response) {
        try {
            const { email, adminId } = req.body;
            const account = await this.accountService.createAutoAccountAdmin(email, adminId);
            res.status(201).json(account);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async createAutoAccountTeacher(req: Request, res: Response) {
        try {
            const { teacherEmail, teacherId } = req.body;
            const account = await this.accountService.createAutoAccountTeacher(teacherEmail, teacherId);
            res.status(201).json(account);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const account = await this.accountService.updateAccount(req.params.id, req.body);
            account 
                ? res.status(200).json(account) 
                : res.status(404).json({ error: 'Account not found' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const account = await this.accountService.deleteAccount(req.params.id);
            account 
                ? res.status(200).json(account) 
                : res.status(404).json({ error: 'Account not found' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

// Export instance của Controller (bao gồm cả router bên trong)
export const accountController = new AccountController();