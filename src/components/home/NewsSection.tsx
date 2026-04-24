'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const NewsSection = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        // filter published and take 4
        const newsArray = Array.isArray(data) ? data : (data.news || []);
        const published = newsArray
          .filter((n: any) => n.status !== 'draft')
          .slice(0, 4);
        setNews(published);
      })
      .catch(err => console.error("Could not load news", err));
  }, []);

  // Mock data fitting the layout if no API connection
  const mockNews = [
    {
      id: "1",
      slug: "#",
      title: "Vinhomes tung chính sách lãi suất dưới 6% cố định suốt 5 năm khiến thị trường bất động sản chấn động",
      time: "Hôm qua",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"
    },
    {
      id: "2",
      slug: "#",
      title: "Thanh tra Chính phủ chỉ ra bất cập trong sử dụng 20% quỹ đất làm NOXH tại Hà Nội",
      time: "Hôm qua",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80"
    },
    {
      id: "3",
      slug: "#",
      title: "Mua nhà ở xã hội: Người cao tuổi có thể ủy quyền cho con cái nộp hồ sơ được không?",
      time: "Hôm kia",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"
    },
    {
      id: "4",
      slug: "#",
      title: "Hà Nội: Chuẩn bị thu hồi hơn 435ha đất để triển khai 2 đại dự án quy mô lịch sử",
      time: "4 ngày trước",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"
    }
  ];

  const displayNews = news.length > 0 ? news : mockNews;

  return (
    <section className="home-news-section">
      <div className="section-header-row">
        <div className="section-header-left">
          <h2>Tin tức</h2>
          <p>Cung cấp thông tin toàn diện về thị trường bất động sản</p>
        </div>
        <Link href="/tin-tuc">
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>

      <div className="news-split-layout">
        <div className="news-list-left">
          {displayNews.map((item) => {
            // Using a simple date if created_at is available, else mock string
            let timeLabel = item.time || "Gần đây";
            if (item.created_at) {
              const date = new Date(item.created_at);
              timeLabel = date.toLocaleDateString('vi-VN');
            }
            // Derive category slug if available
            const catSlug = typeof item.category === 'string' ? item.category : (item.category?.slug || 'tin-tuc');
            // Final path
            const itemPath = item.slug && item.slug !== '#' 
               ? `/tin-tuc/${catSlug}/${item.slug}` 
               : '/tin-tuc';

            return (
              <Link href={itemPath} key={item.id || item.slug} className="news-list-item">
                <img src={item.image} alt={item.title} />
                <div className="news-list-item-content">
                  <h3>{item.title}</h3>
                  <div className="news-list-item-meta">
                    <Clock size={12} />
                    <span>{timeLabel} • 5 phút đọc</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Cột Phải: Tin nổi bật */}
        <Link href="/tin-tuc" className="news-feature-right">
          <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80" alt="Feature" />
          <div className="news-feature-overlay"></div>
          <div className="feature-content">
            <span className="badge-sponsor">Tài trợ</span>
            <h3>Tọa độ an cư vàng tại TP.Hồ Chí Minh</h3>
          </div>
        </Link>
      </div>
    </section>
  );
};
