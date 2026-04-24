'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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


export default function AdminCreateNews() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
     title: '',
     category: '',
     image: '',
     author: 'Admin',
     content: '',
     tags: [] as string[],
     status: 'published'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);

  useEffect(() => {
     fetch('/api/news-categories')
        .then(r => r.json())
        .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

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
     if (!formData.image) {
        alert("Vui lòng chọn ảnh đại diện");
        return;
     }

     setIsSubmitting(true);
     
     try {
        const res = await fetch('/api/news', {
           method: 'POST',
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

  return (
    <div className="create-news-page">
      <div className="page-header">
         <button className="btn-back" onClick={() => router.back()}>
            <ArrowLeft size={20} />
            Quay lại
         </button>
         <div className="header-actions">
            <button className="btn-save-draft">Lưu nháp</button>
            <button className="btn-publish" onClick={handleSubmit} disabled={isSubmitting}>
               {isSubmitting ? 'Đang đăng...' : (
                  <>
                    <Save size={18} />
                    Đăng bài viết
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
                  <p className="hint">Mẹo: Sử dụng CKEditor để định dạng văn bản chuyên nghiệp hơn.</p>
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
                           <p>Kéo và thả hoặc chọn từ máy tính</p>
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

               <div className="form-group">
                  <label><User size={16} /> Người cập nhật</label>
                  <input 
                    type="text" 
                    value={formData.author}
                    readOnly
                  />
               </div>
            </div>
         </aside>
      </div>

      {status === 'success' && (
         <div className="status-toast success">
            <CheckCircle size={20} />
            Bài viết đã được đăng thành công!
         </div>
      )}

      <style jsx>{`
        .create-news-page { display: flex; flex-direction: column; gap: 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .btn-back { display: flex; align-items: center; gap: 8px; background: transparent; border: none; font-weight: 700; color: #64748b; cursor: pointer; }
        
        .header-actions { display: flex; gap: 12px; }
        .btn-save-draft { padding: 10px 20px; border: 1px solid #e2e8f0; background: #fff; border-radius: 8px; font-weight: 700; color: #64748b; cursor: pointer; }
        .btn-publish { 
           padding: 10px 24px; 
           background: #005B4B; 
           color: #fff; 
           border: none; 
           border-radius: 8px; 
           font-weight: 700; 
           display: flex; 
           align-items: center; 
           gap: 8px; 
           cursor: pointer;
        }
        .btn-publish:disabled { opacity: 0.7; cursor: not-allowed; }

        .create-form-container { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: flex-start; }
        .form-card, .sidebar-card { background: #fff; padding: 32px; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .sidebar-card { padding: 24px; }
        .sidebar-card h4 { font-weight: 800; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }

        .form-group { margin-bottom: 24px; }
        .form-group label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
        
        .title-input { width: 100%; border: none; border-bottom: 2px solid #f1f5f9; padding: 12px 0; font-size: 1.8rem; font-weight: 800; outline: none; transition: 0.3s; }
        .title-input:focus { border-color: #005B4B; }
        
        .mock-editor { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .editor-toolbar { background: #f8fafc; padding: 8px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 4px; }
        .editor-toolbar button { padding: 4px 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: #64748b; }
        .editor-textarea { width: 100%; min-height: 400px; padding: 20px; border: none; outline: none; resize: vertical; line-height: 1.6; font-size: 1rem; }
        .editor-footer { padding: 8px 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; }
        
        .hint { font-size: 0.75rem; color: #94a3b8; margin-top: 8px; }

        .sidebar-card select, .sidebar-card input { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 0.9rem; }
        .sidebar-card select:focus, .sidebar-card input:focus { border-color: #005B4B; }
        
        .upload-container-v2 { width: 100%; }
        .upload-box-v2 { 
           border: 2px dashed #D0D5DD; 
           border-radius: 12px; 
           height: 160px; 
           display: flex; 
           flex-direction: column; 
           align-items: center; 
           justify-content: center; 
           color: #667085; 
           gap: 8px; 
           cursor: pointer; 
           transition: 0.2s; 
           background: #F9FAFB;
           text-align: center;
           padding: 20px;
        }
        .upload-box-v2:hover { border-color: #005B4B; background: #f0faf8; }
        .upload-box-v2 strong { color: #005B4B; }
        .upload-box-v2 p { font-size: 0.75rem; margin: 0; }
        .hidden-input { display: none; }
        
        .image-preview-v2 { position: relative; border-radius: 12px; overflow: hidden; height: 160px; border: 1px solid #f1f5f9; }
        .image-preview-v2 img { width: 100%; height: 100%; object-fit: cover; }
        .btn-remove-v2 { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }

        .status-toast { position: fixed; bottom: 40px; right: 40px; padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; gap: 12px; color: #fff; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: slideUp 0.3s forwards; }
        .success { background: #10b981; }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 1024px) {
           .create-form-container { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
