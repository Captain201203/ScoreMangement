"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { scoreService } from "@/app/service/score/service"
import { studentService } from "@/app/service/student/service"
import { subjectService } from "@/app/service/subject/service"
import { IStudent } from "@/app/types/student/type"
import { ISubject } from "@/app/types/subject/type"
import { IScore } from "@/app/types/score/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Save, ChevronLeft, Trash2, Edit2, AlertCircle } from "lucide-react"

function ScoreInputFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const semester = searchParams.get("semester")
  const major = searchParams.get("major")
  const subject = searchParams.get("subject")
  const classId = searchParams.get("class")
  const studentId = searchParams.get("student")

  const [student, setStudent] = useState<IStudent | null>(null)
  const [subjectData, setSubjectData] = useState<ISubject | null>(null)
  const [scoresList, setScoresList] = useState<IScore[]>([]) // Danh sách điểm hiển thị ở bảng
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [ex1Score, setEx1Score] = useState("")
  const [ex2Score, setEx2Score] = useState("")
  const [examScore, setExamScore] = useState("")
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!semester || !major || !subject || !classId || !studentId) {
      router.push("/page/scores/input/semester")
      return
    }
    loadData()
  }, [semester, major, subject, classId, studentId])



// src/app/page/scores/input/form/page.tsx

  const loadData = async () => {
      try {
          setLoading(true);
          // Lọc theo studentId và subjectId là chính xác nhất
          const res = await scoreService.getAll({ 
              studentId: studentId!, 
              subjectId: subject! 
          });

          console.log("📊 Dữ liệu thực tế từ API:", res);
          
          // res của bạn đã là mảng data nhờ hàm getAll ở Frontend Service
          setScoresList(Array.isArray(res) ? res : []);
      } catch (err) {
          setError("Lỗi tải dữ liệu");
      } finally {
          setLoading(false);
      }
  };

  const handleEdit = (score: IScore) => {
    setEditingScoreId(score._id || null)
    setEx1Score(score.ex1Score.toString())
    setEx2Score(score.ex2Score.toString())
    setExamScore(score.examScore.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa điểm này không?")) return
    try {
      await scoreService.delete(id)
      alert("Xóa thành công!")
      loadData() // Tải lại bảng
    } catch (err) {
      alert("Lỗi khi xóa điểm")
    }
  }

// src/app/page/scores/input/page.tsx

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
          const scoreData = {
              studentId: studentId!.trim(),
              subjectId: subject!.trim(),
              semester: semester!.trim(),
              className: decodeURIComponent(classId!).trim(), // Gửi className sạch
              ex1Score: parseFloat(ex1Score) || 0,
              ex2Score: parseFloat(ex2Score) || 0,
              examScore: parseFloat(examScore) || 0,
          };

          await scoreService.upsertScore(scoreData);
          
          // Quan trọng: Chờ 300ms để Database Index kịp cập nhật (đặc biệt nếu dùng MongoDB Atlas)
          await new Promise(resolve => setTimeout(resolve, 300));

          setEx1Score(""); setEx2Score(""); setExamScore("");
          await loadData(); 
          alert("Lưu điểm thành công!");
      } catch (err) {
          setError("Lỗi lưu điểm");
      } finally {
          setSubmitting(false);
      }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-teal-600" /></div>

  return (
    <div className="flex min-h-screen bg-background">
  
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header & Breadcrumb */}
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-teal-700">Nhập & Quản Lý Điểm</h1>
              <p className="text-sm text-muted-foreground">Môn: {subjectData?.subjectName} | Lớp: {classId}</p>
            </div>
            <Button variant="ghost" onClick={() => router.back()}><ChevronLeft className="mr-2 h-4 w-4" /> Quay Lại</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Nhập Điểm */}
            <Card className="lg:col-span-1 h-fit shadow-md border-t-4 border-teal-600">
              <CardHeader>
                <CardTitle className="text-lg">{editingScoreId ? "Chỉnh sửa điểm" : "Nhập điểm mới"}</CardTitle>
                <p className="text-sm font-medium">{student?.studentName}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200">{error}</div>}
                  <div className="space-y-2">
                    <Label>Kiểm Tra 1</Label>
                    <Input type="number" step="0.1" value={ex1Score} onChange={(e) => setEx1Score(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Kiểm Tra 2</Label>
                    <Input type="number" step="0.1" value={ex2Score} onChange={(e) => setEx2Score(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Điểm Thi</Label>
                    <Input type="number" step="0.1" value={examScore} onChange={(e) => setExamScore(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                    {editingScoreId ? "Cập nhật" : "Lưu điểm"}
                  </Button>
                  {editingScoreId && <Button variant="ghost" className="w-full text-xs" onClick={() => {setEditingScoreId(null); setEx1Score(""); setEx2Score(""); setExamScore("")}}>Hủy chỉnh sửa</Button>}
                </form>
              </CardContent>
            </Card>

            {/* Bảng Điểm */}
            <Card className="lg:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Bảng Điểm Lớp Học
                  <span className="text-xs font-normal text-muted-foreground">Tổng số: {scoresList.length} sinh viên</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>MSSV</TableHead>
                        <TableHead>KT1</TableHead>
                        <TableHead>KT2</TableHead>
                        <TableHead>Thi</TableHead>
                        <TableHead>TB</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scoresList.length > 0 ? (
                        scoresList.map((s) => (
                          <TableRow key={s._id} className={s.studentId === studentId ? "bg-teal-50/50" : ""}>
                            <TableCell className="font-medium">{s.studentId}</TableCell>
                            <TableCell>{s.ex1Score}</TableCell>
                            <TableCell>{s.ex2Score}</TableCell>
                            <TableCell>{s.examScore}</TableCell>
                            <TableCell className="font-bold text-teal-700">
                              {((s.ex1Score + s.ex2Score + s.examScore) / 3).toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(s)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(s._id!)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            Chưa có dữ liệu điểm cho môn này.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ScoreInputFormPage() {
  return <Suspense fallback={<Loader2 className="animate-spin" />}><ScoreInputFormContent /></Suspense>
}