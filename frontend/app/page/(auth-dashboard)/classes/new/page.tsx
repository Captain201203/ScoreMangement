"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  LayoutGrid, Users, GraduationCap, 
  ChevronRight, Save, Loader2
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Service & Types
import { classService } from "@/app/service/class/service"; 
import { IClass } from "@/app/types/class/type";
import { accountService } from "@/app/service/account/service"; // 💡 Đổi sang dùng accountService

export default function ClassFormPage() {
  const router = useRouter();
  const params = useParams(); 
  const classIdParam = params?.id as string; // _id từ MongoDB

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]); // Danh sách Account có role teacher
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [formData, setFormData] = useState<IClass>({
    classId: "",
    majorName: "",
    teacherName: "",
    teacherId: "", // ✨ Quan trọng: Phải lưu ID để phân quyền
  });

  // 1. Load danh sách Giảng viên từ hệ thống Accounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const data = await accountService.getAll();
        // Lọc những tài khoản có vai trò là teacher
        const teacherList = data.filter((acc: any) => 
          acc.role?.roleType === 'teacher' || acc.role === 'teacher'
        );
        setTeachers(teacherList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giảng viên:", error);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  // 2. Load dữ liệu cũ nếu là trang Edit
  useEffect(() => {
    if (classIdParam) {
      const fetchDetail = async () => {
        try {
          setLoadingData(true);
          const data = await classService.getById(classIdParam);
          if (data) {
            setFormData({
              classId: data.classId || "",
              majorName: data.majorName || "",
              teacherName: data.teacherName || "",
              teacherId: data.teacherId || "",
            });
          }
        } catch (error) {
          console.error("Error fetching class detail:", error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchDetail();
    }
  }, [classIdParam]);

  const handleChange = (field: keyof IClass, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 3. Xử lý khi chọn Giảng viên từ Select
  const handleTeacherSelect = (teacherAccountId: string) => {
    const selectedTeacher = teachers.find(t => t.accountId === teacherAccountId);
    if (selectedTeacher) {
      setFormData(prev => ({
        ...prev,
        teacherId: selectedTeacher.accountId, // Lưu mã định danh (Ví dụ: GV001)
        teacherName: selectedTeacher.username // Lưu tên (Email/Họ tên) để hiển thị
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId) return alert("Vui lòng chọn giảng viên phụ trách!");
    
    setIsSubmitting(true);
    try {
      if (classIdParam) {
        await classService.update(classIdParam, formData);
        alert("Cập nhật lớp học thành công!");
      } else {
        await classService.create(formData);
        alert("Tạo lớp học mới thành công!");
      }
      router.push("/page/classes"); // Quay lại trang danh sách lớp
      router.refresh();
    } catch (error: any) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 p-8 justify-center">
      <main className="w-full max-w-3xl">
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <Link href="/page/class" className="hover:text-teal-600">Lớp học</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">
            {classIdParam ? "Sửa lớp học" : "Thêm lớp học"}
          </span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {classIdParam ? `Chỉnh sửa: ${formData.classId}` : "Tạo lớp học mới"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-md">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-lg text-teal-700">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Mã lớp học *</Label>
                  <Input
                    required
                    placeholder="VD: DTH21-01"
                    value={formData.classId}
                    onChange={(e) => handleChange("classId", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Chuyên ngành *</Label>
                  <Input
                    required
                    placeholder="VD: Công nghệ thông tin"
                    value={formData.majorName}
                    onChange={(e) => handleChange("majorName", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* 💡 Ô Select Giảng viên: Tự động gán cả Tên và ID */}
              <div className="space-y-2">
                <Label className="font-semibold text-teal-700">Giảng viên hướng dẫn *</Label>
                <Select
                  value={formData.teacherId} // Dùng ID làm giá trị nhận diện
                  onValueChange={handleTeacherSelect}
                  disabled={isSubmitting || loadingTeachers}
                >
                  <SelectTrigger className="border-teal-200 focus:ring-teal-500">
                    <SelectValue placeholder={loadingTeachers ? "Đang tải dữ liệu..." : "Chọn giảng viên phụ trách lớp"} />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.length > 0 ? (
                      teachers.map((t) => (
                        <SelectItem key={t.accountId} value={t.accountId}>
                          {t.username} ({t.accountId})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="none">Không có dữ liệu giảng viên</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formData.teacherName && (
                  <p className="text-[11px] text-teal-600 font-medium italic">
                    Đã chọn: {formData.teacherName} (Mã: {formData.teacherId})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Hủy bỏ
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 min-w-[150px]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {classIdParam ? "Cập nhật" : "Lưu lớp học"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}