import { Request, Response } from "express";
import { teacherService } from "../../service/teacher/service.js";
import { accountService } from "../../service/account/service.js";

class TeacherController {
    async getAll(req: Request, res: Response) {
        try {
            const teachers = await teacherService.getAll();
            res.status(200).json(teachers);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách giảng viên." });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const teacher = await teacherService.getById(req.params.id);
            if (!teacher) {
                res.status(404).json({ message: "Không tìm thấy giảng viên này." });
            } else {
                res.status(200).json(teacher);
            }
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy giảng viên." });
        }
    }


    async create(req: Request, res: Response) {
        try {
            const newTeacher = await teacherService.create(req.body);

            // Kiểm tra dữ liệu trả về từ service
            if (newTeacher && newTeacher.teacherEmail && newTeacher.teacherId) {
                // Gọi đúng hàm tạo tài khoản cho Teacher với role 'teacher'
                await accountService.createAutoAccountTeacher(
                    newTeacher.teacherEmail, 
                    newTeacher.teacherId, 
                    
                );
            }
            
            return res.status(201).json(newTeacher);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const teacher = await teacherService.update(req.params.id, req.body);
            if (!teacher) {
                res.status(404).json({ message: "Không tìm thấy giảng viên này." });
            } else {
                res.status(200).json(teacher);
            }
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi cập nhật giảng viên." });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const teacher = await teacherService.delete(req.params.id);
            if (!teacher) {
                res.status(404).json({ message: "Không tìm thấy giảng viên này." });
            } else {
                res.status(200).json({ success: true, message: "Đã xóa giảng viên thành công." });
            }
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi xóa giảng viên." });
        }
    }
}

export const teacherController = new TeacherController();