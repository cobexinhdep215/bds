'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin@123') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
           <div className="brand-icon">B</div>
           <h2>BDSXXX Admin</h2>
           <p>Vui lòng đăng nhập để quản lý hệ thống</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
           {error && <div className="error-alert">{error}</div>}
           
           <div className="form-group">
              <label>Tài khoản</label>
              <div className="input-box">
                 <Mail size={18} className="icon" />
                 <input 
                   type="text" 
                   value={username} 
                   onChange={(e) => setUsername(e.target.value)} 
                   placeholder="Tên đăng nhập" 
                   required
                 />
              </div>
           </div>

           <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-box">
                 <Lock size={18} className="icon" />
                 <input 
                   type={showPassword ? 'text' : 'password'} 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
                   placeholder="********" 
                   required
                 />
                 <button 
                   type="button" 
                   className="btn-show" 
                   onClick={() => setShowPassword(!showPassword)}
                 >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
           </div>

           <button type="submit" className="btn-login">Đăng nhập ngay</button>
        </form>

        <div className="login-footer">
           <a href="/">Quay về trang chủ</a>
        </div>
      </div>

      <style jsx>{`
        .login-page { 
           height: 100vh; 
           display: flex; 
           align-items: center; 
           justify-content: center; 
           background: #0f172a; 
           padding: 20px;
        }
        .login-card { 
           width: 100%; 
           max-width: 400px; 
           background: #fff; 
           border-radius: 20px; 
           padding: 40px; 
           box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .login-header { text-align: center; margin-bottom: 32px; }
        .brand-icon { 
           width: 48px; 
           height: 48px; 
           background: #005B4B; 
           color: #fff; 
           font-weight: 800; 
           font-size: 1.5rem; 
           display: flex; 
           align-items: center; 
           justify-content: center; 
           border-radius: 12px; 
           margin: 0 auto 16px auto; 
        }
        h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
        p { font-size: 0.9rem; color: #64748b; }

        .error-alert { background: #fee2e2; color: #ef4444; padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; margin-bottom: 24px; text-align: center; }

        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .input-box { position: relative; display: flex; align-items: center; }
        .icon { position: absolute; left: 16px; color: #94a3b8; }
        .input-box input { 
           width: 100%; 
           padding: 12px 16px 12px 48px; 
           border: 1px solid #e2e8f0; 
           border-radius: 12px; 
           font-size: 0.95rem; 
           outline: none; 
           transition: 0.2s;
        }
        .input-box input:focus { border-color: #005B4B; box-shadow: 0 0 0 4px rgba(0, 91, 75, 0.1); }
        .btn-show { position: absolute; right: 12px; background: transparent; border: none; color: #94a3b8; cursor: pointer; }

        .btn-login { 
           width: 100%; 
           padding: 14px; 
           background: #005B4B; 
           color: #fff; 
           border: none; 
           border-radius: 12px; 
           font-weight: 800; 
           font-size: 1rem; 
           cursor: pointer; 
           margin-top: 12px; 
           transition: 0.2s;
        }
        .btn-login:hover { background: #004438; transform: translateY(-2px); }

        .login-footer { margin-top: 32px; text-align: center; }
        .login-footer a { font-size: 0.85rem; color: #64748b; text-decoration: none; font-weight: 600; }
        .login-footer a:hover { color: #005B4B; }
      `}</style>
    </div>
  );
}
