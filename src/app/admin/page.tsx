'use client';
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Newspaper, 
  Home, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Thứ 2', visits: 400, listings: 24 },
  { name: 'Thứ 3', visits: 300, listings: 13 },
  { name: 'Thứ 4', visits: 200, listings: 98 },
  { name: 'Thứ 5', visits: 278, listings: 39 },
  { name: 'Thứ 6', visits: 189, listings: 48 },
  { name: 'Thứ 7', visits: 239, listings: 38 },
  { name: 'Chủ nhật', visits: 349, listings: 43 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
     brokers: 0,
     properties: 0,
     news: 0
  });

  useEffect(() => {
     // Fetch real counts from our data files (via API)
     Promise.all([
        fetch('/api/brokers').then(r => r.json()),
        fetch('/api/properties').then(r => r.json()),
        fetch('/api/news').then(r => r.json())
     ]).then(([brokers, properties, news]) => {
        setStats({
           brokers: Array.isArray(brokers) ? brokers.length : 0,
           properties: properties.pagination?.total || (Array.isArray(properties) ? properties.length : 0),
           news: Array.isArray(news) ? news.length : 0
        });
     }).catch(e => console.error("Stats error", e));
  }, []);

  const statCards = [
    { title: 'Tổng môi giới', value: stats.brokers, icon: Users, color: '#0ea5e9', trend: '+12%', up: true },
    { title: 'Tin đăng bất động sản', value: stats.properties, icon: Home, color: '#10b981', trend: '+5.4%', up: true },
    { title: 'Tin tức & Bài viết', value: stats.news, icon: Newspaper, color: '#f59e0b', trend: '-2.1%', up: false },
    { title: 'Lượt truy cập hôm nay', value: '1,284', icon: TrendingUp, color: '#6366f1', trend: '+18%', up: true },
  ];

  return (
    <div className="dashboard-v2">
      <div className="welcome-header">
         <h1>Chào mừng trở lại, Admin!</h1>
         <p>Dưới đây là thống kê tổng quan về hệ thống BDSXXX của bạn hôm nay.</p>
      </div>

      <div className="stats-grid-v2">
         {statCards.map((card, i) => (
           <div key={i} className="stat-card-v2">
              <div className="card-top">
                 <div className="icon-wrap" style={{ background: `${card.color}15`, color: card.color }}>
                    <card.icon size={24} />
                 </div>
                 <div className={`trend ${card.up ? 'up' : 'down'}`}>
                    {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {card.trend}
                 </div>
              </div>
              <div className="card-body">
                 <h3>{card.value}</h3>
                 <p>{card.title}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="charts-row">
         <div className="chart-box main-chart">
            <div className="chart-header">
               <h4>Biểu đồ tăng trưởng tin đăng</h4>
               <select>
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
               </select>
            </div>
            <div className="chart-canvas">
               <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#005B4B" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#005B4B" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                     <Tooltip />
                     <Area type="monotone" dataKey="listings" stroke="#005B4B" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="recent-activity">
            <h4>Hoạt động gần đây</h4>
            <div className="activity-list">
               {[
                  { user: 'Xuân', action: 'vừa đăng tin mới', time: '5 phút trước', icon: Home },
                  { user: 'Hùng', action: 'đăng ký môi giới mới', time: '12 phút trước', icon: Users },
                  { user: 'Admin', action: 'cập nhật tin tức thị trường', time: '1 giờ trước', icon: Newspaper },
                  { user: 'Minh', action: 'thanh toán gói tin VIP', time: '2 giờ trước', icon: TrendingUp },
               ].map((act, i) => (
                  <div key={i} className="activity-item">
                     <div className="act-icon"><act.icon size={16} /></div>
                     <div className="act-info">
                        <p><strong>{act.user}</strong> {act.action}</p>
                        <span><Clock size={12} /> {act.time}</span>
                     </div>
                  </div>
               ))}
            </div>
            <button className="btn-all-act">Xem tất cả hoạt động</button>
         </div>
      </div>

      <style jsx>{`
        .dashboard-v2 { display: flex; flex-direction: column; gap: 32px; }
        .welcome-header h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; color: #0f172a; }
        .welcome-header p { color: #64748b; font-size: 1rem; }

        .stats-grid-v2 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .stat-card-v2 { 
           background: #fff; 
           padding: 24px; 
           border-radius: 20px; 
           border: 1px solid #f1f5f9; 
           box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); 
        }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .trend { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
        .trend.up { background: #ecfdf5; color: #10b981; }
        .trend.down { background: #fef2f2; color: #ef4444; }
        
        .card-body h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; color: #0f172a; }
        .card-body p { font-size: 0.9rem; color: #64748b; font-weight: 600; }

        .charts-row { display: grid; grid-template-columns: 1fr 350px; gap: 32px; }
        .chart-box { background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .chart-header h4 { font-weight: 800; color: #0f172a; }
        .chart-header select { padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; outline: none; }

        .recent-activity { background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; }
        .recent-activity h4 { font-weight: 800; margin-bottom: 24px; color: #0f172a; }
        .activity-list { display: flex; flex-direction: column; gap: 20px; flex: 1; }
        .activity-item { display: flex; gap: 12px; }
        .act-icon { width: 32px; height: 32px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; flex-shrink: 0; }
        .act-info p { font-size: 0.85rem; margin-bottom: 4px; line-height: 1.4; }
        .act-info span { font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
        
        .btn-all-act { margin-top: 24px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: 700; color: #64748b; font-size: 0.85rem; cursor: pointer; }

        @media (max-width: 1200px) {
           .charts-row { grid-template-columns: 1fr; }
           .stats-grid-v2 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
