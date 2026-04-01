// src/Controllers/DocumentController.ts
import { Router, Request, Response } from "express";
import { documentService } from "../Service/DocumentService.js";
import { verifyToken, authorizeClaim } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: "uploads/documents/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Bộ lọc file (Chỉ cho phép PDF và Word)
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ hỗ trợ file PDF, DOC hoặc DOCX"), false);
    }
};

const upload = multer({ storage, fileFilter });

export class DocumentController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const auth = [verifyToken];

        this.router.get("/", ...auth, (req, res) => this.getAll(req, res));
        
        // Route Upload: dùng middleware upload.single('file')
        this.router.post("/upload", ...auth, authorizeClaim('doc:upload'), upload.single('file'), (req, res) => this.upload(req, res));
        
        this.router.delete("/:id", ...auth, authorizeClaim('doc:manage'), (req, res) => this.delete(req, res));
    }

    private async getAll(req: Request, res: Response) {
        try {
            const docs = await documentService.getAll();
            res.status(200).json(docs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async upload(req: any, res: Response) {
        try {
            if (!req.file) return res.status(400).json({ message: "Vui lòng chọn file" });
            
            const { title } = req.body;
            const userId = req.user.id; // Lấy từ verifyToken

            const newDoc = await documentService.uploadDocument(req.file, title, userId);
            res.status(201).json(newDoc);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const result = await documentService.deleteDocument(req.params.id);
            result ? res.json({ message: "Xóa tài liệu thành công" }) : res.status(404).json({ message: "Không tìm thấy" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}