'use client';
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { PropertyCard } from '@/components/common/PropertyCard';
import { ChevronDown, Search, X, Check, ArrowLeft, Mountain, Sun, Flame, Leaf, DoorOpen, Castle } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const PROVINCES = [
  { name: 'Hà Nội', districts: ['An Khánh', 'Ba Đình', 'Bắc Từ Liêm', 'Bồ Đề', 'Cầu Giấy', 'Chương Mỹ', 'Đại Mỗ', 'Đan Phượng', 'Đông Anh', 'Đống Đa', 'Gia Lâm', 'Hà Đông', 'Hai Bà Trưng', 'Hoài Đức', 'Hoàn Kiếm', 'Hoàng Mai', 'Long Biên', 'Mê Linh', 'Nam Từ Liêm', 'Phú Xuyên', 'Phúc Thọ', 'Quốc Oai', 'Sóc Sơn', 'Sơn Tây', 'Tây Hồ', 'Thạch Thất', 'Thanh Oai', 'Thanh Trì', 'Thanh Xuân', 'Thường Tín', 'Ứng Hòa'] },
  { name: 'TP. Hồ Chí Minh', districts: ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Bình Tân', 'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Thủ Đức', 'Bình Chánh', 'Cần Giờ', 'Củ Chi', 'Hóc Môn', 'Nhà Bè'] },
  { name: 'Đà Nẵng', districts: ['Hải Châu', 'Thanh Khê', 'Liên Chiểu', 'Sơn Trà', 'Ngũ Hành Sơn', 'Cẩm Lệ', 'Hòa Vang'] },
  { name: 'Bình Dương', districts: ['Thủ Dầu Một', 'Thuận An', 'Dĩ An', 'Bến Cát', 'Tân Uyên', 'Bắc Tân Uyên', 'Bàu Bàng', 'Dầu Tiếng', 'Phú Giáo'] }
];

const PRICE_RANGES = [
  { label: 'Tất cả', min: null, max: null },
  { label: 'Dưới 1 tỷ', min: 0, max: 1000000000 },
  { label: '1 - 2 tỷ', min: 1000000000, max: 2000000000 },
  { label: '2 - 3 tỷ', min: 2000000000, max: 3000000000 },
  { label: '3 - 5 tỷ', min: 3000000000, max: 5000000000 },
  { label: '5 - 7 tỷ', min: 5000000000, max: 7000000000 },
  { label: '7 - 10 tỷ', min: 7000000000, max: 10000000000 },
  { label: 'Trên 10 tỷ', min: 10000000000, max: 999000000000 }
];

const AREA_RANGES = [
  { label: 'Tất cả', min: null, max: null },
  { label: '< 30 m²', min: 0, max: 30 },
  { label: '30 - 45 m²', min: 30, max: 45 },
  { label: '45 - 60 m²', min: 45, max: 60 },
  { label: '60 - 80 m²', min: 60, max: 80 },
  { label: '80 - 100 m²', min: 80, max: 100 },
  { label: '100 - 120 m²', min: 100, max: 120 },
  { label: '120 - 150 m²', min: 120, max: 150 },
  { label: '150 - 200 m²', min: 150, max: 200 },
  { label: '> 200 m²', min: 200, max: 10000 }
];

const DIRECTIONS_CONFIG = [
  { name: 'Bắc', icon: <Mountain size={14} className="dir-icon" /> },
  { name: 'Đông Bắc', icon: null },
  { name: 'Đông', icon: <Leaf size={14} className="dir-icon" /> },
  { name: 'Đông Nam', icon: null },
  { name: 'Nam', icon: <Flame size={14} className="dir-icon" /> },
  { name: 'Tây Nam', icon: null },
  { name: 'Tây', icon: <Sun size={14} className="dir-icon" /> },
  { name: 'Tây Bắc', icon: null }
];

const BEDS = ['Studio', '1', '2', '3', '4+'];
const DIRECTIONS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];

function ListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [properties, setProperties] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filter States (Immediate sync with URL)
  const filterProvince = searchParams.get('province') || '';
  const filterDistricts = searchParams.get('districts')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minArea = searchParams.get('minArea');
  const maxArea = searchParams.get('maxArea');
  const beds = searchParams.get('beds')?.split(',').filter(Boolean) || [];
  const directions = searchParams.get('directions')?.split(',').filter(Boolean) || [];
  const balconyDirections = searchParams.get('balcony')?.split(',').filter(Boolean) || [];
  const sortBy = searchParams.get('sort') || 'matching';
  const page = parseInt(searchParams.get('page') || '1');

  // Pending States (Wait for "Xác nhận")
  const [pProvince, setPProvince] = useState(filterProvince);
  const [pDistricts, setPDistricts] = useState<string[]>(filterDistricts);
  const [pPrice, setPPrice] = useState<any>(null);
  const [pArea, setPArea] = useState<any>(null);
  const [pBeds, setPBeds] = useState<string[]>(beds);
  const [pDirections, setPDirections] = useState<string[]>(directions);
  const [pBalcony, setPBalcony] = useState<string[]>(balconyDirections);
  
  // Location view state
  const [locView, setLocView] = useState<'province' | 'district'>('province');

  useEffect(() => {
    // Sync pending states when dropdown opens
    if (openDropdown === 'location') {
      setPProvince(filterProvince);
      setPDistricts(filterDistricts);
      setLocView(filterProvince ? 'district' : 'province');
    } else if (openDropdown === 'price') {
      const match = PRICE_RANGES.find(r => r.min === (minPrice ? parseInt(minPrice) : null) && r.max === (maxPrice ? parseInt(maxPrice) : null));
      setPPrice(match || PRICE_RANGES[0]);
    } else if (openDropdown === 'area') {
      const match = AREA_RANGES.find(r => r.min === (minArea ? parseInt(minArea) : null) && r.max === (maxArea ? parseInt(maxArea) : null));
      setPArea(match || AREA_RANGES[0]);
    } else if (openDropdown === 'beds') {
      setPBeds(beds);
    } else if (openDropdown === 'direction') {
      setPDirections(directions);
      setPBalcony(balconyDirections);
    }
  }, [openDropdown]);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has('limit')) params.set('limit', '16');
    
    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Reset to page 1 on new filter
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
    setOpenDropdown(null);
  };

  const handleApplyLocation = () => {
    updateURL({
       province: pProvince,
       districts: pDistricts.length > 0 ? pDistricts.join(',') : null
    });
  };

  const handleApplyPrice = () => {
    updateURL({
       minPrice: pPrice?.min !== null ? pPrice.min.toString() : null,
       maxPrice: pPrice?.max !== null ? pPrice.max.toString() : null
    });
  };

  const handleApplyBeds = () => {
    updateURL({ beds: pBeds.length > 0 ? pBeds.join(',') : null });
  };

  const handleApplyArea = () => {
    updateURL({
       minArea: pArea?.min !== null ? pArea.min.toString() : null,
       maxArea: pArea?.max !== null ? pArea.max.toString() : null
    });
  };

  const handleApplyDirection = () => {
    updateURL({
       directions: pDirections.length > 0 ? pDirections.join(',') : null,
       balcony: pBalcony.length > 0 ? pBalcony.join(',') : null
    });
  };

  const clearFilters = () => {
    router.push(pathname);
    setOpenDropdown(null);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main>
      <Header />
      
      <div className="filter-bar sticky-nav">
        <div className="container filter-content">
          {/* Khu vực */}
          <div className={`filter-item ${openDropdown === 'location' ? 'opening' : ''}`} onClick={() => setOpenDropdown('location')}>
            <label>Khu vực</label>
            <div className="select-box">
              {filterDistricts.length > 0 ? (filterDistricts.length === 1 ? filterDistricts[0] : `${filterDistricts[0]} (+${filterDistricts.length - 1})`) : (filterProvince || 'Tất cả')}
              <ChevronDown size={14} className="chevron" />
            </div>
            {openDropdown === 'location' && (
              <div className="dropdown-panel location-panel-v2" onClick={e => e.stopPropagation()}>
                {locView === 'province' ? (
                   <>
                      <div className="panel-header-v2">
                         <h3>Chọn Tỉnh/Thành phố</h3>
                         <X size={20} onClick={() => setOpenDropdown(null)} style={{cursor:'pointer'}} />
                      </div>
                      <div className="scroll-list">
                         <div className={`loc-option ${!pProvince ? 'active' : ''}`} onClick={() => { setPProvince(''); setPDistricts([]); handleApplyLocation(); }}>Tất cả</div>
                         {PROVINCES.map(p => (
                            <div key={p.name} className="loc-option" onClick={() => { setPProvince(p.name); setPDistricts([]); setLocView('district'); }}>
                               {p.name}
                               <ChevronDown size={16} style={{transform: 'rotate(-90deg)', opacity: 0.5}} />
                            </div>
                         ))}
                      </div>
                   </>
                ) : (
                   <>
                      <div className="panel-header-v2">
                         <button className="btn-back" onClick={() => setLocView('province')}><ArrowLeft size={18} /> Khu vực {pProvince}</button>
                         <X size={20} onClick={() => setOpenDropdown(null)} style={{cursor:'pointer'}} />
                      </div>
                      <div className="tab-switcher">
                         <span>Thành phố</span> / <span className="active">Quận/Huyện</span>
                      </div>
                      <div className="scroll-list checkbox-list-v2">
                         <div className="loc-option check" onClick={() => {
                            const all = PROVINCES.find(p => p.name === pProvince)?.districts || [];
                            setPDistricts(pDistricts.length === all.length ? [] : all);
                         }}>
                            <span>Chọn tất cả</span>
                            <div className={`custom-cb ${pDistricts.length === (PROVINCES.find(p => p.name === pProvince)?.districts.length || 0) ? 'checked' : ''}`}></div>
                         </div>
                         {PROVINCES.find(p => p.name === pProvince)?.districts.map(d => {
                            const isChecked = pDistricts.includes(d);
                            return (
                               <div key={d} className="loc-option check" onClick={() => setPDistricts(prev => isChecked ? prev.filter(x => x !== d) : [...prev, d])}>
                                  <span>{d}</span>
                                  <div className={`custom-cb ${isChecked ? 'checked' : ''}`}></div>
                               </div>
                            );
                         })}
                      </div>
                      <div className="panel-footer-v2">
                         <button className="btn-clear-v2" onClick={() => { setPDistricts([]); setPProvince(''); setLocView('province'); }}>Bỏ lọc</button>
                         <button className="btn-apply-v2" onClick={handleApplyLocation}>Xác nhận</button>
                      </div>
                   </>
                )}
              </div>
            )}
          </div>

          {/* Khoảng giá */}
          <div className="filter-item" onClick={() => setOpenDropdown('price')}>
            <label>Khoảng giá</label>
            <div className="select-box">
              {PRICE_RANGES.find(r => r.min === (minPrice ? parseInt(minPrice) : null) && r.max === (maxPrice ? parseInt(maxPrice) : null))?.label || 'Tất cả'}
              <ChevronDown size={14} className="chevron" />
            </div>
            {openDropdown === 'price' && (
              <div className="dropdown-panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header-v2"><h3>Khoảng giá</h3></div>
                <div className="scroll-list radio-list-v2">
                   {PRICE_RANGES.map(r => (
                     <div key={r.label} className="loc-option radio" onClick={() => setPPrice(r)}>
                        <span>{r.label}</span>
                        <div className={`custom-radio ${pPrice?.label === r.label ? 'checked' : ''}`}></div>
                     </div>
                   ))}
                </div>
                <div className="panel-footer-v2">
                  <button className="btn-clear-v2" onClick={() => setPPrice(PRICE_RANGES[0])}>Bỏ lọc</button>
                  <button className="btn-apply-v2" onClick={handleApplyPrice}>Xác nhận</button>
                </div>
              </div>
            )}
          </div>

          {/* Phòng ngủ */}
          <div className="filter-item" onClick={() => setOpenDropdown('beds')}>
            <label>Phòng ngủ</label>
            <div className="select-box">
              {beds.length > 0 ? `${beds.join(', ')} PN` : 'Tất cả'}
              <ChevronDown size={14} className="chevron" />
            </div>
            {openDropdown === 'beds' && (
              <div className="dropdown-panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header-v2"><h3>Số phòng ngủ</h3></div>
                <div className="scroll-list checkbox-list-v2">
                   {BEDS.map(b => (
                     <div key={b} className="loc-option check" onClick={() => setPBeds(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])}>
                       <span>{b} {b !== 'Studio' ? 'PN' : ''}</span>
                       <div className={`custom-cb ${pBeds.includes(b) ? 'checked' : ''}`}></div>
                     </div>
                   ))}
                </div>
                <div className="panel-footer-v2">
                  <button className="btn-clear-v2" onClick={() => setPBeds([])}>Bỏ lọc</button>
                  <button className="btn-apply-v2" onClick={handleApplyBeds}>Xác nhận</button>
                </div>
              </div>
            )}
          </div>

          {/* Diện tích */}
          <div className="filter-item" onClick={() => setOpenDropdown('area')}>
            <label>Diện tích</label>
            <div className="select-box">
              {AREA_RANGES.find(r => r.min === (minArea ? parseInt(minArea) : null) && r.max === (maxArea ? parseInt(maxArea) : null))?.label || 'Tất cả'}
              <ChevronDown size={14} className="chevron" />
            </div>
            {openDropdown === 'area' && (
              <div className="dropdown-panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header-v2"><h3>Diện tích</h3></div>
                <div className="scroll-list radio-list-v2">
                   {AREA_RANGES.map(r => (
                     <div key={r.label} className="loc-option radio" onClick={() => setPArea(r)}>
                       <span>{r.label}</span>
                       <div className={`custom-radio ${pArea?.label === r.label ? 'checked' : ''}`}></div>
                     </div>
                   ))}
                </div>
                <div className="panel-footer-v2">
                  <button className="btn-clear-v2" onClick={() => setPArea(AREA_RANGES[0])}>Bỏ lọc</button>
                  <button className="btn-apply-v2" onClick={handleApplyArea}>Xác nhận</button>
                </div>
              </div>
            )}
          </div>

          {/* Hướng nhà */}
          <div className="filter-item" onClick={() => setOpenDropdown('direction')}>
            <label>Hướng nhà</label>
            <div className="select-box">
              {directions.length > 0 ? directions[0] + (directions.length > 1 ? `+${directions.length-1}` : '') : 'Tất cả'}
              <ChevronDown size={14} className="chevron" />
            </div>
            {openDropdown === 'direction' && (
              <div className="dropdown-panel multi-compass-panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header-v2"><h3>Hướng nhà</h3></div>
                <div className="multi-compass-scroll">
                   <div className="compass-section">
                      <p className="compass-title">Hướng cửa chính</p>
                      <div className="compass-wrapper">
                         <svg viewBox="0 0 100 100" className="compass-svg">
                            {DIRECTIONS_CONFIG.map((d, i) => {
                               const startAngle = (i * 45 - 22.5 - 90) * (Math.PI / 180);
                               const endAngle = ((i + 1) * 45 - 22.5 - 90) * (Math.PI / 180);
                               const x1 = 50 + 50 * Math.cos(startAngle);
                               const y1 = 50 + 50 * Math.sin(startAngle);
                               const x2 = 50 + 50 * Math.cos(endAngle);
                               const y2 = 50 + 50 * Math.sin(endAngle);
                               
                               const isActive = pDirections.includes(d.name);
                               
                               // Calculate label position (at 75% radius)
                               const midAngle = (startAngle + endAngle) / 2;
                               const lx = 50 + 35 * Math.cos(midAngle);
                               const ly = 50 + 35 * Math.sin(midAngle);

                               return (
                                  <g key={d.name} className={`compass-path ${isActive ? 'active' : ''}`} onClick={() => setPDirections(prev => isActive ? prev.filter(x => x !== d.name) : [...prev, d.name])}>
                                     <path d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} fill={isActive ? '#005B4B' : '#edf4f2'} stroke="#fff" strokeWidth="0.5" />
                                     <foreignObject x={lx - 25} y={ly - 15} width="50" height="30">
                                        <div className="svg-label-container">
                                           {d.icon && (isActive ? React.cloneElement(d.icon as any, { color: '#fff' }) : d.icon)}
                                           <span className={`dir-name ${isActive ? 'active' : ''}`}>{d.name}</span>
                                        </div>
                                     </foreignObject>
                                  </g>
                               );
                            })}
                         </svg>
                         <div className="compass-core"><DoorOpen size={28} color="#005B4B" /></div>
                      </div>
                   </div>
                   <div className="compass-section">
                      <p className="compass-title">Hướng ban công</p>
                      <div className="compass-wrapper">
                         <svg viewBox="0 0 100 100" className="compass-svg">
                            {DIRECTIONS_CONFIG.map((d, i) => {
                               const startAngle = (i * 45 - 22.5 - 90) * (Math.PI / 180);
                               const endAngle = ((i + 1) * 45 - 22.5 - 90) * (Math.PI / 180);
                               const x1 = 50 + 50 * Math.cos(startAngle);
                               const y1 = 50 + 50 * Math.sin(startAngle);
                               const x2 = 50 + 50 * Math.cos(endAngle);
                               const y2 = 50 + 50 * Math.sin(endAngle);
                               
                               const isActive = pBalcony.includes(d.name);
                               const midAngle = (startAngle + endAngle) / 2;
                               const lx = 50 + 35 * Math.cos(midAngle);
                               const ly = 50 + 35 * Math.sin(midAngle);

                               return (
                                  <g key={d.name} className={`compass-path ${isActive ? 'active' : ''}`} onClick={() => setPBalcony(prev => isActive ? prev.filter(x => x !== d.name) : [...prev, d.name])}>
                                     <path d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} fill={isActive ? '#005B4B' : '#edf4f2'} stroke="#fff" strokeWidth="0.5" />
                                     <foreignObject x={lx - 25} y={ly - 15} width="50" height="30">
                                        <div className="svg-label-container">
                                           {d.icon && (isActive ? React.cloneElement(d.icon as any, { color: '#fff' }) : d.icon)}
                                           <span className={`dir-name ${isActive ? 'active' : ''}`}>{d.name}</span>
                                        </div>
                                     </foreignObject>
                                  </g>
                               );
                            })}
                         </svg>
                         <div className="compass-core"><Castle size={28} color="#005B4B" /></div>
                      </div>
                   </div>
                </div>
                <div className="panel-footer-v2">
                  <button className="btn-clear-v2" onClick={() => { setPDirections([]); setPBalcony([]); }}>Bỏ lọc</button>
                  <button className="btn-apply-v2" onClick={handleApplyDirection}>Xác nhận</button>
                </div>
              </div>
            )}
          </div>

          <button className="btn-reset-v2" onClick={clearFilters} title="Xóa tất cả bộ lọc">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="listing-page container">
        <div className="listing-header">
          <div className="count">
            <h1>Mua bán căn hộ chung cư mới nhất 2026</h1>
            <span>Tìm được <strong>{pagination.total}</strong> kết quả</span>
          </div>
          <div className="sorting-container">
            <span>Sắp xếp:</span>
            <select value={sortBy} onChange={(e) => updateURL({ sort: e.target.value })} className="sort-select">
               <option value="matching">Phù hợp nhất</option>
               <option value="newest">Mới nhất</option>
               <option value="price_asc">Giá thấp đến cao</option>
               <option value="price_desc">Giá cao xuống thấp</option>
            </select>
          </div>
        </div>

        <div className="results-grid">
           {isLoading ? Array(8).fill(0).map((_, i) => <div key={i} className="skeleton-card"></div>) : 
             properties.length > 0 ? properties.map(p => (
               <PropertyCard key={p.id} property={{
                 ...p,
                 price: p.price.toLocaleString('vi-VN') + ' đ',
                 area: Math.round(p.price / (p.area || 1)).toLocaleString('vi-VN') + ' đ/m²',
                 location: `${p.district ? p.district + ', ' : ''}${p.province}`,
                 image: p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                 beds: parseInt(p.bedrooms) || 0,
                 baths: parseInt(p.bathrooms) || 0,
                 size: p.area
               } as any} />
             )) : (
               <div className="no-results">
                  <p>Tiếc quá, chúng tôi không tìm thấy kết quả nào phù hợp.</p>
                  <button className="btn-outline" onClick={clearFilters}>Xóa bộ lọc để xem nhiều tin hơn</button>
               </div>
             )
           }
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)}>←</button>
            {Array.from({length: pagination.totalPages}, (_, i) => i + 1).map(pNum => (
              <button 
                key={pNum} 
                className={pagination.page === pNum ? 'active' : ''}
                onClick={() => handlePageChange(pNum)}
              >{pNum}</button>
            ))}
            <button disabled={pagination.page === pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>→</button>
          </div>
        )}

        <section className="seo-content">
           <h2>BDSXXX - Kênh thông tin mua bán căn hộ chung cư số 1 Việt Nam</h2>
           <p>Tại BDSXXX, chúng tôi cung cấp giải pháp tìm kiếm bất động sản toàn diện với bộ lọc thông minh theo Tỉnh thành, Quận huyện, Khoảng giá, Diện tích và Hướng nhà. Dữ liệu được cập nhật liên tục 24/7 từ các nguồn uy tín.</p>
        </section>
      </div>

      <style jsx>{`
        .sticky-nav { position: sticky; top: var(--header-height); background: #fff; z-index: 1000; border-bottom: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .filter-content { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
        .filter-item { flex: 1; min-width: 0; position: relative; padding: 8px 12px; border: 1px solid #e0e6e8; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .filter-item:hover, .filter-item.opening { border-color: #005B4B; background: #f0fdf9; }
        .filter-item label { display: block; font-size: 0.7rem; color: #667085; text-transform: uppercase; margin-bottom: 2px; }
        .select-box { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 0.85rem; color: #101828; }
        .chevron { transition: 0.3s; }
        .opening .chevron { transform: rotate(180deg); }

        /* V2 Dropdown */
        .dropdown-panel { position: absolute; top: calc(100% + 12px); left: 0; width: 350px; background: #fff; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: 1px solid #eee; z-index: 2000; overflow: hidden; }
        .location-panel-v2 { width: 400px; }
        .multi-compass-panel { width: 380px; }
        
        .panel-header-v2 { padding: 16px 20px; border-bottom: 1px solid #f2f4f7; display: flex; justify-content: space-between; align-items: center; }
        .panel-header-v2 h3 { font-size: 1rem; font-weight: 700; margin: 0; }
        .btn-back { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #101828; background: none; border: none; font-size: 1rem; }
        
        .tab-switcher { padding: 12px 20px; font-size: 0.9rem; font-weight: 600; color: #666; border-bottom: 1px solid #f2f4f7; }
        .tab-switcher .active { color: #005B4B; text-decoration: underline; text-underline-offset: 4px; }

        .scroll-list { max-height: 400px; overflow-y: auto; padding: 8px 0; }
        .loc-option { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; font-weight: 500; cursor: pointer; border-bottom: 1px solid #f9f9f9; }
        .loc-option:hover { background: #f9fafb; }
        .loc-option.active { color: #005B4B; font-weight: 700; background: #f0fdf9; }

        .checkbox-list-v2 .loc-option, .radio-list-v2 .loc-option { justify-content: space-between; }
        .custom-cb { width: 22px; height: 22px; border: 2px solid #d0d5dd; border-radius: 4px; }
        .custom-cb.checked { background: #005B4B; border-color: #005B4B; position: relative; }
        .custom-cb.checked::after { content: '✓'; color: #fff; position: absolute; left: 4px; top: -1px; font-size: 14px; }
        
        .custom-radio { width: 22px; height: 22px; border: 2px solid #d0d5dd; border-radius: 50%; }
        .custom-radio.checked { border-color: #005B4B; border-width: 6px; }

        .panel-footer-v2 { padding: 16px 20px; border-top: 1px solid #f2f4f7; display: flex; gap: 12px; }
        .btn-clear-v2 { flex: 1; padding: 12px; border: 1px solid #d0d5dd; border-radius: 8px; font-weight: 700; background: #fff; }
        .btn-apply-v2 { flex: 1; padding: 12px; background: #005B4B; color: #fff; border-radius: 8px; font-weight: 700; }

        /* Compass V3 - SVG Based */
        .multi-compass-scroll { max-height: 500px; overflow-y: auto; padding: 24px; background: #fff; }
        .compass-section { margin-bottom: 48px; display: flex; flex-direction: column; align-items: center; }
        .compass-title { font-weight: 700; margin-bottom: 24px; color: #101828; font-size: 1.1rem; width: 100%; text-align: left; }
        .compass-wrapper { position: relative; width: 280px; height: 280px; }
        .compass-svg { width: 100%; height: 100%; overflow: visible; display: block; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.05)); }
        .compass-path { cursor: pointer; transition: 0.2s; outline: none; }
        .compass-path:hover path { opacity: 0.8; }
        .svg-label-container { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; pointer-events: none; }
        .dir-icon { color: #f79009; }
        .dir-name { font-size: 8px; font-weight: 700; color: #475467; text-align: center; line-height: 1; letter-spacing: -0.2px; }
        .dir-name.active { color: #fff; }
        .compass-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #edf4f2; pointer-events: none; }

        /* Utilities */
        .btn-reset-v2 { background: #f2f4f7; width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666; transition: 0.2s; }
        .btn-reset-v2:hover { background: #fee4e2; color: #d92d20; }

        .listing-page { padding: 40px 16px; min-height: 900px; }
        .listing-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .count h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; }
        .count span strong { color: #005B4B; }
        .sorting-container { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #475467; }
        .sort-select { border: none; font-weight: 700; outline: none; cursor: pointer; color: #101828; }

        .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .skeleton-card { height: 360px; background: #f2f4f7; border-radius: 12px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .no-results { grid-column: 1/-1; text-align: center; padding: 120px 0; color: #666; }
        .btn-outline { border: 1px solid #d0d5dd; background: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 700; margin-top: 20px; }

        .pagination { display: flex; justify-content: center; gap: 8px; margin: 60px 0; }
        .pagination button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid #eaecf0; background: #fff; font-weight: 700; }
        .pagination button.active { background: #005B4B; color: #fff; }

        @media (max-width: 1024px) {
           .filter-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; }
           .filter-content { width: max-content; }
        }
      `}</style>
    </main>
  );
}

export default function ListingPage() {
  return (
    <Suspense fallback={<div>Đang tải bộ lọc...</div>}>
      <ListingContent />
    </Suspense>
  );
}
