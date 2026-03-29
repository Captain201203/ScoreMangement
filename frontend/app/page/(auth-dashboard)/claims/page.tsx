"use client"

import { useEffect, useState } from "react"
import { claimService } from "@/app/service/claim/service"
import { IClaim } from "@/app/types/claim/type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Key, Loader2, Info, Pencil, Trash2, AlertTriangle } from "lucide-react"

export default function ClaimPage() {
  const [claims, setClaims] = useState<IClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newClaim, setNewClaim] = useState({ name: "", slug: "", description: "" })
  
  // State cho việc chỉnh sửa
  const [editingClaim, setEditingClaim] = useState<IClaim | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      const data = await claimService.getAll()
      setClaims(data)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await claimService.create(newClaim)
      setNewClaim({ name: "", slug: "", description: "" })
      fetchClaims()
      alert("Tạo quyền mới thành công!")
    } catch (error: any) {
      alert(error.response?.data?.error || "Lỗi khi tạo quyền")
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClaim) return
    setIsUpdating(true)
    try {
      await claimService.update(editingClaim._id, editingClaim)
      setIsEditDialogOpen(false)
      fetchClaims()
      alert("Cập nhật quyền thành công!")
    } catch (error: any) {
      alert(error.response?.data?.error || "Lỗi khi cập nhật")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`CẢNH BÁO: Xóa quyền "${name}" sẽ gỡ bỏ quyền này khỏi TẤT CẢ các vai trò (Roles) liên quan. Bạn có chắc chắn?`)) {
      try {
        await claimService.delete(id)
        fetchClaims()
      } catch (error: any) {
        alert(error.response?.data?.error || "Lỗi khi xóa quyền")
      }
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-teal-600" /></div>

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <Key className="text-teal-600 h-8 w-8" />
        <h1 className="text-3xl font-bold text-slate-800 uppercase">Quản lý định danh quyền (Claims)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form thêm mới */}
        <Card className="h-fit shadow-lg border-t-4 border-teal-600">
          <CardHeader>
            <CardTitle className="text-lg">Tạo quyền mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Tên quyền</Label>
                <Input 
                  required 
                  placeholder="Ví dụ: Cập nhật điểm" 
                  value={newClaim.name}
                  onChange={e => setNewClaim({...newClaim, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (Mã định danh)</Label>
                <Input 
                  required 
                  placeholder="Ví dụ: score:update" 
                  value={newClaim.slug}
                  onChange={e => setNewClaim({...newClaim, slug: e.target.value})}
                />
                <p className="text-[10px] text-muted-foreground italic">* Lưu ý: Slug dùng để check quyền trong code.</p>
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input 
                  placeholder="Mô tả chức năng..." 
                  value={newClaim.description}
                  onChange={e => setNewClaim({...newClaim, description: e.target.value})}
                />
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700" disabled={isCreating}>
                {isCreating ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Tạo mới</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bảng danh sách */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-600" />
                Danh sách quyền hệ thống
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Tên quyền</TableHead>
                    <TableHead className="font-bold">Slug (Mã)</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Mô tả</TableHead>
                    <TableHead className="font-bold text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim._id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-teal-700">{claim.name}</TableCell>
                      <TableCell>
                        <code className="bg-slate-100 px-2 py-1 rounded text-pink-600 text-xs font-mono">
                          {claim.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm hidden md:table-cell">{claim.description}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600"
                          onClick={() => {
                            setEditingClaim(claim);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600"
                          onClick={() => handleDelete(claim._id, claim.name)}
                          disabled={claim.slug === 'admin:all'} // Khóa xóa quyền tối cao
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      {/* Dialog chỉnh sửa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-teal-700 flex items-center gap-2">
              <Pencil className="h-5 w-5" /> Chỉnh sửa quyền
            </DialogTitle>
          </DialogHeader>
          {editingClaim && (
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Tên quyền hiển thị</Label>
                <Input 
                  value={editingClaim.name}
                  onChange={e => setEditingClaim({...editingClaim, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (Mã định danh)</Label>
                <Input 
                  value={editingClaim.slug}
                  onChange={e => setEditingClaim({...editingClaim, slug: e.target.value})}
                  required
                />
                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Cẩn thận: Sửa slug có thể làm hỏng logic phân quyền trong code.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Mô tả chức năng</Label>
                <Input 
                  value={editingClaim.description}
                  onChange={e => setEditingClaim({...editingClaim, description: e.target.value})}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                <Button type="submit" className="bg-teal-600" disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="animate-spin" /> : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}