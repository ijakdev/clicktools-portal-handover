import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UAParser } from 'ua-parser-js';

// FORCE_REFRESH_TIMESTAMP: 2026-04-14 13:56:00
// 클릭 수집 및 리다이렉션 엔진 v2

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    const { code } = await (await context).params;

    try {
        const urlData = await prisma.url.findUnique({ where: { shortCode: code } });

        if (urlData) {
            // Check expiration
            if (urlData.expiresAt) {
                const now = new Date();
                const expireDate = new Date(urlData.expiresAt);
                if (now > expireDate) {
                    return new NextResponse(
                        `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                                body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; background: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; color: #1e293b; overflow: hidden; }
                                .card { background: white; padding: 3rem; border-radius: 2rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px; width: 90%; border: 1px border #e2e8f0; position: relative; }
                                .bar { width: 3rem; h-1.5rem; height: 0.4rem; background: #ef4444; margin: 0 auto 2rem; border-radius: 9999px; }
                                h1 { font-size: 1.875rem; font-weight: 800; margin-bottom: 1rem; color: #0f172a; tracking: -0.025em; }
                                p { font-size: 1.125rem; font-weight: 500; color: #64748b; margin-bottom: 2rem; line-height: 1.5; }
                                a { display: inline-block; background: #2563eb; color: white; padding: 0.75rem 2rem; border-radius: 9999px; text-decoration: none; font-weight: 700; transition: transform 0.2s, background 0.2s; }
                                a:hover { background: #1d4ed8; transform: translateY(-2px); }
                            </style>
                        </head>
                        <body>
                            <div className="card">
                                <div className="bar"></div>
                                <h1>기간 만료 알림</h1>
                                <p>해당 단축 링크의 유효 기간이 만료되어<br>접속이 차단되었습니다.</p>
                                <a href="https://www.clicktools.co.kr">ClickTools 홈으로 가기</a>
                            </div>
                        </body>
                        </html>
                        `,
                        { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                    );
                }
            }

            // Logging (Fire and forget, but in Next.js we should wait or use background task)
            const ip = req.headers.get('x-forwarded-for') || 'unknown';
            const userAgent = req.headers.get('user-agent') || '';
            const parser = new UAParser(userAgent);
            const device = parser.getDevice().type || 'desktop';

            // Persistent Logging (Awaiting to ensure completion in all environments)
            await prisma.url.update({
                where: { shortCode: code },
                data: { clickCount: { increment: 1 } },
            });
            await prisma.clickLog.create({
                data: { shortCode: code, ip, device },
            });

            // Redirect
            return NextResponse.redirect(urlData.originalUrl, {
                status: 302,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, private'
                }
            });

        } else {
            return new NextResponse(
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; background: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; color: #1e293b; overflow: hidden; }
                        .card { background: white; padding: 3rem; border-radius: 2rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px; width: 90%; border: 1px border #e2e8f0; position: relative; }
                        .bar { width: 3rem; height: 0.4rem; background: #64748b; margin: 0 auto 2rem; border-radius: 9999px; }
                        h1 { font-size: 1.875rem; font-weight: 800; margin-bottom: 1rem; color: #0f172a; tracking: -0.025em; }
                        p { font-size: 1.125rem; font-weight: 500; color: #64748b; margin-bottom: 2rem; line-height: 1.5; }
                        a { display: inline-block; background: #2563eb; color: white; padding: 0.75rem 2rem; border-radius: 9999px; text-decoration: none; font-weight: 700; transition: transform 0.2s, background 0.2s; }
                        a:hover { background: #1d4ed8; transform: translateY(-2px); }
                    </style>
                </head>
                <body>
                    <div className="card">
                        <div className="bar"></div>
                        <h1>링크를 찾을 수 없음</h1>
                        <p>요청하신 단축 URL이 존재하지 않거나<br>잘못된 주소입니다.</p>
                        <a href="https://www.clicktools.co.kr">ClickTools 홈으로 가기</a>
                    </div>
                </body>
                </html>
                `,
                { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
        }

    } catch (error) {
        console.error(error);
        return new NextResponse('서버 오류가 발생했습니다.', { status: 500 });
    }
}
