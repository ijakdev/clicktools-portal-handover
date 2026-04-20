// Constants - 접속 환경에 따라 동적으로 서버 주소 결정 (연결 신뢰성 극대화)
const SERVER_URL = (window.location.port === '7773') ? '' : 'http://127.0.0.1:7773';

// DOM Elements
const mainDropzone = document.getElementById('main-dropzone');
const mainFileInput = document.getElementById('mainFileInput');
const mainTableBody = document.getElementById('mainTableBody');
const resultPanel = document.getElementById('result-panel');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// New UI Elements
const formatTabs = document.querySelectorAll('.format-tab');
const qualitySlider = document.getElementById('qualitySlider');
const currentSettingText = document.getElementById('current-setting-text');

// State
let selectedFormat = 'mp3';
let selectedBitrate = '128k';
const bitrateMap = { '0': '64k', '1': '128k', '2': '192k' };
const qualityNameMap = { '0': 'Economy', '1': 'Standard', '2': 'Good' };

// --- 전역 드래그 앤 드롭 기본 동작 방지 ---
window.addEventListener('dragover', (e) => e.preventDefault(), false);
window.addEventListener('drop', (e) => e.preventDefault(), false);

// --- 이벤트 리스너 ---
mainDropzone.addEventListener('click', () => mainFileInput.click());
mainDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mainDropzone.classList.add('dragover');
});
mainDropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mainDropzone.classList.remove('dragover');
});
mainDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mainDropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
});
mainFileInput.addEventListener('change', (e) => handleFiles(e.target.files));

clearAllBtn.addEventListener('click', () => {
    mainTableBody.innerHTML = '';
    resultPanel.classList.add('hidden');
    mainFileInput.value = '';
});

// Format Tab Selection
formatTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        formatTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectedFormat = tab.dataset.format;
        updateSettingText();
    });
});

// Quality Slider
qualitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    selectedBitrate = bitrateMap[val];
    updateSettingText();
});

function updateSettingText() {
    const qualityName = qualityNameMap[qualitySlider.value];
    currentSettingText.innerText = `현재 설정: ${selectedFormat.toUpperCase()} (${qualityName} ${selectedBitrate}bps)`;
}

// --- 핵심 로직: 파일 처리 (정보 분석 + 변환 통합) ---
async function handleFiles(files) {
    resultPanel.classList.remove('hidden');
    
    for (const file of Array.from(files)) {
        if (!file.type && file.name.indexOf('.') === -1) continue;

        const row = document.createElement('tr');
        const fileExt = file.name.split('.').pop().toUpperCase();
        const fileSize = formatSize(file.size);
        
        row.innerHTML = `
            <td class="file-name">${file.name}</td>
            <td>${fileExt}</td>
            <td>${fileSize}</td>
            <td class="duration">분석 중...</td>
            <td class="status"><div class="progress-wrap"><div class="progress-bar"></div><span class="status-text">대기 중</span></div></td>
            <td class="download-cell">-</td>
        `;
        mainTableBody.appendChild(row);

        const durationCell = row.querySelector('.duration');
        
        // 2단계: 서버 변환 시작 (다양한 영상/오디오 포맷 확장 지원)
        const videoExts = ['MP4', 'MOV', 'AVI', 'WMV', 'FLV', 'ASF', 'MKV', 'WEBM', 'M4V', '3GP', 'RM', 'VOB'];
        const audioExts = ['MP3', 'WAV', 'M4A', 'FLAC', 'OGG', 'WMA', 'AAC', 'M4R'];

        if (file.type.startsWith('video') || file.type.startsWith('audio') || 
            videoExts.includes(fileExt) || audioExts.includes(fileExt)) {
            
            // 재생 시간 분석은 비차단(Non-blocking)으로 진행
            getMetadataDuration(file).then(duration => {
                durationCell.innerText = formatDuration(duration);
            }).catch(() => {
                durationCell.innerText = '--:--';
            });

            // 변환은 즉시 시작
            startConversion(file, row, selectedFormat, selectedBitrate);
        } else {
            durationCell.innerText = '미지원';
            row.querySelector('.status-text').innerText = '지원하지 않는 파일 형식';
            row.querySelector('.status-text').style.color = '#e74c3c';
            row.querySelector('.progress-bar').style.width = '100%';
            row.querySelector('.progress-bar').style.background = '#e74c3c';
        }
    }
}

async function startConversion(file, row, format, bitrate) {
    const statusText = row.querySelector('.status-text');
    const progressBar = row.querySelector('.progress-bar');
    const downloadCell = row.querySelector('.download-cell');

    try {
        statusText.innerText = '서버 전송 중...';
        progressBar.style.width = '20%';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        formData.append('bitrate', bitrate);

        const response = await fetch(`${SERVER_URL}/convert`, {
            method: 'POST',
            body: formData
        }).catch(err => {
            throw new Error('서버 연결 실패 (Failed to fetch)');
        });

        if (!response.ok) throw new Error(`서버 응답 오류 (${response.status})`);

        statusText.innerText = '인코딩 중...';
        progressBar.style.width = '60%';

        const result = await response.json();
        
        if (result.success) {
            statusText.innerText = '변환 완료!';
            statusText.style.color = '#2ecc71';
            progressBar.style.width = '100%';
            progressBar.style.background = '#2ecc71';
            
            // 서버에서 추출한 정확한 재생시간 반영 (브라우저 분석 불가 포맷 대응)
            if (result.duration) {
                row.querySelector('.duration').innerText = formatDuration(result.duration);
            }
            
            downloadCell.innerHTML = `<a href="${result.downloadUrl}" class="btn-download">다운로드 📥</a>`;
        } else {
            throw new Error(result.error || '변환 실패');
        }
    } catch (err) {
        statusText.innerText = `오류: ${err.message}`;
        statusText.style.color = '#e74c3c';
        progressBar.style.width = '100%';
        progressBar.style.background = '#e74c3c';
        console.error('Conversion Error:', err);
    }
}

// --- 유틸리티 함수 ---
function getMetadataDuration(file) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const el = file.type.startsWith('video') ? document.createElement('video') : document.createElement('audio');
        
        let isResolved = false;
        const cleanup = (duration) => {
            if (isResolved) return;
            isResolved = true;
            URL.revokeObjectURL(url);
            resolve(duration);
            el.src = '';
            el.load();
        };

        const timeout = setTimeout(() => cleanup(0), 5000);
        el.preload = 'metadata';
        el.src = url;
        
        const check = () => {
            if (el.duration && !isNaN(el.duration) && el.duration !== Infinity) {
                clearTimeout(timeout);
                cleanup(el.duration);
            }
        };

        el.addEventListener('loadedmetadata', check);
        el.addEventListener('durationchange', check);
        el.addEventListener('error', () => { clearTimeout(timeout); cleanup(0); });

        setTimeout(() => {
            if (!isResolved && el.duration === Infinity) el.currentTime = 1e101;
        }, 1000);
    });
}

const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds === Infinity || seconds < 0) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

// CSV 다운로드 기능
downloadCsvBtn.addEventListener('click', () => {
    const rows = Array.from(mainTableBody.querySelectorAll('tr'));
    let csv = '\uFEFF파일명,확장자,크기,재생시간,상태\n';
    rows.forEach(row => {
        const cols = Array.from(row.querySelectorAll('td')).map(td => td.innerText.replace(/,/g, ''));
        csv += cols.slice(0, 5).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `파일정보_결과_${new Date().getTime()}.csv`;
    link.click();
});

// 페이지 로드 시 서버 상태 체크
window.addEventListener('DOMContentLoaded', async () => {
    console.log('World Class All-in-One Engine Ready.');
    try {
        const res = await fetch(`${SERVER_URL}/health`);
        if (res.ok) console.log('Backend Server is Connected.');
    } catch (err) {
        console.error('Server is not responding. Please check if 실행하기.bat is running.');
    }
});
