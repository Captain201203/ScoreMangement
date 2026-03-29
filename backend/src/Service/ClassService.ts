// src/Service/ClassService.ts
import { classRepository } from "../Repository/ClassRepository.js";
import { IClass } from "../Entity/ClassEntity.js";
import StudentModel from "../Entity/StudentEntity.js";

export class ClassService {
    async getAll(user: any): Promise<IClass[]> {
        let filter = {};

        // Kiểm tra quyền tối cao (admin:all hoặc roleType === 'admin')
        const isAdmin = user.claims?.includes('admin:all') || user.roleType === 'admin';

        if (!isAdmin) {
            // Nếu không phải admin, ta lọc theo mã định danh của user đang đăng nhập
            // user.id ở đây chính là accountId (ví dụ: 2280600163) được lấy từ Token
            filter = { teacherId: user.id }; 
            
            // Hoặc nếu bạn chưa kịp thêm teacherId và muốn lọc tạm bằng tên (không khuyến khích):
            // filter = { teacherName: user.username }; 
        }

        return await classRepository.findAll(filter);
    }

    async getById(id: string): Promise<IClass | null> {
        return await classRepository.findById(id);
    }

    async create(data: any): Promise<IClass> {
        const existingClass = await classRepository.findById(data.classId);
        if (existingClass) throw new Error("Lớp học đã tồn tại.");
        return await classRepository.create(data);
    }

    async update(id: string, data: Partial<IClass>): Promise<IClass | null> {
        return await classRepository.update(id, data);
    }

    async delete(id: string): Promise<IClass | null> {
        const existingClass = await classRepository.findById(id);
        if (!existingClass) throw new Error("Lớp học không tồn tại.");
        return await classRepository.delete(id);
    }

    async countStudentsInClass(classId: string): Promise<number> {
        return await StudentModel.countDocuments({ classId });
    }

    async deleteAllStudentsInClass(classId: string): Promise<void> {
        await StudentModel.deleteMany({ classId });
    }
}

export const classService = new ClassService();