'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/adminmoigioi');
    } else {
      const data = await res.json();
      setError(data.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">HouseNow<span>Agent</span></div>
        <h1>Đăng nhập Môi giới</h1>
        <p>Chào mừng bạn trở lại hệ thống quản lý tin đăng</p>

        <form onSubmit={handleLogin}>
          {error && <div className="error-msg">{error}</div>}
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-login">
            <LogIn size={18} /> Đăng nhập
          </button>
        </form>

        <div className="footer-links">
          Chưa có tài khoản? <Link href="/register">Đăng ký môi giới</Link>
        </div>
      </div>

      <style jsx>{`
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f7f6; }
        .login-card { background: #fff; padding: 40px; border-radius: 16px; width: 100%; max-width: 400px; box-shadow: var(--shadow-md); }
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
        .footer-links { margin-top: 32px; text-align: center; font-size: 0.9rem; color: var(--text-secondary); }
        .footer-links a { color: var(--primary-color); font-weight: 700; }
      `}</style>
    </div>
  );
}
