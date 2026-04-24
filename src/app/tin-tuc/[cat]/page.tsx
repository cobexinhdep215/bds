'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Clock } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.cat as string;
  
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     Promise.all([
        fetch('/api/news-categories').then(r => r.json()),
        fetch('/api/news').then(r => r.json())
     ]).then(([cats, newsData]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        const cat = cats.find((c: any) => c.slug === categorySlug);
        setCurrentCategory(cat);
        
        if (cat) {
           const filtered = newsData.filter((n: any) => n.category === cat.id);
           setNews(filtered);
        }
        setIsLoading(false);
     });
  }, [categorySlug]);

  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Đang tải chuyên mục...</div>;
  if (!currentCategory) return <div style={{ padding: '100px', textAlign: 'center' }}>Chuyên mục không tồn tại</div>;

  return (
    <main className="container category-page">
      <div className="news-breadcrumb">
        BDSXXX <ChevronRight size={14} /> 
        <Link href="/tin-tuc">Tin tức</Link> 
        <ChevronRight size={14} /> 
        <span>{currentCategory.name}</span>
      </div>

      <h1 className="category-title">{currentCategory.name}</h1>

      <div className="news-list">
         {news.map(item => (
            <Link key={item.id} href={`/tin-tuc/${currentCategory.slug}/${item.slug}`} className="horizontal-card">
               <img src={item.image} alt={item.title} />
               <div className="card-info">
                  <h3>{item.title}</h3>
                  <p>{item.content.replace(/<[^>]*>/g, '').substring(0, 200)}...</p>
                  <div className="news-meta"><Clock size={14} /> <span>{item.date} • {item.viewCount} xem</span></div>
               </div>
            </Link>
         ))}
         {news.length === 0 && <p className="news-empty">Chưa có bài viết nào trong chuyên mục này.</p>}
      </div>
    </main>
  );
}
