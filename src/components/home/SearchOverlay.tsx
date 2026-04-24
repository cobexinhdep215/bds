'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Search, MapPin, TrendingUp, ChevronRight } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClose();
      router.push('/can-ho-chung-cu');
    }
  };

  return (
    <div className="search-overlay">
      <div className="search-header">
        <div className="container header-inner">
          <div className="search-input-wrapper">
            <Search size={22} className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tin đăng, tin tức bất động sản" 
              autoFocus 
              onKeyDown={handleSearch}
            />
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="search-body container">
        <section className="search-section">
          <div className="section-header">
            <h3>Gợi ý dự án Nhà ở xã hội</h3>
            <Link href="/can-ho-chung-cu" className="btn-link" onClick={onClose}>Xem tất cả <ChevronRight size={16} /></Link>
          </div>
          <div className="suggestion-grid">
            {['Happy Home Nhơn Trạch', 'Smile Đông Anh', 'Nhà ở xã hội Tân Trường', 'Golden City'].map((name, i) => (
              <Link key={i} href="/can-ho-chung-cu" className="suggestion-card" onClick={onClose}>
                 <div className="card-thumb" style={{background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://picsum.photos/id/${i+20}/300/200)`}}>
                   <span className="card-name">{name}</span>
                 </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="search-section">
          <h3>Dự án phổ biến</h3>
          <div className="project-list">
            {[
              { name: 'Vinhomes Smart City', area: 'Nam Từ Liêm, Hà Nội' },
              { name: 'Vinhomes Ocean Park', area: 'Gia Lâm, Hà Nội' },
              { name: 'The Sapphire - Vinhomes Ocean Park', area: 'Gia Lâm, Hà Nội' },
              { name: 'The Sola Park - Vinhomes Smart City', area: 'Nam Từ Liêm, Hà Nội' }
            ].map((p, i) => (
              <Link key={i} href="/can-ho-chung-cu" className="project-item" onClick={onClose}>
                <div className="project-box">
                  <span className="project-name">{p.name}</span>
                  <span className="project-area">{p.area}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="search-section">
          <h3>Khu vực phổ biến</h3>
          <div className="area-grid">
            {['Nam Từ Liêm, Hà Nội', 'Hoàng Mai, Hà Nội', 'Hà Đông, Hà Nội', 'Cầu Giấy, Hà Nội'].map((area, i) => (
              <Link key={i} href="/can-ho-chung-cu" className="area-chip" onClick={onClose}>
                <MapPin size={18} />
                <span>{area}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #fff;
          z-index: 2000;
          overflow-y: auto;
        }
        .search-header {
          position: sticky;
          top: 0;
          background: #fff;
          border-bottom: 1px solid var(--border-color);
          padding: 16px 0;
          z-index: 10;
        }
        .header-inner {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--bg-alt);
          border-radius: 12px;
          padding: 4px 16px;
        }
        .search-input-wrapper input {
          border: none;
          background: transparent;
          width: 100%;
          height: 48px;
          outline: none;
          font-size: 1.1rem;
          margin-left: 12px;
        }
        .search-icon { color: var(--text-muted); }
        .btn-close { color: var(--text-primary); }

        .search-body {
          padding: 40px 16px;
        }
        .search-section {
          margin-bottom: 48px;
        }
        h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .section-header h3 { margin-bottom: 0; }
        .btn-link {
          color: var(--primary-color);
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .suggestion-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        .card-thumb {
          height: 120px;
          border-radius: 12px;
          background-size: cover;
          display: flex;
          align-items: flex-end;
          padding: 12px;
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .project-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .project-box {
          display: flex;
          flex-direction: column;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          transition: background 0.2s;
          cursor: pointer;
        }
        .project-box:hover { background: var(--bg-alt); }
        .project-name { font-weight: 600; }
        .project-area { font-size: 0.85rem; color: var(--text-secondary); }

        .area-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }
        .area-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--bg-alt);
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
