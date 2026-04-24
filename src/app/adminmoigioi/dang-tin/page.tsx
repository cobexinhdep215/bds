'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image as ImageIcon, Video, ChevronDown, Plus, Info, Trash2, X, ChevronLeft, Check, Smartphone, MapPin, Share2, Heart } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(10, 'Tiêu đề phải ít nhất 10 ký tự').max(256),
  description: z.string().min(20, 'Mô tả phải ít nhất 20 ký tự'),
  project: z.string().optional(),
  price: z.string().min(1, 'Vui lòng nhập giá'),
  area: z.string().min(1, 'Vui lòng nhập diện tích'),
  bedrooms: z.string(),
  bathrooms: z.string(),
  direction: z.string().optional(),
  balconyDirection: z.string().optional(),
  propertyStatus: z.string().optional(),
  legalStatus: z.string().optional(),
  furniture: z.string().optional(),
  unitCode: z.string().optional(),
  floor: z.string().optional(),
  building: z.string().optional(),
  videoLink: z.string().optional(),
});

const DIRECTIONS = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam'];
const BALCONY_DIRECTIONS = [...DIRECTIONS, 'ĐB-TB', 'ĐB-ĐN', 'ĐN-TN'];
const PROPERTY_STATUSES = ['Đã bàn giao', 'Chưa bàn giao'];
const LEGAL_STATUSES = ['Văn bản thỏa thuận', 'Hợp đồng mua bán', 'Đã có sổ đỏ'];
const FURNITURE_TYPES = ['Bàn giao thô', 'Cơ bản', 'Đầy đủ'];

const formatNumber = (val: string) => {
  if (!val) return '';
  const num = val.toString().replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const unformatNumber = (val: string) => {
  return val.toString().replace(/\./g, '');
};

function PostPropertyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [images, setImages] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [pricePerM2, setPricePerM2] = useState<string>('0');
  const [loading, setLoading] = useState(!!id);

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bedrooms: '2',
      bathrooms: '1',
      direction: 'Đông Nam',
      balconyDirection: 'Tây',
      propertyStatus: 'Đã bàn giao',
      legalStatus: 'Đã có sổ đỏ',
      furniture: 'Cơ bản',
    }
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/properties?id=${id}`)
        .then(res => res.json())
        .then(data => {
          reset({
            ...data,
            price: data.price.toString(),
            area: data.area.toString(),
          });
          setImages(data.images || []);
          setIsPublic(data.status === 'selling');
          setLoading(false);
        });
    }
  }, [id, reset]);

  const watchedPrice = watch('price');
  const watchedArea = watch('area');

  useEffect(() => {
    const p = parseFloat(unformatNumber(watchedPrice || '0'));
    const a = parseFloat(watchedArea || '0');
    if (p && a) {
      setPricePerM2(formatNumber(Math.round(p / a).toString()));
    } else {
      setPricePerM2('0');
    }
  }, [watchedPrice, watchedArea]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onContinue = () => {
    setIsPreview(true);
    window.scrollTo(0, 0);
  };

  const onSubmitFinal = async () => {
    const data = watch();
    const finalData = {
      ...data,
      images,
      price: parseFloat(unformatNumber(data.price)),
      area: parseFloat(data.area),
      status: isPublic ? 'selling' : 'private',
    };

    const method = id ? 'PUT' : 'POST';
    const res = await fetch('/api/properties', {
      method,
      body: JSON.stringify(finalData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/adminmoigioi');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  if (isPreview) {
    const data = watch();
    return (
      <div className="preview-container">
        <header className="form-header-admin">
           <div className="header-left">
             <button className="btn-back" onClick={() => setIsPreview(false)}><ChevronLeft size={24} /></button>
             <h1>Xem trước tin đăng</h1>
           </div>
           <div className="header-actions">
              <button className="btn-exit" onClick={() => router.back()}>Thoát</button>
              <button className="btn-finish" style={{ background: '#005B4B', cursor: 'pointer' }} onClick={onSubmitFinal}>Hoàn tất & Đăng tin</button>
           </div>
        </header>

        <div className="preview-content">
           <div className="status-toggle-card">
              <div className="toggle-info">
                 <div className="toggle-icon"><ImageIcon size={24} /></div>
                 <div>
                    <h4>Đăng bán</h4>
                    <p>Đăng tin công khai lên BDSXXX</p>
                 </div>
              </div>
              <div className={`toggle-switch ${isPublic ? 'active' : ''}`} onClick={() => setIsPublic(!isPublic)}>
                 <div className="switch-dot"></div>
              </div>
           </div>

           <div className="preview-card">
              <div className="preview-gallery">
                 {images.length > 0 ? (
                    <div className="gallery-grid">
                       {images.slice(0, 4).map((img, i) => (
                         <div key={i} className={`gallery-item ${i === 0 ? 'main' : ''}`}>
                            <img src={img} alt="Preview" />
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div className="no-image-placeholder">Chưa có hình ảnh</div>
                 )}
              </div>

              <div className="preview-details">
                 <div className="detail-header">
                    <span className="badge-private">{isPublic ? 'Đang bán' : 'Riêng tư'}</span>
                    <h2>{data.title || 'Chưa nhập tiêu đề'}</h2>
                 </div>
                 <p className="preview-address">{data.project ? `${data.project}, ` : ''} Hà Nội</p>

                 <div className="info-table">
                    <div className="info-row"><span>Dự án</span> <strong>{data.project || '-'}</strong></div>
                    <div className="info-row"><span>Số phòng ngủ</span> <strong>{data.bedrooms} PN</strong></div>
                    <div className="info-row"><span>Số toilet</span> <strong>{data.bathrooms} WC</strong></div>
                    <div className="info-row"><span>Diện tích</span> <strong>{data.area} m²</strong></div>
                    <div className="info-row"><span>Giá</span> <strong>{formatNumber(data.price)} đ</strong></div>
                    <div className="info-row description-row">
                       <span>Mô tả</span>
                       <p>{data.description}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <style jsx>{`
          .preview-container { background: #F8FAFB; min-height: 100vh; padding-bottom: 60px; }
          .form-header-admin { background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #E2E8F0; margin-bottom: 32px; }
          .header-left { display: flex; align-items: center; gap: 16px; }
          .header-left h1 { font-size: 1.25rem; font-weight: 800; margin: 0; color: #1e293b; }
          .btn-back { display: flex; align-items: center; justify-content: center; color: #64748b; background: transparent; border: none; cursor: pointer; }
          .header-actions { display: flex; gap: 12px; }
          .btn-exit { background: #f1f5f9; color: #64748b; padding: 10px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
          .btn-finish { background: #005B4B; color: #fff; padding: 10px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }

          .preview-content { max-width: 900px; margin: 0 auto; }
          .status-toggle-card { background: #fff; border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border: 1px solid #e2e8f0; }
          .toggle-info { display: flex; gap: 16px; align-items: center; }
          .toggle-icon { width: 48px; height: 48px; background: #E8F5F1; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #005B4B; }
          .toggle-info h4 { font-weight: 800; margin: 0; font-size: 1.1rem; color: #1e293b; }
          .toggle-info p { margin: 0; color: #64748b; font-size: 0.85rem; }
          .toggle-switch { width: 50px; height: 26px; background: #e2e8f0; border-radius: 13px; cursor: pointer; padding: 3px; transition: 0.3s; }
          .toggle-switch.active { background: #005B4B; }
          .switch-dot { width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: 0.3s; }
          .toggle-switch.active .switch-dot { transform: translateX(24px); }

          .preview-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
          .gallery-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: repeat(2, 180px); gap: 4px; }
          .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
          .detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
          .badge-private { background: #0f172a; color: #fff; font-size: 0.7rem; padding: 4px 10px; border-radius: 6px; font-weight: 800; }
          .preview-details { padding: 32px; }
          .preview-details h2 { font-size: 1.6rem; font-weight: 800; margin: 0; color: #1e293b; }
          .preview-address { color: #64748b; margin-bottom: 32px; }

          .info-table { display: flex; flex-direction: column; gap: 16px; border-top: 1px solid #f1f5f9; padding-top: 24px; }
          .info-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; }
          .info-row span { color: #64748b; }
          .info-row strong { color: #1e293b; font-weight: 700; }
          .description-row { flex-direction: column; align-items: flex-start; gap: 12px; }
          .description-row p { margin: 0; line-height: 1.6; color: #475569; white-space: pre-wrap; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="post-property-v2">
      <div className="post-header">
         <h1 className="page-title">{id ? 'Chỉnh sửa tin đăng' : 'Đăng tin bất động sản mới'}</h1>
         <div className="header-actions">
            <button className="btn-save-draft">Lưu nháp</button>
            <button className="btn-primary-admin" onClick={handleSubmit(onContinue)}>Xem trước & Tiếp tục</button>
         </div>
      </div>

      <div className="post-layout">
         <div className="post-main">
            <section className="p-section">
               <h3><ImageIcon size={20} /> Hình ảnh thực tế</h3>
               <p className="hint">Hình ảnh rõ nét giúp tin đăng của bạn thu hút hơn. Hỗ trợ tối đa 10 ảnh.</p>
               <div className="image-uploader-grid">
                  {images.map((img, i) => (
                     <div key={i} className="img-preview-box">
                        <img src={img} alt="Listing" />
                        <button className="btn-delete-img" onClick={() => removeImage(i)}><X size={14} /></button>
                        {i === 0 && <span className="label-cover">Ảnh bìa</span>}
                     </div>
                  ))}
                  {images.length < 10 && (
                      <label 
                        className="upload-btn"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           const files = e.dataTransfer.files;
                           if (files) {
                              Array.from(files).forEach(file => {
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                    setImages(prev => [...prev, reader.result as string]);
                                 };
                                 reader.readAsDataURL(file);
                              });
                           }
                        }}
                      >
                         <Plus size={32} />
                         <span>Thêm ảnh</span>
                         <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                  )}
               </div>
            </section>

            <section className="p-section">
               <h3><Info size={20} /> Thông tin căn bản</h3>
               <div className="field-group-admin">
                  <label>Tiêu đề tin đăng</label>
                  <input {...register('title')} placeholder="VD: Căn hộ Vinhomes Smart City 2 PN, full nội thất..." />
                  {errors.title && <span className="error">{errors.title.message as string}</span>}
               </div>

               <div className="field-group-admin">
                  <label>Mô tả chi tiết</label>
                  <textarea {...register('description')} rows={8} placeholder="Mô tả các ưu điểm về vị trí, tiện ích, nội thất, pháp lý..."></textarea>
                  {errors.description && <span className="error">{errors.description.message as string}</span>}
               </div>

               <div className="form-grid-2">
                  <div className="field-group-admin">
                     <label>Giá bán (VND)</label>
                     <div className="input-group-v2">
                        <Controller
                           name="price"
                           control={control}
                           render={({ field }) => (
                              <input 
                                 {...field}
                                 value={formatNumber(field.value)}
                                 onChange={(e) => field.onChange(unformatNumber(e.target.value))}
                                 placeholder="7.000.000.000"
                              />
                           )}
                        />
                        <span className="unit-label">đ</span>
                     </div>
                     {errors.price && <span className="error">{errors.price.message as string}</span>}
                  </div>
                  <div className="field-group-admin">
                     <label>Diện tích (m²)</label>
                     <div className="input-group-v2">
                        <input type="number" {...register('area')} placeholder="60" />
                        <span className="unit-label">m²</span>
                     </div>
                     {errors.area && <span className="error">{errors.area.message as string}</span>}
                  </div>
               </div>
            </section>

            <section className="p-section">
               <h3><MapPin size={20} /> Đặc điểm & Vị trí</h3>
               <div className="form-grid-3">
                  <div className="field-group-admin">
                     <label>Dự án</label>
                     <select {...register('project')}>
                        <option value="">Chọn dự án</option>
                        <option value="97 Láng Hạ">97 Láng Hạ</option>
                        <option value="Vinhomes Smart City">Vinhomes Smart City</option>
                        <option value="Vinhomes Ocean Park">Vinhomes Ocean Park</option>
                     </select>
                  </div>
                  <div className="field-group-admin">
                     <label>Số phòng ngủ</label>
                     <select {...register('bedrooms')}>
                        <option value="Studio">Studio</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4+</option>
                     </select>
                  </div>
                  <div className="field-group-admin">
                     <label>Số vệ sinh</label>
                     <select {...register('bathrooms')}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4+</option>
                     </select>
                  </div>
               </div>
               
               <div className="form-grid-2">
                  <div className="field-group-admin">
                     <label>Hướng ban công</label>
                     <select {...register('balconyDirection')}>
                        {BALCONY_DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                  </div>
                  <div className="field-group-admin">
                     <label>Nội thất</label>
                     <select {...register('furniture')}>
                        {FURNITURE_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                     </select>
                  </div>
               </div>
            </section>
         </div>

         <aside className="post-sidebar">
            <div className="help-card">
               <h4><Share2 size={18} /> Mẹo đăng tin tốt</h4>
               <ul>
                  <li>Tiêu đề ngắn gọn, đủ ý</li>
                  <li>Mô tả rõ ràng các tiện ích</li>
                  <li>Sử dụng ít nhất 4 ảnh đẹp</li>
                  <li>Giá sát với thị trường</li>
               </ul>
            </div>
         </aside>
      </div>

      <style jsx>{`
        .post-property-v2 { padding-bottom: 100px; }
        .post-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .page-title { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
        
        .header-actions { display: flex; gap: 12px; }
        .btn-save-draft { background: #fff; border: 1px solid #e2e8f0; padding: 12px 24px; border-radius: 12px; font-weight: 700; color: #64748b; cursor: pointer; }
        .btn-primary-admin { background: #005B4B; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-primary-admin:hover { background: #004438; transform: translateY(-2px); }

        .post-layout { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: flex-start; }
        .p-section { background: #fff; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px; }
        .p-section h3 { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 800; margin-bottom: 24px; color: #1e293b; }
        .hint { font-size: 0.85rem; color: #64748b; margin-bottom: 20px; }

        .image-uploader-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 16px; }
        .img-preview-box { position: relative; height: 110px; border-radius: 12px; overflow: hidden; border: 1px solid #f1f5f9; }
        .img-preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .btn-delete-img { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.5); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
        .label-cover { position: absolute; bottom: 0; left: 0; right: 0; background: #005B4B; color: #fff; font-size: 0.65rem; text-align: center; padding: 2px 0; font-weight: 700; }
        
        .upload-btn { border: 2px dashed #cbd5e1; border-radius: 12px; height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #64748b; cursor: pointer; transition: 0.2s; }
        .upload-btn:hover { border-color: #005B4B; background: #f0faf8; color: #005B4B; }
        .upload-btn span { font-size: 0.75rem; font-weight: 700; }
        .hidden { display: none; }

        .field-group-admin { margin-bottom: 20px; }
        .field-group-admin label { display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .field-group-admin input, .field-group-admin textarea, .field-group-admin select { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; font-size: 0.95rem; transition: 0.2s; }
        .field-group-admin input:focus, .field-group-admin textarea:focus, .field-group-admin select:focus { border-color: #005B4B; box-shadow: 0 0 0 4px rgba(0,91,75,0.05); }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        
        .input-group-v2 { position: relative; display: flex; align-items: center; }
        .unit-label { position: absolute; right: 16px; font-weight: 700; color: #64748b; font-size: 0.9rem; }
        
        .help-card { background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; position: sticky; top: 100px; }
        .help-card h4 { display: flex; align-items: center; gap: 8px; font-weight: 800; margin-bottom: 16px; color: #1e293b; }
        .help-card ul { padding-left: 20px; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .help-card li { font-size: 0.85rem; color: #64748b; line-height: 1.4; }
        
        .error { color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block; }
      `}</style>
    </div>
  );
}

export default function BrokerPostProperty() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <PostPropertyForm />
    </Suspense>
  );
}
