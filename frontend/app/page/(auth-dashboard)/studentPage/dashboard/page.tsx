"use client"

import { useState, useEffect, useMemo } from "react"
import { scoreService } from "@/app/service/score/service"
import { IScore } from "@/app/types/score/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, LogOut, BookOpen, User, GraduationCap } from "lucide-react"

export default function StudentDashboard() {
  const [scores, setScores] = useState<IScore[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState<string>("all")

  useEffect(() => {
    const studentId = localStorage.getItem("student_session");
    const token = localStorage.getItem("token");

    if (!studentId || !token) {
      window.location.href = "/page/login";
      return;
    }
    loadMyScores(studentId);
  }, []);

  const loadMyScores = async (id: string) => {
      try {
          setLoading(true);
          // Ép kiểu any để truy cập .data mà không bị TS báo lỗi
          const res: any = await scoreService.getAll({ studentId: id });
          
          console.log("📥 Dữ liệu thô từ API:", res);

          // API của bạn trả về { data: [...] }, nên phải lấy res.data
          if (res && res.data && Array.isArray(res.data)) {
              setScores(res.data);
              console.log("✅ Đã gán mảng điểm vào state:", res.data);
          } else {
              // Trường hợp res chính là mảng (nếu bạn đã sửa service trước đó)
              setScores(Array.isArray(res) ? res : []);
          }
      } catch (err) {
          console.error("❌ Lỗi tải điểm:", err);
      } finally {
          setLoading(false);
      }
  }

  // Lấy danh sách các học kỳ duy nhất từ dữ liệu để làm bộ lọc
  const semesters = useMemo(() => {
    const unique = Array.from(new Set(scores.map(s => s.semester)));
    return unique.sort().reverse(); 
  }, [scores]);

  // Lọc điểm theo học kỳ đã chọn
  const filteredScores = useMemo(() => {
    if (selectedSemester === "all") return scores;
    return scores.filter(s => s.semester === selectedSemester);
  }, [selectedSemester, scores]);

  // Tính toán GPA trung bình cho phần hiển thị bên dưới
  const stats = useMemo(() => {
    if (filteredScores.length === 0) return { avgGPA: 0, total: 0 };
    const sumGPA = filteredScores.reduce((acc, s) => acc + (s.GPA || 0), 0);
    return {
      avgGPA: sumGPA / filteredScores.length,
      total: filteredScores.length
    };
  }, [filteredScores]);

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/page/login"
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header điều hướng */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-full text-teal-700">
              <GraduationCap size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Kết Quả Học Tập</h2>
              <p className="text-slate-500 font-medium">Sinh viên: {scores[0]?.studentId || localStorage.getItem("student_session")}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                {semesters.map(sem => (
                  <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
              <LogOut size={18} className="mr-2" /> Thoát
            </Button>
          </div>
        </div>

        {/* Bảng điểm chi tiết */}
        <Card className="shadow-md border-none overflow-hidden">
          <CardHeader className="bg-white border-b flex flex-row items-center gap-2">
            <BookOpen className="text-teal-600" />
            <CardTitle className="text-teal-700">Chi tiết bảng điểm</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-bold">Mã môn học</TableHead>
                    <TableHead className="font-bold">Tên môn học</TableHead>
                    <TableHead className="text-center font-bold">KT1</TableHead>
                    <TableHead className="text-center font-bold">KT2</TableHead>
                    <TableHead className="text-center font-bold">Thi</TableHead>
                    <TableHead className="text-center font-bold">Tổng kết</TableHead>
                    <TableHead className="text-center font-bold">Điểm chữ</TableHead>
                    <TableHead className="text-center font-bold">Hệ 4 (GPA)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScores.length > 0 ? (
                    filteredScores.map((score) => (
                      <TableRow key={score._id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-mono text-teal-700 font-semibold">{score.subjectId}</TableCell>
                        <TableCell className="font-medium">{score.subjectName}</TableCell>
                        <TableCell className="text-center">{score.ex1Score}</TableCell>
                        <TableCell className="text-center">{score.ex2Score}</TableCell>
                        <TableCell className="text-center">{score.examScore}</TableCell>
                        <TableCell className="text-center font-bold">{score.finalScore}</TableCell>
                        <TableCell className="text-center font-bold text-blue-600">{score.letterGrade}</TableCell>
                        <TableCell className="text-center font-bold text-teal-600 bg-teal-50/50">{score.GPA?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-20 text-slate-400">
                        Chưa có dữ liệu điểm cho học kỳ này.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          {/* Phần Footer hiển thị GPA tổng kết */}
          <div className="bg-slate-50 p-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-8">
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-500 uppercase tracking-wider">Số môn học</p>
                <p className="text-xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="h-10 w-[1px] bg-slate-300 hidden md:block"></div>
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-500 uppercase tracking-wider">Điểm trung bình (GPA)</p>
                <p className="text-2xl font-black text-teal-600">{stats.avgGPA.toFixed(2)} <span className="text-sm text-slate-400">/ 4.0</span></p>
              </div>
            </div>
            <div className="text-sm text-slate-400 italic">
              {filteredScores[0] && (
                <>* Dữ liệu được cập nhật lần cuối: {new Date(filteredScores[0].updatedAt as string).toLocaleDateString('vi-VN')}</>)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}