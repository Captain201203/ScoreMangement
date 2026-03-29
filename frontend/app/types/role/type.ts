// src/app/types/role/type.ts
import { IClaim } from "../claim/type"; // Giả sử bạn đã có IClaim

export interface IRole {
  _id: string;
  roleName: string;
  roleType: 'admin' | 'teacher' | 'student';
  claims: IClaim[]; // Danh sách các object quyền đã populate
  createdAt?: string;
  updatedAt?: string;
}

export interface IRoleUpdatePayload {
  roleId: string;
  claimId: string;
}