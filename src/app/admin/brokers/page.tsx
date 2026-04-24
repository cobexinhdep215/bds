'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  ExternalLink,
  ChevronRight,
  Home
} from 'lucide-react';

export default function AdminBrokers() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
     Promise.all([
        fetch('/api/brokers').then(r => r.json()),
        fetch('/api/properties').then(r => r.json())
     ]).then(([bData, pData]) => {
        setBrokers(Array.isArray(bData) ? bData : []);
        setProperties(pData.properties || []);
        setIsLoading(false);
     });
  }, []);

  const getPropertyCount = (email: string) => {
     return properties.filter(p => p.broker?.email === email || (email === 'xuan@gmail.com' && p.authorId === 'xuân')).length;
  };

  const filtered = brokers.filter(b => 
     b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="brokers-admin-page">
      <div className="page-header">
         <div className="title-area">
            <h1>Quản lý Môi giới</h1>
            <p>Danh sách các nhà môi giới đã đăng ký và tin đăng của họ</p>
         </div>
      </div>

      <div className="list-filters-v2">
         <div className="search-box-v2">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Tìm môi giới theo tên, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="brokers-grid">
         {isLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton-card"></div>) : 
          filtered.map(broker => (
            <div key={broker.id} className="broker-admin-card">
               <div className="card-banner"></div>
               <div className="broker-main">
                  <img src={broker.avatar} alt={broker.name} className="broker-avatar" />
                  <div className="broker-primary">
                     <h3>{broker.name}</h3>
                     <span className="broker-status">Môi giới chuyên nghiệp</span>
                  </div>
               </div>
               
               <div className="broker-details">
                  <div className="detail-item">
                     <Mail size={16} />
                     <span>{broker.email}</span>
                  </div>
                  <div className="detail-item">
                     <Phone size={16} />
                     <span>{broker.phone}</span>
                  </div>
                  <div className="detail-item">
                     <Calendar size={16} />
                     <span>Tham gia: {new Date(broker.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
               </div>

               <div className="broker-stats-row">
                  <div className="stat-box">
                     <strong>{getPropertyCount(broker.email)}</strong>
                     <span>Tin đăng</span>
                  </div>
                  <div className="stat-box">
                     <strong>0</strong>
                     <span>Giao dịch</span>
                  </div>
               </div>

               <Link href={`/admin/brokers/${broker.email}`} className="btn-view-broker">
                  Xem chi tiết tin đăng
                  <ChevronRight size={18} />
               </Link>
            </div>
         ))}
      </div>

      <style jsx>{`
        .brokers-admin-page { display: flex; flex-direction: column; gap: 32px; }
        .page-header h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .page-header p { color: #64748b; }

        .list-filters-v2 { background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
        .search-box-v2 { 
           background: #f8fafc; 
           border: 1px solid #e2e8f0; 
           border-radius: 10px; 
           padding: 10px 16px; 
           display: flex; 
           align-items: center; 
           gap: 12px; 
           width: 400px;
        }
        .search-box-v2 input { border: none; background: transparent; flex: 1; outline: none; }

        .brokers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
        .broker-admin-card { 
           background: #fff; 
           border-radius: 20px; 
           border: 1px solid #f1f5f9; 
           overflow: hidden; 
           position: relative;
           transition: 0.3s;
        }
        .broker-admin-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .card-banner { height: 80px; background: linear-gradient(135deg, #005B4B, #00877a); }
        
        .broker-main { display: flex; flex-direction: column; align-items: center; margin-top: -40px; padding: 0 24px 20px 24px; text-align: center; border-bottom: 1px solid #f1f5f9; }
        .broker-avatar { width: 80px; height: 80px; border-radius: 50%; border: 4px solid #fff; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 12px; }
        .broker-primary h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; color: #0f172a; }
        .broker-status { font-size: 0.75rem; background: #f0fdf9; color: #005B4B; padding: 4px 10px; border-radius: 20px; font-weight: 700; }

        .broker-details { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
        .detail-item { display: flex; align-items: center; gap: 12px; color: #64748b; font-size: 0.85rem; }
        
        .broker-stats-row { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #f1f5f9; }
        .stat-box { padding: 16px; text-align: center; border-right: 1px solid #f1f5f9; }
        .stat-box:last-child { border-right: none; }
        .stat-box strong { display: block; font-size: 1.2rem; color: #0f172a; }
        .stat-box span { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

        .btn-view-broker { 
           display: flex; 
           align-items: center; 
           justify-content: center; 
           gap: 8px; 
           padding: 16px; 
           background: #f8fafc; 
           color: #005B4B; 
           font-weight: 700; 
           font-size: 0.9rem; 
           text-decoration: none;
           transition: 0.2s;
        }
        .btn-view-broker:hover { background: #005B4B; color: #fff; }

        .skeleton-card { height: 400px; background: #f1f5f9; border-radius: 20px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
