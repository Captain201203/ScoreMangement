// src/app/service/score/service.ts
import { IScore } from "@/app/types/score/type";
import { BaseApiService } from "../baseApi/service";

class ScoreService extends BaseApiService {
    constructor() {
        super('scores');
    }

    public async getAll(query?: Record<string, string>): Promise<IScore[]> {
        // Ép kiểu các giá trị trong query về string để URLSearchParams không lỗi
        const cleanQuery: Record<string, string> = {};
        if (query) {
            Object.keys(query).forEach(key => {
                if (query[key]) cleanQuery[key] = String(query[key]);
            });
        }

        const queryString = Object.keys(cleanQuery).length > 0 
            ? `?${new URLSearchParams(cleanQuery).toString()}` 
            : '';
        
        const response = await this.apiRequest<{ success: boolean; data: IScore[] }>(
            'GET', 
            queryString
        );
        return response.data; // Trả về mảng IScore[]
    }

    public async upsertScore(data: Partial<IScore>): Promise<IScore> {
        const response = await this.apiRequest<{ success: boolean; data: IScore }>(
            'POST', 
            '', 
            data
        );
        return response.data;
    }

    public async delete(id: string): Promise<{ success: boolean }> {
        return this.apiRequest<{ success: boolean }>('DELETE', `/${id}`);
    }
}

export const scoreService = new ScoreService();