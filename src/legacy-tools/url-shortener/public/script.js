document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('shortener-form');
    const urlInput = document.getElementById('url-input');
    const customCodeInput = document.getElementById('custom-code');
    const submitBtn = document.getElementById('submit-btn');
    const errorMsg = document.getElementById('error-msg');

    // Result Layer
    const resultLayer = document.getElementById('result-layer');
    const shortUrlInput = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const qrToggleBtn = document.getElementById('qr-toggle-btn');
    const qrContainer = document.getElementById('qr-container');
    const qrImage = document.getElementById('qr-image');

    // Stats
    const valTotal = document.getElementById('val-total');
    const valToday = document.getElementById('val-today');
    const valClicks = document.getElementById('val-clicks');

    let currentQrSrc = '';

    // Auth Elements
    const authNav = document.getElementById('auth-nav');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.getElementById('close-modal');
    const authErrorMsg = document.getElementById('auth-error-msg');

    /* ================= Authentication Logic ================= */

    function getToken() { return localStorage.getItem('token'); }
    function setToken(token) { localStorage.setItem('token', token); }
    function removeToken() { localStorage.removeItem('token'); }

    // My URLs & Stats Modal Elements
    const myUrlsModal = document.getElementById('my-urls-modal');
    const closeMyUrls = document.getElementById('close-my-urls');
    const myUrlsList = document.getElementById('my-urls-list');

    const statsModal = document.getElementById('stats-modal');
    const closeStats = document.getElementById('close-stats');
    const statsChartCtx = document.getElementById('statsChart').getContext('2d');
    let currentChart = null;

    function updateAuthUI() {
        const token = getToken();
        if (token) {
            authNav.innerHTML = `
                <button id="my-urls-btn" class="text-btn" style="margin-right:1rem; font-weight:700;"><i class="fas fa-list"></i> 내 URL 목록</button>
                <span class="nav-link" style="color:var(--text-muted); cursor:default;"><i class="fas fa-user-circle"></i> 회원님</span>
                <button id="logout-btn" class="btn-primary-small" style="background:var(--text-muted); color:white; border:none;">로그아웃</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                removeToken();
                updateAuthUI();
                showError('로그아웃 되었습니다.');
            });
            document.getElementById('my-urls-btn').addEventListener('click', openMyUrlsModal);
        } else {
            authNav.innerHTML = `
                <a href="#" id="open-login" class="nav-link">로그인 / 회원가입</a>
            `;
            document.getElementById('open-login').addEventListener('click', (e) => { e.preventDefault(); openAuthModal(); });
        }
    }

    function openAuthModal() {
        authErrorMsg.classList.add('hidden');
        authModal.classList.remove('hidden');
    }

    closeModal.addEventListener('click', () => authModal.classList.add('hidden'));
    closeMyUrls.addEventListener('click', () => myUrlsModal.classList.add('hidden'));
    closeStats.addEventListener('click', () => statsModal.classList.add('hidden'));

    // --- My URLs Logic ---
    let countdownInterval;

    async function openMyUrlsModal() {
        myUrlsModal.classList.remove('hidden');
        document.getElementById('my-urls-title').innerHTML = '<i class="fas fa-link"></i> 내 URL 목록';
        myUrlsList.innerHTML = '<div style="text-align:center; padding:2rem;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

        try {
            const res = await fetch('/url-shortener/api/urls/my', {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (!res.ok) throw new Error('목록을 불러오지 못했습니다.');
            const urls = await res.json();
            renderMyUrls(urls);
        } catch (e) {
            myUrlsList.innerHTML = `<div style="text-align:center; color:red; padding:1rem;">${e.message}</div>`;
        }
    }

    function renderMyUrls(urls) {
        clearInterval(countdownInterval);

        if (urls.length === 0) {
            myUrlsList.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:2rem;">생성한 단축 URL이 없습니다.</div>';
            return;
        }

        const html = urls.map(url => {
            const shortUrl = `${window.location.origin}/url-shortener/${url.short_code}`;
            return `
                <div class="url-item">
                    <div class="url-info">
                        <a href="${shortUrl}" target="_blank" class="url-short">${shortUrl}</a>
                        <div class="url-original">${url.original_url}</div>
                        <div class="url-meta">
                            <span class="countdown-badge" data-expires="${url.expires_at || ''}">계산 중...</span>
                        </div>
                    </div>
                    <button class="url-stats-btn" onclick="openStats(event, '${url.short_code}')">
                        <span id="clicks-${url.short_code}">${url.click_count}</span>
                        <small>클릭</small>
                    </button>
                </div>
            `;
        }).join('');
        myUrlsList.innerHTML = html;

        updateCountdowns();
        countdownInterval = setInterval(updateCountdowns, 1000);
    }

    function updateCountdowns() {
        document.querySelectorAll('.countdown-badge').forEach(badge => {
            const exp = badge.getAttribute('data-expires');
            if (!exp || exp === 'null') {
                badge.className = 'countdown-badge unlimited';
                badge.innerHTML = '<i class="fas fa-infinity"></i> 무제한';
                return;
            }

            const now = new Date();
            const expDate = new Date(exp);
            const diff = expDate - now;

            if (diff <= 0) {
                badge.className = 'countdown-badge expired';
                badge.innerHTML = '<i class="fas fa-ban"></i> 만료됨';
            } else {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / 1000 / 60) % 60);
                const s = Math.floor((diff / 1000) % 60);

                let text = '<i class="far fa-clock"></i> ';
                if (d > 0) text += `${d}일 ${h}시간 남음`;
                else if (h > 0) text += `${h}시간 ${m}분 남음`;
                else text += `${m}분 ${s}초 남음`;

                badge.innerHTML = text;
            }
        });
    }

    window.openStats = async function (e, shortcode) {
        if (e) e.stopPropagation(); // prevent other click events from firing (like QR code modal if overlapping)
        statsModal.classList.remove('hidden');
        if (currentChart) currentChart.destroy();

        try {
            const res = await fetch(`/url-shortener/api/urls/${shortcode}/stats`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (!res.ok) throw new Error('통계 로드 실패');

            const data = await res.json();
            renderChart(data.stats);
        } catch (e) {
            console.error(e);
            alert(e.message);
            statsModal.classList.add('hidden');
        }
    };

    function renderChart(statsData) {
        if (!statsData || statsData.length === 0) {
            // 빈 데이터일 경우 임시값
            statsData = [{ date: new Date().toISOString().split('T')[0], count: 0 }];
        }

        const labels = statsData.map(item => item.date);
        const data = statsData.map(item => item.count);

        currentChart = new Chart(statsChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '일별 클릭수',
                    data: data,
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }

    // 콜백 함수는 전역 이벤트 리스너로 연결
    // Load Stats on mount
    fetchStats();
    updateAuthUI();

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const url = urlInput.value.trim();
        const customCode = customCodeInput.value.trim();
        const expiresIn = document.querySelector('input[name="expiry"]:checked').value;

        if (!isValidUrl(url)) {
            showError('유효한 웹사이트 주소(URL)를 입력해주세요.');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성중...';
        submitBtn.disabled = true;

        try {
            const token = getToken();
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/url-shortener/api/shorten', {
                method: 'POST',
                headers,
                body: JSON.stringify({ url, customCode, expiresIn })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) openAuthModal(); // 비회원 권한 오류시 로그인 창 띄우기
                throw new Error(data.error || '오류가 발생했습니다.');
            }

            // Success Transition
            shortUrlInput.value = data.short_url;
            currentQrSrc = data.qr_code;

            // Show Result Layer
            resultLayer.classList.remove('hidden');
            qrContainer.classList.add('hidden'); // Reset QR state

            // Refresh stats background
            fetchStats();

        } catch (error) {
            showError(error.message);
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Actions
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shortUrlInput.value);
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = '#10b981';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i>';
                copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            shortUrlInput.select();
            document.execCommand('copy');
            alert('복사되었습니다.');
        }
    });

    qrToggleBtn.addEventListener('click', () => {
        if (qrContainer.classList.contains('hidden')) {
            qrImage.src = currentQrSrc;
            qrContainer.classList.remove('hidden');
            qrToggleBtn.innerHTML = '<i class="fas fa-times"></i> QR 코드 닫기';
        } else {
            qrContainer.classList.add('hidden');
            qrToggleBtn.innerHTML = '<i class="fas fa-qrcode"></i> QR 코드 보기';
        }
    });

    resetBtn.addEventListener('click', () => {
        resultLayer.classList.add('hidden');
        urlInput.value = '';
        customCodeInput.value = '';
        document.querySelector('input[name="expiry"][value="24h"]').checked = true;
        urlInput.focus();
    });

    // Helpers
    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.add('show');
        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 3000);
    }

    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    async function fetchStats() {
        try {
            const res = await fetch('/url-shortener/api/stats');
            const data = await res.json();

            animateValue(valTotal, parseInt(valTotal.textContent.replace(/,/g, '')), data.totalUrls, 1000);
            animateValue(valToday, parseInt(valToday.textContent.replace(/,/g, '')), data.todayUrls, 1000);
            animateValue(valClicks, parseInt(valClicks.textContent.replace(/,/g, '')), data.totalClicks, 1000);
        } catch (e) {
            console.error('Failed to load stats', e);
        }
    }

    // Number Counter Animation
    function animateValue(obj, start, end, duration) {
        if (isNaN(start)) start = 0;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- Global Stats Click Logic ---
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.cursor = 'pointer'; // UI hint
        card.addEventListener('click', async () => {
            let filter = 'all';
            const label = card.querySelector('.stat-label').textContent;

            if (label.includes('오늘 생성')) filter = 'today';
            else if (label.includes('누적 클릭')) filter = 'clicks';

            myUrlsModal.classList.remove('hidden');
            document.querySelector('#my-urls-modal h2').innerHTML = `<i class="fas fa-list-alt"></i> ${label} 상세`;
            myUrlsList.innerHTML = '<div style="text-align:center; padding:2rem;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

            try {
                const res = await fetch(`/url-shortener/api/urls/filter?filter=${filter}`);
                if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
                const urls = await res.json();
                renderMyUrls(urls);
            } catch (e) {
                myUrlsList.innerHTML = `<div style="text-align:center; color:red; padding:1rem;">${e.message}</div>`;
            }
        });
    });
});

// 구글 스크립트가 로드될 때 확실히 참조할 수 있도록 전역 공간에 선언
window.handleCredentialResponse = async (response) => {
    const authErrorMsg = document.getElementById('auth-error-msg');
    const authModal = document.getElementById('auth-modal');

    try {
        if (authErrorMsg) authErrorMsg.classList.add('hidden');
        const res = await fetch('/url-shortener/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || '오류가 발생했습니다.');

        localStorage.setItem('token', data.token);
        if (authModal) authModal.classList.add('hidden');

        // UI 강제 업데이트 (새로고침 효과)
        window.location.reload();
    } catch (err) {
        if (authErrorMsg) {
            authErrorMsg.textContent = err.message;
            authErrorMsg.classList.remove('hidden');
        } else {
            alert(err.message);
        }
    }
};
