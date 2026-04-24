'use client';
import React from 'react';
import { CreditCard, Wallet, ArrowUpRight, History } from 'lucide-react';

export default function BrokerMoney() {
  return (
    <div className="money-page">
       <div className="money-header">
          <h1>Quản lý tài chính</h1>
          <p>Nạp tiền, quản lý số dư và lịch sử giao dịch của bạn.</p>
       </div>

       <div className="money-stats">
          <div className="m-card main">
             <div className="m-info">
                <span>Số dư khả dụng</span>
                <h3>0 đ</h3>
             </div>
             <div className="m-actions">
                <button className="btn-deposit">Nạp tiền ngay</button>
             </div>
          </div>
          <div className="m-card">
             <div className="m-info">
                <span>Khuyến mãi</span>
                <h3>0 đ</h3>
             </div>
          </div>
          <div className="m-card">
             <div className="m-info">
                <span>Đã chi tiêu tháng này</span>
                <h3>0 đ</h3>
             </div>
          </div>
       </div>

       <div className="transaction-history">
          <div className="t-header">
             <h4>Lịch sử giao dịch</h4>
             <button className="btn-view-all">Xem tất cả <History size={16} /></button>
          </div>
          <div className="empty-history">
             <p>Bạn chưa có giao dịch nào.</p>
          </div>
       </div>

       <style jsx>{`
         .money-page { display: flex; flex-direction: column; gap: 32px; }
         .money-header h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
         .money-header p { color: #64748b; }

         .money-stats { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 24px; }
         .m-card { background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
         .m-card.main { background: #005B4B; color: #fff; border: none; }
         .m-info span { font-size: 0.85rem; opacity: 0.8; display: block; margin-bottom: 4px; }
         .m-info h3 { font-size: 2rem; font-weight: 800; }
         
         .btn-deposit { background: #fff; color: #005B4B; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
         .btn-deposit:hover { transform: scale(1.05); }

         .transaction-history { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 32px; }
         .t-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
         .t-header h4 { font-weight: 800; font-size: 1.2rem; }
         .btn-view-all { display: flex; align-items: center; gap: 8px; background: transparent; border: none; font-weight: 700; color: #005B4B; cursor: pointer; }
         
         .empty-history { padding: 60px; text-align: center; color: #94a3b8; font-style: italic; border: 2px dashed #f1f5f9; border-radius: 16px; }
       `}</style>
    </div>
  );
}
