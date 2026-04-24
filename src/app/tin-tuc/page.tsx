'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';

export default function NewsIndex() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     Promise.all([
        fetch('/api/news-categories').then(r => r.json()),
        fetch('/api/news').then(r => r.json())
     ]).then(([cats, newsData]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setAllNews(Array.isArray(newsData) ? newsData : []);
        setIsLoading(false);
     });
  }, []);

  const getCategorySlug = (catId: string) => categories.find(c => c.id === catId)?.slug || 'chung';
  const getCategoryName = (catId: string) => categories.find(c => c.id === catId)?.name || 'Tin tức';

  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Đang tải tin tức...</div>;

  const featured = allNews[0];
  const listNews = allNews.slice(1, 10);

  return (
    <main className="container news-index">
      <div className="news-breadcrumb">
        BDSXXX <ChevronRight size={14} /> <span>Tin tức</span>
      </div>

      <div className="news-main-grid">
         <div className="featured-column">
            {featured && (
               <Link href={`/tin-tuc/${getCategorySlug(featured.category)}/${featured.slug}`} className="featured-card">
                  <img src={featured.image} alt={featured.title} />
                  <div className="featured-info">
                     <span className="news-badge">NỔI BẬT</span>
                     <h2>{featured.title}</h2>
                     <div className="news-meta"><Clock size={14} /> <span>{featured.date}</span></div>
                  </div>
               </Link>
            )}
         </div>

         <div className="list-column">
            <h3 className="section-title">Tin mới cập nhật</h3>
            {listNews.map(n => (
               <Link key={n.id} href={`/tin-tuc/${getCategorySlug(n.category)}/${n.slug}`} className="small-news-item">
                  <img src={n.image} alt="" />
                  <div>
                     <h4>{n.title}</h4>
                     <div className="news-meta"><Clock size={12} /> <span>{n.date}</span></div>
                  </div>
               </Link>
            ))}
         </div>
      </div>
    </main>
  );
}
