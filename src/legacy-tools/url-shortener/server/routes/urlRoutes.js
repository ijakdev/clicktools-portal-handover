const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: '너무 많은 요청이 발생했습니다. 잠시 후 시도해주세요.' }
});

const { authenticateToken, requireAuth } = require('../controllers/authController');

router.post('/api/shorten', apiLimiter, authenticateToken, urlController.shortenUrl);
router.get('/api/stats', urlController.getStats);
router.get('/api/urls/my', authenticateToken, requireAuth, urlController.getMyUrls);
router.get('/api/urls/filter', urlController.getFilteredUrls);
router.get('/api/urls/:shortcode/stats', urlController.getUrlDetailedStats);

// 단축 URL 라우팅 맨 마지막에 배치
router.get('/:shortcode', urlController.redirectToOriginal);

module.exports = router;
