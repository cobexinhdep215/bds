import React from 'react';
import Link from 'next/link';

export const NOXHSection = () => {
  const mockNOXH = [
    { title: "Happy Home Nhơn Trạch", location: "Đồng Nai", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&q=80" },
    { title: "Smile Đông Anh - KĐT G19", location: "Thiên Lộc, Hà Nội", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
    { title: "Nhà ở xã hội Tân Trường", location: "Hải Phòng", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
    { title: "Golden City", location: "Phường 2, Tây Ninh", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
  ];

  return (
    <section className="home-noxh-section">
      <div className="section-header-row">
        <div className="section-header-left">
          <h2>Cơ hội an cư với dự án Nhà ở Xã hội !</h2>
        </div>
        <Link href="/can-ho-chung-cu">Xem tất cả →</Link>
      </div>

      <div className="noxh-grid">
        {mockNOXH.map((item, index) => (
          <Link key={index} href="/can-ho-chung-cu" className="noxh-card">
            <div className="badge-circle">{index + 1}</div>
            <img src={item.image} alt={item.title} />
            <div className="noxh-card-overlay"></div>
            <div className="noxh-card-content">
              <h3>{item.title}</h3>
              <p>{item.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
