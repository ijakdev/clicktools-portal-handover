"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
    RefreshCw, Copy, RotateCcw, ArrowLeftRight, Droplets, Zap, Gauge, Database, Clock, 
    Upload, FileText, CheckCircle2, TrendingUp, TrendingDown, Landmark,
    Ruler, Maximize, Weight, Container, Thermometer, User, Percent, Tag, Receipt, 
    Calendar, Cake, Home, Coins, CreditCard, PiggyBank, ArrowUpRight, Folder, Search, Star, History, X, 
    Cloud, ChevronRight, Activity, Sparkles, ChevronLeft, ShieldCheck, Globe, Gift, Info, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// --- (Helpers) ---
const copyToClipboard = (text: string) => {
    if (!text) return;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('복사 완료: ' + text);
        }).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
};

const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        toast.success('복사 완료 (호환 모드): ' + text);
    } catch (e) { toast.error('복사 실패'); }
    document.body.removeChild(textArea);
};

// --- (Constants) ---
const CATEGORIES = [
    { id: 'all', label: '전체' },
    { id: 'unit', label: '단위변환' },
    { id: 'life', label: '생활 계산' },
    { id: 'fin', label: '금융 계산' },
    { id: 'digital', label: '디지털/업무' },
];

const CALCULATOR_DATA = [
    { id: 'len', cat: 'unit', title: '길이 변환', desc: 'mm, cm, m, inch, mile 등', icon: Ruler },
    { id: 'bmi', cat: 'life', title: 'BMI 계산기', desc: '체질량 지수 및 비만도 측정', icon: User },
    { id: 'pct', cat: 'life', title: '퍼센트 계산', desc: '비율, 증감률, 할인가 계산', icon: Percent },
    { id: 'loan', cat: 'fin', title: '대출 계산기', desc: '원리금 상환액 자동 계산', icon: CreditCard },
    { id: 'interest', cat: 'fin', title: '이자 계산기', desc: '단리/복리 이자 수익 시뮬레이션', icon: TrendingUp },
    { id: 'area', cat: 'unit', title: '넓이 변환', desc: 'm², km², 평, acre 등', icon: Maximize },
    { id: 'weight', cat: 'unit', title: '무게 변환', desc: 'g, kg, ton, oz, lb 등', icon: Weight },
    { id: 'vol', cat: 'unit', title: '부피 변환', desc: 'mL, L, m³, gal, pt 등', icon: Container },
    { id: 'temp', cat: 'unit', title: '온도 변환', desc: 'Celsius, Fahrenheit, Kelvin', icon: Thermometer },
    { id: 'press', cat: 'unit', title: '압력 변환', desc: 'Pa, bar, atm, psi, mmHg', icon: Gauge },
    { id: 'speed', cat: 'unit', title: '속도 변환', desc: 'm/s, km/h, mph, knot', icon: Zap },
    { id: 'fuel', cat: 'unit', title: '연비 변환', desc: 'km/L, L/100km, mpg', icon: Droplets },
    { id: 'data', cat: 'unit', title: '데이터양', desc: 'bit, B, KB, MB, GB, TB', icon: Database },
    { id: 'time', cat: 'unit', title: '시간 변환', desc: '초, 분, 시, 일, 주, 월, 년', icon: Clock },
    { id: 'disc', cat: 'life', title: '할인 계산기', desc: '원가, 할인율 대비 최종가', icon: Tag },
    { id: 'vat', cat: 'life', title: '부가세 계산', desc: '공급가, 세액, 합계 계산', icon: Receipt },
    { id: 'date', cat: 'life', title: '날짜 계산기', desc: '디데이, 날짜 차이 측정', icon: Calendar },
    { id: 'age', cat: 'life', title: '나이 계산기', desc: '생일 기준 만/한국 나이', icon: Cake },
    { id: 'pyeong', cat: 'life', title: '평수 계산기', desc: 'm² ↔ 평 즉시 변환', icon: Home },
    { id: 'fx', cat: 'fin', title: '환율 계산기', desc: 'USD, JPY, EUR 등 주요 통화', icon: Coins },
    { id: 'savings', cat: 'fin', title: '예적금 계산', desc: '만기 시 수령액 계산', icon: PiggyBank },
    { id: 'speed_net', cat: 'digital', title: '전송 속도', desc: '다운로드 예상 시간 측정', icon: ArrowUpRight },
];

interface CalcProps {
    onResult: (res: any) => void;
}

// --- (Shared UI Blocks) ---
const InputGroup = ({ label, value, onChange, unit, options }: any) => (
    <div className="flex flex-col gap-1.5 flex-1 mb-5">
        <label className="text-[13px] font-bold text-slate-500 ml-1">{label}</label>
        <div className="relative group">
            <input
                type={(options || typeof value === 'string' || label.includes('날짜') || label.includes('생일')) ? "text" : "number"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[1.2rem] font-bold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800 shadow-inner"
                placeholder={label.includes('날짜') ? "YYYY-MM-DD" : "0"}
            />
            {options ? (
                <select className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold outline-none cursor-pointer shadow-sm" value={unit} onChange={(e) => onChange(value, e.target.value)}>
                    {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm whitespace-nowrap uppercase tracking-tighter">{unit}</span>
            )}
        </div>
    </div>
);

const ResultField = ({ label, value, unit }: any) => (
    <div className="p-10 bg-indigo-600 rounded-[2.5rem] flex flex-col items-center flex-1 shadow-2xl shadow-indigo-900/20 text-white mt-8">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">{label}</span>
        <div className="flex items-baseline gap-2">
            <span className={cn("text-5xl font-black tracking-tighter tabular-nums", "text-white")}>
                {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
            </span>
            <span className="text-xl font-bold opacity-80">{unit}</span>
        </div>
    </div>
);

// --- (Calculator Modules) ---

const BMICalculator = ({ onResult }: CalcProps) => {
    const [h, setH] = useState(175);
    const [w, setW] = useState(70);
    const bmi = useMemo(() => (!h || !w) ? 0 : w / ((h / 100) * (h / 100)), [h, w]);
    const status = useMemo(() => {
        if (bmi < 18.5) return { text: '저체중', color: 'text-blue-500' };
        if (bmi < 23) return { text: '정상', color: 'text-emerald-500' };
        if (bmi < 25) return { text: '과체중', color: 'text-amber-500' };
        return { text: '비만', color: 'text-rose-500' };
    }, [bmi]);
    useEffect(() => { onResult(bmi.toFixed(1) + ' (' + status.text + ')'); }, [bmi, status, onResult]);
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="키" value={h} onChange={setH} unit="cm" />
                <InputGroup label="몸무게" value={w} onChange={setW} unit="kg" />
            </div>
            <div className="p-12 bg-slate-900 rounded-[3rem] flex flex-col items-center gap-1 shadow-2xl">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">BMI INDEX</span>
                <span className="text-6xl font-[900] text-white tracking-tighter tabular-nums">{bmi.toFixed(1)}</span>
                <span className={cn("text-lg font-black mt-4 px-6 py-2 rounded-full bg-white/10", status.color)}>{status.text}</span>
            </div>
        </div>
    );
};

const AgeCalculator = ({ onResult }: CalcProps) => {
    const [birth, setBirth] = useState('2000-01-01');
    const age = useMemo(() => {
        const b = new Date(birth);
        if (isNaN(b.getTime())) return 0;
        const t = new Date();
        let a = t.getFullYear() - b.getFullYear();
        const m = t.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
        return Math.max(0, a);
    }, [birth]);
    useEffect(() => { onResult('만 ' + age + '세'); }, [age, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 mb-6">
                <label className="text-sm font-black text-slate-500 ml-1 uppercase tracking-widest">생년월일</label>
                <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="p-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-2xl text-slate-800 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner" />
            </div>
            <ResultField label="만 나이" value={age} unit="세" />
        </div>
    );
};

const SavingsCalculator = ({ onResult }: CalcProps) => {
    const [p, setP] = useState(1000000);
    const [r, setR] = useState(3.0);
    const [y, setY] = useState(1);
    const res = useMemo(() => {
        if (!p || !r || !y) return 0;
        const mr = (r / 100) / 12;
        const n = y * 12;
        return p * ((Math.pow(1 + mr, n) - 1) / mr) * (1 + mr);
    }, [p, r, y]);
    useEffect(() => { onResult(Math.round(res).toLocaleString() + '원'); }, [res, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label="월 적립액" value={p} onChange={setP} unit="원" />
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="연 이율" value={r} onChange={setR} unit="%" />
                <InputGroup label="적립 기간" value={y} onChange={setY} unit="년" />
            </div>
            <ResultField label="만기 예상금액" value={Math.round(res)} unit="원" />
        </div>
    );
};

const PercentCalculator = ({ onResult }: CalcProps) => {
    const [v1, setV1] = useState(100);
    const [v2, setV2] = useState(20);
    const res = (v1 * v2) / 100;
    useEffect(() => { onResult(res.toLocaleString()); }, [res, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label="기준 값" value={v1} onChange={setV1} unit="" />
            <InputGroup label="비율" value={v2} onChange={setV2} unit="%" />
            <ResultField label="계산 결과" value={res} unit="" />
        </div>
    );
};

const LoanCalculator = ({ onResult }: CalcProps) => {
    const [p, setP] = useState(10000000);
    const [r, setR] = useState(3.5);
    const [y, setY] = useState(10);
    const res = useMemo(() => {
        if (!p || !r || !y) return 0;
        const mr = (r / 100) / 12;
        const n = y * 12;
        if (mr === 0) return p / n;
        return (p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
    }, [p, r, y]);
    useEffect(() => { onResult(Math.round(res).toLocaleString() + '원'); }, [res, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label="대출 원금" value={p} onChange={setP} unit="원" />
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="금리" value={r} onChange={setR} unit="%" />
                <InputGroup label="기간" value={y} onChange={setY} unit="년" />
            </div>
            <ResultField label="월 상환금" value={Math.round(res)} unit="원" />
        </div>
    );
};

const InterestCalculator = ({ onResult }: CalcProps) => {
    const [p, setP] = useState(1000000);
    const [r, setR] = useState(2.0);
    const [y, setY] = useState(1);
    const [type, setType] = useState('simple');
    const res = useMemo(() => {
        if (!p || !r || !y) return 0;
        if (type === 'simple') return p * (1 + (r / 100) * y);
        return p * Math.pow(1 + (r / 100), y);
    }, [p, r, y, type]);
    useEffect(() => { onResult(Math.round(res).toLocaleString() + '원'); }, [res, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label="원금" value={p} onChange={setP} unit="원" />
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="금리" value={r} onChange={setR} unit="%" />
                <InputGroup label="기간" value={y} onChange={setY} unit="년" />
            </div>
            <div className="flex gap-4 mb-4">
                <button onClick={() => setType('simple')} className={cn("flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 transition-all", type === 'simple' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-100 text-slate-400")}>단리</button>
                <button onClick={() => setType('compound')} className={cn("flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 transition-all", type === 'compound' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-100 text-slate-400")}>복리</button>
            </div>
            <ResultField label="수령 예상액" value={Math.round(res)} unit="원" />
        </div>
    );
};

const VATCalculator = ({ onResult }: CalcProps) => {
    const [amt, setAmt] = useState(100000);
    const [rate, setRate] = useState(10);
    const vat = amt * (rate / 100);
    const total = amt + vat;
    useEffect(() => { onResult(total.toLocaleString() + '원'); }, [total, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label="원금" value={amt} onChange={setAmt} unit="원" />
            <InputGroup label="세율" value={rate} onChange={setRate} unit="%" />
            <div className="grid grid-cols-2 gap-4">
                <ResultField label="세액" value={Math.round(vat)} unit="원" />
                <ResultField label="합계" value={Math.round(total)} unit="원" />
            </div>
        </div>
    );
};

const DateCalculator = ({ onResult }: CalcProps) => {
    const [d2, setD2] = useState(new Date().toISOString().split('T')[0]);
    const diff = useMemo(() => {
        const dt = new Date(d2);
        if (isNaN(dt.getTime())) return 0;
        return Math.floor(Math.abs(dt.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }, [d2]);
    useEffect(() => { onResult(diff + '일'); }, [diff, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 mb-6">
                <label className="text-sm font-black text-slate-500 ml-1 uppercase tracking-widest">목표일</label>
                <input type="date" value={d2} onChange={e => setD2(e.target.value)} className="p-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-2xl text-slate-800 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner" />
            </div>
            <ResultField label="디데이" value={diff} unit="일" />
        </div>
    );
};

const FuelCalculator = ({ onResult }: CalcProps) => {
    const [dist, setDist] = useState(100);
    const [fuel, setFuel] = useState(10);
    const res = dist / fuel;
    useEffect(() => { onResult(res.toFixed(1) + ' km/L'); }, [res, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label="거리" value={dist} onChange={setDist} unit="km" />
            <InputGroup label="유량" value={fuel} onChange={setFuel} unit="L" />
            <ResultField label="연비" value={res.toFixed(1)} unit="km/L" />
        </div>
    );
};

const DiscountCalculator = ({ onResult }: CalcProps) => {
    const [price, setPrice] = useState(50000);
    const [rate, setRate] = useState(25);
    const disc = price * (rate / 100);
    const res = price - disc;
    useEffect(() => { onResult(res.toLocaleString() + '원'); }, [res, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label="정가" value={price} onChange={setPrice} unit="원" />
            <InputGroup label="할인율" value={rate} onChange={setRate} unit="%" />
            <ResultField label="할인가" value={Math.round(res)} unit="원" />
        </div>
    );
};

const NetSpeedCalculator = ({ onResult }: CalcProps) => {
    const [size, setSize] = useState(1);
    const [sUnit, setSUnit] = useState('GB');
    const [speed, setSpeed] = useState(100);
    const [vUnit, setVUnit] = useState('Mbps');
    const time = useMemo(() => {
        if (!size || !speed) return 0;
        const bits = sUnit === 'GB' ? size * 8 * 1024 * 1024 * 1024 : size * 8 * 1024 * 1024;
        const speedBits = vUnit === 'Mbps' ? speed * 1000000 : speed * 1000;
        return bits / speedBits;
    }, [size, sUnit, speed, vUnit]);
    useEffect(() => { onResult(Math.round(time) + '초'); }, [time, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <InputGroup label="용량" value={size} onChange={setSize} unit="" />
                <div className="mt-8">
                    <select className="h-[64px] px-6 bg-slate-50 border border-slate-200 rounded-2xl font-black shadow-inner outline-none focus:bg-white focus:border-indigo-600" value={sUnit} onChange={e => setSUnit(e.target.value)}>
                        <option value="MB">MB</option><option value="GB">GB</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-4">
                <InputGroup label="속도" value={speed} onChange={setSpeed} unit="" />
                <div className="mt-8">
                    <select className="h-[64px] px-6 bg-slate-50 border border-slate-200 rounded-2xl font-black shadow-inner outline-none focus:bg-white focus:border-indigo-600" value={vUnit} onChange={e => setVUnit(e.target.value)}>
                        <option value="Kbps">Kbps</option><option value="Mbps">Mbps</option>
                    </select>
                </div>
            </div>
            <ResultField label="예상 시간" value={Math.round(time)} unit="초" />
        </div>
    );
};

const SpecialConverter = ({ type, onResult }: any) => {
    const [val, setVal] = useState(10);
    const res = useMemo(() => {
        if (!val) return 0;
        if (type === 'pyeong') return val * 0.3025;
        if (type === 'fx') return val * 1350;
        return val;
    }, [val, type]);
    const unit = type === 'pyeong' ? '평' : '원';
    useEffect(() => { onResult(res.toLocaleString() + ' ' + unit); }, [res, unit, onResult]);
    return (
        <div className="flex flex-col gap-4">
            <InputGroup label={type === 'pyeong' ? "면적 (m²)" : "달러 (USD)"} value={val} onChange={setVal} unit={type === 'pyeong' ? "m²" : "USD"} />
            <ResultField label={type === 'pyeong' ? "평수" : "한화 (예상)"} value={res} unit={unit} />
        </div>
    );
};

const GenericConverter = ({ units, defaultFrom, defaultTo, onResult, label }: any) => {
    const [val, setVal] = useState(1);
    const [fromUnit, setFromUnit] = useState(defaultFrom || Object.keys(units)[0]);
    const [toUnit, setToUnit] = useState(defaultTo || Object.keys(units)[1]);
    const result = useMemo(() => {
        if (!val) return 0;
        return (Number(val) * units[fromUnit]) / units[toUnit];
    }, [val, fromUnit, toUnit, units]);
    useEffect(() => { onResult(result.toLocaleString(undefined, { maximumFractionDigits: 5 }) + ' ' + toUnit); }, [result, toUnit, onResult]);
    return (
        <div className="flex flex-col gap-6">
            <InputGroup label="값 입력" value={val} onChange={setVal} unit={fromUnit} />
            <div className="grid grid-cols-2 gap-4">
                <select className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none focus:bg-white shadow-inner" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
                    {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <select className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none focus:bg-white shadow-inner" value={toUnit} onChange={e => setToUnit(e.target.value)}>
                    {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
            <ResultField label={label || "변환"} value={result} unit={toUnit} />
        </div>
    );
};

// --- (Main Component) ---

export default function SmartCalculator() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeCat, setActiveCat] = useState('all');
    const [currentResult, setCurrentResult] = useState('');

    const unitRef: any = {
        len: { units: { mm: 1, cm: 10, m: 1000, km: 1000000, inch: 25.4, ft: 304.8, yd: 914.4, mile: 1609344 }, from: 'm', to: 'cm', label: '길이 변환' },
        area: { units: { 'm²': 1, 'km²': 1000000, '평': 3.305785, 'acre': 4046.856 }, from: 'm²', to: '평', label: '넓이 변환' },
        weight: { units: { mg: 0.001, g: 1, kg: 1000, ton: 1000000, oz: 28.3495, lb: 453.592 }, from: 'kg', to: 'g', label: '무게 변환' },
        vol: { units: { mL: 1, L: 1000, 'm³': 1000000, gal: 3785.41 }, from: 'L', to: 'mL', label: '부피 변환' },
        temp: { units: { '°C': 1, '°F': 0.5555, 'K': 1 }, from: '°C', to: '°F', label: '온도 변환' },
        press: { units: { Pa: 1, bar: 100000, atm: 101325, psi: 6894.76 }, from: 'atm', to: 'psi', label: '압력 변환' },
        speed: { units: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444 }, from: 'km/h', to: 'm/s', label: '속도 변환' },
        data: { units: { bit: 1, B: 8, KB: 8192, MB: 8388608, GB: 8589934592, TB: 8796093022208 }, from: 'GB', to: 'MB', label: '데이터양 변환' },
        time: { units: { 초: 1, 분: 60, 시간: 3600, 일: 86400, 주: 604800, 년: 31536000 }, from: '시간', to: '분', label: '시간 변환' },
    };

    const handleResult = (res: any) => {
        const str = typeof res === 'number' ? res.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(res);
        setCurrentResult(str);
    };

    const filteredCalculators = CALCULATOR_DATA.filter(calc => activeCat === 'all' || calc.cat === activeCat);

    const renderCalculator = (targetId?: string) => {
        const id = targetId || selectedId;
        if (!id) return null;
        switch (id) {
            case 'bmi': return <BMICalculator onResult={handleResult} />;
            case 'pct': return <PercentCalculator onResult={handleResult} />;
            case 'loan': return <LoanCalculator onResult={handleResult} />;
            case 'interest': return <InterestCalculator onResult={handleResult} />;
            case 'vat': return <VATCalculator onResult={handleResult} />;
            case 'date': return <DateCalculator onResult={handleResult} />;
            case 'age': return <AgeCalculator onResult={handleResult} />;
            case 'fuel': return <FuelCalculator onResult={handleResult} />;
            case 'disc': return <DiscountCalculator onResult={handleResult} />;
            case 'speed_net': return <NetSpeedCalculator onResult={handleResult} />;
            case 'pyeong': return <SpecialConverter type="pyeong" onResult={handleResult} />;
            case 'fx': return <SpecialConverter type="fx" onResult={handleResult} />;
            case 'savings': return <SavingsCalculator onResult={handleResult} />;
            default:
                if (unitRef[id]) return <GenericConverter units={unitRef[id].units} defaultFrom={unitRef[id].from} defaultTo={unitRef[id].to} onResult={handleResult} label={unitRef[id].label} />;
                return <div className="p-10 text-center font-black text-slate-300 italic opacity-40">ENGINE RECHARGING...</div>;
        }
    };

    return (
        <div className="min-h-screen bg-white font-outfit text-slate-900">
            {/* [Tier 0] Centered Header - Smart Calc Box */}
            <div className="pt-32 pb-12 bg-white text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-[1000] text-slate-900 tracking-tighter mb-4 shadow-indigo-600/10">스마트 계산기</h1>
                    <p className="text-xl font-bold text-indigo-600 tracking-tight">일상에 필요한 23가지 무료 계산기</p>
                    <div className="w-24 h-1.5 bg-indigo-600 mx-auto mt-12 rounded-full hidden md:block" />
                </div>
            </div>

            {/* [Tier 1.1] Category Bar */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-6 max-w-6xl flex justify-center">
                    {CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={cn("px-8 py-7 text-sm font-black tracking-tight border-b-4 transition-all whitespace-nowrap", activeCat === cat.id ? "text-indigo-600 border-indigo-600 bg-indigo-50/20" : "text-slate-400 border-transparent hover:text-slate-600")}>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* [Tier 1.2] Calculator Grid (Image Top) */}
            <div className="container mx-auto px-6 max-w-7xl py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
                    {filteredCalculators.map((calc) => (
                        <div 
                            key={calc.id} 
                            onClick={() => { setSelectedId(calc.id); setCurrentResult(''); }} 
                            className="bg-white p-10 py-12 rounded-[2rem] border border-slate-100 shadow-sm transition-all cursor-pointer group flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-2xl hover:-translate-y-2 relative"
                        >
                            <div className="absolute top-5 right-5 text-slate-100 group-hover:text-amber-400 transition-colors">
                                <Star size={18} fill="currentColor" />
                            </div>
                            <div className="text-indigo-600 mb-8 group-hover:scale-110 transition-transform bg-indigo-50/50 p-6 rounded-[2rem]">
                                <calc.icon size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-[1.2rem] font-[1000] text-slate-900 tracking-tight mb-2">{calc.title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{calc.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* [Tier 2] Master Usage Dashboard (Image Middle) */}
            <div className="bg-[#F8FAFC] border-y border-slate-100 py-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        
                        {/* Left Column: Main Dashboard Content (8 Cols) */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Master Usage Header Card */}
                            <div className="bg-white/40 backdrop-blur-sm p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-all duration-1000" />
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-2.5 h-10 bg-indigo-600 rounded-full shadow-lg" />
                                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">📏 스마트 계산 완벽 정리 | 단위 변환·수치 계산 한 번에</h2>
                                </div>
                                <div className="space-y-4 text-slate-600 text-lg leading-relaxed font-bold italic opacity-80">
                                    <p>
                                        길이 단위는 건축, 쇼핑, 지도 등 일상 전반에서 활용됩니다.<br />
                                        이미지 크기나 제품 규격이 헷갈릴 때 정확한 수치 계산이 중요합니다.
                                    </p>
                                    <p>
                                        복잡한 계산 없이<br />
                                        필요한 값을 빠르게 확인하는 것이 핵심입니다.
                                    </p>
                                    <div className="flex items-center gap-3 pt-6 font-[1000] text-slate-800 text-xl tracking-tighter">
                                        <span className="text-4xl animate-bounce">👉</span> 스마트 계산으로 단위 변환과 다양한 수치를 쉽고 빠르게 확인해보세요.
                                    </div>
                                </div>
                            </div>

                            {/* Middle Grid (Why/How) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-14 bg-white rounded-[4.5rem] border border-slate-100 shadow-sm space-y-10 hover:shadow-xl transition-shadow">
                                    <h4 className="text-2xl font-[1000] text-slate-900 flex items-center gap-4">
                                        <span className="p-4 bg-rose-50 text-rose-500 rounded-[2rem] shadow-sm">📌</span> 왜 필요할까?
                                    </h4>
                                    <ul className="space-y-8">
                                        <li className="flex items-start gap-5 text-slate-600 font-bold text-xl leading-relaxed">
                                            <div className="w-3 h-3 bg-rose-400 rounded-full shrink-0 mt-3" />
                                            정확한 수치 변환으로 실수를 방지합니다.
                                        </li>
                                        <li className="flex items-start gap-5 text-slate-600 font-bold text-xl leading-relaxed">
                                            <div className="w-3 h-3 bg-rose-400 rounded-full shrink-0 mt-3" />
                                            다양한 상황별 최적화된 계산 환경을 제공합니다.
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-14 bg-white rounded-[4.5rem] border border-slate-100 shadow-sm space-y-10 hover:shadow-xl transition-shadow">
                                    <h4 className="text-2xl font-[1000] text-slate-900 flex items-center gap-4">
                                        <span className="p-4 bg-indigo-50 text-indigo-500 rounded-[2rem] shadow-sm">🚀</span> 활용 방법
                                    </h4>
                                    <ul className="space-y-8">
                                        <li className="flex items-start gap-5 text-slate-600 font-bold text-xl leading-relaxed">
                                            <div className="w-3 h-3 bg-indigo-400 rounded-full shrink-0 mt-3" />
                                            일상에서 필요한 다양한 생활 수치를 즉시 계산.
                                        </li>
                                        <li className="flex items-start gap-5 text-slate-600 font-bold text-xl leading-relaxed">
                                            <div className="w-3 h-3 bg-indigo-400 rounded-full shrink-0 mt-3" />
                                            복잡한 금융/단위 업무를 스마트하게 처리.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sidebar (4 Cols) */}
                        <div className="lg:col-span-4 space-y-10">
                            <div className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
                                <h4 className="text-xl font-[1000] text-slate-900 tracking-tight uppercase tracking-[0.2em] opacity-50">연관 도구</h4>
                                <a href="/tools" className="block p-12 bg-indigo-600 rounded-[3rem] text-white hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 group">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-3">PORTAL HOME</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black tracking-tighter">전체 도구 카탈로그</span>
                                        <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </a>

                                <div className="p-10 bg-slate-50/80 rounded-[3rem] border border-slate-100 space-y-8">
                                    <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">
                                        <Info size={18} /> FAQ
                                    </div>
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-[1.1rem] font-black text-slate-800 leading-tight mb-3">Q. 회원가입이 필요한가요?</p>
                                            <p className="text-sm font-bold text-slate-400 leading-relaxed italic">아니요, 회원가입 없이 즉시 무료 사용 가능합니다.</p>
                                        </div>
                                        <div>
                                            <p className="text-[1.1rem] font-black text-slate-800 leading-tight mb-3">Q. 모바일에서도 사용 가능한가요?</p>
                                            <p className="text-sm font-bold text-slate-400 leading-relaxed italic">네, 최신 스마트폰 환경에 완벽 최적화 되어 있습니다.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* [Modal] Calculator Engine Execution */}
            {selectedId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xl" onClick={() => setSelectedId(null)} />
                    <div className="relative w-full max-w-[800px] bg-white rounded-[5rem] shadow-[0_0_150px_rgba(37,99,235,0.15)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col border border-white/30">
                        <div className="p-14 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                                    {React.createElement(CALCULATOR_DATA.find(c => c.id === selectedId)?.icon || Sparkles, { size: 36 })}
                                </div>
                                <h2 className="text-5xl font-[1000] text-slate-900 tracking-tighter">{CALCULATOR_DATA.find(c => c.id === selectedId)?.title}</h2>
                            </div>
                            <button onClick={() => setSelectedId(null)} className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-white flex items-center justify-center transition-all shadow-inner active:scale-95"><X size={36} /></button>
                        </div>
                        <div className="p-16 md:p-20 max-h-[85vh] overflow-y-auto custom-scrollbar relative z-10">
                            <div className="bg-slate-50/50 p-12 rounded-[4rem] border border-slate-100 mb-14 shadow-inner">
                                {renderCalculator()}
                            </div>
                            <div className="flex gap-6">
                                <button className="flex-[2.5] bg-indigo-600 hover:bg-indigo-700 text-white font-[1000] py-10 rounded-[3rem] flex items-center justify-center gap-6 transition-all shadow-2xl shadow-indigo-600/50 text-3xl active:scale-95" onClick={() => copyToClipboard(currentResult)}><Copy size={40} /> 결과 복사</button>
                                <button className="flex-1 bg-slate-100 text-slate-500 font-[1000] py-10 rounded-[3rem] transition-all hover:bg-slate-200 hover:text-slate-800 text-2xl" onClick={() => setSelectedId(null)}>닫기</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
