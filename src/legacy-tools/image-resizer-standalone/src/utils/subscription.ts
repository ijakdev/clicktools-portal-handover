const STORAGE_KEYS = {
    PREMIUM_ACTIVE: 'upro_premium',
    ACCESS_UNTIL: 'upro_access_limit',
} as const;

export interface AccessState {
    premiumActive: boolean;
    remainingSeconds: number;
}

export function getAccessState(): AccessState {
    const premiumActive = localStorage.getItem(STORAGE_KEYS.PREMIUM_ACTIVE) === 'true';
    const accessUntilStr = localStorage.getItem(STORAGE_KEYS.ACCESS_UNTIL);
    const accessUntil = accessUntilStr ? parseInt(accessUntilStr, 10) : 0;

    const remaining = Math.max(0, Math.floor((accessUntil - Date.now()) / 1000));

    return {
        premiumActive,
        remainingSeconds: premiumActive ? Infinity : remaining
    };
}

export function hasAccess(): boolean {
    const state = getAccessState();
    return state.premiumActive || state.remainingSeconds > 0;
}

export function grantFreeAccess(): void {
    const accessUntil = Date.now() + (5 * 60 * 1000); // 5 minutes
    localStorage.setItem(STORAGE_KEYS.ACCESS_UNTIL, accessUntil.toString());
}

export function activatePremium(): void {
    localStorage.setItem(STORAGE_KEYS.PREMIUM_ACTIVE, 'true');
}

export function deactivatePremium(): void {
    localStorage.removeItem(STORAGE_KEYS.PREMIUM_ACTIVE);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_UNTIL);
}

export function formatSeconds(seconds: number): string {
    if (seconds === Infinity) return '무제한';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export interface ProcessingProgress {
    progress: number;
    message: string;
    isDone: boolean;
}

export async function mockProcess(onProgress: (p: ProcessingProgress) => void): Promise<void> {
    const steps = [
        { p: 10, m: '파일 분석 중...' },
        { p: 30, m: '서버 업로드 중...' },
        { p: 60, m: 'AI 엔진 처리 중...' },
        { p: 85, m: '결과물 최적화 중...' },
        { p: 100, m: '모든 처리 완료!' }
    ];

    for (const step of steps) {
        await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
        onProgress({ progress: step.p, message: step.m, isDone: step.p === 100 });
    }
}

export function downloadDummy(filename: string): void {
    const blob = new Blob(['데모용 처리 결과물입니다.'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
