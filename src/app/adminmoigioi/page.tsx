'use client';
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BrokerListingManagement() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get current logged in user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => {
        if (user.id) {
          setUserId(user.id);
          // 2. Fetch properties for this broker
          fetch(`/api/properties?brokerId=${user.id}&limit=100`)
            .then(res => res.json())
            .then(data => {
              setProperties(data.properties || []);
            });
        }
      });
  }, []);

  const tabs = [
    `Tất cả (${properties.length})`, 
    `Đang bán (${properties.filter(p => p.status === 'selling').length})`, 
    'Chờ duyệt (0)', 
    `Riêng tư (${properties.filter(p => p.status === 'private' || p.status === 'pending').length})`, 
  ];

  const filteredProperties = properties.filter(p => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return p.status === 'selling';
    if (activeTab === 3) return p.status === 'private';
    return false;
  });

  return (
    <div className="listing-management">
      <div className="page-header-moigioi">
         <div>
            <h1 className="page-title">Quản lý Tin đăng</h1>
            <p>Tại đây bạn có thể quản lý tất cả các bất động sản đang đăng của mình.</p>
         </div>
         <Link href="/adminmoigioi/dang-tin" className="btn-add-new">
            <Plus size={20} />
            Đăng tin mới
         </Link>
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
                  <button className="btn-edit" onClick={() => router.push(`/adminmoigioi/dang-tin?id=${p.id}`)}><Edit size={20} /> Chỉnh sửa</button>
                  <button className="btn-delete"><Trash2 size={20} /> Xóa</button>
               </div>
            </div>
          ))
        ) : (
          <div className="no-data">Không có tin đăng nào trong mục này.</div>
        )}
      </div>

      <style jsx>{`
        .listing-management { display: flex; flex-direction: column; }
        .page-header-moigioi { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .page-title { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; color: #1e293b; }
        .page-header-moigioi p { color: #64748b; font-size: 0.95rem; }
        
        .btn-add-new { background: #005B4B; color: #fff; padding: 12px 24px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; text-decoration: none; transition: 0.2s; }
        .btn-add-new:hover { background: #004438; transform: translateY(-2px); }

        .filter-tabs { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .tab-item {
          padding: 10px 20px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #e2e8f0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
        }
        .tab-item.active { background: #E8F5F1; border-color: #005B4B; color: #005B4B; }

        .admin-property-card { 
           background: #fff;
           display: flex; 
           align-items: center; 
           gap: 24px; 
           padding: 20px; 
           border-radius: 16px; 
           border: 1px solid #e2e8f0; 
           margin-bottom: 16px;
           transition: 0.3s;
        }
        .admin-property-card:hover { border-color: #005B4B; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .admin-property-card img { width: 140px; height: 90px; object-fit: cover; border-radius: 12px; }
        .card-info { flex: 1; }
        .card-info h4 { font-weight: 700; margin-bottom: 6px; font-size: 1.1rem; color: #1e293b; }
        .card-info p { font-size: 0.85rem; color: #64748b; margin-bottom: 12px; }
        .badges { display: flex; gap: 16px; align-items: center; }
        
        .badge-status { padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
        .badge-status.private { background: #f1f5f9; color: #64748b; }
        .badge-status.selling { background: #ecfdf5; color: #10b981; }
        
        .price-tag { font-weight: 800; color: #005B4B; font-size: 1.1rem; }
        
        .card-actions { display: flex; gap: 20px; }
        .card-actions button { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700; border: none; background: transparent; cursor: pointer; }
        .btn-edit { color: #005B4B; }
        .btn-delete { color: #ef4444; }
        
        .no-data { text-align: center; padding: 100px 0; color: #94a3b8; font-weight: 500; font-style: italic; }
      `}</style>
    </div>
  );
}
