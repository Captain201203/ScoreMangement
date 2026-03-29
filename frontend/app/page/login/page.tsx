"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/app/service/auth/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, User, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    }
  }, []);

  // Hàm kiểm tra định dạng email bằng Regex
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Kiểm tra để trống trường Email hoặc Mật khẩu
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    // 2. Kiểm tra định dạng Email (thiếu @, thiếu tên miền...)
    if (!validateEmail(username)) {
      setError("Email không đúng định dạng (ví dụ: example@domain.com).");
      return;
    }

    // 3. Kiểm tra số lượng ký tự Email (6-50 ký tự theo yêu cầu)
    if (username.length < 6 || username.length > 50) {
      setError("Email phải từ 6 đến 50 ký tự.");
      return;
    }

    // 4. Kiểm tra số lượng ký tự Mật khẩu (6-30 ký tự theo yêu cầu hệ thống)
    if (password.length < 6 || password.length > 30) {
      setError("Mật khẩu phải từ 6 đến 30 ký tự.");
      return;
    }

    setLoading(true);

  try {
      // 💡 BƯỚC QUAN TRỌNG: Xóa sạch dấu vết của User cũ trước khi Login mới
      localStorage.clear(); 

      const response = await authService.login({ username, password });

      if (response && response.token) {
          // Ép kiểu về string bằng cách thêm || "" (hoặc String() nếu cần)
          localStorage.setItem("token", response.token);
          
          // Sử dụng toán tử ?? hoặc || để đảm bảo luôn là chuỗi
          localStorage.setItem("user_role", (response.roleType || response.user?.role) ?? "");
          
          // claims đã có JSON.stringify nên thường sẽ ra chuỗi "[]", nhưng cứ thêm check cho chắc
          localStorage.setItem("user_claims", JSON.stringify(response.claims || []));
          
          localStorage.setItem("user_username", response.username ?? "");

          const roleType = response.roleType || response.user?.role;

        // 💡 SỬ DỤNG router.push HOẶC ĐỢI 1 CHÚT TRƯỚC KHI location.href
        // Để đảm bảo IO của LocalStorage đã xong
        setTimeout(() => {
          if (roleType === 'admin') {
            window.location.href = "/page/dashboard";
          } else if (roleType === 'student') {
            window.location.href = "/page/studentPage/dashboard";
          } else {
            window.location.href = "/page/scores/input/semester";
          }
        }, 100); 
      }
    } catch (err: any) {
      // Xử lý các lỗi từ Backend (Tài khoản không tồn tại, sai mật khẩu)
      const message = err.response?.data?.message || "";
      
      if (message.includes("not found") || message.includes("tồn tại")) {
        setError("Tài khoản Email không tồn tại trong hệ thống.");
      } else if (message.includes("password") || message.includes("mật khẩu")) {
        setError("Email đúng nhưng Mật khẩu sai.");
      } else {
        setError("Tài khoản hoặc mật khẩu không chính xác.");
      }
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
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 font-medium animate-in fade-in zoom-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
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
                  placeholder="example@gmail.com" 
                  className={`pl-10 focus-visible:ring-teal-500 ${error.includes("Email") ? "border-destructive" : ""}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  placeholder="Nhập mật khẩu"
                  className={`pl-10 focus-visible:ring-teal-500 ${error.includes("Mật khẩu") ? "border-destructive" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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