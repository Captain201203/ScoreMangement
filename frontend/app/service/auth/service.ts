// src/app/service/auth/service.ts
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

        const response = await this.handleResponse<ILoginResponse>(res);

        if (response.token) {
        
            localStorage.setItem("token", response.token);
            localStorage.setItem("user_role", response.user.role);
            

            localStorage.setItem("student_session", response.user.accountId);
            
      
            Cookies.set('token', response.token, { expires: 1, path: '/' });
        }
        return response;
    }

    public logout() {
        localStorage.clear();
        Cookies.remove('token');
    
        window.location.href = "/page/login";
    }
}
export const authService = new AuthService();