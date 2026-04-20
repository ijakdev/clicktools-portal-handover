const express = require('express');
const multer = require('multer');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller);

const app = express();
const PORT = 7773; // API용 별도 포트 (Frontend 7771과 분리)

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
// UI 정적 파일 서빙 (포트 충돌 및 연결 실패 방지)
app.use(express.static(path.join(__dirname, '..')));

// 전역 예외 처리 (서버 다운 방지)
process.on('uncaughtException', (err) => {
    console.error('Caught exception: ' + err);
});

// [API] 서버 상태 체크용 (연결 문제 진단 도구)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'FFmpeg Server is Ready' });
});

// 디렉토리 설정
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CONVERTED_DIR = path.join(__dirname, 'converted');

[UPLOADS_DIR, CONVERTED_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// [API] 단일 파일 변환
app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: '파일이 없습니다.' });

    const format = req.body.format || 'mp3';
    const bitrate = req.body.bitrate || '128k';

    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const outputBaseName = `${crypto.randomUUID()}.${format}`;
    const outputPath = path.join(CONVERTED_DIR, outputBaseName);
    const downloadName = `${path.parse(originalName).name}.${format}`;

    console.log(`[START] Converting ${originalName} to ${format.toUpperCase()}...`);

    // FFprobe를 사용하여 정확한 재생 시간 추출 (브라우저 분석 불가 포맷 대응)
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
        const duration = metadata ? metadata.format.duration : 0;
        
        let command = ffmpeg(inputPath);
        // 공통 옵션
        command.noVideo(); // 비디오 스트림 제거

        if (format === 'mp3') {
            command = command.toFormat('mp3').audioCodec('libmp3lame').audioBitrate(bitrate);
        } else if (format === 'wav') {
            command = command.toFormat('wav').audioCodec('pcm_s16le'); // WAV는 일반적으로 PCM
        } else if (format === 'm4a' || format === 'm4r') {
            command = command.toFormat('adts').audioCodec('aac').audioBitrate(bitrate);
        } else {
            command = command.toFormat(format).audioBitrate(bitrate);
        }

        command
            .on('error', (err) => {
                console.error('An error occurred: ' + err.message);
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                res.status(500).json({ success: false, error: '변환 중 오류 발생', details: err.message });
            })
            .on('end', () => {
                console.log(`[DONE] Conversion finished: ${downloadName}`);
                res.json({ 
                    success: true, 
                    filename: downloadName,
                    duration: duration, // 추출된 정확한 재생 시간 반환
                    downloadUrl: `http://127.0.0.1:${PORT}/download/${outputBaseName}?name=${encodeURIComponent(downloadName)}`
                });
            })
            .save(outputPath);
    });
});

// [API] 다중 파일 변환 (Batch) - 프론트에서 순차적으로 호출하거나 여기서 루프
app.post('/convert-batch', upload.array('files'), async (req, res) => {
    // 순차 처리를 권장하므로 프론트에서 /convert를 반복 호출하는 것이 상태 관리에 유리함
    // 여기서는 간단히 완료 응답만 보냄
    res.json({ message: '순차 처리를 위해 개별 /convert 호출을 권장합니다.' });
});

app.get('/download/:id', (req, res) => {
    const fileId = req.params.id;
    const displayName = req.query.name || 'converted.mp3';
    const filePath = path.join(CONVERTED_DIR, fileId);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(displayName)}"`);
        res.sendFile(filePath, (err) => {
            if (!err) {
                // 다운로드 완료 후 1분 뒤 자동 삭제 (메모리 절약)
                setTimeout(() => {
                    if (fs.existsSync(filePath)) {
                        fs.unlink(filePath, (e) => { if(!e) console.log(`Deleted temp file: ${fileId}`); });
                    }
                }, 60000);
            }
        });
    } else {
        res.status(404).send('파일을 찾을 수 없습니다.');
    }
});

app.listen(PORT, () => {
    console.log(`FFmpeg Conversion Server running at http://localhost:${PORT}`);
});
