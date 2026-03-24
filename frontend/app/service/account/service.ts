// src/app/service/account/service.ts
import { IAccount } from "../../types/account/type";
import { BaseApiService } from "../baseApi/service";

class AccountService extends BaseApiService {
    constructor() {
        super('accounts');
    }

    public async getAll(): Promise<IAccount[]> {
        return this.apiRequest<IAccount[]>('GET');
    }

    public async getById(accountId: string): Promise<IAccount> {
        return this.apiRequest<IAccount>('GET', `/${accountId}`);
    }

    public async create(data: Omit<IAccount, '_id'>): Promise<IAccount> {
        return this.apiRequest<IAccount>('POST', '', data);
    }

    public async update(accountId: string, data: Partial<IAccount>): Promise<IAccount> {
        return this.apiRequest<IAccount>('PUT', `/${accountId}`, data);
    }

    public async delete(accountId: string): Promise<{ success: boolean; message?: string }> {
        return this.apiRequest('DELETE', `/${accountId}`);
    }
}

export const accountService = new AccountService();