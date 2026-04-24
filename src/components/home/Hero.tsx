'use client';
import React from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  onOpenSearch: () => void;
}

export const Hero = ({ onOpenSearch }: HeroProps) => {
  return (
    <section className="hero-wrapper">
      <div className="hero-bg-curve">
        <div className="hero-content">
          <h1>
            Kết nối toàn bộ hành trình mua nhà<br />
            tại Hà Nội và TP. Hồ Chí Minh<br />
            <span style={{
              display: 'inline-block',
              background: '#fff',
              color: '#005B4B',
              padding: '4px 20px',
              borderRadius: '30px',
              marginTop: '12px'
            }}>trên một nền tảng</span>
          </h1>
          <p className="subtitle">Ứng dụng công nghệ Bất động sản hàng đầu Việt Nam</p>
        </div>
      </div>

      <div className="hero-search-box" onClick={onOpenSearch}>
        <Search size={22} color="#64748b" style={{ marginRight: '12px' }} />
        <input type="text" placeholder="Tìm kiếm tin đăng, tin tức bất động sản" readOnly />
        <button className="btn-search">Tìm kiếm</button>
      </div>

      <div className="quick-menu-grid">
        <Link href="/can-ho-chung-cu" className="quick-menu-card">
          <img src="https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=80" alt="Tìm nhà" className="quick-menu-icon" />
          <h3>Tìm nhà</h3>
          <p>25,000+ căn hộ</p>
        </Link>
        <Link href="/tin-tuc" className="quick-menu-card green">
          <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80" alt="Tin tức" className="quick-menu-icon" />
          <h3>Tin tức</h3>
          <p>Tin tức BDS cùng HouseNow</p>
        </Link>
        {/* <Link href="/vay-mua-nha" className="quick-menu-card">
          <img src="https://images.unsplash.com/photo-1621210874535-654cb255d60f?w=400&q=80" alt="Vay mua nhà" className="quick-menu-icon" />
          <h3>Vay mua nhà</h3>
          <p>Vay cùng HouseNow</p>
        </Link>
        <Link href="/moi-gioi" className="quick-menu-card">
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=400&q=80" alt="Môi giới" className="quick-menu-icon" />
          <h3>Môi giới</h3>
          <p>45,000+ khách tiềm năng</p>
        </Link> */}
        <Link href="/du-an" className="quick-menu-card">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" alt="Dự án NOXH" className="quick-menu-icon" />
          <h3>Dự án NOXH</h3>
          <p>Cơ hội an cư, chi phí hợp lý</p>
        </Link>
      </div>
    </section>
  );
};
