const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-url-shortener';

async function register(req, res) {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: '유효한 이메일과 6자리 이상의 비밀번호를 입력해주세요.' });
    }

    try {
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: '이미 가입된 이메일입니다.' });
        }

        const newUser = await userModel.createUser(email, password);

        // 자동 로그인 토큰 발급
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: '회원가입이 완료되었습니다.', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: '로그인 성공', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }
}

// 미들웨어: 토큰 검증
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (token == null) {
        req.user = null; // 회원이 아님 (익명)
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user; // 회원 인증 완료
        }
        next();
    });
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: '로그인이 필요한 서비스입니다.' });
    }
    next();
}

const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '909229247497-g0oebpva4hkqni620nucef450pj9lvu1.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function googleLogin(req, res) {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ error: 'Google 인증 토큰이 없습니다.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];

        let user = await userModel.getUserByProviderId('google', googleId);

        if (!user) {
            user = await userModel.createOAuthUser('google', googleId, email);
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Google 로그인 성공', token });

    } catch (error) {
        console.error('Google 인증 오류 상세:', error.message || error);
        res.status(401).json({ error: `유효하지 않은 Google 토큰입니다. (${error.message || '상세 로그 확인'})` });
    }
}

module.exports = {
    register,
    login,
    googleLogin,
    authenticateToken,
    requireAuth
};
