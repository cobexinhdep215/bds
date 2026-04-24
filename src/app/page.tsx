'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { SearchOverlay } from '@/components/home/SearchOverlay';
import { NewsSection } from '@/components/home/NewsSection';
import { PropertyCard } from '@/components/common/PropertyCard';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { NOXHSection } from '@/components/home/NOXHSection';
import { LoanCalculatorSection } from '@/components/home/LoanCalculatorSection';
import { BannerPromo } from '@/components/home/BannerPromo';
import Link from 'next/link';
import './home.css';

const formatPrice = (price: number) => {
  if (!price) return 'Đang cập nhật';
  if (price >= 1000000000) {
    return (price / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ';
  }
  if (price >= 1000000) {
    return (price / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' triệu';
  }
  return price.toLocaleString('vi-VN') + ' đ';
};

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/properties?limit=4')
      .then(res => res.json())
      .then(data => {
        setProperties(data.properties || []);
      });
  }, []);

  return (
    <main className="home-main">
      <Header />
      <Hero onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* News Section */}
      <NewsSection />

      {/* Featured Properties */}
      <section className="home-props-section">
        <div className="section-header-row" style={{ marginTop: '40px' }}>
          <div className="section-header-left">
            <h2>Tin đăng đề xuất</h2>
            <p>Bạn có thể kết hợp bộ lọc để tìm kiếm nâng cao trong trang tìm kiếm</p>
          </div>
          <Link href="/can-ho-chung-cu">Xem tất cả →</Link>
        </div>

        <div className="prop-grid-4">
          {properties.map(p => (
            <PropertyCard key={p.id} property={{
              ...p,
              price: formatPrice(p.price),
              area: Math.round(p.price / (p.area || 1) / 1000000).toLocaleString('vi-VN') + ' triệu/m²',
              location: `${p.district ? p.district + ', ' : ''}${p.province}`,
              image: p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
              beds: parseInt(p.bedrooms) || 0,
              baths: parseInt(p.bathrooms) || 0,
              size: p.area
            } as any} />
          ))}
        </div>
        
        <Link href="/can-ho-chung-cu" className="btn-load-more">Xem thêm ⏷</Link>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      {/* NOXH Section */}
      <NOXHSection />

      {/* Loan Section */}
      <LoanCalculatorSection />

      {/* Banner Promo */}
      <BannerPromo />

      {/* Detailed SEO Footer */}
      <section className="seo-footer-links container">
         <div className="seo-group">
            <h3>Bất động sản theo khu vực</h3>
            <div className="seo-links">
               {['Căn hộ chung cư Hà Nội', 'Căn hộ chung cư TP.HCM', 'Căn hộ chung cư Đà Nẵng', 'Càn hồ chung cư Bình Dương', 'Căn hộ chung cư Nam Từ Liêm', 'Căn hộ chung cư Gia Lâm', 'Căn hộ chung cư Cầu Giấy', 'Căn hộ chung cư Quận 7'].map(link => <Link key={link} href="/can-ho-chung-cu">{link}</Link>)}
            </div>
         </div>
         <div className="seo-group">
            <h3>Dự án tiêu biểu</h3>
            <div className="seo-links">
               {['Vinhomes Smart City', 'Vinhomes Ocean Park', 'Imperia Smart City', 'Masteri West Heights', 'The Sola Park', 'Lumiere EverGreen'].map(link => <Link key={link} href="/can-ho-chung-cu">{link}</Link>)}
            </div>
         </div>
      </section>

      <footer className="footer-v2">
        <div className="container">
           <div className="footer-top">
              <div className="footer-brand">
                 <h2 className="logo-white">BDSXXX</h2>
                 <p>Hệ sinh thái bất động sản hàng đầu Việt Nam. Cung cấp dữ liệu chính xác, minh bạch và giải pháp tài chính toàn diện.</p>
                 <div className="contact-info">
                    <span>Hotline: 1900 1234</span>
                    <span>Email: support@bdsxxx.com</span>
                 </div>
              </div>
              <div className="footer-nav-group">
                 <h4>Dịch vụ</h4>
                 <ul>
                    <li><Link href="/can-ho-chung-cu">Tìm nhà</Link></li>
                    <li><Link href="/tin-tuc">Tin tức</Link></li>
                    <li><Link href="/vay-mua-nha">Vay mua nhà</Link></li>
                    <li><Link href="/moi-gioi">Môi giới</Link></li>
                 </ul>
              </div>
              <div className="footer-nav-group">
                 <h4>Công ty</h4>
                 <ul>
                    <li>Về chúng tôi</li>
                    <li>Liên hệ</li>
                    <li>Chính sách bảo mật</li>
                    <li>Điều khoản dịch vụ</li>
                 </ul>
              </div>
           </div>
           <div className="footer-bottom">
              <p>© 2026 BDSXXX. Tất cả quyền được bảo lưu.</p>
           </div>
        </div>
      </footer>

      <style jsx>{`
        .featured-listings { padding: 60px 20px; }
        .section-header-v2 { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .section-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; color: #101828; }
        .section-subtitle { color: #667085; font-size: 0.95rem; }
        .btn-text-v2 { color: #005B4B; font-weight: 700; font-size: 0.95rem; }
        
        .property-grid-v2 { 
           display: grid; 
           grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
           gap: 24px; 
        }

        .seo-footer-links { padding: 40px 20px; border-top: 1px solid #eaecf0; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .seo-group h3 { font-size: 1rem; font-weight: 800; margin-bottom: 24px; color: #101828; }
        .seo-links { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .seo-links :global(a) { font-size: 0.85rem; color: #667085; transition: 0.2s; }
        .seo-links :global(a):hover { color: #005B4B; }

        .footer-v2 { background: #002B24; color: #fff; padding: 80px 0 40px 0; }
        .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
        .logo-white { font-weight: 800; margin-bottom: 24px; }
        .footer-brand p { font-size: 0.95rem; opacity: 0.7; line-height: 1.6; margin-bottom: 24px; }
        .contact-info { display: flex; flex-direction: column; gap: 8px; font-weight: 600; opacity: 0.9; }
        
        .footer-nav-group h4 { font-weight: 800; margin-bottom: 32px; font-size: 1.1rem; }
        .footer-nav-group ul { list-style: none; padding: 0; }
        .footer-nav-group ul li { margin-bottom: 16px; font-size: 0.95rem; opacity: 0.7; }
        
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px; text-align: center; font-size: 0.85rem; opacity: 0.5; }

        @media (max-width: 992px) {
           .footer-top { grid-template-columns: 1fr; gap: 40px; }
           .seo-footer-links { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
