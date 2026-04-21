import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { username, currentPassword, newPassword } = await req.json();

        if (!username || !currentPassword || !newPassword) {
            return NextResponse.json({ error: '모든 필드를 입력해 주세요.' }, { status: 400 });
        }

        const user = await prisma.adminUser.findUnique({ where: { username } });

        if (!user) {
            return NextResponse.json({ error: '존재하지 않는 계정입니다.' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ error: '기존 비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await prisma.adminUser.update({
            where: { id: user.id },
            data: { passwordHash: newPasswordHash },
        });

        return NextResponse.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
        console.error('Change Password API Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
