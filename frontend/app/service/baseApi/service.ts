// src/app/service/baseApi/service.ts
import Cookies from 'js-cookie';

export abstract class BaseApiService {
    protected readonly endpoint: string;

    constructor(resource: string) {
        const apiBase = process.env.NEXT_LOCAL_API_URL || 'http://localhost:3001';
        this.endpoint = `${apiBase}/api/${resource}`;
    }



    private getHeaders(): HeadersInit {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (typeof window !== 'undefined') {
     
            const token = localStorage.getItem("token"); 
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }

    protected async apiRequest<T>(method: string, urlSuffix: string = '', body?: any): Promise<T> {
        const response = await fetch(`${this.endpoint}${urlSuffix}`, {
            method,
            headers: this.getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
        });
        return this.handleResponse<T>(response);
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
         
                localStorage.clear();
                Cookies.remove('token');
                
        
                if (window.location.pathname !== '/page/login') {
                    window.location.href = "/page/login";
                }
            }
            throw new Error("Unauthorized");
        }
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Error: ${response.status}`);
        }
        return response.json();
    }
}