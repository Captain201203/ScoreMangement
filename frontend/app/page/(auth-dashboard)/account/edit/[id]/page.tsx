"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { accountService } from "@/app/service/account/service";
import { roleService } from "@/app/service/role/service";
import { IRole } from "@/app/types/role/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Save, Shield } from "lucide-react";

export default function EditAccountPage() {
  const params = useParams();
  const accountIdFromParams = params.id as string; // Đây có thể là accountId (MSSV) hoặc _id
  
  const [username, setUsername] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [account, allRoles] = await Promise.all([
          accountService.getById(accountIdFromParams),
          roleService.getAll()
        ]);
        
        if (account) {
          setUsername(account.username);
          
          // 💡 QUAN TRỌNG: Trích xuất ID Role an toàn
          let currentRoleId = "";
          if (account.role) {
            currentRoleId = typeof account.role === 'object' ? account.role._id : account.role;
          }
          
          // Ép về string để Select Component nhận diện đúng key
          setSelectedRoleId(String(currentRoleId));
        }
        
        setRoles(allRoles);
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accountIdFromParams]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoleId) {
      alert("Vui lòng chọn vai trò!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 💡 Gửi field 'role' khớp với AccountEntity ở Backend
      const payload = { 
        username: username, 
        role: selectedRoleId 
      };

      await accountService.update(accountIdFromParams, payload as any);
      
      alert("Cập nhật thông tin thành công!");
      
      // Chuyển hướng và làm mới router để cập nhật UI danh sách
      router.push("/page/account");
      router.refresh(); 
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại Backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
        <p className="text-sm text-muted-foreground">Đang tải thông tin...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 flex flex-col items-center bg-slate-50 min-h-screen">
      <div className="w-full max-w-lg mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
      </div>

      <Card className="w-full max-w-lg shadow-xl border-t-4 border-blue-600 bg-white">
        <CardHeader className="border-b">
          <CardTitle className="text-blue-700 flex items-center gap-2 uppercase text-lg">
            <Shield className="h-5 w-5" /> Quản lý tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Email đăng nhập</Label>
              <Input 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                className="focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Vai trò hệ thống</Label>
              {/* 💡 Sử dụng value={selectedRoleId} và đảm bảo nó luôn là string */}
              <Select 
                value={selectedRoleId} 
                onValueChange={setSelectedRoleId}
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="Chọn vai trò mới" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r._id} value={String(r._id)}>
                      {r.roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 shadow-lg transition-all active:scale-95" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Đang lưu...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}