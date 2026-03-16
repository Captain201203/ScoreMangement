import { adminService } from "../../service/admin/service.js";
import { Request, Response } from "express";
import { accountService } from "../../service/account/service.js";

export class AdminController {

    async getAll(req: Request, res: Response) {
        try {
            const admins = await adminService.getAll();
            return res.status(200).json(admins);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async create (req: Request, res: Response) {
        try {
            const newAdmin = await adminService.create(req.body);

            // Debug để kiểm tra dữ liệu trước khi tạo tài khoản
            console.log("Dữ liệu Admin mới:", newAdmin);

            if (newAdmin && newAdmin.email && newAdmin.adminId) {
                await accountService.createAutoAccountAdmin(
                    newAdmin.email, 
                    newAdmin.adminId, 
                   
                );
            }
            
            return res.status(201).json(newAdmin);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getById (req: Request, res: Response){
        try{
            const admin = await adminService.getById(req.params.id);
            if (!admin) return res.status(404).json({ message: "Không tìm thấy quản trị viên" });
            return res.status(200).json(admin);
        }catch(error: any){
            return res.status(500).json({ message: error.message });
        }
        
    }

    async update ( req: Request, res: Response){
        try{
            const updateAdmin = await adminService.update(req.params.id, req.body);
            if (!updateAdmin) return res.status(404).json({ message: "Không tìm thấy quản trị viên" });
            return res.status(200).json(updateAdmin);

        }catch(error: any){
            return res.status(500).json({ message: error.message });

        }
    }

    async delete ( req: Request, res: Response){
        try{
            const deleteAdmin = await adminService.delete(req.params.id);
            if (!deleteAdmin) return res.status(404).json({ message: "Không tìm thấy quản trị viên" });
            return res.status(200).json({ message: "Xóa quản trị viên thành công" });
        }catch(error: any){
            return res.status(500).json({ message: error.message });
        }
    }


}

export const adminController = new AdminController();
