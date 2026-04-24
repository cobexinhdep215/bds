'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function AdminNewsList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
     Promise.all([
        fetch('/api/news-categories').then(r => r.json()),
        fetch('/api/news').then(r => r.json())
     ]).then(([cats, newsData]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setNews(Array.isArray(newsData) ? newsData : []);
        setIsLoading(false);
     });
  }, []);

  const handleDelete = async (id: string) => {
     if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
     const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
     if (res.ok) {
        setNews(news.filter(n => n.id !== id));
     }
  };

  const getCategoryName = (id: string) => {
     return categories.find(c => c.id === id)?.name || 'Khác';
  };

  const filtered = news.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="news-list-admin">
      <div className="page-header">
         <div className="title-area">
            <h1>Danh sách tin tức</h1>
            <p>Quản lý toàn bộ bài viết, tin thị trường và hướng dẫn</p>
         </div>
         <Link href="/admin/news/create" className="btn-create">
            <Plus size={20} />
            Tạo bài viết mới
         </Link>
      </div>

      <div className="list-filters-v2">
         <div className="search-box-v2">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tiêu đề, tác giả..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="filter-actions">
            <button className="btn-filter"><Filter size={16} /> Bộ lọc</button>
         </div>
      </div>

      <div className="news-table-card">
         <table className="admin-table">
            <thead>
               <tr>
                  <th>Tiêu đề bài viết</th>
                  <th>Danh mục</th>
                  <th>Tác giả</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
               </tr>
            </thead>
            <tbody>
               {isLoading ? (
                  <tr><td colSpan={6} align="center">Đang tải dữ liệu...</td></tr>
               ) : filtered.length > 0 ? filtered.map(item => (
                  <tr key={item.id}>
                     <td className="title-cell">
                        <img src={item.image} alt="" />
                        <div className="title-wrap">
                           <strong>{item.title}</strong>
                           <span className="slug">/{item.slug}</span>
                         </div>
                      </td>
                      <td>
                         <span className="cat-badge">
                            {getCategoryName(item.category)}
                         </span>
                      </td>
                      <td>{item.author}</td>
                      <td>{item.date}</td>
                      <td>
                         <span className={`status-badge ${item.status === 'published' ? 'published' : 'draft'}`}>
                            {item.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {item.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                         </span>
                      </td>
                      <td>
                         <div className="table-actions">
                            <Link href={`/admin/news/edit/${item.id}`} className="btn-icon"><Edit size={16} /></Link>
                            <button className="btn-icon delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                )) : (
                   <tr><td colSpan={6} align="center">Không tìm thấy bài viết nào.</td></tr>
                )}
             </tbody>
          </table>
       </div>

      <style jsx>{`
        .news-list-admin { display: flex; flex-direction: column; gap: 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .title-area h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; }
        .title-area p { color: #64748b; font-size: 0.9rem; }
        
        .btn-create { 
           background: #005B4B; 
           color: #fff; 
           padding: 10px 20px; 
           border-radius: 8px; 
           font-weight: 700; 
           display: flex; 
           align-items: center; 
           gap: 8px; 
           text-decoration: none;
        }

        .list-filters-v2 { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; }
        .search-box-v2 { 
           background: #f8fafc; 
           border: 1px solid #e2e8f0; 
           border-radius: 8px; 
           padding: 8px 16px; 
           display: flex; 
           align-items: center; 
           gap: 12px; 
           width: 400px;
        }
        .search-box-v2 input { border: none; background: transparent; flex: 1; outline: none; font-size: 0.9rem; }
        
        .btn-filter { background: #fff; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; color: #64748b; display: flex; align-items: center; gap: 8px; }

        .news-table-card { background: #fff; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 16px 20px; background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .admin-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
        
        .title-cell { display: flex; gap: 16px; align-items: center; max-width: 450px; }
        .title-cell img { width: 80px; height: 50px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .title-wrap { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
        .title-wrap strong { color: #0f172a; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .slug { font-size: 0.75rem; color: #94a3b8; }
        
        .cat-badge { background: #f0fdf9; color: #005B4B; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
        .status-badge { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; }
        .published { color: #10b981; }
        
        .table-actions { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; }
        .btn-icon:hover { background: #f8fafc; color: #005B4B; border-color: #005B4B; }
        .btn-icon.delete:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }
      `}</style>
    </div>
  );
}
