import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Copy, RotateCcw, ArrowLeftRight, Droplets, Zap, Gauge, Database, Clock, Cloud, Upload, FileText, CheckCircle2, TrendingUp, TrendingDown, Landmark } from 'lucide-react';

// --- Shared Components ---
const InputGroup = ({ label, value, onChange, unit, options }) => (
    <div className="flex flex-col gap-2 flex-1">
        <label className="text-sm font-bold text-slate-500 ml-1">{label}</label>
        <div className="relative">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="form-input pr-20"
                placeholder="0"
            />
            {options ? (
                <select
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-50 border-none px-2 py-1 rounded text-xs font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    value={unit}
                    onChange={(e) => onChange(value, e.target.value)}
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">{unit}</span>
            )}
        </div>
    </div>
);

const ResultField = ({ label, value, unit, color = "text-slate-900" }) => (
    <div className="result-box border border-slate-100 flex-1">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black tracking-tighter ${color}`}>
                {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
            </span>
            <span className="text-sm font-bold text-blue-600">{unit}</span>
        </div>
    </div>
);

// --- Generic Unit Converter ---
const GenericConverter = ({ units, defaultFrom, defaultTo }) => {
    const [val, setVal] = useState(1);
    const [fromUnit, setFromUnit] = useState(defaultFrom || Object.keys(units)[0]);
    const [toUnit, setToUnit] = useState(defaultTo || Object.keys(units)[1]);

    const result = useMemo(() => {
        if (!units[fromUnit] || !units[toUnit]) return 0;
        return (Number(val) * units[fromUnit]) / units[toUnit];
    }, [val, fromUnit, toUnit, units]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <InputGroup label="값 입력" value={val} onChange={setVal} />
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">변환 전 단위</label>
                        <select className="form-input bg-slate-50 font-bold" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
                            {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">변환 후 단위</label>
                        <select className="form-input bg-slate-50 font-bold" value={toUnit} onChange={e => setToUnit(e.target.value)}>
                            {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <ResultField label="변환 결과" value={result} unit={toUnit} />
        </div>
    );
};

// --- Specialized Components ---

const BMICalculator = () => {
    const [h, setH] = useState(175);
    const [w, setW] = useState(70);
    const bmi = useMemo(() => (!h || !w) ? 0 : w / ((h / 100) * (h / 100)), [h, w]);
    const status = useMemo(() => {
        if (bmi < 18.5) return { text: '저체중', color: 'text-blue-500' };
        if (bmi < 23) return { text: '정상', color: 'text-emerald-500' };
        if (bmi < 25) return { text: '과체중', color: 'text-amber-500' };
        return { text: '비만', color: 'text-rose-500' };
    }, [bmi]);
    return (
        <div className="flex flex-col gap-6 text-center">
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="키 (cm)" value={h} onChange={setH} unit="cm" />
                <InputGroup label="몸무게 (kg)" value={w} onChange={setW} unit="kg" />
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">나의 BMI</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{bmi.toFixed(1)}</span>
                <span className={`text-sm font-bold mt-2 ${status.color}`}>{status.text}</span>
            </div>
        </div>
    );
};

const LoanCalculator = () => {
    const [p, setP] = useState(1000000);
    const [r, setR] = useState(3.5);
    const [y, setY] = useState(10);
    const monthlyPayment = useMemo(() => {
        const monthlyRate = (r / 100) / 12;
        const months = y * 12;
        if (monthlyRate === 0) return p / months;
        return (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }, [p, r, y]);
    return (
        <div className="flex flex-col gap-6">
            <InputGroup label="대출 원금" value={p} onChange={setP} unit="원" />
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="연 이자율" value={r} onChange={setR} unit="%" />
                <InputGroup label="대출 기간" value={y} onChange={setY} unit="년" />
            </div>
            <ResultField label="월 상환액" value={Math.round(monthlyPayment)} unit="원" />
        </div>
    );
};

const TempConverter = () => {
    const [val, setVal] = useState(25);
    const [fromUnit, setFromUnit] = useState('℃');
    const [toUnit, setToUnit] = useState('℉');

    const result = useMemo(() => {
        const v = Number(val);
        if (isNaN(v)) return 0;

        let celsius;
        if (fromUnit === '℃') celsius = v;
        else if (fromUnit === '℉') celsius = (v - 32) * 5 / 9;
        else celsius = v - 273.15;

        if (toUnit === '℃') return celsius;
        if (toUnit === '℉') return (celsius * 9 / 5) + 32;
        return celsius + 273.15;
    }, [val, fromUnit, toUnit]);

    return (
        <div className="flex flex-col gap-6">
            <InputGroup label="온도 값 입력" value={val} onChange={setVal} />
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">단위 (From)</label>
                    <select className="form-input bg-slate-50 font-bold" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
                        {['℃', '℉', 'K'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">단위 (To)</label>
                    <select className="form-input bg-slate-50 font-bold" value={toUnit} onChange={e => setToUnit(e.target.value)}>
                        {['℃', '℉', 'K'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            <ResultField label="변환 결과" value={result} unit={toUnit} />
        </div>
    );
};

const AgeCalculator = () => {
    const [birth, setBirth] = useState('2000-01-01');
    const now = new Date();

    const { man, meet, zodiac } = useMemo(() => {
        const b = new Date(birth);
        if (isNaN(b)) return { man: 0, meet: 0, zodiac: '-' };

        const diff = now.getFullYear() - b.getFullYear();
        const m = now.getMonth() - b.getMonth();
        const d = now.getDate() - b.getDate();

        let meetAge = diff;
        if (m < 0 || (m === 0 && d < 0)) meetAge--;

        const zodiacs = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
        const zodiacSign = zodiacs[b.getFullYear() % 12];

        return {
            man: diff + 1,
            meet: meetAge,
            zodiac: `${zodiacSign}띠`
        };
    }, [birth]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-500 ml-1">생년월일 선택</label>
                <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="form-input" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <ResultField label="만 나이" value={meet} unit="세" />
                <ResultField label="한국 나이" value={man} unit="세" />
                <ResultField label="띠" value={zodiac} unit="" />
            </div>
        </div>
    );
};

const FuelCalculator = () => {
    const [val, setVal] = useState(10);
    const [from, setFrom] = useState('km/L');
    const [to, setTo] = useState('L/100km');

    const result = useMemo(() => {
        const v = Number(val);
        if (isNaN(v) || v <= 0) return 0;

        let kmpl;
        if (from === 'km/L') kmpl = v;
        else if (from === 'L/100km') kmpl = 100 / v;
        else kmpl = v * 0.425144; // mpg(US)

        if (to === 'km/L') return kmpl;
        if (to === 'L/100km') return 100 / kmpl;
        return kmpl / 0.425144; // mpg(US)
    }, [val, from, to]);

    return (
        <div className="flex flex-col gap-6">
            <InputGroup label="연비 값 입력" value={val} onChange={setVal} />
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">단위 (From)</label>
                    <select className="form-input bg-slate-50 font-bold" value={from} onChange={e => setFrom(e.target.value)}>
                        {['km/L', 'L/100km', 'mpg(US)'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">단위 (To)</label>
                    <select className="form-input bg-slate-50 font-bold" value={to} onChange={e => setTo(e.target.value)}>
                        {['km/L', 'L/100km', 'mpg(US)'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            <ResultField label="계산 결과" value={result} unit={to} />
        </div>
    );
};

const PercentCalculator = () => {
    const [val1, setVal1] = useState(100);
    const [val2, setVal2] = useState(20);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <span className="text-sm font-black text-slate-500 ml-1 border-l-4 border-blue-500 pl-2">비율 계산</span>
                <div className="flex items-center gap-3">
                    <InputGroup value={val1} onChange={setVal1} unit="" />
                    <span className="font-bold text-slate-400">의</span>
                    <InputGroup value={val2} onChange={setVal2} unit="%" />
                    <span className="font-bold text-slate-400">는?</span>
                </div>
                <ResultField label="결과" value={(val1 * val2) / 100} unit="" />
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
                <span className="text-sm font-black text-slate-500 ml-1 border-l-4 border-emerald-500 pl-2">증감 계산</span>
                <div className="flex items-center gap-3">
                    <InputGroup value={val1} onChange={setVal1} unit="" />
                    <span className="font-bold text-slate-400">가</span>
                    <InputGroup value={val2} onChange={setVal2} unit="" />
                    <span className="font-bold text-slate-400">가 되면?</span>
                </div>
                <ResultField
                    label="변동률"
                    value={val1 === 0 ? 0 : ((val2 - val1) / val1) * 100}
                    unit="%"
                    color={val2 > val1 ? 'text-rose-500' : 'text-blue-500'}
                />
            </div>
        </div>
    );
};

// [사장님 지시] 실시간 환율 AI 연동 엔진 (Groq API)
const ForeignExchangeCalculator = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurr, setFromCurr] = useState('USD');
    const [toCurr, setToCurr] = useState('KRW');
    const [rate, setRate] = useState(1350);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState('');

    const currencies = {
        'KRW': '대한민국 원',
        'USD': '미국 달러',
        'JPY': '일본 엔',
        'EUR': '유로',
        'CNY': '중국 위안',
        'GBP': '영국 파운드',
        'AUD': '호주 달러'
    };

    const fetchRate = async () => {
        if (fromCurr === toCurr) { setRate(1); return; }
        setIsLoading(true);
        try {
            const apiKey = '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';
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are a professional financial assistant. Provide the current real-time exchange rate between two currencies. ONLY respond with the numeric rate value, no words, no explanations.' },
                        { role: 'user', content: `What is the current exchange rate for 1 ${fromCurr} to ${toCurr}? Just the number.` }
                    ],
                    temperature: 0
                })
            });
            const data = await response.json();
            const result = parseFloat(data.choices[0].message.content.trim().replace(/[^0-9.]/g, ''));
            if (!isNaN(result)) {
                setRate(result);
                setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
            }
        } catch (error) {
            console.error('환율 조회 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRate();
    }, [fromCurr, toCurr]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <InputGroup label="환전 금액" value={amount} onChange={setAmount} unit={fromCurr} />
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">보유 통화</label>
                        <select className="form-input bg-slate-50 font-bold" value={fromCurr} onChange={e => setFromCurr(e.target.value)}>
                            {Object.entries(currencies).map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">환전 통화</label>
                        <select className="form-input bg-slate-50 font-bold" value={toCurr} onChange={e => setToCurr(e.target.value)}>
                            {Object.entries(currencies).map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="relative p-10 bg-slate-900 rounded-2xl overflow-hidden group shadow-2xl shadow-blue-900/20">
                <div className="relative flex flex-col items-center text-center gap-2">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.25em]">실시간 AI 환율 조회 결과</span>
                        {isLoading && <RefreshCw size={12} className="text-blue-400 animate-spin ml-1" />}
                    </div>

                    <div className="flex items-baseline justify-center gap-3 py-4 w-full">
                        <span className="text-6xl font-black text-white tracking-tighter drop-shadow-sm">
                            {(amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-3xl font-bold text-blue-400">{toCurr}</span>
                    </div>

                    <div className="flex flex-col items-center gap-4 mt-6 pt-8 border-t border-white/10 w-full">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Exchange Rate Information</span>
                            <span className="text-sm font-black text-slate-300">
                                1 {fromCurr} = {rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCurr}
                            </span>
                        </div>
                        <button
                            onClick={fetchRate}
                            disabled={isLoading}
                            className="bg-white/5 hover:bg-blue-600 hover:text-white text-slate-400 p-4 rounded-2xl transition-all shadow-lg flex items-center gap-2 group/btn"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                            <span className="text-xs font-bold px-2 text-slate-300 group-hover/btn:text-white">환율 다시 불러오기</span>
                        </button>
                    </div>
                </div>
            </div>

            {lastUpdate && (
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    최근 업데이트: {lastUpdate} (Groq AI Real-time)
                </p>
            )}
        </div>
    );
};

const StorageCalculator = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [analyzedFiles, setAnalyzedFiles] = useState([]);

    const processFiles = (fileList) => {
        const files = Array.from(fileList).map(f => ({
            name: f.name,
            size: f.size,
            type: f.type || 'unknown'
        }));
        setAnalyzedFiles(prev => [...prev, ...files]);
    };

    const totalStats = useMemo(() => {
        const totalSize = analyzedFiles.reduce((acc, f) => acc + f.size, 0);
        const count = analyzedFiles.length;

        let displaySize = totalSize;
        let unit = 'B';
        if (totalSize > 1024 ** 4) { displaySize = totalSize / (1024 ** 4); unit = 'TB'; }
        else if (totalSize > 1024 ** 3) { displaySize = totalSize / (1024 ** 3); unit = 'GB'; }
        else if (totalSize > 1024 ** 2) { displaySize = totalSize / (1024 ** 2); unit = 'MB'; }
        else if (totalSize > 1024) { displaySize = totalSize / 1024; unit = 'KB'; }

        return { size: displaySize, unit, count };
    }, [analyzedFiles]);

    const reset = () => setAnalyzedFiles([]);

    return (
        <div className="flex flex-col gap-6">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
                className={`flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-[2rem] transition-all cursor-pointer bg-slate-50 relative group ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[0.98]' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => processFiles(e.target.files)}
                />

                <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Cloud size={40} className={isDragging ? 'animate-bounce' : ''} />
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-2">사장님, 분석할 파일을 끌어다 놓으세요!</h3>
                <p className="text-sm font-bold text-slate-400">파일을 클릭해서 직접 선택할 수도 있습니다.</p>

                <div className="absolute bottom-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Upload size={24} className="text-blue-500" />
                </div>
            </div>

            {analyzedFiles.length > 0 && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-end px-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" /> 실시간 분석 리포트
                        </span>
                        <button onClick={reset} className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase">다시 분석하기</button>
                    </div>

                    <div className="flex gap-4">
                        <ResultField label="총 분석 용량" value={totalStats.size} unit={totalStats.unit} color="text-blue-600" />
                        <ResultField label="총 파일 개수" value={totalStats.count} unit="개" />
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-4 overflow-hidden">
                        <div className="max-h-[160px] overflow-y-auto no-scrollbar flex flex-col gap-2">
                            {analyzedFiles.map((f, i) => (
                                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                            <FileText size={16} />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs font-black text-slate-700 truncate max-w-[150px]">{f.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{f.type || 'unknown'}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase">
                                        {(f.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </div>
                            )).reverse()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DiscountCalculator = () => {
    const [price, setPrice] = useState(100000);
    const [rate, setRate] = useState(20);
    const saved = useMemo(() => price * (rate / 100), [price, rate]);
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="원가" value={price} onChange={setPrice} unit="원" />
                <InputGroup label="할인율" value={rate} onChange={setRate} unit="%" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <ResultField label="할인 금액" value={Math.round(saved)} unit="원" />
                <ResultField label="최종 가격" value={Math.round(price - saved)} unit="원" />
            </div>
        </div>
    );
};

const InterestCalculator = () => {
    const [p, setP] = useState(1000000);
    const [r, setR] = useState(5);
    const [y, setY] = useState(1);
    const simple = useMemo(() => p * (r / 100) * y, [p, r, y]);
    const compound = useMemo(() => p * (Math.pow(1 + (r / 100), y) - 1), [p, r, y]);
    return (
        <div className="flex flex-col gap-6">
            <InputGroup label="예치 원금" value={p} onChange={setP} unit="원" />
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="이자율 (%)" value={r} onChange={setR} unit="%" />
                <InputGroup label="기간" value={y} onChange={setY} unit="년" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <ResultField label="단리 이자" value={Math.round(simple)} unit="원" />
                <ResultField label="복리 이자" value={Math.round(compound)} unit="원" />
            </div>
        </div>
    );
};

const DateCalculator = () => {
    const [d1, setD1] = useState(new Date().toISOString().split('T')[0]);
    const [d2, setD2] = useState(new Date().toISOString().split('T')[0]);
    const diff = useMemo(() => {
        const start = new Date(d1);
        const end = new Date(d2);
        return Math.floor(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    }, [d1, d2]);
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">시작 날짜</label>
                    <input type="date" value={d1} onChange={e => setD1(e.target.value)} className="form-input" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">종료 날짜</label>
                    <input type="date" value={d2} onChange={e => setD2(e.target.value)} className="form-input" />
                </div>
            </div>
            <ResultField label="날짜 차이" value={diff} unit="일" />
        </div>
    );
};

const SpeedNetCalculator = () => {
    const [size, setSize] = useState(1);
    const [unit, setUnit] = useState('GB');
    const [speed, setSpeed] = useState(100);
    const [sUnit, setSUnit] = useState('Mbps');

    const totalBits = useMemo(() => {
        const multipliers = { MB: 1024 ** 2 * 8, GB: 1024 ** 3 * 8, TB: 1024 ** 4 * 8 };
        return size * multipliers[unit];
    }, [size, unit]);

    const speedBits = useMemo(() => {
        const multipliers = { 'Mbps': 1000000, 'Gbps': 1000000000 };
        return speed * multipliers[sUnit];
    }, [speed, sUnit]);

    const seconds = useMemo(() => totalBits / speedBits, [totalBits, speedBits]);

    const formatTime = (s) => {
        if (s < 60) return `${Math.round(s)}초`;
        if (s < 3600) return `${Math.floor(s / 60)}분 ${Math.round(s % 60)}초`;
        return `${Math.floor(s / 3600)}시간 ${Math.floor((s % 3600) / (60))}분`;
    };

    return (
        <div className="flex flex-col gap-6">
            <InputGroup label="파일 크기" value={size} onChange={(v, u) => { setSize(v); if (u) setUnit(u); }} unit={unit} options={['MB', 'GB', 'TB']} />
            <InputGroup label="인터넷 속도" value={speed} onChange={(v, u) => { setSpeed(v); if (u) setSUnit(u); }} unit={sUnit} options={['Mbps', 'Gbps']} />
            <ResultField label="예상 소요 시간" value={formatTime(seconds)} unit="" />
        </div>
    );
};

// --- Engine Factory ---

export const CalculatorContent = ({ id }) => {
    const [val, setVal] = useState(10000);

    const unitRef = {
        len: { units: { mm: 1, cm: 10, m: 1000, km: 1000000, inch: 25.4, ft: 304.8, yd: 914.4, mile: 1609344 }, from: 'm', to: 'cm' },
        area: { units: { 'm²': 1, 'km²': 1000000, '평': 3.305785, 'acre': 4046.856, 'ft²': 0.092903, 'yd²': 0.836127 }, from: 'm²', to: '평' },
        weight: { units: { mg: 0.001, g: 1, kg: 1000, ton: 1000000, oz: 28.3495, lb: 453.592 }, from: 'kg', to: 'lb' },
        vol: { units: { mL: 1, L: 1000, 'cm³': 1, 'm³': 1000000, gal: 3785.41 }, from: 'L', to: 'mL' },
        press: { units: { Pa: 1, kPa: 1000, MPa: 1000000, bar: 100000, atm: 101325, psi: 6894.76, mmHg: 133.322 }, from: 'atm', to: 'bar' },
        speed: { units: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048 }, from: 'km/h', to: 'm/s' },
        data: { units: { bit: 1, B: 8, KB: 8192, MB: 8388608, GB: 8589934592, TB: 8796093022208 }, from: 'GB', to: 'MB' },
        time: { units: { 초: 1, 분: 60, 시간: 3600, 일: 86400, 주: 604800, 월: 2592000, 년: 31536000 }, from: '시간', to: '분' },
        pyeong: { units: { 'm²': 1, '평': 3.305785 }, from: 'm²', to: '평' },
    };

    switch (id) {
        case 'len':
        case 'area':
        case 'weight':
        case 'vol':
        case 'press':
        case 'speed':
        case 'data':
        case 'time':
        case 'pyeong':
            return <GenericConverter units={unitRef[id].units} defaultFrom={unitRef[id].from} defaultTo={unitRef[id].to} />;

        case 'bmi': return <BMICalculator />;
        case 'loan': return <LoanCalculator />;
        case 'temp': return <TempConverter />;
        case 'age': return <AgeCalculator />;
        case 'fuel': return <FuelCalculator />;
        case 'pct': return <PercentCalculator />;
        case 'disc': return <DiscountCalculator />;
        case 'storage': return <StorageCalculator />;
        case 'date': return <DateCalculator />;
        case 'speed_net': return <SpeedNetCalculator />;
        case 'interest':
        case 'savings':
            return <InterestCalculator />;
        case 'fx':
            return <ForeignExchangeCalculator />;
        case 'vat':
            return (
                <div className="flex flex-col gap-6">
                    <InputGroup label="공급 가액" onChange={(v) => setVal(v)} unit="원" />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultField label="부가세 (10%)" value={val * 0.1} unit="" />
                        <ResultField label="총 합계" value={val * 1.1} unit="" />
                    </div>
                </div>
            );
        default:
            return (
                <div className="flex flex-col items-center justify-center p-12 text-slate-300 gap-4">
                    <Database className="animate-bounce" size={32} />
                    <p className="font-bold">엔진 작동 준비 완료.</p>
                </div>
            );
    }
};
