// src/Service/MajorService.ts
import { IMajor } from "../Entity/MajorEntity.js";
import { majorRepository } from "../Repository/MajorRepository.js";

export class MajorService {
    async getAll(): Promise<IMajor[]> {
        return await majorRepository.findAll();
    }

    async getById(id: string): Promise<IMajor | null> {
        return await majorRepository.findByMajorId(id);
    }

    async create(data: any): Promise<IMajor> {
        const existing = await majorRepository.findByMajorId(data.majorId);
        if (existing) throw new Error("Chuyên ngành đã tồn tại.");
        return await majorRepository.create(data);
    }

    async update(id: string, data: Partial<IMajor>): Promise<IMajor | null> {
        return await majorRepository.update(id, data);
    }

    async delete(id: string): Promise<IMajor | null> {
        return await majorRepository.delete(id);
    }
}

export const majorService = new MajorService();