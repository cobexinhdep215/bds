'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Smartphone, User, Menu, FileText, Diamond, Wallet, LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth status via API since cookie is HttpOnly
    fetch('/api/auth/me')
      .then(res => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setShowUserMenu(false);
    router.push('/login');
  };

  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-left">
          <Link href="/" className="logo">
            <img src="/logo_bds.png" alt="BDSXXX" style={{ height: '32px' }} onError={(e) => e.currentTarget.src = 'https://img.icons8.com/color/48/005B4B/real-estate.png'} />
            <span className="logo-text">BDSXXX</span>
          </Link>
        </div>

        <div className="header-center">
          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm tin đăng, tin tức bất động sản" />
          </div>
        </div>

        <div className="header-right">
          <nav className="main-nav">
            <Link href="/can-ho-chung-cu" className="nav-link">Tìm nhà</Link>
            <Link href="/tin-tuc" className="nav-link">Tin tức</Link>
            <Link href="/vay-mua-nha" className="nav-link">Vay mua nhà</Link>
            <Link href="/moi-gioi" className="nav-link">Môi giới</Link>
            <Link href="/bang-gia" className="nav-link">Bảng giá</Link>
          </nav>
          
          <button className="btn-app">
            <Smartphone size={16} />
            Tải ứng dụng
          </button>
          
          <div className="user-dropdown-container">
            {isLoggedIn ? (
              <button className="btn-profile-logged" onClick={() => setShowUserMenu(!showUserMenu)}>
                 <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=40&q=40" alt="Avatar" />
              </button>
            ) : (
              <Link href="/login" className="btn-profile">
                <User size={20} />
              </Link>
            )}

            {showUserMenu && (
              <div className="user-dropdown-menu">
                 <div className="user-info-section">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=44&q=80" alt="Avatar" />
                    <div className="user-stats">
                       <span className="user-name">Admin</span>
                       <div className="stats-grid">
                          <span className="stat-item"><Diamond size={12} /> 0</span>
                          <span className="stat-item"><Wallet size={12} /> 0đ</span>
                       </div>
                    </div>
                 </div>
                 
                  <div className="menu-links">
                    <Link href="/admin" className="menu-link" onClick={() => setShowUserMenu(false)}>
                       <Shield size={18} />
                       <span>Quản lý hệ thống (Admin)</span>
                    </Link>
                    <Link href="/adminmoigioi" className="menu-link" onClick={() => setShowUserMenu(false)}>
                       <FileText size={18} />
                       <span>Quản lý quy trình (Môi giới)</span>
                    </Link>
                 </div>
                 
                 <div className="menu-footer">
                    <button onClick={handleLogout} className="btn-logout-full">
                       <LogOut size={18} />
                       <span>Đăng xuất</span>
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          height: 72px;
          border-bottom: 1px solid #f2f4f7;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 2000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          gap: 20px;
        }
        .header-left { flex-shrink: 0; }
        .logo { display: flex; align-items: center; gap: 8px; color: #005B4B; font-weight: 800; font-size: 1.4rem; }
        
        .header-center { flex: 1; max-width: 500px; }
        .header-search { border: 1px solid #eaecf0; background: #f9fafb; padding: 10px 16px; border-radius: 12px; display: flex; align-items: center; gap: 10px; }
        .header-search input { border: none; background: transparent; width: 100%; outline: none; font-size: 0.9rem; font-weight: 500; }
        .search-icon { color: #667085; }

        .header-right { display: flex; align-items: center; gap: 24px; }
        .main-nav { display: flex; gap: 16px; }
        .nav-link { font-weight: 600; font-size: 0.9rem; color: #101828; transition: 0.2s; white-space: nowrap; }
        .nav-link:hover { color: #005B4B; }
        
        .btn-app {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #005B4B;
          color: #fff;
          padding: 8px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          white-space: nowrap;
        }
        .btn-profile { color: #666; padding: 8px; border: 1px solid #eee; border-radius: 50%; }
        .btn-profile-logged { border: none; background: transparent; cursor: pointer; padding: 0; }
        .btn-profile-logged img { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #E8F5F1; }
        
        .user-dropdown-container { position: relative; }
        .user-dropdown-menu {
          position: absolute;
          top: 45px;
          right: 0;
          width: 240px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid #E0E0E0;
          overflow: hidden;
          animation: slideIn 0.2s ease;
        }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .user-info-section { display: flex; gap: 10px; padding: 12px; border-bottom: 1px solid #f0f0f0; align-items: center; }
        .user-info-section img { width: 40px; height: 40px; border-radius: 50%; }
        .user-name { font-weight: 700; font-size: 0.9rem; color: #333; display: block; }
        .stats-grid { display: flex; gap: 10px; font-size: 0.75rem; color: #666; }
        .stat-item { display: flex; align-items: center; gap: 2px; }

        .menu-links { padding: 4px 0; }
        .menu-links :global(.menu-link) { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #333; font-weight: 600; font-size: 0.85rem; text-decoration: none; }
        .menu-links :global(.menu-link):hover { background: #f9fafb; color: #005B4B; }

        .menu-footer { padding: 10px; border-top: 1px solid #f0f0f0; }
        .btn-logout-full { width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-weight: 600; color: #333; background: #fff; font-size: 0.85rem; }

        .btn-menu { display: none; }

        @media (max-width: 992px) {
          .main-nav { display: none; }
          .btn-menu { display: block; }
          .btn-app { display: none; }
        }
      `}</style>
    </header>
  );
};
