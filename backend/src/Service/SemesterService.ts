// src/Service/SemesterService.ts
import { ISemester } from "../Entity/SemesterEntity.js";
import { semesterRepository } from "../Repository/SemesterRepository.js";

export class SemesterService {
    async getAll(): Promise<ISemester[]> {
        return await semesterRepository.findAll();
    }

    async getById(id: string): Promise<ISemester | null> {
        return await semesterRepository.findBySemesterId(id);
    }

    async create(data: any): Promise<ISemester> {
        // 1. Kiểm tra tồn tại
        const existSemester = await semesterRepository.findBySemesterId(data.semesterId);
        if (existSemester) throw new Error("Semester already exists");

        // 2. Kiểm tra logic ngày tháng
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (start >= end) {
            throw new Error("Start date must be before end date");
        }

        return await semesterRepository.create(data);
    }

    async update(id: string, data: Partial<ISemester>): Promise<ISemester | null> {
        return await semesterRepository.update(id, data);
    }

    async delete(id: string): Promise<ISemester | null> {
        return await semesterRepository.delete(id);
    }
}

export const semesterService = new SemesterService();