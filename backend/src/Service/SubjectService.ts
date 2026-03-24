// src/Service/SubjectService.ts
import { ISubject } from "../Entity/SubjectEntity.js";
import { subjectRepository } from "../Repository/SubjectRepository.js";
import MajorModel from "../Entity/MajorEntity.js";

export class SubjectService {
    async getAll(): Promise<ISubject[]> {
        return await subjectRepository.findAll();
    }

    async getByMajor(majorName: string): Promise<ISubject[]> {
        return await subjectRepository.findByMajor(majorName);
    }

    async getById(id: string): Promise<ISubject | null> {
        return await subjectRepository.findById(id);
    }

    async create(data: any): Promise<ISubject> {
   
        const existSubject = await subjectRepository.findById(data.subjectId);
        if (existSubject) {
            throw new Error("Subject already exists");
        }

    
        const major = await MajorModel.findOne({ majorName: data.majorName });
        if (!major) {
            throw new Error("Major not found");
        }

        return await subjectRepository.create(data);
    }

    async update(id: string, data: Partial<ISubject>): Promise<ISubject | null> {
        return await subjectRepository.update(id, data);
    }

    async delete(id: string): Promise<ISubject | null> {
        return await subjectRepository.delete(id);
    }
}

export const subjectService = new SubjectService();