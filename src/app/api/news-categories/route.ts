import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const catPath = path.join(process.cwd(), 'data/news_categories.json');

export async function GET() {
  try {
    const data = fs.readFileSync(catPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
