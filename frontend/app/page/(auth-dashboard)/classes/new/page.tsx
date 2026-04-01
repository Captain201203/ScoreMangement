"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  LayoutGrid, Users, GraduationCap, 
  ChevronRight, Save, Loader2, BookOpen
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
import { accountService } from "@/app/service/account/service";
import { majorService } from "@/app/service/major/service"; // ✨ Giả định bạn đã có service này
import { IMajor } from "@/app/types/major/type";

export default function ClassFormPage() {
  const router = useRouter();
  const params = useParams(); 
  const classIdParam = params?.id as string; 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  
  // States cho danh sách đổ vào Dropdown
  const [teachers, setTeachers] = useState<any[]>([]);
  const [majors, setMajors] = useState<IMajor[]>([]);

  const [formData, setFormData] = useState<IClass>({
    classId: "",
    majorName: "",
    teacherName: "",
    teacherId: "", 
  });

  // 1. Load dữ liệu khởi tạo (Giảng viên & Chuyên ngành)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingInitialData(true);
        
        // 💡 Tối ưu: Chạy song song 2 API lấy danh sách
        const [accountData, majorData] = await Promise.all([
          accountService.getAll(),
          majorService.getAll()
        ]);

        // Lọc danh sách tài khoản là giảng viên
        const teacherList = accountData.filter((acc: any) => 
          acc.role?.roleType === 'teacher' || acc.role === 'teacher'
        );
        
        setTeachers(teacherList);
        setMajors(Array.isArray(majorData) ? majorData : []);

        // 2. Nếu là chế độ Edit, load tiếp dữ liệu của lớp đó
        if (classIdParam) {
          const classData = await classService.getById(classIdParam);
          if (classData) {
            setFormData({
              classId: classData.classId || "",
              majorName: classData.majorName || "",
              teacherName: classData.teacherName || "",
              teacherId: classData.teacherId || "",
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoadingInitialData(false);
      }
    };
    fetchInitialData();
  }, [classIdParam]);

  const handleChange = (field: keyof IClass, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Xử lý chọn Giảng viên (Cập nhật cả ID và Name)
  const handleTeacherSelect = (teacherAccountId: string) => {
    const selectedTeacher = teachers.find(t => t.accountId === teacherAccountId);
    if (selectedTeacher) {
      setFormData(prev => ({
        ...prev,
        teacherId: selectedTeacher.accountId,
        teacherName: selectedTeacher.username 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId) return alert("Vui lòng chọn giảng viên!");
    if (!formData.majorName) return alert("Vui lòng chọn chuyên ngành!");
    
    setIsSubmitting(true);
    try {
      if (classIdParam) {
        await classService.update(classIdParam, formData);
        alert("Cập nhật thành công!");
      } else {
        await classService.create(formData);
        alert("Tạo mới thành công!");
      }
      router.push("/page/classes");
      router.refresh();
    } catch (error: any) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitialData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-teal-600 w-12 h-12 mb-4" />
        <p className="text-slate-500 font-medium">Đang chuẩn bị dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 p-8 justify-center font-sans">
      <main className="w-full max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <Link href="/page/classes" className="hover:text-teal-600 transition-colors">Danh sách lớp</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-semibold">
            {classIdParam ? "Cập nhật lớp học" : "Thêm lớp học mới"}
          </span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {classIdParam ? `Chỉnh sửa: ${formData.classId}` : "Tạo lớp học mới"}
          </h1>
          <p className="text-slate-500 mt-2">Vui lòng điền chính xác thông tin để hệ thống phân quyền dữ liệu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-lg border-none">
            <CardHeader className="bg-white border-b rounded-t-xl px-8 py-6">
              <CardTitle className="text-xl flex items-center gap-2 text-teal-700">
                <BookOpen className="w-5 h-5" /> Thông tin quản lý lớp học
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Mã lớp học */}
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Mã lớp học *</Label>
                  <Input
                    required
                    placeholder="Ví dụ: DTH21-01"
                    className="h-11 focus-visible:ring-teal-500"
                    value={formData.classId}
                    onChange={(e) => handleChange("classId", e.target.value.toUpperCase())}
                    disabled={isSubmitting}
                  />
                </div>

                {/* 2. Chọn Chuyên ngành (Dropdown) */}
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Chuyên ngành *</Label>
                  <Select
                    value={formData.majorName}
                    onValueChange={(val) => handleChange("majorName", val)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-11 border-slate-200 focus:ring-teal-500">
                      <SelectValue placeholder="Chọn chuyên ngành đào tạo" />
                    </SelectTrigger>
                    <SelectContent>
                    {majors.map((m: any) => (
                      <SelectItem key={m._id || m.majorName} value={m.majorName}>
                        {m.majorName}
                      </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 3. Chọn Giảng viên (Dropdown) */}
              <div className="space-y-3 pt-4">
                <Label className="font-bold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" /> Giảng viên hướng dẫn *
                </Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={handleTeacherSelect}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-11 border-teal-200 bg-teal-50/30 focus:ring-teal-500">
                    <SelectValue placeholder="Chọn giảng viên phụ trách" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.accountId} value={t.accountId}>
                        {t.username} — {t.accountId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.teacherName && (
                  <p className="text-xs text-teal-600 font-semibold bg-teal-50 p-2 rounded border border-teal-100 italic">
                    Xác nhận: {formData.teacherName} sẽ có quyền nhập điểm cho lớp này.
                  </p>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Nút bấm điều hướng */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()} 
              className="h-11 px-6 border-slate-300 hover:bg-slate-100"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              className="h-11 px-10 bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/30 transition-all active:scale-95" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> {classIdParam ? "Cập nhật lớp" : "Tạo lớp học"}</>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}