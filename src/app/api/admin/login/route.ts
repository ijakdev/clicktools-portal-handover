import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

        const user = await prisma.adminUser.findUnique({ where: { username } });

        if (!user) {
            return NextResponse.json({ error: '존재하지 않는 계정입니다.' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        const token = await new SignJWT({ id: user.id, username: user.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        await prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        const response = NextResponse.json({ success: true, message: '로그인에 성공했습니다.' });

        response.cookies.set({
            name: 'admin_session',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch (error) {
        console.error('Login API Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
