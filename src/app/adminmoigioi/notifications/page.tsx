'use client';
import React from 'react';
import { Bell, Clock, CheckCircle, Info } from 'lucide-react';

export default function BrokerNotifications() {
  const notifs = [
    { id: 1, type: 'success', title: 'Tin đăng của bạn đã được duyệt', time: '2 giờ trước', desc: 'Căn hộ Vinhomes Smart City của bạn hiện đã hiển thị trên hệ thống.' },
    { id: 2, type: 'info', title: 'Hết hạn tin VIP', time: 'Hôm qua', desc: 'Tin đăng "Masteri West Heights" sẽ hết hạn VIP sau 24h tới.' },
    { id: 3, type: 'info', title: 'Cập nhật chính sách mới', time: '2 ngày trước', desc: 'Chúng tôi vừa cập nhật điều khoản về phí đăng tin mới.' },
  ];

  return (
    <div className="notif-page">
       <div className="notif-header">
          <h1>Thông báo</h1>
          <p>Luôn cập nhật những tin tức mới nhất về tin đăng và tài khoản của bạn.</p>
       </div>

       <div className="notif-list">
          {notifs.map(n => (
             <div key={n.id} className="notif-item">
                <div className={`n-icon ${n.type}`}>
                   {n.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                </div>
                <div className="n-content">
                   <div className="n-top">
                      <h4>{n.title}</h4>
                      <span className="n-time"><Clock size={12} /> {n.time}</span>
                   </div>
                   <p>{n.desc}</p>
                </div>
             </div>
          ))}
       </div>

       <style jsx>{`
         .notif-page { display: flex; flex-direction: column; gap: 32px; }
         .notif-header h1 { font-size: 1.8rem; font-weight: 800; }
         
         .notif-list { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; }
         .notif-item { display: flex; gap: 20px; padding: 24px; border-bottom: 1px solid #f1f5f9; transition: 0.2s; cursor: pointer; }
         .notif-item:hover { background: #f8fafc; }
         .notif-item:last-child { border-bottom: none; }
         
         .n-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
         .n-icon.success { background: #ecfdf5; color: #10b981; }
         .n-icon.info { background: #eff6ff; color: #3b82f6; }
         
         .n-content { flex: 1; }
         .n-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
         .n-top h4 { font-weight: 800; color: #1e293b; font-size: 1rem; }
         .n-time { font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
         .n-content p { font-size: 0.9rem; color: #64748b; line-height: 1.5; margin: 0; }
       `}</style>
    </div>
  );
}
