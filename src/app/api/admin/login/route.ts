import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clicktools-premium-secret-key-2026'
);

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: '아이디와 비밀번호를 입력해 주세요.' }, { status: 400 });
        }

        const db = await getDb();
        const user = await db.get('SELECT * FROM admin_users WHERE username = ?', [username]);

        if (!user) {
            return NextResponse.json({ error: '존재하지 않는 계정입니다.' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // Create JWT
        const token = await new SignJWT({ id: user.id, username: user.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // Update last login
        await db.run('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        const response = NextResponse.json({ success: true, message: '로그인에 성공했습니다.' });
        
        // Set cookie
        response.cookies.set({
            name: 'admin_session',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Login API Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
