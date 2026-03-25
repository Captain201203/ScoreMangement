import { Router, Request, Response } from "express";
import { authService } from "../Service/AuthService.js";


export class AuthController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', (req, res) => this.login(req, res));
        
    }

    

    private async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Vui lòng nhập tài khoản và mật khẩu" });
            }

            const result = await authService.login(username, password);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }
}

export const authController = new AuthController();