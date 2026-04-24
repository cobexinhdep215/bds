import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const brokersPath = path.join(process.cwd(), 'data/brokers.json');

export async function GET() {
  try {
    const data = fs.readFileSync(brokersPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
