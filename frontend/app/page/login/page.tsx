// src/app/login/page.tsx
"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/app/service/auth/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, User, AlertCircle } from "lucide-react"
import { useEffect } from "react";


export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
          // Logic chặn popstate này đôi khi làm rối loạn router của Next.js
          window.history.pushState(null, "", window.location.href);
          window.onpopstate = function () {
              window.history.go(1);
          };
      }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

      try {
          const response = await authService.login({ username, password });
          
          if (response && response.token) {
              const role = response.user.role;
              
              // Ép buộc trình duyệt tải lại toàn bộ để Middleware đọc Cookie mới nhất
              if (role === 'admin') {
                  window.location.href = "/page/dashboard";
              } else if (role === 'student') {
                  // Đảm bảo đường dẫn này khớp chính xác với thư mục của bạn
                  window.location.href = "/page/studentPage/dashboard";
              } else {
                  window.location.href = "/page/scores/input/semester";
              }
          }
      } catch (err: any) {
          setError("Tài khoản hoặc mật khẩu không chính xác");
      } finally {
          setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-teal-600">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-teal-700 uppercase">EduManage Login</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">Hệ thống Quản lý & Xem điểm trực tuyến</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 font-medium">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Tài khoản (Email)</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="username" 
                  type="email"
                  placeholder="vuan@gmail.com" 
                  className="pl-10 focus-visible:ring-teal-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Mã số sinh viên"
                  className="pl-10 focus-visible:ring-teal-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 h-11 text-base shadow-md transition-all active:scale-95" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Đang xác thực...
                </>
              ) : "Đăng Nhập"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-muted-foreground border-t pt-4">
            Tài khoản đã được tạo tự động khi bạn được thêm vào hệ thống.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}