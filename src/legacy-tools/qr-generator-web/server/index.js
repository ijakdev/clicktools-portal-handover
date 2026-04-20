const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const qrcode = require('qrcode');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
// 정적 파일 제공 (저장된 QR 이미지 조회용)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const TEMP_DIR = path.join(__dirname, 'temp');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(__dirname, 'data', 'db.json');

fs.ensureDirSync(TEMP_DIR);
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(DB_FILE)) {
    fs.writeJsonSync(DB_FILE, []);
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// 1. 단일 URL QR 코드 생성 및 저장 API
app.post('/api/single', async (req, res) => {
    try {
        const { url, options, name = '이름 없음' } = req.body;
        if (!url) return res.status(400).json({ error: 'URL을 입력해주세요.' });

        const format = options?.format || 'png';
        const resolution = parseInt(options?.resolution || 300, 10);

        const qrOptions = {
            errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
            type: format === 'svg' ? 'svg' : 'image/png',
            margin: 1,
            width: resolution,
            color: {
                dark: options?.colorDark || '#000000',
                light: options?.colorLight || '#ffffff'
            }
        };

        const id = uuidv4();
        const fileName = `${id}.${format}`;
        const filePath = path.join(UPLOADS_DIR, fileName);

        if (format === 'svg') {
            await fs.writeFile(filePath, await qrcode.toString(url, qrOptions), 'utf8');
        } else {
            await qrcode.toFile(filePath, url, qrOptions);
        }

        // DB에 기록
        const newRecord = {
            id,
            name,
            originalUrl: url,
            format,
            filePath: `/uploads/${fileName}`,
            createdAt: new Date().toISOString()
        };

        const db = await fs.readJson(DB_FILE);
        db.unshift(newRecord); // 가장 최신을 맨 앞으로
        await fs.writeJson(DB_FILE, db, { spaces: 2 });

        res.json(newRecord);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '단일 생성 중 오류가 발생했습니다.' });
    }
});

// 2. 관리 데이터 목록 조회 API
app.get('/api/history', async (req, res) => {
    try {
        const db = await fs.readJson(DB_FILE);
        res.json(db);
    } catch (error) {
        res.status(500).json({ error: '목록을 불러오는 중 오류가 발생했습니다.' });
    }
});

// 3. 관리 데이터 삭제 API
app.delete('/api/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await fs.readJson(DB_FILE);
        const recordIndex = db.findIndex(r => r.id === id);

        if (recordIndex !== -1) {
            const record = db[recordIndex];
            // 실제 파일 삭제
            const filePath = path.join(__dirname, record.filePath);
            if (await fs.pathExists(filePath)) {
                await fs.remove(filePath);
            }
            db.splice(recordIndex, 1);
            await fs.writeJson(DB_FILE, db, { spaces: 2 });
            res.json({ success: true });
        } else {
            res.status(404).json({ error: '기록을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '삭제 중 오류가 발생했습니다.' });
    }
});

// 4. 기존 일괄 다중 엑셀 QR 생성 (DB 저장 없음, Temp 삭제)
app.post('/api/generate', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: '엑셀 파일을 업로드해주세요.' });

        const options = req.body;
        const format = options.format || 'png';
        const resolution = parseInt(options.resolution || 300, 10);

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const firstRow = data[0];
        if (!firstRow || !firstRow.name || !firstRow.url || !firstRow.campaign || !firstRow.store_code) {
            return res.status(400).json({ error: '필수 컬럼 누락 (name, url, campaign, store_code)' });
        }

        const jobId = uuidv4();
        const jobDir = path.join(TEMP_DIR, jobId);
        await fs.ensureDir(jobDir);

        for (let row of data) {
            try {
                let baseUrl = row.url.startsWith('http') ? row.url : 'https://' + row.url;
                const urlObj = new URL(baseUrl);
                urlObj.searchParams.set('utm_source', 'qr');
                urlObj.searchParams.set('utm_campaign', String(row.campaign));
                urlObj.searchParams.set('utm_id', String(row.store_code));

                const qrOptions = {
                    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
                    type: format === 'svg' ? 'svg' : 'image/png',
                    margin: 1, width: resolution,
                    color: { dark: options.colorDark || '#000000', light: options.colorLight || '#ffffff' }
                };

                const fileName = `${String(row.name).replace(/[^a-z0-9가-힣]/gi, '_')}_${row.store_code}.${format}`;
                const filePath = path.join(jobDir, fileName);

                if (format === 'svg') {
                    await fs.writeFile(filePath, await qrcode.toString(urlObj.toString(), qrOptions), 'utf8');
                } else {
                    await qrcode.toFile(filePath, urlObj.toString(), qrOptions);
                }
            } catch (err) { console.error('QR 생략:', err.message); }
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="qrcodes_${Date.now()}.zip"`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        res.on('finish', () => fs.remove(jobDir).catch(() => { })); // 응답 완료 즉시 삭제

        archive.pipe(res);
        archive.directory(jobDir, false);
        await archive.finalize();

    } catch (error) {
        if (!res.headersSent) res.status(500).json({ error: '오류: ' + error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
