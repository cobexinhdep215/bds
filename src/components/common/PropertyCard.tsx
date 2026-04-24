import React from 'react';
import Link from 'next/link';
import { Bed, Bath, Move, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    slug?: string;
    title: string;
    price: string;
    area: string;
    location: string;
    image: string;
    badge?: string;
    beds: number;
    baths: number;
    size: number;
  }
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const linkHref = property.slug ? `/can-ho-chung-cu/${property.slug}` : `/bds/${property.id}`;

  return (
    <Link href={linkHref} className="prop-card-home">
      <div className="prop-img-wrapper">
        <img src={property.image} alt={property.title} />
        <span className="badge-quality"><CheckCircle size={12}/> Tin đăng chất lượng</span>
        <span className="badge-photos"><ImageIcon size={12}/> 1/5</span>
      </div>
      
      <div className="prop-card-body">
        <div className="prop-price-row">
          <span className="prop-price-main">{property.price} - {property.area}</span>
          <span className="prop-price-sub">đăng 5 ngày trước</span>
        </div>
        
        <h4 className="prop-title">{property.title}</h4>
        <p className="prop-address">{property.location}</p>
        
        <div className="prop-features">
          <div className="prop-feat-item"><Bed size={14} /> {property.beds}</div>
          <div className="prop-feat-item"><Bath size={14} /> {property.baths}</div>
          <div className="prop-feat-item"><Move size={14} /> {property.size} m²</div>
        </div>
      </div>
    </Link>
  );
};
