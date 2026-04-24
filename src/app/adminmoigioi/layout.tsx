'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  List, 
  PlusCircle, 
  Home, 
  User, 
  LogOut,
  Menu,
  X,
  CreditCard,
  Bell
} from 'lucide-react';

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Call API to verify user instead of checking document.cookie (since it's HttpOnly)
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
           setIsLoggedIn(true);
        } else {
           router.push('/login');
        }
      })
      .catch(() => {
         router.push('/login');
      });
  }, [router]);

  if (!isLoggedIn) return <div className="loading">Đang xác thực...</div>;

  const navItems = [
    { name: 'Danh sách tin đăng', icon: List, path: '/adminmoigioi' },
    { name: 'Đăng tin mới', icon: PlusCircle, path: '/adminmoigioi/dang-tin' },
    { name: 'Quản lý tài chính', icon: CreditCard, path: '/adminmoigioi/money' },
    { name: 'Thông báo', icon: Bell, path: '/adminmoigioi/notifications' },
    { name: 'Cài đặt tài khoản', icon: User, path: '/adminmoigioi/profile' },
    { name: 'Về Trang chủ', icon: Home, path: '/' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="broker-admin">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
           <Link href="/" className="logo">BDSXXX</Link>
           <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
        </div>
        
        <nav className="nav">
           {navItems.map(item => (
             <Link 
               key={item.path} 
               href={item.path} 
               className={`nav-item ${pathname === item.path ? 'active' : ''}`}
             >
                <item.icon size={20} />
                <span>{item.name}</span>
             </Link>
           ))}
        </nav>

        <div className="sidebar-footer">
           <button onClick={handleLogout} className="btn-logout-v3">
              <LogOut size={20} />
              <span>Đăng xuất</span>
           </button>
        </div>
      </aside>

      <main className="main">
        <header className="top-nav">
           <button className="menu-trigger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
           </button>
           <div className="breadcrumb">Quản lý tin đăng</div>
           <div className="user-pill">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=32&q=80" alt="" />
              <span>Broker Admin</span>
           </div>
        </header>
        <div className="content">
           {children}
        </div>
      </main>

      <style jsx>{`
        .broker-admin { display: flex; min-height: 100vh; background: #f4f7f6; }
        
        .sidebar { width: 260px; background: #fff; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; transition: 0.3s; z-index: 1000; }
        .sidebar.closed { width: 0; overflow: hidden; border-right: none; }
        
        .sidebar-header { padding: 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-weight: 800; font-size: 1.5rem; color: #005B4B; text-decoration: none; }
        .mobile-close { display: none; background: transparent; border: none; }

        .nav { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; color: #666; font-weight: 600; text-decoration: none; transition: 0.2s; }
        .nav-item:hover { background: #f0faf8; color: #005B4B; }
        .nav-item.active { background: #005B4B; color: #fff; }

        .sidebar-footer { padding: 20px; border-top: 1px solid #f0f0f0; }
        .btn-logout-v3 { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px; border: none; background: #fff1f1; color: #f44336; border-radius: 10px; font-weight: 700; cursor: pointer; }

        .main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .top-nav { height: 64px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid #e0e0e0; }
        .menu-trigger { background: transparent; border: none; color: #666; cursor: pointer; }
        .user-pill { display: flex; align-items: center; gap: 10px; padding: 6px 12px; background: #f8fafc; border-radius: 30px; font-weight: 600; font-size: 0.85rem; border: 1px solid #e2e8f0; }
        .user-pill img { width: 24px; height: 24px; border-radius: 50%; }

        .content { padding: 32px; flex: 1; overflow-y: auto; }
        .loading { display: flex; align-items: center; justify-content: center; height: 100vh; font-weight: 700; color: #005B4B; }

        @media (max-width: 768px) {
           .sidebar { position: fixed; height: 100vh; left: -260px; }
           .sidebar.open { left: 0; width: 260px; }
           .mobile-close { display: block; }
        }
      `}</style>
    </div>
  );
}
