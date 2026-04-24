'use client';
import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ListingManagement() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    router.push('/adminmoigioi');
  }, [router]);

  const tabs = [
    `Tất cả (${properties.length})`, 
    `Đang bán (${properties.filter(p => p.status === 'selling').length})`, 
    'Chờ duyệt (0)', 
    'Yêu cầu sửa (0)', 
    `Riêng tư (${properties.filter(p => p.status === 'private' || p.status === 'pending').length})`, 
    'Tin đã gỡ (0)'
  ];

  const filteredProperties = properties.filter(p => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return p.status === 'selling';
    if (activeTab === 4) return p.status === 'private';
    return false;
  });

  return (
    <div className="listing-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý Bất động sản</h1>
      </div>

      <div className="filter-tabs">
        {tabs.map((tab, i) => (
          <button 
            key={i} 
            className={`tab-item ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="property-list">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(p => (
            <div key={p.id} className="admin-property-card">
               <img src={p.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=100"} alt="Property" />
               <div className="card-info">
                  <h4>{p.title}</h4>
                  <p>{p.bedrooms} PN | {p.bathrooms} WC | {p.area} m²</p>
                  <div className="badges">
                     <span className={`badge-status ${p.status}`}>
                        {p.status === 'selling' ? 'Đang bán' : 'Riêng tư'}
                     </span>
                     <span className="price-tag">{p.price.toLocaleString('vi-VN')} đ</span>
                  </div>
               </div>
               <div className="card-actions">
                  <button className="btn-edit" onClick={() => router.push(`/admin/post-property?id=${p.id}`)}><Edit size={20} /> Chỉnh sửa</button>
                  <button className="btn-delete"><Trash2 size={20} /> Xóa</button>
               </div>
            </div>
          ))
        ) : (
          <div className="no-data">Không có tin đăng nào trong mục này.</div>
        )}
      </div>

      <div className="app-promo-banner mt-auto">
         <div className="promo-info">
            <h4>Quản lý dễ dàng qua app</h4>
            <p>Tải ngay ứng dụng HouseNow để nhận thông báo ngay khi có cập nhật về tin đăng và khách hàng</p>
         </div>
         <button className="btn-promo">Tìm hiểu thêm ↗</button>
      </div>

      <style jsx>{`
        .listing-management { display: flex; flex-direction: column; min-height: calc(100vh - 150px); }
        .page-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 32px; }

        .filter-tabs { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .tab-item {
          padding: 8px 16px;
          border-radius: 6px;
          background: #fff;
          border: 1px solid var(--border-color);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .tab-item.active { background: #E8F5F1; border-color: var(--primary-color); color: var(--primary-color); }

        .property-list { min-height: 400px; }
        .no-data { text-align: center; padding: 100px 0; color: #999; }

        .admin-property-card { 
          background: #fff;
          display: flex; 
          align-items: center; 
          gap: 20px; 
          padding: 24px; 
          border-radius: 12px; 
          border: 1px solid var(--border-color); 
          margin-bottom: 16px;
        }
        .admin-property-card img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; }
        .card-info { flex: 1; }
        .card-info h4 { font-weight: 700; margin-bottom: 4px; font-size: 1.1rem; }
        .card-info p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px; }
        .badges { display: flex; gap: 12px; align-items: center; }
        
        .badge-status { padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
        .badge-status.private { background: #f1f3f4; color: var(--text-secondary); }
        .badge-status.selling { background: #E8F5F1; color: var(--primary-color); }
        
        .price-tag { font-weight: 800; color: var(--primary-color); font-size: 1.1rem; }
        
        .card-actions { display: flex; gap: 24px; }
        .card-actions button { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.85rem; font-weight: 600; }
        .btn-edit { color: var(--primary-color); }
        .btn-delete { color: #f12c2c; }

        .mt-auto { margin-top: auto; }
        .app-promo-banner { background: var(--primary-color); color: #fff; padding: 24px 32px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-top: 40px; }
        .promo-info h4 { font-size: 1.2rem; margin-bottom: 4px; font-weight: 700; }
        .promo-info p { opacity: 0.8; font-size: 0.9rem; }
        .btn-promo { border: 1px solid rgba(255,255,255,0.4); padding: 10px 20px; border-radius: 8px; font-weight: 600; }

        @media (max-width: 768px) {
          .admin-property-card { flex-direction: column; align-items: flex-start; }
          .card-actions { width: 100%; justify-content: space-between; border-top: 1px solid #f0f0f0; padding-top: 16px; }
        }
      `}</style>
    </div>
  );
}
