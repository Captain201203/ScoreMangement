import { Request, Response } from 'express';
import { studentService } from '../../service/student/service.js';
import { accountService } from '../../service/account/service.js';

export class StudentController {
    // 1. Lấy tất cả sinh viên
    async getAll(req: Request, res: Response) {
        try {
            const students = await studentService.getAll();
            return res.status(200).json(students);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // 2. Tạo sinh viên mới (Có xử lý lỗi nghiệp vụ từ Service)
    async create(req: Request, res: Response) {
        try {
            // 1. Tạo sinh viên mới qua service
            const newStudent = await studentService.create(req.body);

            // 2. TỰ ĐỘNG TẠO TÀI KHOẢN
            // Email làm username, studentId làm mật khẩu, role là student
            await accountService.createAutoAccountStudent(
                newStudent.email, 
                newStudent.studentId, 
             
            );

            return res.status(201).json(newStudent);
        } catch (error: any) {
            if (error.message.includes("không tồn tại")) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes("Mã sinh viên đã tồn tại")) {
                return res.status(400).json({ message: "Mã sinh viên đã tồn tại" });
            }
            // Log lỗi cụ thể để debug nếu tạo account thất bại
            console.error("Lỗi khi tạo tài khoản tự động:", error.message);
            return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
        }
    }

    // 3. Lấy chi tiết sinh viên
    async getById(req: Request, res: Response) {
        try {
            const student = await studentService.getById(req.params.id);
            if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
            return res.status(200).json(student);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getByClass(req: Request, res: Response) {
        try {
            const classId = req.params.classId;
            const students = await studentService.getByClass(classId);
            return res.status(200).json(students);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // 4. Cập nhật sinh viên
    async update(req: Request, res: Response) {
        try {
            const updatedStudent = await studentService.update(req.params.id, req.body);
            if (!updatedStudent) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
            return res.status(200).json(updatedStudent);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // 5. Xóa sinh viên
    async delete(req: Request, res: Response) {
        try {
            const deletedStudent = await studentService.delete(req.params.id);
            if (!deletedStudent) return res.status(404).json({ message: "Không tìm thấy sinh viên" });
            return res.status(200).json({ message: "Xóa sinh viên thành công" });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }


}

// Export một instance để dùng trong Router
export const studentController = new StudentController();