import React from 'react';
import Link from 'next/link';

export const ProjectsSection = () => {
  const mockProjects = [
    { id: 1, title: 'Vinhomes Smart City', price: 'từ 50 triệu/m²', views: '1.7k lượt quan tâm', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=80' },
    { id: 2, title: 'Vinhomes Grand Park', price: 'từ 40 triệu/m²', views: '337 lượt quan tâm', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80' },
    { id: 3, title: 'Imperia Smart City', price: 'từ 88 triệu/m²', views: '261 lượt quan tâm', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80' },
    { id: 4, title: 'Vinhomes Ocean Park', price: 'từ 32 triệu/m²', views: '899 lượt quan tâm', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=80' },
    { id: 5, title: 'The Sola Park - Vinhomes Smart City', price: 'từ 73 triệu/m²', views: '286 lượt quan tâm', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=200&q=80' },
    { id: 6, title: 'Goldmark City', price: 'từ 54 triệu/m²', views: '247 lượt quan tâm', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=80' },
    { id: 7, title: 'The Sapphire - Vinhomes Ocean Park', price: 'từ 58 triệu/m²', views: '530 lượt quan tâm', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200&q=80' },
    { id: 8, title: 'The Sapphire - Vinhomes Smart City', price: 'từ 85 triệu/m²', views: '266 lượt quan tâm', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&q=80' },
    { id: 9, title: 'Phân khu The Zurich - Vinhomes Ocean Park', price: 'từ 60 triệu/m²', views: '237 lượt quan tâm', image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=200&q=80' },
  ];

  return (
    <section className="home-projects-section">
      <div className="projects-container">
        <div className="projects-header">
          <h2>Dự án nổi bật</h2>
          <p>Top các dự án được tìm kiếm nhiều nhất trong tháng</p>
        </div>
        
        <div className="projects-grid">
          {mockProjects.map(proj => (
            <Link key={proj.id} href="/can-ho-chung-cu" className="project-card-h">
              <img src={proj.image} alt={proj.title} />
              <div className="project-card-h-info">
                <h3>{proj.title}</h3>
                <span className="p-price">{proj.price}</span>
                <span className="p-views">{proj.views}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
