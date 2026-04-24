'use client';
import React, { useState } from 'react';
import { Percent, TrendingUp, Headset } from 'lucide-react';

export const LoanCalculatorSection = () => {
  const [tab, setTab] = useState('tu-nghien-cuu');
  const [amount, setAmount] = useState('0');

  return (
    <section className="home-loan-section">
      <div className="section-header-row">
         <div className="section-header-left">
            <h2>Vay mua nhà cùng HouseNow</h2>
            <p>Khám phá các ưu đãi tốt nhất từ các ngân hàng</p>
         </div>
      </div>

      {/* Benefits */}
      <div className="loan-benefits-row">
         <div className="loan-benefit-card">
            <div className="loan-icon-circle"><Percent size={24}/></div>
            <h3>Lãi suất độc quyền</h3>
            <p>Lãi suất tốt nhất thị trường, dành riêng cho khách hàng HouseNow</p>
         </div>
         <div className="loan-benefit-card">
            <div className="loan-icon-circle"><TrendingUp size={24}/></div>
            <h3>Tăng khả năng duyệt hồ sơ</h3>
            <p>Hồ sơ của bạn được ngân hàng ưu tiên xét duyệt, tăng cơ hội duyệt thành công</p>
         </div>
         <div className="loan-benefit-card">
            <div className="loan-icon-circle"><Headset size={24}/></div>
            <h3>Chuyên viên tư vấn riêng</h3>
            <p>Giúp cá nhân hóa phương án vay phù hợp với hồ sơ của bạn</p>
         </div>
      </div>

      {/* Calculator */}
      <div className="section-header-row" style={{ marginTop: '80px', borderBottom: 'none' }}>
         <div className="section-header-left">
            <h2>Công cụ tính toán khoản vay</h2>
         </div>
      </div>

      <div className="loan-calculator-grid">
         {/* Left Form */}
         <div className="calc-left">
            <div className="calc-tabs">
               <button className={`calc-tab ${tab === 'tu-nghien-cuu' ? 'active' : ''}`} onClick={() => setTab('tu-nghien-cuu')}>Tự nghiên cứu</button>
               <button className={`calc-tab ${tab === 'goi-y' ? 'active' : ''}`} onClick={() => setTab('goi-y')}>Gợi ý từ HouseNow</button>
            </div>

            <div className="calc-form-group">
               <label>Số tiền vay</label>
               <div className="calc-input-wrapper">
                  <input type="text" value={amount} onChange={e => setAmount(e.target.value)} />
                  <div className="calc-input-unit">VND</div>
               </div>
            </div>

            <div className="calc-form-group">
               <label>Ngân hàng tham khảo</label>
               <div className="calc-input-wrapper">
                  <select defaultValue="">
                     <option value="" disabled>Chọn</option>
                     <option value="vcb">Vietcombank</option>
                     <option value="mbb">MBBank</option>
                  </select>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
               <div className="calc-form-group" style={{ flex: 1 }}>
                  <label>Lãi suất ưu đãi</label>
                  <div className="calc-input-wrapper">
                     <input type="text" defaultValue="0" />
                     <div className="calc-input-unit">% / Năm</div>
                  </div>
               </div>
               <div className="calc-form-group" style={{ flex: 1 }}>
                  <label>Thời hạn ưu đãi</label>
                  <div className="calc-input-wrapper">
                     <input type="text" defaultValue="0" />
                     <div className="calc-input-unit">Tháng</div>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
               <div className="calc-form-group" style={{ flex: 1 }}>
                  <label>Lãi suất thả nổi</label>
                  <div className="calc-input-wrapper">
                     <input type="text" defaultValue="10" />
                     <div className="calc-input-unit">% / Năm</div>
                  </div>
               </div>
               <div className="calc-form-group" style={{ flex: 1 }}>
                  <label>Thời hạn vay</label>
                  <div className="calc-input-wrapper">
                     <input type="text" defaultValue="0" />
                     <div className="calc-input-unit">Năm</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Results */}
         <div className="calc-right">
            <h3 className="calc-result-title">Kết quả: Trả gốc + lãi cố định</h3>
            
            <div className="calc-result-row">
               <span className="calc-result-label">Gốc + lãi tháng đầu trả</span>
               <span className="calc-result-val">0 VND</span>
            </div>
            <div className="calc-result-row">
               <span className="calc-result-label">Gốc + lãi sau ưu đãi trả</span>
               <span className="calc-result-val">0 VND</span>
            </div>
            <div className="calc-result-row">
               <span className="calc-result-label">Tổng gốc + lãi phải trả</span>
               <span className="calc-result-val">0 VND</span>
            </div>

            <div className="calc-buttons">
               <button className="calc-btn-outline">Chi tiết khoản vay</button>
               <button className="calc-btn-primary">Đăng ký tư vấn</button>
            </div>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '24px', lineHeight: 1.5 }}>
               Lưu ý: Công cụ tính toán này chỉ hỗ trợ cho việc ước tính khoản vay, không phải là sự đảm bảo về khoản vay của HouseNow
            </p>
         </div>
      </div>
    </section>
  );
};
