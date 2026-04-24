'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { PropertyCard } from '@/components/common/PropertyCard';
import '../../home.css';
import { 
  ChevronRight, ChevronLeft, Phone, MessageSquare, MapPin, 
  Share2, Heart, Info, Bath, Bed, Maximize, Compass, 
  Layers, BadgeCheck, FileText, CheckCircle2, X, Loader2
} from 'lucide-react';
import { useParams } from 'next/navigation';

const formatPrice = (price: number) => {
  if (!price) return 'Đang cập nhật';
  if (price >= 1000000000) {
    return (price / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ';
  }
  if (price >= 1000000) {
    return (price / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' triệu';
  }
  return price.toLocaleString('vi-VN') + ' đ';
};

const formatPricePerM2 = (price: number, area: number) => {
  const priceM2 = price / (area || 1);
  if (priceM2 >= 1000000) {
    return (priceM2 / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' triệu/m²';
  }
  return Math.round(priceM2).toLocaleString('vi-VN') + ' đ/m²';
};

export default function PropertyDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [property, setProperty] = useState<any>(null);
  const [broker, setBroker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    if (slug) {
      fetch(`/api/properties?slug=${slug}`)
        .then(res => res.json())
        .then(data => {
          setProperty(data);
          if (data.brokerId) {
             fetch(`/api/users?id=${data.brokerId}`)
               .then(res => res.json())
               .then(bData => setBroker(bData));
          }
          const query = data.project ? `&project=${data.project}` : `&province=${data.province}`;
          fetch(`/api/properties?limit=20${query}`)
            .then(res => res.json())
            .then(sData => {
               setSimilarProperties((sData.properties || []).filter((p:any) => p.id !== data.id));
            });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={48} color="#008761" />
        <style jsx>{`
          .loading-state { height: 100vh; display: flex; align-items: center; justify-content: center; }
        `}</style>
      </div>
    );
  }

  if (!property) {
    return <div className="not-found" style={{padding: '100px', textAlign: 'center'}}>Không tìm thấy thông tin bất động sản này.</div>;
  }

  const images = property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const priceFormatted = formatPrice(property.price);
  const pricePerM2 = formatPricePerM2(property.price, property.area);
  const monthlyEstimate = formatPrice(Math.round(property.price * 0.0075));

  return (
    <main className="prop-detail-layout">
      <Header />
      
      <div className="container detail-container">
        {/* Breadcrumbs */}
        <div className="breadcrumb-nav">
          <span>HouseNow</span> 
          <ChevronRight size={14} className="bc-icon"/> 
          <span>{property.province || 'Hà Nội'}</span>
          <ChevronRight size={14} className="bc-icon"/> 
          <span>{property.district || 'Khu vực'}</span>
          <ChevronRight size={14} className="bc-icon"/> 
          <span className="bc-active">{property.project || 'Bất động sản'}</span>
        </div>

        <div className="detail-layout-grid">
          {/* TRỤC CHÍNH (TRÁI) */}
          <div className="main-content-col">
            
            <div className="prop-header-info">
              <div className="prop-title-row">
                 <h1 className="prop-main-title">{property.title}</h1>
                 <div className="prop-actions">
                    <button className="btn-icon circle"><Share2 size={18} /></button>
                    <button className="btn-icon circle text-red hover-red"><Heart size={18} /></button>
                 </div>
              </div>
              <div className="prop-address">
                 <MapPin size={16} />
                 <span>{property.district ? `${property.district}, ` : ''}{property.province}</span>
              </div>
              <div className="prop-price-metrics">
                 <div className="price-primary">{priceFormatted}</div>
                 <div className="price-secondary">~ {pricePerM2}</div>
                 <div className="divider-vert"></div>
                 <div className="metric-badges">
                    <span className="metric-badge"><Bed size={16}/> {property.bedrooms} PN</span>
                    <span className="metric-badge"><Bath size={16}/> {property.bathrooms} WC</span>
                    <span className="metric-badge"><Maximize size={16}/> {property.area} m²</span>
                 </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="gallery-section">
               <div className="gallery-main-view" onClick={() => setIsPopupOpen(true)}>
                  <img src={images[activeImgIndex]} alt="BDS View" className="img-main-fit" />
                  
                  <div className="gallery-overlay-ui">
                     <span className="status-badge green-badge"><CheckCircle2 size={14}/> Đã xác thực</span>
                     
                     {images.length > 1 && (
                       <div className="nav-controls">
                          <button className="btn-nav prev-btn" onClick={handlePrev}><ChevronLeft size={24}/></button>
                          <button className="btn-nav next-btn" onClick={handleNext}><ChevronRight size={24}/></button>
                       </div>
                     )}

                     <div className="counter-pill">
                        <Layers size={14}/> {activeImgIndex + 1} / {images.length} ảnh
                     </div>
                  </div>
               </div>

               {images.length > 1 && (
                 <div className="gallery-thumbnails">
                   {images.map((img: string, idx: number) => (
                      <div 
                        key={idx} 
                        className={`thumb-box ${idx === activeImgIndex ? 'active' : ''}`}
                        onClick={() => setActiveImgIndex(idx)}
                      >
                         <img src={img} alt={`Thumb ${idx+1}`} />
                      </div>
                   ))}
                 </div>
               )}
            </div>

            {/* Price Chart */}
            <div className="price-evaluation-block">
               <div className="evaluation-header">
                  <div className="e-left">
                     <h4>Khoảng giá phổ biến khu vực</h4>
                     <p>Cập nhật thị trường</p>
                  </div>
                  <div className="e-right">
                     <span className="highlight-price">~ {pricePerM2}</span>
                  </div>
               </div>
               <div className="evaluation-bar-wrapper">
                  <div className="e-bar-bg"></div>
                  <div className="e-marker" style={{ left: '50%' }}>
                     <div className="tooltip-marker">Giá căn này</div>
                     <div className="pin"></div>
                  </div>
               </div>
               <div className="evaluation-labels">
                  <span>Thấp: {formatPricePerM2(property.price * 0.8, property.area)}</span>
                  <span>Phổ biến: {pricePerM2}</span>
                  <span>Cao: {formatPricePerM2(property.price * 1.2, property.area)}</span>
               </div>
            </div>

            {/* Description */}
            <section className="detail-section">
               <div className="section-title-wrap">
                  <h3 className="h3-title">Thông tin mô tả</h3>
               </div>
               <div className={`description-content ${isDescExpanded ? 'expanded' : ''}`}>
                  <div style={{ whiteSpace: 'pre-line' }}>{property.description}</div>
               </div>
               <button className="btn-read-more" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                  {isDescExpanded ? 'Thu gọn ⏶' : 'Xem thêm ⏷'}
               </button>
            </section>

            {/* Specifications Grid */}
            <section className="detail-section">
               <div className="section-title-wrap">
                  <h3 className="h3-title">Đặc điểm bất động sản</h3>
               </div>
               <div className="specs-grid-3">
                  <div className="spec-card">
                     <div className="s-icon"><Maximize size={20}/></div>
                     <div className="s-data">
                        <span className="s-lbl">Diện tích sử dụng</span>
                        <span className="s-val">{property.area} m²</span>
                     </div>
                  </div>
                  <div className="spec-card">
                     <div className="s-icon"><Bed size={20}/></div>
                     <div className="s-data">
                        <span className="s-lbl">Phòng ngủ</span>
                        <span className="s-val">{property.bedrooms} PN</span>
                     </div>
                  </div>
                  <div className="spec-card">
                     <div className="s-icon"><Bath size={20}/></div>
                     <div className="s-data">
                        <span className="s-lbl">Phòng tắm / WC</span>
                        <span className="s-val">{property.bathrooms} WC</span>
                     </div>
                  </div>
                  <div className="spec-card">
                     <div className="s-icon"><Compass size={20}/></div>
                     <div className="s-data">
                        <span className="s-lbl">Hướng cửa chính</span>
                        <span className="s-val">{property.direction || 'Đang cập nhật'}</span>
                     </div>
                  </div>
                  <div className="spec-card">
                     <div className="s-icon"><Compass size={20}/></div>
                     <div className="s-data">
                        <span className="s-lbl">Hướng ban công</span>
                        <span className="s-val">{property.balconyDirection || 'Đang cập nhật'}</span>
                     </div>
                  </div>
                  <div className="spec-card">
                     <div className="s-icon"><FileText size={20}/></div>
                     <div className="s-data">
                        <span className="s-lbl">Pháp lý</span>
                        <span className="s-val">{property.legalStatus || 'Sổ đỏ / Sổ hồng'}</span>
                     </div>
                  </div>
               </div>
            </section>
            
            <section className="detail-section">
               <div className="section-title-wrap">
                  <h3 className="h3-title">Vị trí tương đối</h3>
               </div>
               <div className="map-view-box" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                 <MapPin size={48} color="#008761" />
                 <p style={{ marginTop: '16px', fontWeight: '600', fontSize: '1.2rem' }}>{property.project || 'Vị trí khu vực'}</p>
                 <p style={{ color: '#666' }}>{property.district}, {property.province}</p>
               </div>
            </section>

          </div>

          {/* TRỤC TÙY CHỌN (PHẢI) */}
          <aside className="sidebar-col">
             <div className="sticky-wrapper">
                
                <div className="agent-widget">
                   <div className="aw-header">
                      <div className="aw-avatar">
                         <img src={broker?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"} alt="Agent" />
                         <div className="verified-tick"><BadgeCheck size={16}/></div>
                      </div>
                      <div className="aw-info">
                         <h4 className="aw-name">{broker?.name || "Phạm Ánh"}</h4>
                         <span className="aw-label">{broker?.role === 'broker' ? 'Môi giới chuyên nghiệp' : 'Thành viên HouseNow'}</span>
                      </div>
                   </div>

                   <div className="aw-stats-row">
                      <div className="aw-stat-box">
                         <strong>{broker?.id === 'cada145d-7a99-471c-a4d5-aac9041ba782' ? 'Mới' : '5 năm'}</strong>
                         <span>Kinh nghiệm</span>
                      </div>
                      <div className="aw-separator"></div>
                      <div className="aw-stat-box">
                         <strong>{broker?.name === 'No Na' ? '20+' : '24'}</strong>
                         <span>Tin đang bán</span>
                      </div>
                   </div>

                   <div className="aw-actions">
                      <button className="btn-call-agent">
                         <Phone size={20} />
                         <span>{broker?.phone || "094 392 7919"}</span>
                         <div className="shine-fx"></div>
                      </button>
                      <button className="btn-chatbot">
                         <MessageSquare size={20} />
                         <span>Chat Zalo</span>
                      </button>
                   </div>
                   <div className="aw-footer-note">Thường phản hồi trong vòng 5 phút</div>
                </div>

                <div className="loan-widget">
                   <h4 className="lw-title">Dự toán khoản vay</h4>
                   <div className="lw-price-row">
                      <span>Trả trước (30%):</span>
                      <strong>{formatPrice(property.price * 0.3)}</strong>
                   </div>
                   <div className="lw-price-row highlight">
                      <span>Gốc lãi tháng đầu:</span>
                      <strong className="green-txt">{monthlyEstimate}/tháng</strong>
                   </div>
                   <div className="lw-params-grid">
                      <div className="lw-param">
                         <span className="lw-lbl">Thời hạn vay</span>
                         <span className="lw-val">20 năm</span>
                      </div>
                      <div className="lw-param">
                         <span className="lw-lbl">Lãi suất</span>
                         <span className="lw-val">7.5%/năm</span>
                      </div>
                   </div>
                   <button className="btn-outline-green mt-4">Xem chi tiết bảng tính →</button>
                </div>

             </div>
          </aside>
        </div>

        {/* CÙNG TẦM GIÁ / KHU VỰC */}
        <section className="similar-listings-sec">
          <div className="section-title-wrap mb-6">
             <h3 className="h3-title">Bất động sản tương tự</h3>
          </div>
          <div className="prop-grid-4">
             {similarProperties.slice(0, 8).map(p => (
                <PropertyCard key={p.id} property={{
                  ...p,
                  price: formatPrice(p.price),
                  area: formatPricePerM2(p.price, p.area),
                  image: p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                  beds: parseInt(p.bedrooms) || 0,
                  baths: parseInt(p.bathrooms) || 0,
                  size: p.area,
                  location: `${p.district ? p.district + ', ' : ''}${p.province}`
                } as any} />
             ))}
          </div>
        </section>

      </div>

      {isPopupOpen && (
        <div className="fullscreen-gallery-modal">
           <div className="modal-backdrop" onClick={() => setIsPopupOpen(false)}></div>
           <button className="btn-close-modal" onClick={() => setIsPopupOpen(false)}><X size={32}/></button>
           
           <button className="modal-nav prev" onClick={(e) => { e.stopPropagation(); handlePrev(e); }}>
              <ChevronLeft size={40}/>
           </button>
           
           <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
              <img src={images[activeImgIndex]} alt="Zoomed view" className="zoomed-image" />
              <div className="modal-counter">{activeImgIndex + 1} / {images.length}</div>
           </div>

           <button className="modal-nav next" onClick={(e) => { e.stopPropagation(); handleNext(e); }}>
              <ChevronRight size={40}/>
           </button>
        </div>
      )}

      {/* COMPONENT SPECIFIC CSS */}
      <style jsx>{`
        .prop-detail-layout { background: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .detail-container { max-width: 1200px; margin: 0 auto; padding: 24px 20px 80px 20px; }

        .breadcrumb-nav { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; margin-bottom: 24px; font-weight: 500; }
        .bc-icon { color: #94a3b8; }
        .bc-active { color: #1e293b; font-weight: 600; }

        .detail-layout-grid { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 40px; align-items: flex-start; }

        .prop-header-info { margin-bottom: 32px; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; }
        .prop-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 12px; }
        .prop-main-title { font-size: 2rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin: 0; }
        .prop-actions { display: flex; gap: 12px; flex-shrink: 0; }
        .btn-icon.circle { width: 44px; height: 44px; border-radius: 50%; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; color: #475569; cursor: pointer; transition: 0.2s; }
        .btn-icon.circle:hover { background: #f8fafc; border-color: #cbd5e1; }
        .text-red { color: #cbd5e1; }
        .hover-red:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }
        
        .prop-address { display: flex; align-items: center; gap: 6px; font-size: 0.95rem; color: #475569; margin-bottom: 24px; }
        .prop-address svg { color: #94a3b8; }

        .prop-price-metrics { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .price-primary { font-size: 2.2rem; font-weight: 800; color: #008761; }
        .price-secondary { font-size: 1.1rem; color: #64748b; font-weight: 600; }
        .divider-vert { width: 1px; height: 24px; background: #cbd5e1; }
        .metric-badges { display: flex; gap: 12px; }
        .metric-badge { display: flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; color: #334155; }
        
        .gallery-section { margin-bottom: 40px; }
        .gallery-main-view { position: relative; width: 100%; height: 460px; border-radius: 16px; overflow: hidden; cursor: zoom-in; margin-bottom: 12px; background: #f1f5f9; }
        .img-main-fit { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }
        .gallery-main-view:hover .img-main-fit { transform: scale(1.02); }
        
        .gallery-overlay-ui { position: absolute; inset: 0; pointer-events: none; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 24px; font-size: 0.85rem; font-weight: 700; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); pointer-events: auto; }
        .green-badge { color: #008761; }
        
        .nav-controls { position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); display: flex; justify-content: space-between; padding: 0 16px; opacity: 0; transition: 0.3s; }
        .gallery-main-view:hover .nav-controls { opacity: 1; }
        .btn-nav { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.9); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1e293b; pointer-events: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: 0.2s; }
        .btn-nav:hover { background: #fff; transform: scale(1.05); color: #005B4B; }

        .counter-pill { align-self: flex-end; display: flex; align-items: center; gap: 6px; background: rgba(15,23,42,0.7); color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; backdrop-filter: blur(4px); pointer-events: auto; }

        .gallery-thumbnails { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .thumb-box { height: 90px; border-radius: 12px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: 0.2s; opacity: 0.7; }
        .thumb-box img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-box:hover { opacity: 1; }
        .thumb-box.active { border-color: #008761; opacity: 1; }

        .price-evaluation-block { background: linear-gradient(145deg, #f0fdf9, #f8fafc); border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 40px; }
        .evaluation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .e-left h4 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .highlight-price { font-size: 1.4rem; font-weight: 800; color: #008761; }
        
        .evaluation-bar-wrapper { position: relative; height: 8px; margin-bottom: 12px; }
        .e-bar-bg { width: 100%; height: 100%; background: linear-gradient(90deg, #38bdf8, #10b981, #f59e0b, #ef4444); border-radius: 4px; opacity: 0.8; }
        .e-marker { position: absolute; top: -30px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .tooltip-marker { background: #0f172a; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); white-space: nowrap; }
        .tooltip-marker::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); border-width: 4px 4px 0; border-style: solid; border-color: #0f172a transparent transparent transparent; }
        .pin { width: 4px; height: 16px; background: #0f172a; border-radius: 2px; }
        .evaluation-labels { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: #64748b; }

        .detail-section { margin-bottom: 48px; }
        .section-title-wrap { border-left: 4px solid #008761; padding-left: 12px; margin-bottom: 24px; }
        .h3-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1; }

        .description-content { font-size: 1rem; line-height: 1.7; color: #334155; position: relative; max-height: 200px; overflow: hidden; transition: max-height 0.3s ease-out; }
        .description-content.expanded { max-height: 5000px; }
        .description-content:not(.expanded)::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 100px; background: linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0)); pointer-events: none; }
        .btn-read-more { display: block; margin: 24px auto 0 auto; background: transparent; border: 1px solid #cbd5e1; color: #334155; font-weight: 700; padding: 10px 24px; border-radius: 24px; cursor: pointer; transition: 0.2s; }
        .btn-read-more:hover { background: #f8fafc; border-color: #94a3b8; }

        .specs-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .spec-card { border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; display: flex; align-items: center; gap: 16px; background: #fafafa; }
        .s-icon { width: 44px; height: 44px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; color: #008761; box-shadow: 0 2px 4px rgba(0,0,0,0.02); flex-shrink: 0; }
        .s-data { display: flex; flex-direction: column; gap: 4px; }
        .s-lbl { font-size: 0.85rem; color: #64748b; font-weight: 500; }
        .s-val { font-size: 1rem; font-weight: 700; color: #1e293b; }

        .map-view-box { height: 400px; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #e2e8f0; }

        .sticky-wrapper { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px; }
        
        .agent-widget { border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; background: #fff; box-shadow: 0 10px 40px rgba(0,0,0,0.03); }
        .aw-header { display: flex; gap: 16px; margin-bottom: 24px; align-items: center; }
        .aw-avatar { position: relative; width: 64px; height: 64px; }
        .aw-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .verified-tick { position: absolute; bottom: 0; right: 0; background: #10b981; color: #fff; border-radius: 50%; padding: 2px; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; }
        .aw-name { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .aw-label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
        
        .aw-stats-row { display: flex; background: #f8fafc; border-radius: 12px; padding: 12px; margin-bottom: 24px; }
        .aw-stat-box { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .aw-stat-box strong { font-size: 1.1rem; color: #0f172a; font-weight: 800; }
        .aw-stat-box span { font-size: 0.75rem; color: #64748b; margin-top: 4px; }
        .aw-separator { width: 1px; background: #e2e8f0; margin: 0 16px; }

        .aw-actions { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .btn-call-agent { width: 100%; background: #008761; color: #fff; font-size: 1.05rem; font-weight: 700; padding: 14px; border-radius: 12px; border: none; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; position: relative; overflow: hidden; }
        .btn-call-agent:hover { background: #007050; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,135,97,0.2); }
        .shine-fx { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); animation: shine 3s infinite; transform: skewX(-20deg); }
        @keyframes shine { 20% { left: 200%; } 100% { left: 200%; } }
        
        .btn-chatbot { width: 100%; background: #fff; border: 2px solid #008761; color: #008761; font-size: 1rem; font-weight: 700; padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.2s; }
        .btn-chatbot:hover { background: #f0faf8; }
        .aw-footer-note { text-align: center; font-size: 0.8rem; color: #64748b; }

        .loan-widget { background: #f0fdf9; border: 1px solid #ccfbf1; border-radius: 16px; padding: 24px; position: relative; overflow: hidden; }
        .loan-widget::after { content: ''; position: absolute; top:0; right:0; width: 100px; height: 100px; background: radial-gradient(circle, rgba(20,184,166,0.1) 0%, rgba(20,184,166,0) 70%); border-radius: 50%; transform: translate(30%, -30%); pointer-events: none; }
        .lw-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
        .lw-price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.95rem; color: #475569; }
        .lw-price-row strong { color: #0f172a; font-weight: 700; }
        .lw-price-row.highlight { padding-bottom: 16px; border-bottom: 1px dashed #99f6e4; margin-bottom: 16px; }
        .green-txt { color: #008761 !important; font-size: 1.1rem; }
        
        .lw-params-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .lw-param { display: flex; flex-direction: column; gap: 4px; }
        .lw-lbl { font-size: 0.8rem; color: #64748b; }
        .lw-val { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
        
        .btn-outline-green { width: 100%; margin-top: 20px; background: transparent; border: 1px solid #14b8a6; color: #0f766e; font-weight: 700; padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.2s; }
        
        .similar-listings-sec { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 40px; }

        .fullscreen-gallery-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(8px); }
        .btn-close-modal { position: absolute; top: 24px; right: 24px; z-index: 10000; background: transparent; border: none; color: #fff; cursor: pointer; opacity: 0.7; transition: 0.2s; }
        .btn-close-modal:hover { opacity: 1; transform: scale(1.1); }
        .modal-nav { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10000; background: transparent; border: none; color: #fff; cursor: pointer; opacity: 0.5; transition: 0.2s; padding: 20px; }
        .modal-nav:hover { opacity: 1; text-shadow: 0 0 20px rgba(255,255,255,0.5); }
        .modal-nav.prev { left: 40px; }
        .modal-nav.next { right: 40px; }
        
        .modal-content-wrapper { position: relative; z-index: 10000; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center; animation: fadeIn 0.3s; }
        .zoomed-image { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .modal-counter { color: #fff; font-size: 1rem; font-weight: 600; margin-top: 16px; opacity: 0.8; }

        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        @media (max-width: 1024px) {
           .detail-layout-grid { grid-template-columns: 1fr; }
           .sticky-wrapper { position: relative; top: 0; }
        }
        @media (max-width: 768px) {
           .prop-title-row { flex-direction: column; }
           .prop-price-metrics { flex-direction: column; align-items: flex-start; gap: 12px; }
           .divider-vert { display: none; }
           .specs-grid-3 { grid-template-columns: 1fr 1fr; }
           .gallery-main-view { height: 300px; }
           .gallery-thumbnails { grid-template-columns: repeat(5, 1fr); gap: 8px; }
           .thumb-box { height: 60px; }
        }
        @media (max-width: 480px) {
           .specs-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
