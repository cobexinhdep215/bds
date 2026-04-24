import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData, writeData, User } from '@/lib/dataService';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const users = readData<User>('users.json');
    if (users.some(u => u.email === email)) {
      return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: uuidv4(), // Reliable ID generator
      email,
      passwordHash,
      name,
      phone: phone || '',
      role: 'broker',
    };

    users.push(newUser);
    writeData('users.json', users);

    return NextResponse.json({ message: 'Đăng ký thành công', userId: newUser.id });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
