"use client"

import { useEffect, useState } from "react"
import { accountService } from "@/app/service/account/service"
import { IAccount } from "@/app/types/account/type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2, ShieldCheck, UserCircle, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge" // Giả sử bạn có component Badge từ shadcn/ui

export default function AccountListPage() {
  const [accounts, setAccounts] = useState<IAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await accountService.getAll()
      setAccounts(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      await accountService.delete(id)
      loadAccounts()
    }
  }

  // Hàm hiển thị Badge dựa trên Role Type
  const renderRoleBadge = (roleType: string, roleName: string) => {
    switch (roleType?.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 uppercase gap-1"><ShieldCheck size={12}/> {roleName}</Badge>
      case 'teacher':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 uppercase gap-1"><UserCircle size={12}/> {roleName}</Badge>
      default:
        return <Badge className="bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100 uppercase gap-1"><GraduationCap size={12}/> {roleName}</Badge>
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-600" /></div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">QUẢN LÝ HỆ THỐNG TÀI KHOẢN</h1>
          <p className="text-sm text-slate-500 italic mt-1">
            * Lưu ý: Mật khẩu mặc định của người dùng là Mã định danh (ID).
          </p>
        </div>
        <Link href="/page/account/new">
          <Button className="bg-teal-600 hover:bg-teal-700 shadow-md transition-all">
            <Plus className="w-4 h-4 mr-2" /> Tạo tài khoản thủ công
          </Button>
        </Link>
      </div>

      <div className="border rounded-xl shadow-lg bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Tài khoản (Email)</TableHead>
              <TableHead className="font-bold">Mã định danh (ID)</TableHead>
              <TableHead className="font-bold">Vai trò</TableHead>
              <TableHead className="font-bold">Ngày tạo</TableHead>
              <TableHead className="text-right font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <TableRow key={account.accountId} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-medium text-slate-700">{account.username}</div>
                    <div className="text-[11px] text-slate-400">Email đăng nhập</div>
                  </TableCell>
                  <TableCell>
                    <code className="px-2 py-0.5 bg-slate-100 rounded text-teal-700 font-mono text-xs">
                      {account.accountId}
                    </code>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase italic">(Mật khẩu mặc định)</div>
                  </TableCell>
                  <TableCell>
                    {renderRoleBadge(account.role?.roleType, account.role?.roleName)}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                     {/* @ts-ignore */}
                    {new Date(account.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/page/account/edit/${account.accountId}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(account.accountId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                  Chưa có tài khoản nào được khởi tạo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}