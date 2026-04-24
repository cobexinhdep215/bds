'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Users, BarChart3, Play, Edit, Trash2 } from 'lucide-react';

const chartData = [
  { name: '16 thg 04', value: 0 },
  { name: '18 thg 04', value: 3 },
  { name: '20 thg 04', value: 2 },
  { name: '22 thg 04', value: 5 },
];

const STAT_CARDS = [
  { title: 'Lượt tiếp cận khách hàng', value: '0', icon: Users, color: '#8884d8' },
  { title: 'Lượt tương tác khách hàng', value: '0', icon: BarChart3, color: '#3498db' },
  { title: 'Lượt xem video', value: '0', icon: Play, color: '#27ae60' },
];

export default function Dashboard() {
  const router = React.useMemo(() => {
    if (typeof window !== 'undefined') {
       window.location.href = '/adminmoigioi';
    }
    return null;
  }, []);

  return (
    <div className="dashboard">
      <h1 className="page-title">Tổng quan</h1>

      <div className="stats-grid">
        {STAT_CARDS.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
               <stat.icon size={20} color={stat.color} />
               <span>{stat.title}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="chart-mini">
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="value" stroke={stat.color} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-labels">
                <span>16 thg 04</span>
                <span>22 thg 04</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="property-management-section">
        <h3>Quản lý bất động sản</h3>
        <div className="admin-property-card">
           <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=100" alt="Property" />
           <div className="card-info">
              <h4>Căn hộ 97 Láng Hạ, 2 PN 60 m²</h4>
              <p>2 PN | 2 WC | 60 m²</p>
              <div className="badges">
                 <span className="badge-private">Riêng tư</span>
                 <span className="price-tag">7 tỷ</span>
              </div>
           </div>
           <div className="card-actions">
              <button className="btn-edit"><Edit size={20} /> Chỉnh sửa</button>
              <button className="btn-delete"><Trash2 size={20} /> Xóa</button>
           </div>
        </div>
      </div>

      <div className="app-promo-banner">
         <div className="promo-info">
            <h4>Quản lý dễ dàng qua app</h4>
            <p>Tải ngay ứng dụng HouseNow để nhận thông báo ngay khi có cập nhật về tin đăng và khách hàng</p>
         </div>
         <button className="btn-promo">Tìm hiểu thêm ↗</button>
      </div>

      <style jsx>{`
        .page-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 24px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .stat-card { background: #fff; padding: 24px; border-radius: 12px; border: 1px solid var(--border-color); }
        .stat-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-weight: 600; color: var(--text-secondary); }
        .stat-value { font-size: 2rem; font-weight: 800; margin-bottom: 16px; }
        .chart-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 8px; }

        .property-management-section { background: #fff; padding: 24px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 40px; }
        .property-management-section h3 { font-size: 1.2rem; margin-bottom: 24px; font-weight: 700; }
        
        .admin-property-card { display: flex; align-items: center; gap: 20px; padding: 16px; border-radius: 12px; border: 1px solid #f0f0f0; }
        .admin-property-card img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; }
        .card-info { flex: 1; }
        .card-info h4 { font-weight: 700; margin-bottom: 4px; }
        .card-info p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px; }
        .badges { display: flex; gap: 12px; align-items: center; }
        .badge-private { background: #f1f3f4; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; color: var(--text-secondary); }
        .price-tag { font-weight: 800; color: var(--primary-color); }
        
        .card-actions { display: flex; gap: 16px; }
        .card-actions button { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; }
        .btn-edit { color: var(--primary-color); }
        .btn-delete { color: #f12c2c; }

        .app-promo-banner { background: var(--primary-color); color: #fff; padding: 24px 32px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .promo-info h4 { font-size: 1.2rem; margin-bottom: 4px; font-weight: 700; }
        .promo-info p { opacity: 0.8; font-size: 0.9rem; }
        .btn-promo { border: 1px solid rgba(255,255,255,0.4); padding: 10px 20px; border-radius: 8px; font-weight: 600; }

        @media (max-width: 992px) {
          .stats-grid { grid-template-columns: 1fr; }
          .admin-property-card { flex-direction: column; align-items: flex-start; }
          .app-promo-banner { flex-direction: column; gap: 20px; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
