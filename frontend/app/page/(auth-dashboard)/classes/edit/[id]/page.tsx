"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight, Save, Loader2, BookOpen, Users } from "lucide-react";

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
import { majorService } from "@/app/service/major/service";
import { IMajor } from "@/app/types/major/type";

export default function ClassEditFormPage() {
  const router = useRouter();
  const params = useParams(); 
  const classIdParam = params?.id as string; // ID từ URL

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  // Danh sách dữ liệu từ DB
  const [teachers, setTeachers] = useState<any[]>([]);
  const [majors, setMajors] = useState<IMajor[]>([]);

  const [formData, setFormData] = useState<IClass>({
    classId: "",
    majorName: "",
    teacherName: "",
    teacherId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInitial(true);
        
        // 💡 Chạy song song: Giảng viên, Chuyên ngành và Chi tiết lớp học
        const [accountData, majorData, classDetail] = await Promise.all([
          accountService.getAll(),
          majorService.getAll(),
          classIdParam ? classService.getById(classIdParam) : Promise.resolve(null)
        ]);

        // 1. Xử lý danh sách giảng viên
        const teacherList = accountData.filter((acc: any) => 
          acc.role?.roleType === 'teacher' || acc.role === 'teacher'
        );
        setTeachers(teacherList);

        // 2. Xử lý danh sách chuyên ngành
        setMajors(Array.isArray(majorData) ? majorData : []);

        // 3. Điền dữ liệu cũ vào Form
        if (classDetail) {
          setFormData({
            classId: classDetail.classId || "",
            majorName: classDetail.majorName || "",
            teacherName: classDetail.teacherName || "",
            teacherId: classDetail.teacherId || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchData();
  }, [classIdParam]);

  const handleChange = (field: keyof IClass, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    setIsSubmitting(true);
    try {
      await classService.update(classIdParam, formData);
      alert("Cập nhật thông tin lớp học thành công!");
      router.push("/page/classes");
      router.refresh();
    } catch (error: any) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-teal-600 w-12 h-12 mb-4" />
        <p className="text-slate-500 font-medium italic">Đang tải dữ liệu lớp học...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 p-8 justify-center">
      <main className="w-full max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <Link href="/page/classes" className="hover:text-teal-600">Lớp học</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold italic">Chỉnh sửa thông tin</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Cập nhật lớp: <span className="text-teal-600">{formData.classId}</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-lg border-none">
            <CardHeader className="bg-white border-b px-8 py-5">
              <CardTitle className="text-lg flex items-center gap-2 text-teal-700 font-bold">
                <BookOpen className="w-5 h-5" /> Thông tin chi tiết lớp học
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Mã lớp - Thường Edit sẽ không cho sửa mã lớp chính, nếu muốn cho sửa thì giữ nguyên */}
                <div className="space-y-2">
                  <Label className="font-bold">Mã lớp học *</Label>
                  <Input
                    required
                    value={formData.classId}
                    onChange={(e) => handleChange("classId", e.target.value.toUpperCase())}
                    className="h-11 focus:ring-teal-500 border-slate-200"
                  />
                </div>

                {/* 2. Chuyên ngành Dropdown */}
                <div className="space-y-2">
                  <Label className="font-bold">Chuyên ngành *</Label>
                  <Select
                    value={formData.majorName}
                    onValueChange={(val) => handleChange("majorName", val)}
                  >
                    <SelectTrigger className="h-11 border-slate-200">
                      <SelectValue placeholder="Chọn chuyên ngành" />
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

              {/* 3. Giảng viên hướng dẫn Dropdown */}
              <div className="space-y-3 pt-4">
                <Label className="font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" /> Giảng viên hướng dẫn *
                </Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={handleTeacherSelect}
                >
                  <SelectTrigger className="h-11 border-teal-200 bg-teal-50/20">
                    <SelectValue placeholder="Chọn giảng viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.accountId} value={t.accountId}>
                        {t.username} ({t.accountId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-teal-600 font-medium">
                   Giảng viên hiện tại: {formData.teacherName}
                </p>
              </div>

            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" className="h-11 px-6" onClick={() => router.back()}>
              Hủy bỏ
            </Button>
            <Button type="submit" className="h-11 px-10 bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}