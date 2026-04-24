'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Clock, User, Eye, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

export default function ArticleDetail() {
  const params = useParams();
  const articleSlug = params.slug as string;
  
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     Promise.all([
        fetch('/api/news-categories').then(r => r.json()),
        fetch('/api/news').then(r => r.json())
     ]).then(([cats, newsData]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        const found = newsData.find((n: any) => n.slug === articleSlug);
        setArticle(found);
        setNews(newsData);
        setIsLoading(false);
     });
  }, [articleSlug]);

  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Đang tải bài viết...</div>;
  if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Bài viết không tồn tại</div>;

  const currentCategory = categories.find(c => c.id === article.category);
  const relatedNews = news.filter(n => n.category === article.category && n.id !== article.id).slice(0, 5);

  return (
    <main className="container article-detail">
      <div className="news-breadcrumb">
        BDSXXX <ChevronRight size={14} /> 
        <Link href="/tin-tuc">Tin tức</Link> <ChevronRight size={14} /> 
        <Link href={`/tin-tuc/${currentCategory?.slug}`}>{currentCategory?.name}</Link> <ChevronRight size={14} /> 
        <span>Chi tiết</span>
      </div>

      <div className="detail-layout">
         <article className="content-area">
            <h1 className="title">{article.title}</h1>
            
            <div className="article-meta-modern">
               <div className="meta-left">
                  <div className="author-box">
                     <div className="author-avatar"><User size={20} /></div>
                     <div>
                        <span className="author-name">{article.author}</span>
                        <span className="post-date">{article.date}</span>
                     </div>
                  </div>
               </div>
               <div className="meta-right">
                  <div className="article-stat"><Eye size={16} /> <span>{article.viewCount} xem</span></div>
                  <div className="share-btns">
                     <button title="Facebook"><Facebook size={16}/></button>
                     <button title="Twitter"><Twitter size={16}/></button>
                     <button title="Link"><LinkIcon size={16}/></button>
                  </div>
               </div>
            </div>

            <img src={article.image} alt={article.title} className="main-image" />
            <div className="body-text" dangerouslySetInnerHTML={{ __html: article.content }}></div>
            
            {article.tags && article.tags.length > 0 && (
               <div className="article-tags">
                  <span>Tags:</span>
                  <div className="tags-list">
                     {article.tags.map((tag: string) => (
                        <Link key={tag} href={`/tin-tuc/tags/${encodeURIComponent(tag)}`} className="tag-link">
                           #{tag}
                        </Link>
                     ))}
                  </div>
               </div>
            )}
         </article>

         <aside className="sidebar">
            <div className="related-widget">
               <h3 className="widget-title">Cùng chuyên mục</h3>
               <div className="related-list">
                  {relatedNews.map(rn => (
                     <Link key={rn.id} href={`/tin-tuc/${currentCategory?.slug}/${rn.slug}`} className="related-item">
                        <img src={rn.image} alt="" />
                        <p>{rn.title}</p>
                     </Link>
                  ))}
               </div>
            </div>
         </aside>
      </div>
    </main>
  );
}
