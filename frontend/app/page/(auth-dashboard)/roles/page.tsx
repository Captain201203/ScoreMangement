"use client"

import { useEffect, useState } from "react"
import { roleService } from "@/app/service/role/service"
import { claimService } from "@/app/service/claim/service"
import { IRole } from "@/app/types/role/type"
import { IClaim } from "@/app/types/claim/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, PlusCircle, Trash2, X, Shield, Pencil, Plus } from "lucide-react"

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<IRole[]>([])
  const [allClaims, setAllClaims] = useState<IClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClaim, setSelectedClaim] = useState<Record<string, string>>({})
  
  // State cho Create/Edit Role
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Partial<IRole>>({ roleName: "", roleType: "student" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [rolesData, claimsData] = await Promise.all([
        roleService.getAll(),
        claimService.getAll()
      ])
      setRoles(rolesData)
      setAllClaims(claimsData)
    } finally {
      setLoading(false)
    }
  }

  // --- LOGIC XỬ LÝ ---

  const handleCreateRole = async () => {
    try {
      await roleService.create(currentRole)
      setIsAddRoleOpen(false)
      setCurrentRole({ roleName: "", roleType: "student" })
      fetchData()
    } catch (error) { alert("Lỗi khi tạo Role") }
  }

  const handleUpdateRoleName = async () => {
    if (!currentRole._id || !currentRole.roleName) return
    try {
      await roleService.update(currentRole._id, { roleName: currentRole.roleName })
      setIsEditRoleOpen(false)
      fetchData()
    } catch (error) { alert("Lỗi khi sửa tên Role") }
  }

  const handleDeleteRole = async (id: string, type: string) => {
    if (type === 'admin') return alert("Không được xóa vai trò Admin hệ thống!")
    if (confirm("Bạn có chắc chắn muốn xóa vai trò này?")) {
      try {
        await roleService.deleteRole(id)
        fetchData()
      } catch (error) { alert("Lỗi khi xóa") }
    }
  }

  const handleAddClaim = async (roleId: string) => {
    const claimId = selectedClaim[roleId]
    if (!claimId) return
    try {
      await roleService.addClaimToRole({ roleId, claimId })
      fetchData()
    } catch (error) { alert("Lỗi khi gán quyền") }
  }

  const handleRemoveClaim = async (roleId: string, claimId: string) => {
    try {
      await roleService.removeClaim(roleId, claimId)
      fetchData()
    } catch (error) { alert("Lỗi khi gỡ quyền") }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-teal-600" /></div>

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-teal-600 h-8 w-8" />
          <h1 className="text-3xl font-bold text-slate-800 uppercase">Quản lý Vai trò & Phân quyền</h1>
        </div>
        <Button onClick={() => setIsAddRoleOpen(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" /> Thêm Vai trò mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role._id} className="shadow-md border-t-4 border-teal-600 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-start text-lg">
                <div className="flex flex-col gap-1">
                  <span className="uppercase font-bold text-slate-700">{role.roleName}</span>
                  <Badge variant="secondary" className="w-fit text-[10px]">{role.roleType}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => {
                    setCurrentRole(role)
                    setIsEditRoleOpen(true)
                  }}>
                    <Pencil size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500" 
                    onClick={() => handleDeleteRole(role._id, role.roleType)}
                    disabled={role.roleType === 'admin'}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quyền đang sở hữu:</Label>
                <div className="flex flex-wrap gap-1.5">
                  {role.claims.map((c) => (
                    <Badge key={c._id} className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 transition-colors pr-1">
                      {c.name}
                      <button onClick={() => handleRemoveClaim(role._id, c._id)} className="ml-1 hover:text-red-600">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                  {role.claims.length === 0 && <p className="text-xs text-slate-400 italic">Chưa có quyền nào</p>}
                </div>
              </div>

              <div className="pt-4 border-t mt-auto space-y-3">
                <Label className="text-[10px] font-bold text-slate-400 uppercase">Gán thêm quyền:</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(val) => setSelectedClaim({ ...selectedClaim, [role._id]: val })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Chọn quyền..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allClaims
                        .filter(ac => !role.claims.find(rc => rc._id === ac._id))
                        .map(ac => (
                          <SelectItem key={ac._id} value={ac._id}>{ac.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="bg-slate-800 h-9" onClick={() => handleAddClaim(role._id)}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DIALOG THÊM ROLE MỚI */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tạo vai trò mới</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên vai trò (Ví dụ: Trợ giảng)</Label>
              <Input value={currentRole.roleName} onChange={e => setCurrentRole({...currentRole, roleName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Loại vai trò (Role Type)</Label>
              <Select onValueChange={(val) => setCurrentRole({...currentRole, roleType: val as any})}>
                <SelectTrigger><SelectValue placeholder="Chọn loại..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher (Giảng viên)</SelectItem>
                  <SelectItem value="student">Student (Sinh viên)</SelectItem>
                  <SelectItem value="admin">Admin (Quản trị)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>Hủy</Button>
            <Button className="bg-teal-600" onClick={handleCreateRole}>Tạo ngay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG SỬA TÊN ROLE */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chỉnh sửa tên vai trò</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Tên mới cho vai trò</Label>
              <Input value={currentRole.roleName} onChange={e => setCurrentRole({...currentRole, roleName: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>Hủy</Button>
            <Button className="bg-blue-600 text-white" onClick={handleUpdateRoleName}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}