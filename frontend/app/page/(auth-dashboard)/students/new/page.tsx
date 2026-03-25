"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { studentService } from "@/app/service/student/service"
import { classService } from "@/app/service/class/service" 
import { IClass } from "@/app/types/class/type.js"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, ChevronRight, AlertCircle } from "lucide-react"

export default function NewStudentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classes, setClasses] = useState<IClass[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    dateOfBirth: "",
    email: "",
    classId: "",
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true)
        const data = await classService.getAll()
        setClasses(data)
      } catch (err) {
        console.error("Lỗi khi lấy danh sách lớp:", err)
      } finally {
        setIsLoadingClasses(false)
      }
    }
    fetchClasses()
  }, [])

  // Hàm kiểm tra logic nghiệp vụ
  const validateForm = () => {
    const { studentName, studentId, dateOfBirth, email, classId } = formData;

    // 1. Kiểm tra Họ tên: 2-50 ký tự, không chứa số/ký tự đặc biệt
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
    if (studentName.length < 2 || studentName.length > 50) return "Họ tên phải từ 2-50 ký tự.";
    if (!nameRegex.test(studentName)) return "Họ tên không được chứa số hoặc ký tự đặc biệt.";

    // 2. Kiểm tra MSSV: 2-20 ký tự
    if (studentId.length < 2 || studentId.length > 20) return "MSSV phải từ 2-20 ký tự.";

    // 3. Kiểm tra Ngày sinh & Độ tuổi (17 - 50 tuổi)
    if (!dateOfBirth) return "Vui lòng chọn ngày sinh.";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 17 || age > 50) return "Sinh viên phải từ 17 đến 50 tuổi.";

    // 4. Kiểm tra Lớp học
    if (!classId) return "Vui lòng chọn lớp học.";

    // 5. Kiểm tra Email: Đúng định dạng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không đúng định dạng.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true)
    try {
      await studentService.create({
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth)
      })

      alert("Thông báo: Tạo sinh viên mới thành công!")
      router.push("/page/students")
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data?.message || "MSSV này đã tồn tại trên hệ thống.");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/page/students" className="hover:text-foreground">Students</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Enrollment</span>
        </nav>

        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-teal-700">Nhập Thông Tin Sinh Viên</h1>
          <p className="text-muted-foreground italic">Vui lòng nhập đầy đủ và chính xác theo yêu cầu hệ thống.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="shadow-md">
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Họ và Tên <span className="text-red-500">*</span></Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn An"
                  />
                  <p className="text-[11px] text-muted-foreground">Không chứa số, từ 2-50 ký tự.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">MSSV <span className="text-red-500">*</span></Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="Duy nhất, 2-20 ký tự"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày Sinh <span className="text-red-500">*</span></Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                  <p className="text-[11px] text-muted-foreground">Yêu cầu: 17 - 50 tuổi.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="classId">Lớp Học <span className="text-red-500">*</span></Label>
                  <Select
                    disabled={isLoadingClasses}
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                    value={formData.classId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp từ danh sách có sẵn" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((item) => (
                        <SelectItem key={item._id} value={item.classId}>{item.classId}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@gmail.com"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Hủy</Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 min-w-[150px]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Lưu sinh viên
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}