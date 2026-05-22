'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  const navItems = [
    { href: "/admin123", label: "Dashboard", icon: "📊" },
    { href: "/admin123/teams", label: "Teams", icon: "👥" },
    { href: "/admin123/players", label: "Players", icon: "⚽" },
    { href: "/admin123/fixtures", label: "Fixtures", icon: "📅" },
    { href: "/admin123/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar - EXACT About page styling */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-full w-72
          bg-black border-r border-white/10
          transition-transform duration-300 ease-in-out z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo Area - matches About header style */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500">Tournament Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation - matches feature strip styling */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-6 bg-orange-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - matches info panel styling */}
        <div className="p-4 border-t border-white/10">
          <div className="border border-white/10 rounded-xl p-3 bg-white/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-500">System Online</span>
            </div>
            <p className="text-xs text-gray-500">v2.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        
        {/* Header - matches About header styling exactly */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden relative w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-1.5"
            >
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* Breadcrumb - matches your text-gray-500 style */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-gray-500">Pages</span>
              <span className="text-gray-600">/</span>
              <span className="text-orange-400">
                {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </span>
            </div>

            {/* Mobile Title */}
            <h2 className="font-semibold text-white md:hidden">
              {navItems.find(item => item.href === pathname)?.label || 'Admin'}
            </h2>

            {/* User Actions - matches your button styling */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 transition px-4 py-1.5 rounded-lg text-sm font-medium">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}