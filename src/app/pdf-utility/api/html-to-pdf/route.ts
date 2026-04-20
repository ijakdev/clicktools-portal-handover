import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
    let browser = null;
    try {
        const body = await req.json();
        const { url, pageSize = 'A4', orientation = 'Portrait' } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests',
                '--window-size=1280,1024',
                '--disable-blink-features=AutomationControlled',
                '--ignore-certificate-errors',
                '--allow-running-insecure-content',
                '--disable-client-side-phishing-detection',
                '--proxy-server="direct://"',
                '--proxy-bypass-list=*',
                '--disable-extensions'
            ],
        });

        const page = await browser.newPage();
        await page.setBypassCSP(true);

        // 1. Set Viewport and standard User-Agent to prevent blocking
        await page.setViewport({ width: 1280, height: 1024, deviceScaleFactor: 1 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        });

        // 2. Navigate to URL
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        // 3. Auto-scroll to trigger lazy loading
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 50);
            });
        });

        // Wait for final renders/animations
        await new Promise(r => setTimeout(r, 1000));

        // 4. Inject Print CSS to fix common layout issues
        await page.addStyleTag({
            content: `
                @page { size: auto; margin: 0mm; } 
                body { 
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important; 
                }
                header.fixed, nav.fixed, .fixed-header { position: absolute !important; }
            `
        });

        // 5. Generate Vector PDF
        const pdfBuffer = await page.pdf({
            format: (pageSize === 'Fit' ? 'A4' : pageSize) as any,
            landscape: orientation === 'Landscape',
            printBackground: true,
            scale: 0.6,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        await browser.close();
        browser = null;

        return new NextResponse(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="website.pdf"`,
            },
        });

    } catch (error: any) {
        console.error('Puppeteer conversion error:', error);
        if (browser) await browser.close();
        return NextResponse.json(
            { error: error.message || 'Failed to convert URL to PDF' },
            { status: 500 }
        );
    }
}
