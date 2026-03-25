"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { accountService } from "@/app/service/account/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus, Info, Key } from "lucide-react"

export default function NewAccountPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student", // Mặc định là student
    accountId: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Logic nghiệp vụ: Cập nhật Username khi Email thay đổi
  const handleEmailChange = (val: string) => {
    setFormData({
      ...formData,
      email: val,
      username: val // Quy tắc: Username = Email
    })
  }

  // Logic nghiệp vụ: Đặt mật khẩu mặc định là AccountId
  const setPasswordAsId = () => {
    if(!formData.accountId) {
        alert("Vui lòng nhập Mã định danh trước!");
        return;
    }
    setFormData({ ...formData, password: formData.accountId });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Gửi dữ liệu tạo tài khoản thủ công
      await accountService.create(formData as any) // Cast để bỏ qua kiểu tạm thời
      alert("Tạo tài khoản thành công!")
      router.push("/page/account")
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || "Đảm bảo MSSV/Email không bị trùng"));
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
            <CardTitle className="text-teal-700 uppercase">Tạo tài khoản thủ công</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Dùng cho các trường hợp đặc biệt không tạo tự động.</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Mã định danh - Rất quan trọng vì nó liên kết với bảng Sinh viên/Giảng viên */}
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Mã định danh (MSSV/MSGV)</Label>
              <Input 
                required 
                value={formData.accountId} 
                placeholder="Ví dụ: 2280600161" 
                className="focus-visible:ring-teal-500"
                onChange={e => setFormData({...formData, accountId: e.target.value})} 
              />
            </div>

            {/* Email & Username */}
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Email (Đồng thời là Username)</Label>
              <Input 
                required 
                type="email" 
                value={formData.email} 
                placeholder="sinhvien@gmail.com" 
                className="focus-visible:ring-teal-500"
                onChange={e => handleEmailChange(e.target.value)} 
              />
            </div>
            
            {/* Mật khẩu */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-bold text-slate-700">Mật khẩu</Label>
                <button 
                    type="button" 
                    onClick={setPasswordAsId}
                    className="text-[11px] text-teal-600 hover:underline flex items-center gap-1"
                >
                    Dùng Mã định danh làm pass
                </button>
              </div>
              <Input 
                type="password" 
                required 
                value={formData.password} 
                className="focus-visible:ring-teal-500"
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            {/* Vai trò - Dùng Select thay vì gõ tay */}
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Vai trò (Role)</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger className="focus:ring-teal-500">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                  <SelectItem value="teacher">Giảng viên (Teacher)</SelectItem>
                  <SelectItem value="student">Sinh viên (Student)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start border border-blue-100 mt-4">
                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                    Hệ thống sẽ thực hiện Hash mật khẩu tự động trước khi lưu. 
                    Username được đồng bộ hóa với Email để đồng nhất dữ liệu đăng nhập.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
               <Button 
                type="button" 
                variant="outline" 
                className="w-1/2" 
                disabled={isSubmitting}
                onClick={() => router.back()}
               >
                 Hủy bỏ
               </Button>
               <Button 
                type="submit" 
                className="w-1/2 bg-teal-600 hover:bg-teal-700 shadow-md"
                disabled={isSubmitting}
               >
                 {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Lưu tài khoản"}
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}