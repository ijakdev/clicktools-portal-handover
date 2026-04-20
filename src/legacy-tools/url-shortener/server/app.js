const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = process.env.PORT || 3088;

// 보안 강화를 위한 헤더 설정 및 권한, XSS 방지
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: false // Google 로그인을 위해 Referrer-Policy 완화
}));
app.use(cors());
app.use(express.json()); // Body-parser 포함

const authRoutes = require('./routes/authRoutes');

// 프론트엔드 정적 파일 서빙 및 라우터 설정 (포털 통합을 위한 /url-shortener 접두사 지원)
app.use('/url-shortener', express.static(path.join(__dirname, '../public')));
app.use('/url-shortener/api/auth', authRoutes);
app.use('/url-shortener', urlRoutes);

// 기본 루트 호환성 유지
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', authRoutes);
app.use('/', urlRoutes);

const { initDb } = require('./config/db');

// 기본 오류 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// 서버 실행 및 DB 초기화
async function startServer() {
    try {
        await initDb();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('서버 시작 실패:', error);
        process.exit(1);
    }
}

startServer();
