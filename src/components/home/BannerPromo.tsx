import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const BannerPromo = () => {
  return (
    <section className="home-promo-section">
      {/* Left Promo */}
      <div className="promo-card promo-left">
        <div className="promo-card-content">
          <h3>Vay mua nhà cùng HouseNow</h3>
          <p>Khám phá các ưu đãi tốt nhất từ ngân hàng giúp bạn chạm đến tổ ấm mơ ước</p>
          <Link href="/vay-mua-nha" className="btn-promo">
            Tìm hiểu thêm <ExternalLink size={16} />
          </Link>
        </div>
        <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=300&q=80" alt="Vay mua nhà" className="promo-card-img" style={{ borderRadius: '50%', objectFit: 'cover', width: '140px', height: '140px' }} />
      </div>

      {/* Right Promo */}
      <div className="promo-card promo-right">
        <div className="promo-card-content">
          <h3>Tải ứng dụng HouseNow</h3>
          <p>Trải nghiệm trọn vẹn trên ứng dụng. Tải ngay trên App Store và Google Play.</p>
          <div className="qr-box">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://housenow.vn" alt="QR Code" className="qr-img" />
            <div className="store-badges">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
