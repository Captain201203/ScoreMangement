import AccountModel, { IAccount } from "../../models/account/model.js";
import RoleModel from "../../models/role/model.js"; // Import model Role mới
import bcrypt from "bcrypt";

interface IAccountService {
    getAll(): Promise<IAccount[]>;
    findByUsername(username: string): Promise<IAccount | null>;
    create(data: any): Promise<IAccount>;
}

export class AccountService implements IAccountService {
    // Helper để lấy Role ID mặc định dựa trên loại (roleType)
    private async getDefaultRoleId(type: 'admin' | 'teacher' | 'student'): Promise<string> {
        const role = await RoleModel.findOne({ roleType: type });
        if (!role) {
            // Bạn có thể xử lý lỗi này tùy theo cách bạn seed dữ liệu
            throw new Error(`Role for type ${type} not found in database. Please seed roles first.`);
        }
        return role._id;
    }

    async getAll(): Promise<IAccount[]> {
        const accounts = await AccountModel.find()
            .select('-password')
            .populate({
                path: 'role',
                populate: { path: 'claims' }
            })
            .lean() // Dùng lean() để lấy plain object, giúp TypeScript dễ xử lý hơn
            .exec();

        return accounts as unknown as IAccount[]; 
    }

    async findByUsername(username: string): Promise<IAccount | null> {
        const account = await AccountModel.findOne({ username })
            .populate('role')
            .exec();
        
        return account as IAccount | null;
    }

    async create(data: any): Promise<IAccount> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        
        const newAccount = new AccountModel({
            ...data,
            password: hashedPassword
        });
        return await newAccount.save();
    }

    async update(id: string, data: Partial<IAccount>): Promise<IAccount | null> {
        return AccountModel.findOneAndUpdate({ accountId: id }, data, { new: true });
    }

    async delete(id: string): Promise<IAccount | null> {
        return AccountModel.findOneAndDelete({ accountId: id });
    }  

    async createAutoAccountStudent(email: string, mssv: string): Promise<IAccount> {
        const existingAccount = await AccountModel.findOne({ username: email });
        if (existingAccount) return existingAccount; 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mssv, salt);

        // Lấy ID của Role dành cho sinh viên
        const roleId = await this.getDefaultRoleId('student');

        const newAccount = new AccountModel({
            accountId: mssv, 
            username: email,
            password: hashedPassword,
            role: roleId // Truyền vào ObjectId thay vì string 'student'
        });

        return await newAccount.save();
    }

    async createAutoAccountAdmin(email: string, adminId: string): Promise<IAccount> {
        const existingAccount = await AccountModel.findOne({ username: email });
        if (existingAccount) return existingAccount;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminId, salt);

        const roleId = await this.getDefaultRoleId('admin');

        const newAccount = new AccountModel({
            accountId: adminId,
            username: email,
            password: hashedPassword,
            role: roleId
        });

        return await newAccount.save();
    }

    async createAutoAccountTeacher(teacherEmail: string, teacherId: string): Promise<IAccount> {
        const existingAccount = await AccountModel.findOne({ username: teacherEmail });
        if (existingAccount) return existingAccount;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(teacherId, salt);

        const roleId = await this.getDefaultRoleId('teacher');

        const newAccount = new AccountModel({
            accountId: teacherId,
            username: teacherEmail,
            password: hashedPassword,
            role: roleId
        });

        return await newAccount.save();
    }
}

export const accountService = new AccountService();