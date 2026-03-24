"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Save, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sidebar } from "@/app/components/dasboard/sidebar"

import { semesterService } from "@/app/service/semester/service"
import { ISemester } from "@/app/types/semester/type"

export default function SemesterFormPage() {
  const router = useRouter()
  const params = useParams()
  // Sử dụng _id (của MongoDB) hoặc semesterId tùy theo cách bạn route
  const semesterId = params?.id as string 

  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  
  const [formData, setFormData] = useState<ISemester>({
    semesterId: "",
    semesterName: "",
    startDate: "",
    endDate: "",
  })

  const isEditMode = !!(semesterId !== "new")

  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        try {
          setLoadingData(true)
          const data = await semesterService.getById(semesterId)
          if (data) {
            setFormData({
              semesterId: data.semesterId,
              semesterName: data.semesterName,
              // Chuyển đổi Date sang định dạng yyyy-MM-dd để input[type="date"] hiểu được
              startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
              endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : "",
            })
          }
        } catch (error) {
          alert("Không thể tải dữ liệu học kì.")
        } finally {
          setLoadingData(false)
        }
      }
      fetchDetail()
    }
  }, [semesterId, isEditMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isEditMode) {
        await semesterService.update(semesterId, formData)
        alert("Cập nhật thành công!")
      } else {
        await semesterService.create(formData)
        alert("Thêm học kì thành công!")
      }
      router.push("/page/semesters")
      router.refresh()
    } catch (error: any) {
      alert("Lỗi: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <Link href="/page/semesters">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay Lại
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Cập Nhật Học Kỳ" : "Thêm Học Kỳ Mới"}
            </h1>
          </div>

          <Card className="max-w-2xl shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Mã Học Kỳ */}
                <div className="space-y-2">
                  <Label htmlFor="semesterId">Mã Học Kỳ (Gộp) *</Label>
                  <Input
                    id="semesterId"
                    value={formData.semesterId}
                    onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                    placeholder="VD: HK1-2025-2026"
                    // SỬA LỖI TẠI ĐÂY: Ép kiểu về boolean thuần túy bằng !!
                    disabled={isLoading || !!isEditMode}
                    required
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Định dạng gợi ý: HK[Số]-[NămBắtĐầu]-[NămKếtThúc]
                  </p>
                </div>

                {/* Tên Học Kỳ */}
                <div className="space-y-2">
                  <Label htmlFor="semesterName">Tên Hiển Thị *</Label>
                  <Input
                    id="semesterName"
                    value={formData.semesterName}
                    onChange={(e) => setFormData({ ...formData, semesterName: e.target.value })}
                    placeholder="VD: Học kỳ 1 năm học 2025-2026"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Ngày tháng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày Bắt Đầu</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate.toString()}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày Kết Thúc</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate.toString()}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isEditMode ? "Cập Nhật" : "Lưu Học Kỳ"}
                  </Button>
                  <Link href="/page/semesters">
                    <Button type="button" variant="outline" disabled={isLoading}>
                      Hủy
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}