// src/app/types/claim/type.ts

export interface IClaim {
  _id: string;
  name: string;        // Tên hiển thị: "Cập nhật điểm số"
  slug: string;        // Mã định danh: "score:update"
  description: string; // Mô tả chi tiết
  createdAt?: string;
}

export interface ICreateClaimPayload {
  name: string;
  slug: string;
  description: string;
}