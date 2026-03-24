// src/app/service/class/service.ts
import { IClass } from "@/app/types/class/type";
import { BaseApiService } from "../baseApi/service";

class ClassService extends BaseApiService {
    constructor() {
        super('classes');
    }

    public async getAll(): Promise<IClass[]> {
        return this.apiRequest<IClass[]>('GET');
    }

    public async getById(classId: string): Promise<IClass> {
        return this.apiRequest<IClass>('GET', `/${classId}`);
    }

    public async create(classData: IClass): Promise<IClass> {
        return this.apiRequest<IClass>('POST', '', classData);
    }

    public async update(classId: string, classData: IClass): Promise<IClass> {
        return this.apiRequest<IClass>('PUT', `/${classId}`, classData);
    }

    public async delete(classId: string): Promise<void> {
        return this.apiRequest<void>('DELETE', `/${classId}`);
    }

    // Sửa lại dựa trên route bạn đã gộp trong Controller: /api/classes/count/:classId
    public async countStudentsInClass(classId: string): Promise<{ classId: string; studentCount: number }> {
        return this.apiRequest<{ classId: string; studentCount: number }>('GET', `/count/${classId}`);
    }
}

export const classService = new ClassService();