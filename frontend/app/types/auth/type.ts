
export interface IUser {
  username: string;
  role: 'admin' | 'teacher' | 'student';
  accountId: string;
}

// Định nghĩa lại ILoginResponse cho khớp với thực tế Backend trả về
export interface ILoginResponse {
  token: string;
  username: string;   // Thêm trường này
  roleType: string;   // Thêm trường này
  claims: string[];   // Thêm mảng các slug quyền
  user?: {            // Nếu Backend bọc trong object user thì giữ lại, không thì bỏ qua
    role: string;
  };
}