import { BaseApiService } from "../baseApi/service";
import { ILoginResponse } from "@/app/types/auth/type";
import Cookies from 'js-cookie';

class AuthService extends BaseApiService {
    constructor() { super('auth'); }

    public async login(data: any): Promise<ILoginResponse> {
        const res = await fetch(`${this.endpoint}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        // 1. Ép kiểu any tạm thời nếu bạn chưa kịp sửa file Interface ILoginResponse
        const response = await this.handleResponse<any>(res);

        if (response.token) {
            // ✅ GỘP TẤT CẢ VIỆC LƯU TRỮ VÀO ĐÂY
            localStorage.setItem("token", response.token);
            
            // Lấy username và role từ response (tùy cấu trúc Backend của bạn)
            const username = response.username || (response.user?.username);
            const roleType = response.roleType || (response.user?.role);
            const claims = response.claims || [];

            localStorage.setItem("user_username", username);
            localStorage.setItem("user_role", roleType);
            
            // 💡 QUAN TRỌNG: Lưu Claims dưới dạng chuỗi JSON cho Sidebar
            localStorage.setItem("user_claims", JSON.stringify(claims));

            // Lưu accountId cho sinh viên nếu có
            if (response.user?.accountId) {
                localStorage.setItem("student_session", response.user.accountId);
            }
            
            // Lưu Cookie để Middleware của Next.js có thể đọc được
            Cookies.set('token', response.token, { expires: 1, path: '/' });
        }
        return response;
    }

    public logout() {
        // Xóa sạch để bảo mật
        localStorage.clear();
        Cookies.remove('token');
        // Điều hướng về trang login
        window.location.href = "/page/login";
    }
}

export const authService = new AuthService();