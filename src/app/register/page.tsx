'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } else {
      const data = await res.json();
      setError(data.error || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">HouseNow<span>Agent</span></div>
        <h1>Đăng ký Môi giới</h1>
        <p>Tham gia mạng lưới môi giới chuyên nghiệp nhất</p>

        {success ? (
          <div className="success-msg">Đăng ký thành công! Đang chuyển hướng...</div>
        ) : (
          <form onSubmit={handleRegister}>
            {error && <div className="error-msg">{error}</div>}
            <div className="input-group">
              <label>Họ và tên</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Số điện thoại</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Mật khẩu</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn-login">Đăng ký ngay</button>
          </form>
        )}

        <div className="footer-links">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </div>
      </div>

      <style jsx>{`
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f7f6; }
        .login-card { background: #fff; padding: 40px; border-radius: 16px; width: 100%; max-width: 440px; box-shadow: var(--shadow-md); }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); margin-bottom: 32px; }
        .logo span { color: var(--text-secondary); font-weight: 400; }
        h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
        p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 32px; }
        .input-group { margin-bottom: 20px; }
        label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; }
        input { width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; outline: none; }
        input:focus { border-color: var(--primary-color); }
        .btn-login { width: 100%; background: var(--primary-color); color: #fff; padding: 12px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; }
        .error-msg { background: #fee2e2; color: #ef4444; padding: 12px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 20px; }
        .success-msg { background: #d1fae5; color: #059669; padding: 20px; border-radius: 8px; text-align: center; font-weight: 600; }
        .footer-links { margin-top: 32px; text-align: center; font-size: 0.9rem; color: var(--text-secondary); }
        .footer-links a { color: var(--primary-color); font-weight: 700; }
      `}</style>
    </div>
  );
}
