'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import './news.css';

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news-categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="news-layout">
      <Header />
      
      <nav className="news-cat-nav">
         <div className="container cat-menu">
            <Link 
              href="/tin-tuc" 
              className={`cat-item ${pathname === '/tin-tuc' ? 'active' : ''}`}
            >
              Tin mới nhất
            </Link>
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                href={`/tin-tuc/${cat.slug}`} 
                className={`cat-item ${pathname.includes(cat.slug) ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
         </div>
      </nav>

      <div className="news-main-content">
        {children}
      </div>
    </div>
  );
}
