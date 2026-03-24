// src/Repository/AccountRepository.ts
import AccountModel, { IAccount } from "../Entity/AccountEntity.js";
import { FilterQuery, UpdateQuery } from "mongoose";

export class AccountRepository {
 
    async findAll(): Promise<IAccount[]> {
        return await AccountModel.find()
            .select('-password')
            .populate({
                path: 'role',
                populate: { path: 'claims' }
            })
            .lean()
            .exec() as unknown as IAccount[];
    }

  
    async findByUsername(username: string): Promise<IAccount | null> {
        return await AccountModel.findOne({ username })
            .populate({
                path: 'role',
                populate: { path: 'claims' }
            })
            .exec();
    }

   
    async findByAccountId(accountId: string): Promise<IAccount | null> {
        return await AccountModel.findOne({ accountId }).exec();
    }

  
    async create(data: Partial<IAccount>): Promise<IAccount> {
        const account = new AccountModel(data);
        return await account.save();
    }

   
    async update(accountId: string, data: UpdateQuery<IAccount>): Promise<IAccount | null> {
        return await AccountModel.findOneAndUpdate({ accountId }, data, { new: true }).exec();
    }

   
    async delete(accountId: string): Promise<IAccount | null> {
        return await AccountModel.findOneAndDelete({ accountId }).exec();
    }
}

export const accountRepository = new AccountRepository();