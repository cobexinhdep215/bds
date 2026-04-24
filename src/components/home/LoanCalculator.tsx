'use client';
import React, { useState } from 'react';

export const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [loanTerm, setLoanTerm] = useState<number>(10);

  return (
    <section className="loan-calculator container">
      <div className="section-title">
        <h2>Công cụ tính toán khoản vay</h2>
        <div className="tabs">
          <button className="tab active">Tư vấn chọn căn</button>
          <button className="tab">Gợi ý từ HouseNow</button>
        </div>
      </div>

      <div className="calc-card">
        <div className="calc-inputs">
          <div className="input-group">
            <label>Số tiền vay</label>
            <div className="input-with-unit">
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
              <span>VNĐ</span>
            </div>
          </div>

          <div className="input-group">
            <label>Ngân hàng tham khảo</label>
            <select>
              <option>Chọn ngân hàng</option>
              <option>Techcombank</option>
              <option>Vietcombank</option>
              <option>ACB</option>
            </select>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Lãi suất ưu đãi</label>
              <div className="input-with-unit">
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
                <span>%/năm</span>
              </div>
            </div>
            <div className="input-group">
              <label>Thời hạn ưu đãi</label>
              <div className="input-with-unit">
                <input type="number" defaultValue={0} />
                <span>tháng</span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Lãi suất thả nổi</label>
              <div className="input-with-unit">
                <input type="number" defaultValue={10.5} />
                <span>%/năm</span>
              </div>
            </div>
            <div className="input-group">
              <label>Thời hạn vay</label>
              <div className="input-with-unit">
                <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} />
                <span>năm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="calc-result">
          <h3>Kết quả: Trả gốc + lãi cố định</h3>
          <div className="result-item">
            <span>Gốc + lãi tháng đầu trả</span>
            <span className="value">0 VNĐ</span>
          </div>
          <div className="result-item">
            <span>Gốc + lãi sau ưu đãi trả</span>
            <span className="value">0 VNĐ</span>
          </div>
          <div className="result-item bold">
            <span>Tổng gốc + lãi phải trả</span>
            <span className="value bold">0 VNĐ</span>
          </div>

          <div className="buttons">
            <button className="btn-secondary">Chi tiết khoản vay</button>
            <button className="btn-primary">Đăng ký tư vấn</button>
          </div>
          <p className="note">Lưu ý: Công cụ tính toán này chỉ hỗ trợ cho việc ước tính khoản vay mang tính chất tham khảo...</p>
        </div>
      </div>

      <style jsx>{`
        .loan-calculator {
          padding: 60px 16px;
        }
        .section-title {
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        h2 { font-size: 1.8rem; font-weight: 800; }
        .tabs {
          background: var(--bg-alt);
          padding: 4px;
          border-radius: 30px;
          display: flex;
        }
        .tab {
          padding: 8px 24px;
          border-radius: 26px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .tab.active {
          background: #fff;
          color: var(--primary-color);
          box-shadow: var(--shadow-sm);
        }

        .calc-card {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          background: #fff;
          border-radius: 24px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .calc-inputs {
          padding: 40px;
        }
        .calc-result {
          background: var(--primary-color);
          color: #fff;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        .input-group {
          margin-bottom: 24px;
        }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        .input-with-unit {
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }
        .input-with-unit input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 1.1rem;
          font-weight: 700;
        }
        select {
          width: 100%;
          border: none;
          border-bottom: 1px solid var(--border-color);
          padding: 8px 0;
          font-size: 1rem;
          outline: none;
        }
        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .calc-result h3 {
          font-size: 1.4rem;
          margin-bottom: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 16px;
        }
        .result-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 0.95rem;
          opacity: 0.9;
        }
        .result-item.bold {
          opacity: 1;
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 16px;
          margin-top: 16px;
        }
        .value { font-weight: 700; }
        .value.bold { font-size: 1.2rem; }

        .buttons {
          margin-top: auto;
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }
        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
        }
        .btn-primary { background: #fff; color: var(--primary-color); }
        .btn-secondary { background: rgba(255,255,255,0.1); border: 1px solid #fff; color: #fff; }
        .note { font-size: 0.75rem; opacity: 0.7; line-height: 1.4; }

        @media (max-width: 900px) {
          .calc-card { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
