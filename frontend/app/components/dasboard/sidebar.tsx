"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LayoutDashboard, Users, BookOpen, GraduationCap,
  PenTool, Calendar, BookMarked, UserCog, 
  ShieldCheck, Key, ChevronRight
} from "lucide-react"

// Cấu hình Menu khớp chính xác với bộ Slugs bạn đã tạo
const MENU_GROUPS = [
  {
    groupName: "Hệ thống",
    items: [
      { title: "Dashboard", href: "/page/dashboard", icon: LayoutDashboard, claim: "dashboard:view" },
      { title: "Tài khoản", href: "/page/account", icon: UserCog, claim: "account:manage" },
      { title: "Vai trò", href: "/page/roles", icon: ShieldCheck, claim: "role:manage" },
      { title: "Định danh quyền", href: "/page/claims", icon: Key, claim: "claim:manage" },
    ]
  },
  {
    groupName: "Đào tạo",
    items: [
      { title: "Chuyên ngành", href: "/page/majors", icon: BookOpen, claim: "major:view" },
      { title: "Học kỳ", href: "/page/semesters", icon: Calendar, claim: "semester:view" },
      { title: "Môn học", href: "/page/subjects", icon: BookMarked, claim: "subject:view" },
      { title: "Lớp học", href: "/page/classes", icon: BookOpen, claim: "class:view" },
    ]
  },
  {
    groupName: "Quản lý",
    items: [
      { title: "Nhập điểm", href: "/page/scores/input/semester", icon: PenTool, claim: "score:update" },
      { title: "Sinh viên", href: "/page/students", icon: Users, claim: "student:view" },
      { title: "Giảng viên", href: "/page/teachers", icon: GraduationCap, claim: "teacher:view" },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState({ role: "", username: "", claims: [] as string[] })

  useEffect(() => {
    setMounted(true)
    const storedClaims = localStorage.getItem("user_claims")
    setUserData({
      role: localStorage.getItem("user_role") || "",
      username: localStorage.getItem("user_username") || "User",
      claims: storedClaims ? JSON.parse(storedClaims) : []
    })
  }, [])

  // Logic kiểm tra quyền linh hoạt
  const hasAccess = (requiredClaim: string) => {
    const userClaims = userData.claims;

    // 1. Nếu có quyền toàn năng
    if (userClaims.includes("admin:all")) return true;

    
    if (userClaims.includes(requiredClaim)) return true;

   
    const resource = requiredClaim.split(':')[0]; 
    if (userClaims.includes(`${resource}:manage`)) return true;

    return false;
  }

  const filteredGroups = useMemo(() => {
    return MENU_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item => hasAccess(item.claim))
    })).filter(group => group.items.length > 0)
  }, [userData.claims])

  if (!mounted) return <div className="w-64 border-r h-screen bg-background" />

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card shadow-sm select-none">
      <div className="px-6 py-8 border-b mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-100 ring-4 ring-teal-50">
            <BookMarked className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-teal-800">EduManage</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-7 overflow-y-auto pt-4 custom-scrollbar">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div key={group.groupName} className="space-y-3">
              <h2 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {group.groupName}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => {
                  // Active logic hỗ trợ sub-routes
                  const isActive = pathname === item.href || (item.href !== "/page/dashboard" && pathname.startsWith(item.href))
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-100 scale-[1.02]"
                          : "text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:pl-4"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-teal-600")} />
                        {item.title}
                      </div>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70 animate-in slide-in-from-left-2" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="p-2 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-2 w-12 ml-2" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* User Section - Tinh chỉnh giao diện chuyên nghiệp hơn */}
      <div className="p-4 border-t bg-slate-50/80">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl border bg-white shadow-sm hover:border-teal-300 transition-all cursor-default group">
          <Avatar className="h-10 w-10 border-2 border-teal-50 shadow-sm group-hover:scale-110 transition-transform">
            <AvatarFallback className="bg-teal-600 text-white text-xs font-black">
              {userData.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-slate-800 mb-0.5">
              {userData.username.split('@')[0]}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest opacity-80">{userData.role || 'No Role'}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}