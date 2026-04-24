'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  User,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Tag
} from 'lucide-react';
import dynamic from 'next/dynamic';
import TagsInput from '@/components/admin/TagsInput';

const CKEditorWrapper = dynamic(() => import('@/components/admin/CKEditorWrapper'), { ssr: false });


export default function AdminEditNews() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
     id: '',
     title: '',
     category: '',
     image: '',
     author: 'Admin',
     content: '',
     tags: [] as string[],
     status: 'published'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);

  useEffect(() => {
     Promise.all([
        fetch('/api/news-categories').then(r => r.json()),
        fetch(`/api/news`).then(r => r.json())
     ]).then(([cats, newsData]) => {
        setCategories(Array.isArray(cats) ? cats : []);
         const article = Array.isArray(newsData) ? newsData.find((n: any) => n.id === id) : null;
         if (article) {
            setFormData({ ...article, tags: article.tags || [] });
         } else {
           alert("Không tìm thấy bài viết");
           router.push('/admin/news');
        }
        setIsLoading(false);
     });
  }, [id, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!formData.title) {
        alert("Vui lòng nhập tiêu đề");
        return;
     }
     setIsSubmitting(true);
     
     try {
        const res = await fetch('/api/news', {
           method: 'PUT',
           body: JSON.stringify(formData),
           headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
           setStatus('success');
           setTimeout(() => router.push('/admin/news'), 1500);
        } else {
           setStatus('error');
        }
     } catch (err) {
        setStatus('error');
     } finally {
        setIsSubmitting(false);
     }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  return (
    <div className="create-news-page">
      <div className="page-header">
         <button className="btn-back" onClick={() => router.back()}>
            <ArrowLeft size={20} />
            Quay lại
         </button>
         <div className="header-actions">
            <button className="btn-publish" onClick={handleSubmit} disabled={isSubmitting}>
               {isSubmitting ? 'Đang lưu...' : (
                  <>
                    <CheckCircle size={18} />
                    Cập nhật bài viết
                  </>
               )}
            </button>
         </div>
      </div>

      <div className="create-form-container">
         <div className="editor-main">
            <div className="form-card">
               <div className="form-group">
                  <label><Type size={16} /> Tiêu đề bài viết</label>
                  <input 
                    type="text" 
                    className="title-input" 
                    placeholder="Nhập tiêu đề tin tức..." 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
               </div>

               <div className="form-group">
                  <label><Layout size={16} /> Nội dung (CKEditor)</label>
                  <CKEditorWrapper 
                     value={formData.content} 
                     onChange={(val) => setFormData({...formData, content: val})} 
                  />
               </div>
            </div>
         </div>

         <aside className="editor-sidebar">
            <div className="sidebar-card">
               <h4>Thiết lập bài viết</h4>
               
               <div className="form-group">
                  <label><Layout size={16} /> Danh mục</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                     <option value="">Chọn danh mục</option>
                     {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                     ))}
                  </select>
               </div>

               <div className="form-group">
                  <label><Tag size={16} /> Tags bài viết</label>
                  <TagsInput 
                     tags={formData.tags} 
                     onChange={(newTags) => setFormData({...formData, tags: newTags})} 
                  />
               </div>

               <div className="form-group">
                  <label><ImageIcon size={16} /> Ảnh đại diện</label>
                  <div className="upload-container-v2">
                     {formData.image ? (
                        <div className="image-preview-v2">
                           <img src={formData.image} alt="Preview" />
                           <button className="btn-remove-v2" onClick={removeImage}><X size={16} /></button>
                        </div>
                     ) : (
                        <label 
                          className="upload-box-v2"
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             const files = e.dataTransfer.files;
                             if (files && files[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                   setFormData(prev => ({ ...prev, image: reader.result as string }));
                                };
                                reader.readAsDataURL(files[0]);
                             }
                          }}
                        >
                           <ImageIcon size={32} />
                           <span><strong>Tải ảnh lên</strong></span>
                           <input type="file" className="hidden-input" onChange={handleImageUpload} accept="image/*" />
                        </label>
                     )}
                  </div>
               </div>

               <div className="form-group">
                  <label><FileText size={16} /> Trạng thái</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                     <option value="draft">Nháp</option>
                     <option value="published">Xuất bản</option>
                  </select>
               </div>
            </div>
         </aside>
      </div>

      <style jsx>{`
        .create-news-page { display: flex; flex-direction: column; gap: 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .btn-back { display: flex; align-items: center; gap: 8px; background: transparent; border: none; font-weight: 700; color: #64748b; cursor: pointer; }
        .btn-publish { padding: 10px 24px; background: #005B4B; color: #fff; border: none; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
        .btn-publish:hover { background: #004438; transform: translateY(-2px); }

        .create-form-container { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
        .form-card, .sidebar-card { background: #fff; padding: 32px; border-radius: 20px; border: 1px solid #f1f5f9; }
        .sidebar-card h4 { font-weight: 800; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }

        .form-group { margin-bottom: 24px; }
        .form-group label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
        
        .title-input { width: 100%; border: none; border-bottom: 2px solid #f1f5f9; padding: 12px 0; font-size: 1.8rem; font-weight: 800; outline: none; }

        .sidebar-card select { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
        
        .image-preview-v2 { position: relative; border-radius: 12px; overflow: hidden; height: 160px; }
        .image-preview-v2 img { width: 100%; height: 100%; object-fit: cover; }
        .btn-remove-v2 { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); color: #fff; width: 28px; height: 28px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .upload-box-v2 { border: 2px dashed #e2e8f0; border-radius: 12px; height: 160px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .hidden-input { display: none; }
      `}</style>
    </div>
  );
}
