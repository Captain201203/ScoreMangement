"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { accountService } from "@/app/service/account/service"
import { roleService } from "@/app/service/role/service"
import { IRole } from "@/app/types/role/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus, Info, Lock } from "lucide-react"

export default function NewAccountPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    // password sẽ được Backend xử lý lấy từ accountId, 
    // hoặc Frontend gửi kèm formData với giá trị bằng accountId
    roleId: "", 
    accountId: ""
  })
  const [roles, setRoles] = useState<IRole[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.getAll();
        setRoles(data);
      } catch (error) { console.error("Không thể tải danh sách vai trò"); }
    };
    fetchRoles();
  }, []);

  const handleEmailChange = (val: string) => {
    setFormData({ ...formData, email: val, username: val })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!formData.roleId) return alert("Vui lòng chọn vai trò cho tài khoản!");
    
    setIsSubmitting(true)
    try {
      // 💡 LOGIC TỐI ƯU: Gửi password mặc định chính là accountId
      const finalPayload = {
        ...formData,
        password: formData.accountId 
      }

      await accountService.create(finalPayload as any)
      alert("Tạo tài khoản thành công! Mật khẩu mặc định là mã định danh.")
      router.push("/page/account")
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || "Kiểm tra lại mã định danh hoặc Email"));
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 md:p-10 flex justify-center bg-slate-50 min-h-screen">
      <Card className="w-full max-w-lg shadow-xl border-t-4 border-teal-600">
        <CardHeader className="border-b bg-white">
          <div className="flex items-center gap-2">
            <UserPlus className="text-teal-600" />
            <CardTitle className="text-teal-700 uppercase">Tạo tài khoản hệ thống</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Mã định danh (MSSV/MSGV)</Label>
              <Input 
                required 
                value={formData.accountId} 
                placeholder="Nhập MSSV hoặc Mã giảng viên..."
                onChange={e => setFormData({...formData, accountId: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Email đăng nhập</Label>
              <Input 
                required 
                type="email" 
                value={formData.email} 
                placeholder="example@gmail.com"
                onChange={e => handleEmailChange(e.target.value)} 
              />
            </div>

            {/* 💡 THAY THẾ Ô NHẬP PASSWORD BẰNG THÔNG BÁO TỰ ĐỘNG */}
            <div className="p-4 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 block">Mật khẩu mặc định</Label>
                <span className="text-sm font-mono font-bold text-slate-700">
                  {formData.accountId || "Chờ nhập mã định danh..."}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Vai trò & Phân quyền (Role)</Label>
              <Select onValueChange={(val) => setFormData({...formData, roleId: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò cụ thể..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r._id} value={r._id}>
                      {r.roleName.toUpperCase()} ({r.roleType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start border border-blue-100 mt-4">
                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-700">
                    Người dùng có thể thay đổi mật khẩu sau khi đăng nhập lần đầu thành công bằng Mã định danh.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="w-1/2" onClick={() => router.back()}>Hủy bỏ</Button>
                <Button type="submit" className="w-1/2 bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Xác nhận tạo"}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}