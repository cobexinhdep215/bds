import { NextResponse } from 'next/server';
import { readData, writeData, Property, slugify } from '@/lib/dataService';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'house-now-secret-key-123';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');
  const brokerId = searchParams.get('brokerId');
  const sort = searchParams.get('sort') || 'matching';
  const province = searchParams.get('province');
  const districts = searchParams.get('districts'); // list e.g. "Ba Đình,Cầu Giấy"
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minArea = searchParams.get('minArea');
  const maxArea = searchParams.get('maxArea');
  const bedrooms = searchParams.get('bedrooms'); // list e.g. "Studio,1,2"
  const direction = searchParams.get('directions'); // sync with frontend 'directions'
  const balconyDirection = searchParams.get('balcony'); // sync with frontend 'balcony'
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '16');

  let properties = readData<Property>('properties.json');
  
  if (id) {
    const property = properties.find(p => p.id === id);
    if (!property) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
    return NextResponse.json(property);
  }

  if (slug) {
    const property = properties.find(p => p.slug === slug);
    if (!property) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
    return NextResponse.json(property);
  }

  // Filtering
  if (brokerId) {
     properties = properties.filter(p => p.brokerId === brokerId);
  }
  if (province) {
     properties = properties.filter(p => p.province === province);
  }
  if (districts) {
     const districtList = districts.split(',');
     properties = properties.filter(p => districtList.includes(p.district));
  }
  if (minPrice) {
     properties = properties.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
     properties = properties.filter(p => p.price <= parseInt(maxPrice));
  }
  if (minArea) {
     properties = properties.filter(p => p.area >= parseInt(minArea));
  }
  if (maxArea) {
     properties = properties.filter(p => p.area <= parseInt(maxArea));
  }
  if (bedrooms) {
     const bedList = bedrooms.split(',');
     properties = properties.filter(p => bedList.includes(p.bedrooms));
  }
  if (direction) {
     const dirList = direction.split(',');
     properties = properties.filter(p => dirList.includes(p.direction));
  }
  if (balconyDirection) {
     const balList = balconyDirection.split(',');
     properties = properties.filter(p => balList.includes(p.balconyDirection));
  }

  // Sorting
  if (sort === 'newest') {
     properties.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } else if (sort === 'price_asc') {
     properties.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
     properties.sort((a, b) => b.price - a.price);
  }
  // Default 'matching' could be newest for now

  const total = properties.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedProperties = properties.slice(offset, offset + limit);

  return NextResponse.json({
     properties: paginatedProperties,
     pagination: {
        total,
        page,
        limit,
        totalPages
     }
  });
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId as string;

    const body = await request.json();
    const properties = readData<Property>('properties.json');

    const id = Date.now().toString();
    const slug = slugify(body.title) + '-' + id.substring(id.length - 4);

    const newProperty: Property = {
      id,
      slug,
      ...body,
      brokerId: userId,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
      images: body.images || [],
    };

    properties.push(newProperty);
    writeData('properties.json', properties);

    return NextResponse.json({ message: 'Đã thêm tin đăng thành công', id: newProperty.id, slug: newProperty.slug });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId as string;

    const body = await request.json();
    const properties = readData<Property>('properties.json');
    const index = properties.findIndex(p => p.id === body.id);

    if (index === -1) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });

    if (properties[index].brokerId !== userId) {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 });
    }

    // Refresh slug if title changed
    let slug = properties[index].slug;
    if (body.title && body.title !== properties[index].title) {
      slug = slugify(body.title) + '-' + properties[index].id.substring(properties[index].id.length - 4);
    }

    properties[index] = { ...properties[index], ...body, slug, updatedAt: new Date().toISOString() };
    writeData('properties.json', properties);

    return NextResponse.json({ message: 'Cập nhật thành công', slug });
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
     const { searchParams } = new URL(request.url);
     const id = searchParams.get('id');
     const cookieStore = await cookies();
     const token = cookieStore.get('auth_token')?.value;

     if (!token || !id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

     const { payload } = await jose.jwtVerify(token, secret);
     const userId = payload.userId as string;

     let properties = readData<Property>('properties.json');
     const property = properties.find(p => p.id === id);

     if (!property) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
     if (property.brokerId !== userId) return NextResponse.json({ error: 'Không có quyền' }, { status: 403 });

     properties = properties.filter(p => p.id !== id);
     writeData('properties.json', properties);

     return NextResponse.json({ message: 'Đã xóa thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
