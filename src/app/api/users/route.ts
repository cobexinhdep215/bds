import { NextResponse } from 'next/server';
import { readData, User } from '@/lib/dataService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const users = readData<User>('users.json');
  const user = users.find(u => u.id === id);

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Return only public info
  return NextResponse.json({
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80' // Placeholder
  });
}
