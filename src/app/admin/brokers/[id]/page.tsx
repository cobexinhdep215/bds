'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertyCard } from '@/components/common/PropertyCard';
import { ArrowLeft, User, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminBrokerDetail() {
  const params = useParams();
  const router = useRouter();
  const email = params.id as string;
  const decodedEmail = decodeURIComponent(email);

  const [broker, setBroker] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     Promise.all([
        fetch('/api/brokers').then(r => r.json()),
        fetch('/api/properties').then(r => r.json())
     ]).then(([bData, pData]) => {
        const found = bData.find((b: any) => b.email === decodedEmail);
        setBroker(found);
        
        const allProps = pData.properties || [];
        // Filter by broker email or authorId (for Xuân case)
        const filtered = allProps.filter((p: any) => 
           p.broker?.email === decodedEmail || 
           (decodedEmail === 'xuan@gmail.com' && p.authorId === 'xuân')
        );
        setProperties(filtered);
        setIsLoading(false);
     });
  }, [decodedEmail]);

  if (isLoading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="broker-detail-page">
      <div className="page-header">
         <button className="btn-back" onClick={() => router.back()}>
            <ArrowLeft size={20} />
            Quay lại danh sách
         </button>
      </div>

      <div className="detail-grid">
         <aside className="profile-sidebar">
            <div className="profile-card">
               <img src={broker?.avatar} alt={broker?.name} className="avatar-large" />
               <h2>{broker?.name}</h2>
               <span className="badge-expert">Môi giới cấp cao</span>
               
               <div className="contact-list">
                  <div className="c-item"><Mail size={16} /> {broker?.email}</div>
                  <div className="c-item"><Phone size={16} /> {broker?.phone}</div>
               </div>
               
               <button className="btn-edit-profile">Chỉnh sửa hồ sơ</button>
            </div>
            
            <div className="stats-mini">
               <div className="mini-card">
                  <strong>{properties.length}</strong>
                  <span>Tin đăng</span>
               </div>
               <div className="mini-card">
                  <strong>0</strong>
                  <span>Ghi chú</span>
               </div>
            </div>
         </aside>

         <main className="listing-area">
            <div className="listing-header">
               <h3>Danh sách tin đăng của {broker?.name}</h3>
               <span>Hiển thị {properties.length} tin đăng</span>
            </div>
            
            <div className="property-grid-admin">
               {properties.length > 0 ? properties.map(p => (
                  <PropertyCard key={p.id} property={{
                    ...p,
                    price: p.price.toLocaleString('vi-VN') + ' đ',
                    area: Math.round(p.price / (p.area || 1)).toLocaleString('vi-VN') + ' đ/m²',
                    location: `${p.district ? p.district + ', ' : ''}${p.province}`,
                    image: p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                    beds: parseInt(p.bedrooms) || 0,
                    baths: parseInt(p.bathrooms) || 0,
                    size: p.area
                  } as any} />
               )) : (
                  <div className="empty-state">
                     <p>Môi giới này chưa có tin đăng nào.</p>
                  </div>
               )}
            </div>
         </main>
      </div>

      <style jsx>{`
        .broker-detail-page { display: flex; flex-direction: column; gap: 32px; }
        .btn-back { display: flex; align-items: center; gap: 8px; background: transparent; border: none; font-weight: 700; color: #64748b; cursor: pointer; }
        
        .detail-grid { display: grid; grid-template-columns: 320px 1fr; gap: 40px; align-items: flex-start; }
        
        .profile-card { background: #fff; border-radius: 24px; padding: 32px; text-align: center; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .avatar-large { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 4px solid #f8fafc; }
        h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; color: #0f172a; }
        .badge-expert { font-size: 0.75rem; background: #005B4B; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: 700; }
        
        .contact-list { margin: 32px 0; display: flex; flex-direction: column; gap: 16px; text-align: left; }
        .c-item { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: #64748b; }
        
        .btn-edit-profile { width: 100%; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700; color: #475569; cursor: pointer; }
        
        .stats-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
        .mini-card { background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; text-align: center; }
        .mini-card strong { display: block; font-size: 1.2rem; color: #0f172a; }
        .mini-card span { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

        .listing-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .listing-header h3 { font-size: 1.2rem; font-weight: 800; }
        .listing-header span { font-size: 0.9rem; color: #64748b; font-weight: 600; }
        
        .property-grid-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .empty-state { grid-column: 1/-1; padding: 100px; text-align: center; border: 2px dashed #e2e8f0; border-radius: 20px; color: #94a3b8; }
        
        .loading { padding: 100px; text-align: center; font-weight: 700; color: #005B4B; }

        @media (max-width: 1024px) {
           .detail-grid { grid-template-columns: 1fr; }
           .profile-sidebar { order: 2; }
           .listing-area { order: 1; }
        }
      `}</style>
    </div>
  );
}
