import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const newsPath = path.join(process.cwd(), 'data/news.json');

export async function GET() {
  try {
    const data = fs.readFileSync(newsPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    
    const id = Date.now().toString();
    const newArticle = {
      id,
      ...body,
      tags: body.tags || [],
      date: new Date().toLocaleDateString('vi-VN'),
      viewCount: 0,
      createdAt: new Date().toISOString()
    };
    
    data.push(newArticle);
    fs.writeFileSync(newsPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newArticle);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    const data = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) return NextResponse.json({ error: 'News not found' }, { status: 404 });
    
    data[index] = { ...data[index], ...updateData, updatedAt: new Date().toISOString() };
    fs.writeFileSync(newsPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(data[index]);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    let data = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    data = data.filter((item: any) => item.id !== id);
    
    fs.writeFileSync(newsPath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
