'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Clock, Tag } from 'lucide-react';

export default function TagPage() {
  const params = useParams();
  const tagParam = decodeURIComponent(params.tag as string);
  
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     Promise.all([
        fetch('/api/news-categories').then(r => r.json()),
        fetch('/api/news').then(r => r.json())
     ]).then(([cats, newsData]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        // Lọc các bài viết có tag khớp (case insensitive)
        const filteredNews = Array.isArray(newsData) 
           ? newsData.filter((n: any) => n.tags && n.tags.some((t: string) => t.toLowerCase() === tagParam.toLowerCase())) 
           : [];
        setNews(filteredNews);
        setIsLoading(false);
     });
  }, [tagParam]);

  const getCategorySlug = (catId: string) => {
     return categories.find(c => c.id === catId)?.slug || 'chung';
  };

  return (
    <main className="container category-page">
      <div className="news-breadcrumb">
        BDSXXX <ChevronRight size={14} /> 
        <Link href="/tin-tuc">Tin tức</Link> 
        <ChevronRight size={14} /> 
        <Link href="/tin-tuc">Tags</Link>
        <ChevronRight size={14} /> 
        <span>{tagParam}</span>
      </div>

      <div className="tag-header" style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '3px solid #f1f5f9' }}>
         <h1 className="category-title" style={{ marginBottom: '8px', borderBottom: 'none', paddingBottom: '0' }}>
            <Tag size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle', color: '#005B4B' }} />
            Kết quả cho Tag: "{tagParam}"
         </h1>
         <p style={{ color: '#64748b', fontSize: '1rem' }}>Tìm thấy {news.length} bài viết liên quan đến "{tagParam}"</p>
      </div>

      <div className="news-list">
         {isLoading ? (
            <p>Đang tải dữ liệu...</p>
         ) : news.map(item => (
            <Link 
               key={item.id} 
               href={`/tin-tuc/${getCategorySlug(item.category)}/${item.slug}`} 
               className="horizontal-card"
            >
               <img src={item.image} alt={item.title} />
               <div className="card-info">
                  <h3>{item.title}</h3>
                  <p>{item.content.replace(/<[^>]*>/g, '').substring(0, 200)}...</p>
                  <div className="news-meta"><Clock size={14} /> <span>{item.date} • {item.viewCount} xem</span></div>
               </div>
            </Link>
         ))}
         {!isLoading && news.length === 0 && (
            <p className="news-empty">Chưa có bài viết nào được gắn tag này.</p>
         )}
      </div>
    </main>
  );
}
