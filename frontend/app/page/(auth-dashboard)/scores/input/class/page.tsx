"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { classService } from "@/app/service/class/service"
import { IClass } from "@/app/types/class/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, ChevronRight, ChevronLeft, GraduationCap } from "lucide-react"


function ClassSelectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const semester = searchParams.get("semester")
  const major = searchParams.get("major")
  const subject = searchParams.get("subject")

  const [classes, setClasses] = useState<IClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!semester || !major || !subject) {
      router.push("/page/scores/input/semester")
      return
    }
    loadClasses()
  }, [semester, major, subject, router])

  const loadClasses = async () => {
    try {
      setLoading(true)
      
      // 1. Lấy thông tin từ LocalStorage để biết ai đang đăng nhập
      const userRole = localStorage.getItem("user_role");
      const userAccountId = localStorage.getItem("student_session"); // Mã định danh GV (ví dụ: GV001)
      const userClaims = JSON.parse(localStorage.getItem("user_claims") || "[]");

      const data = await classService.getAll()
      const allData = Array.isArray(data) ? data : []

      // 2. Logic hiển thị phía Client (để hỗ trợ UI mượt mà hơn)
      // Nếu có quyền admin:all hoặc là Admin tối cao thì hiện tất cả
      if (userClaims.includes("admin:all") || userRole === 'admin') {
        setClasses(allData)
      } else {
        // Nếu là giảng viên thường, lọc lại một lần nữa cho chắc chắn trên UI
        // Backend của bạn cũng đã lọc rồi, bước này giúp UI đồng nhất tuyệt đối
        const myClasses = allData.filter(cls => cls.teacherId === userAccountId)
        setClasses(myClasses)
      }

    } catch (error) {
      console.error("Lỗi tải danh sách lớp:", error)
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (cls: IClass) => {
    const classId = cls.classId
    router.push(`/page/scores/input/student?semester=${semester}&major=${major}&subject=${subject}&class=${classId}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap pb-2">
              <Link href="/page/scores/input/semester" className="hover:text-teal-600 transition-colors">
                1. Học Kỳ
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link href={`/page/scores/input/major?semester=${semester}`} className="hover:text-teal-600 transition-colors">
                2. Ngành
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link href={`/page/scores/input/subject?semester=${semester}&major=${major}`} className="hover:text-teal-600 transition-colors">
                3. Môn
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-teal-600 font-bold">4. Lớp</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="opacity-50">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="opacity-50">6. Nhập Điểm</span>
            </nav>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Chọn Lớp Học</h1>
                <p className="text-muted-foreground mt-1">
                  Bước 4: Chọn lớp học để tiến hành chấm điểm
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/page/scores/input/subject?semester=${semester}&major=${major}`)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Quay Lại Bước 3
              </Button>
            </div>
          </div>

          <hr className="mb-8 opacity-50" />

          {/* Content Section */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-sm text-muted-foreground">Đang tải danh sách lớp học...</p>
            </div>
          ) : classes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-lg font-medium">Không có lớp học nào khả dụng</p>
                <p className="text-sm text-muted-foreground">Vui lòng kiểm tra lại cấu hình lớp học trong hệ thống.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <Card 
                  key={cls._id || cls.classId}
                  className="group cursor-pointer border-2 hover:border-teal-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => handleSelect(cls)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="mb-1 uppercase text-[10px] tracking-widest">
                          Mã Lớp
                        </Badge>
                        <CardTitle className="text-2xl group-hover:text-teal-700 transition-colors">
                          {cls.classId}
                        </CardTitle>
                      </div>
                      <div className="bg-teal-50 p-2 rounded-full">
                        <GraduationCap className="w-5 h-5 text-teal-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        Giảng viên: <span className="text-foreground font-medium ml-1">{cls.teacherName || "Chưa cập nhật"}</span>
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 mt-2" variant="default">
                        Chọn Lớp Này
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// 2. Export default bọc trong Suspense để sửa lỗi Build
export default function SelectClassPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-muted-foreground">Đang chuẩn bị danh sách lớp...</p>
        </div>
      </div>
    }>
      <ClassSelectionContent />
    </Suspense>
  )
}
