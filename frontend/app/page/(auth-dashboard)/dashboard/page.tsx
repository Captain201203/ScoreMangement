"use client"

import { useEffect, useState } from "react"
import { StatCards } from "../../../components/dasboard/stat-cards"
import { RecentActivity } from "../../../components/dasboard/recent-activity"
import { Footer } from "../../../components/dasboard/footer"
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Bell, 
  Search,
  UserCircle
} from "lucide-react"

export default function DashboardPage() {
  const [username, setUsername] = useState("User")
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // 1. Lấy thông tin người dùng
    const storedUser = localStorage.getItem("user_username") 
    if (storedUser) {
      setUsername(storedUser.split('@')[0])
    }

    // 2. Cập nhật ngày tháng hiện tại
    const date = new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    setCurrentTime(date)
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="flex flex-1 flex-col">
        {/* Top Header phụ (Tùy chọn nếu Header tổng chưa có) */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-500">
            <LayoutDashboard className="w-5 h-5 text-teal-600" />
            <span className="font-medium">Bảng điều khiển</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-teal-600 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{username}</span>
              <UserCircle className="w-8 h-8 text-slate-300" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {getGreeting()}, <span className="text-teal-600 capitalize">{username}</span>!
              </h1>
              <p className="mt-2 text-slate-500 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-teal-500" />
                {currentTime}
              </p>
            </div>
            
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2 w-fit">
               <span>Xuất báo cáo</span>
            </button>
          </div>

          {/* Statistics Cards Grid */}
          <div className="mb-10">
            <StatCards />
          </div>

          {/* Content Grid: Hoạt động & Thông báo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Hoạt động gần đây</h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <RecentActivity />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-bold text-slate-800">Thông báo hệ thống</h2>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                  <p className="text-sm text-orange-800 font-medium">Hạn chót nhập điểm</p>
                  <p className="text-xs text-orange-700 mt-1">Học kỳ 2 - 2025 sẽ kết thúc vào ngày 30/03.</p>
                </div>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <p className="text-sm text-blue-800 font-medium">Bảo trì hệ thống</p>
                  <p className="text-xs text-blue-700 mt-1">Hệ thống sẽ bảo trì vào lúc 2h sáng chủ nhật.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}