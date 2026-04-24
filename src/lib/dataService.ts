import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data');

export const readData = <T>(filename: string): T[] => {
  try {
    const filePath = path.join(DATA_PATH, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

export const writeData = <T>(filename: string, data: T[]): boolean => {
  try {
    const filePath = path.join(DATA_PATH, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    return false;
  }
};

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Common types
export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  images: string[];
  bedrooms: string;
  bathrooms: string;
  project?: string;
  province?: string;
  district?: string;
  direction?: string;
  balconyDirection?: string;
  propertyStatus?: string;
  legalStatus?: string;
  furniture?: string;
  unitCode?: string;
  floor?: string;
  building?: string;
  videoLink?: string;
  status: 'pending' | 'selling' | 'sold' | 'removed' | 'private';
  brokerId: string;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
  readingTime: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  role: 'broker' | 'admin';
}
