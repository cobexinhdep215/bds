'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Layers } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '' });

  useEffect(() => {
     fetch('/api/news-categories')
        .then(r => r.json())
        .then(data => {
           setCategories(Array.isArray(data) ? data : []);
           setIsLoading(false);
        });
  }, []);

  const handleAddCat = (e: React.FormEvent) => {
     e.preventDefault();
     // Simple client side add for demo, usually would fetch POST
     const id = 'cat_' + Date.now();
     const slug = newCat.name.toLowerCase().replace(/ /g, '-');
     const item = { ...newCat, id, slug };
     setCategories([...categories, item]);
     setIsModalOpen(false);
     setNewCat({ name: '', slug: '' });
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="cat-page">
      <div className="page-header">
         <div className="title-area">
            <h1>Danh mục tin tức</h1>
            <p>Quản lý các chủ đề và phân loại cho bài viết</p>
         </div>
         <button className="btn-add-cat" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Thêm danh mục
         </button>
      </div>

      <div className="table-container">
         <div className="table-controls">
            <div className="search-wrap">
               <Search size={18} />
               <input 
                 type="text" 
                 placeholder="Tìm danh mục..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         
         <table className="admin-table">
            <thead>
               <tr>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Số bài viết</th>
                  <th>Thao tác</th>
               </tr>
            </thead>
            <tbody>
               {isLoading ? (
                  <tr><td colSpan={4} align="center">Đang tải...</td></tr>
               ) : filtered.map(cat => (
                  <tr key={cat.id}>
                     <td>
                        <div className="cat-name-cell">
                           <div className="icon"><Layers size={14} /></div>
                           <strong>{cat.name}</strong>
                        </div>
                     </td>
                     <td><code>{cat.slug}</code></td>
                     <td>4 bài viết</td>
                     <td>
                        <div className="actions">
                           <button className="btn-icon"><Edit2 size={16} /></button>
                           <button className="btn-icon delete"><Trash2 size={16} /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {isModalOpen && (
         <div className="modal-overlay">
            <div className="modal-content">
               <div className="modal-header">
                  <h3>Thêm danh mục mới</h3>
                  <button onClick={() => setIsModalOpen(false)}><Plus size={20} style={{transform: 'rotate(45deg)'}} /></button>
               </div>
               <form onSubmit={handleAddCat} className="cat-form">
                  <div className="form-group">
                     <label>Tên danh mục</label>
                     <input 
                        type="text" 
                        value={newCat.name}
                        onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                        placeholder="VD: Tin thị trường"
                        required
                     />
                  </div>
                  <div className="modal-footer">
                     <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                     <button type="submit" className="btn-save">Lưu danh mục</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      <style jsx>{`
        .cat-page { display: flex; flex-direction: column; gap: 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .title-area h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; }
        .title-area p { color: #64748b; font-size: 0.9rem; }
        
        .btn-add-cat { 
           background: #005B4B; 
           color: #fff; 
           padding: 10px 20px; 
           border-radius: 8px; 
           font-weight: 700; 
           display: flex; 
           align-items: center; 
           gap: 8px; 
           border: none;
           cursor: pointer;
        }

        .table-container { background: #fff; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .table-controls { padding: 20px; border-bottom: 1px solid #f1f5f9; }
        .search-wrap { 
           background: #f8fafc; 
           border: 1px solid #e2e8f0; 
           border-radius: 8px; 
           padding: 8px 16px; 
           display: flex; 
           align-items: center; 
           gap: 12px;
           width: 300px;
        }
        .search-wrap input { border: none; background: transparent; flex: 1; outline: none; font-size: 0.9rem; }
        
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 16px 20px; background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .admin-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
        
        .cat-name-cell { display: flex; align-items: center; gap: 12px; }
        .cat-name-cell .icon { width: 24px; height: 24px; background: #f0fdf9; color: #005B4B; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
        
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.8rem; }
        
        .actions { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; }
        .btn-icon:hover { background: #f8fafc; color: #005B4B; border-color: #005B4B; }
        .btn-icon.delete:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: #fff; border-radius: 16px; width: 100%; max-width: 450px; padding: 32px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h3 { font-weight: 800; margin: 0; }
        .modal-header button { background: transparent; border: none; cursor: pointer; color: #64748b; }
        
        .cat-form .form-group { margin-bottom: 24px; }
        .cat-form label { display: block; font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .cat-form input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
        .cat-form input:focus { border-color: #005B4B; }
        
        .modal-footer { display: flex; gap: 12px; }
        .btn-cancel { flex: 1; padding: 12px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 700; color: #475569; }
        .btn-save { flex: 1; padding: 12px; background: #005B4B; border: none; border-radius: 8px; font-weight: 700; color: #fff; }
      `}</style>
    </div>
  );
}
