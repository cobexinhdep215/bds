'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell,
  ChevronDown,
  Layers,
  FilePlus2,
  Home
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Verification for admin login
  useEffect(() => {
     // For demo/simplicity, we use localStorage or just a state
     const auth = localStorage.getItem('admin_auth');
     if (auth === 'true') {
        setIsLoggedIn(true);
     } else {
        // If not on login page, redirect
        if (pathname !== '/admin/login') {
           router.push('/admin/login');
        }
     }
  }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!isLoggedIn) return <div className="loading-screen">Authenticating...</div>;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { 
       name: 'Tin tức', 
       icon: Newspaper, 
       path: '/admin/news',
       subItems: [
          { name: 'Danh sách tin', path: '/admin/news', icon: Newspaper },
          { name: 'Danh mục tin', path: '/admin/news/categories', icon: Layers },
          { name: 'Tạo mới tin', path: '/admin/news/create', icon: FilePlus2 }
       ]
    },
    { name: 'Môi giới', icon: Users, path: '/admin/brokers' },
    { name: 'Quay lại Trang chủ', icon: Home, path: '/' },
  ];

  const handleLogout = () => {
     localStorage.removeItem('admin_auth');
     router.push('/admin/login');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
           <div className="logo-box">
              <div className="logo-icon">B</div>
              <span>BDSXXX Admin</span>
           </div>
           <button className="btn-toggle-mobile" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
           </button>
        </div>
        
        <nav className="sidebar-nav">
           {navItems.map((item) => (
             <div key={item.name} className="nav-group">
                <Link 
                  href={item.path} 
                  className={`nav-link-main ${pathname === item.path ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
                {item.subItems && (
                   <div className="sub-nav">
                      {item.subItems.map(sub => (
                         <Link 
                           key={sub.name} 
                           href={sub.path} 
                           className={`sub-link ${pathname === sub.path ? 'active' : ''}`}
                         >
                            <sub.icon size={16} />
                            <span>{sub.name}</span>
                         </Link>
                      ))}
                   </div>
                )}
             </div>
           ))}
        </nav>

        <div className="sidebar-footer">
           <button onClick={handleLogout} className="btn-logout-v2">
              <LogOut size={20} />
              <span>Đăng xuất</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
           <div className="topbar-left">
              <button className="btn-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                 <Menu size={24} />
              </button>
              <div className="search-bar-admin">
                 <Search size={18} />
                 <input type="text" placeholder="Tìm kiếm nhanh..." />
              </div>
           </div>
           <div className="topbar-right">
              <button className="icon-btn"><Bell size={20} /></button>
              <div className="admin-profile">
                 <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=40&q=40" alt="Admin" />
                 <div className="admin-info">
                    <span className="name">Admin</span>
                    <span className="role">Tổng quản trị viên</span>
                 </div>
                 <ChevronDown size={14} />
              </div>
           </div>
        </header>

        <section className="admin-content-area">
           {children}
        </section>
      </main>

      <style jsx global>{`
        :root {
           --admin-bg: #f8fafc;
           --admin-sidebar: #0f172a;
           --admin-primary: #005B4B;
           --border-color: #e2e8f0;
        }
        
        .admin-container { 
           display: flex; 
           min-height: 100vh; 
           background: var(--admin-bg); 
           font-family: 'Inter', sans-serif;
           color: #1e293b;
        }

        /* Sidebar Style */
        .admin-sidebar { 
           width: 280px; 
           background: var(--admin-sidebar); 
           color: #fff; 
           display: flex; 
           flex-direction: column;
           transition: 0.3s;
           flex-shrink: 0;
           position: relative;
           z-index: 1000;
        }
        .admin-sidebar.closed { width: 0; overflow: hidden; }
        
        .sidebar-header { padding: 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .logo-box { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; }
        .logo-icon { background: var(--admin-primary); padding: 4px 10px; border-radius: 6px; }
        .btn-toggle-mobile { display: none; background: transparent; border: none; color: #fff; }

        .sidebar-nav { flex: 1; padding: 20px; overflow-y: auto; }
        .nav-group { margin-bottom: 8px; }
        .nav-link-main { 
           display: flex; 
           align-items: center; 
           gap: 12px; 
           padding: 12px 16px; 
           border-radius: 8px; 
           color: #94a3b8; 
           text-decoration: none; 
           font-weight: 600; 
           font-size: 0.95rem;
           transition: 0.2s;
        }
        .nav-link-main:hover, .nav-link-main.active { background: rgba(255,255,255,0.1); color: #fff; }
        .nav-link-main.active { color: var(--admin-primary); background: rgba(0, 91, 75, 0.1); border-left: 3px solid var(--admin-primary); border-radius: 0 8px 8px 0; }

        .sub-nav { margin-left: 36px; margin-top: 4px; display: flex; flex-direction: column; gap: 4px; }
        .sub-link { 
           display: flex; 
           align-items: center; 
           gap: 10px; 
           padding: 8px 12px; 
           color: #64748b; 
           text-decoration: none; 
           font-size: 0.85rem; 
           font-weight: 500;
           border-radius: 6px;
           transition: 0.2s;
        }
        .sub-link:hover, .sub-link.active { color: #fff; background: rgba(255,255,255,0.05); }
        .sub-link.active { color: var(--admin-primary); }

        .sidebar-footer { padding: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
        .btn-logout-v2 { 
           width: 100%; 
           display: flex; 
           align-items: center; 
           gap: 12px; 
           padding: 12px; 
           background: rgba(239, 68, 68, 0.1); 
           color: #ef4444; 
           border: none; 
           border-radius: 8px; 
           font-weight: 700; 
           cursor: pointer; 
        }

        /* Topbar Style */
        .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .admin-topbar { 
           height: 72px; 
           background: #fff; 
           border-bottom: 1px solid var(--border-color); 
           display: flex; 
           align-items: center; 
           justify-content: space-between; 
           padding: 0 24px;
           position: sticky;
           top: 0;
           z-index: 100;
        }
        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .btn-menu-toggle { background: transparent; border: none; color: #64748b; cursor: pointer; }
        .search-bar-admin { 
           background: #f1f5f9; 
           padding: 8px 16px; 
           border-radius: 10px; 
           display: flex; 
           align-items: center; 
           gap: 10px; 
           width: 300px;
        }
        .search-bar-admin input { border: none; background: transparent; outline: none; flex: 1; font-size: 0.9rem; }
        
        .topbar-right { display: flex; align-items: center; gap: 24px; }
        .icon-btn { background: transparent; border: none; color: #64748b; cursor: pointer; position: relative; }
        .admin-profile { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .admin-profile img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
        .admin-info { display: flex; flex-direction: column; line-height: 1.2; }
        .admin-info .name { font-weight: 700; font-size: 0.9rem; }
        .admin-info .role { font-size: 0.75rem; color: #64748b; }

        .admin-content-area { padding: 32px; flex: 1; overflow-y: auto; }
        
        .loading-screen { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--admin-primary); }

        @media (max-width: 768px) {
           .admin-sidebar { position: fixed; height: 100vh; transform: translateX(-100%); }
           .admin-sidebar.open { transform: translateX(0); width: 280px; }
           .btn-toggle-mobile { display: block; }
           .search-bar-admin { display: none; }
        }
      `}</style>
    </div>
  );
}
