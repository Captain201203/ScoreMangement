"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { accountService } from "@/app/service/account/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Save, Shield } from "lucide-react"

export default function EditAccountPage() {
  const params = useParams()
  const accountId = params.id as string
  const [username, setUsername] = useState("")
  // 💡 Sửa lỗi Type: Khai báo rõ ràng Role có thể là string hoặc object hoặc null
  const [roleName, setRoleName] = useState("") 
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const data = await accountService.getById(accountId);
        setUsername(data.username);

        // SỬA TẠI ĐÂY: Trích xuất tên từ object hoặc dùng chính nó nếu là string
        const name = typeof data.role === 'object' 
                    ? data.role?.roleName 
                    : data.role;
        
        // Đảm bảo giá trị truyền vào luôn là string (ép kiểu as string hoặc dùng || "")
        setRoleName(String(name || "N/A"));

      } catch (err) {
        console.error("Lỗi khi tải tài khoản:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [accountId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Chỉ cập nhật Username, Role thường được khóa ở trang Edit để bảo mật
      await accountService.update(accountId, { username } as any)
      alert("Cập nhật thông tin thành công!")
      router.push("/page/account")
    } catch (err) {
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại kết nối.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-teal-600" /></div>

  return (
    <div className="p-6 md:p-10 flex flex-col items-center bg-slate-50 min-h-screen">
      <div className="w-full max-w-lg mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Button>
      </div>

      <Card className="w-full max-w-lg shadow-xl border-t-4 border-blue-600">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Shield className="h-5 w-5" /> CHỈNH SỬA TÀI KHOẢN
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">ID Hệ thống: {accountId}</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Tên đăng nhập (Email)</Label>
              <Input 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="focus-visible:ring-blue-500"
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Vai trò hệ thống</Label>
              <Input 
                disabled 
                value={roleName} 
                className="bg-slate-100 font-medium text-slate-600 cursor-not-allowed"
              />
              <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 rounded border border-amber-100">
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  * <strong>Lưu ý:</strong> Vai trò được quản lý bởi Quản trị viên cấp cao. 
                  Để thay đổi phân quyền, vui lòng liên hệ bộ phận kỹ thuật.
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 shadow-lg transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Cập nhật thông tin</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}