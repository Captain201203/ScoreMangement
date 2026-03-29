"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Loader2, ChevronRight, BookOpen } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/app/components/dasboard/sidebar";

// Service & Types
import { majorService } from "@/app/service/major/service";
import { IMajor } from "@/app/types/major/type";

export default function MajorFormPage() {
  const router = useRouter();
  const params = useParams();
  const majorIdParam = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState<IMajor>({ majorId: "", majorName: "" });

  useEffect(() => {
    if (majorIdParam) {
      const fetchDetail = async () => {
        try {
          setLoadingData(true);
          const data = await majorService.getById(majorIdParam);
          setFormData(data);
        } catch (error) {
          alert("Không thể tải dữ liệu chuyên ngành.");
        } finally {
          setLoadingData(false);
        }
      };
      fetchDetail();
    }
  }, [majorIdParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (majorIdParam) {
        await majorService.update(majorIdParam, formData);
        alert("Cập nhật thành công!");
      } else {
        await majorService.create(formData);
        alert("Thêm chuyên ngành thành công!");
      }
      router.push("/page/majors");
      router.refresh();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-teal-600 w-10 h-10" /></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <main className="flex-1  p-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/majors">Majors</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{majorIdParam ? "Edit Major" : "New Major"}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold">{majorIdParam ? `Sửa ngành: ${formData.majorName}` : "Thêm chuyên ngành mới"}</h1>
        </header>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2 text-teal-700">
                <BookOpen className="w-5 h-5" /> Thông tin chuyên ngành
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="majorId">Mã chuyên ngành <span className="text-red-500">*</span></Label>
                <Input 
                  id="majorId" 
                  value={formData.majorId} 
                  disabled={!!majorIdParam || isLoading}
                  onChange={(e) => setFormData({...formData, majorId: e.target.value})}
                  placeholder="VD: CNTT, KTPM..." 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="majorName">Tên chuyên ngành <span className="text-red-500">*</span></Label>
                <Input 
                  id="majorName" 
                  value={formData.majorName} 
                  disabled={isLoading}
                  onChange={(e) => setFormData({...formData, majorName: e.target.value})}
                  placeholder="VD: Công nghệ thông tin" 
                  required 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-8 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Hủy bỏ
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 min-w-[140px]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {majorIdParam ? "Cập nhật" : "Lưu dữ liệu"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}