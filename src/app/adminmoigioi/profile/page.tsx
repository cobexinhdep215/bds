'use client';
import React from 'react';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';

export default function BrokerProfile() {
  return (
    <div className="profile-page">
       <div className="profile-header">
          <h1>Cài đặt tài khoản</h1>
          <p>Quản lý thông tin cá nhân và hồ sơ môi giới của bạn.</p>
       </div>

       <div className="profile-card-v2">
          <div className="avatar-section">
             <div className="avatar-wrap">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" alt="Avatar" />
                <button className="btn-change-avatar"><Camera size={18} /></button>
             </div>
             <h3>Môi giới chuyên nghiệp</h3>
          </div>

          <form className="profile-form">
             <div className="form-grid">
                <div className="f-group">
                   <label>Họ và tên</label>
                   <input type="text" defaultValue="Broker Admin" />
                </div>
                <div className="f-group">
                   <label>Số điện thoại</label>
                   <input type="text" defaultValue="0988 888 888" />
                </div>
                <div className="f-group">
                   <label>Email</label>
                   <input type="email" defaultValue="broker@bdsxxx.com" />
                </div>
                <div className="f-group">
                   <label>Địa chỉ</label>
                   <input type="text" defaultValue="Hà Nội, Việt Nam" />
                </div>
             </div>
             <button type="submit" className="btn-save-p">Lưu thay đổi</button>
          </form>
       </div>

       <style jsx>{`
         .profile-page { display: flex; flex-direction: column; gap: 32px; }
         .profile-header h1 { font-size: 1.8rem; font-weight: 800; }
         
         .profile-card-v2 { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 40px; display: grid; grid-template-columns: 240px 1fr; gap: 60px; }
         
         .avatar-section { text-align: center; }
         .avatar-wrap { position: relative; width: 150px; height: 150px; margin: 0 auto 20px auto; }
         .avatar-wrap img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid #f0faf8; }
         .btn-change-avatar { position: absolute; bottom: 5px; right: 5px; background: #005B4B; color: #fff; border: none; padding: 10px; border-radius: 50%; cursor: pointer; }
         
         .profile-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
         .f-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 8px; }
         .f-group input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; }
         .f-group input:focus { border-color: #005B4B; }
         
         .btn-save-p { background: #005B4B; color: #fff; border: none; padding: 12px 32px; border-radius: 10px; font-weight: 700; cursor: pointer; }

         @media (max-width: 900px) {
            .profile-card-v2 { grid-template-columns: 1fr; gap: 40px; }
            .profile-form .form-grid { grid-template-columns: 1fr; }
         }
       `}</style>
    </div>
  );
}
