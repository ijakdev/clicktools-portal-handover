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
export const copyToClipboard = (text: string) => {
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

import { CATEGORIES, CALCULATOR_DATA, unitRef } from '@/data/calculator-data';

export { CATEGORIES, CALCULATOR_DATA, unitRef };

export interface CalcProps {
    onResult: (res: any) => void;
}

// --- (Shared UI Blocks) ---
export const InputGroup = ({ label, value, onChange, unit, options }: any) => (
    <div className="flex flex-col gap-1.5 flex-1 mb-5">
        <label className="text-[12px] font-bold text-slate-400 ml-1 uppercase tracking-tight">{label}</label>
        <div className="relative group flex items-stretch">
            <input
                type={(options || typeof value === 'string' || label.includes('날짜') || label.includes('생일')) ? "text" : "number"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-l-lg text-lg font-medium focus:outline-none focus:border-indigo-500 transition-all text-slate-800"
                placeholder={label.includes('날짜') ? "YYYY-MM-DD" : "값 입력..."}
            />
            {options ? (
                <div className="relative border-y border-r border-slate-200 rounded-r-lg bg-slate-50 flex items-center px-4 group-focus-within:border-indigo-500 transition-colors">
                    <select className="bg-transparent text-sm font-bold outline-none cursor-pointer pr-4 appearance-none" value={unit} onChange={(e) => onChange(value, e.target.value)}>
                        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 pointer-events-none text-slate-400" size={14} />
                </div>
            ) : (
                <div className="border-y border-r border-slate-200 rounded-r-lg bg-slate-50 flex items-center px-6 text-xs font-black text-slate-400 uppercase tracking-tighter group-focus-within:border-indigo-500 transition-colors">
                    {unit}
                </div>
            )}
        </div>
    </div>
);

export const CalcLayout = ({ inputs, resultLabel, resultValue, resultUnit }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-7 space-y-2">
            {inputs}
        </div>
        <div className="md:col-span-5 h-full flex flex-col border-l border-slate-100 pl-12 min-h-[160px]">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">{resultLabel || "변환"}</span>
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-[1000] text-slate-900 tracking-tighter break-all">
                        {typeof resultValue === 'number' ? resultValue.toLocaleString(undefined, { maximumFractionDigits: 4 }) : resultValue}
                    </span>
                    <span className="text-xl font-bold text-slate-400">{resultUnit}</span>
                </div>
            </div>
        </div>
    </div>
);

export const ResultField = ({ label, value, unit }: any) => (
    <div className="p-8 bg-indigo-600 rounded-[2rem] flex flex-col items-center flex-1 shadow-2xl shadow-indigo-900/20 text-white mt-6">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">{label}</span>
        <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-black tracking-tighter tabular-nums", "text-white")}>
                {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
            </span>
            <span className="text-xl font-bold opacity-80">{unit}</span>
        </div>
    </div>
);

// --- (Calculator Modules) ---

export const BMICalculator = ({ onResult }: CalcProps) => {
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
        <CalcLayout
            resultLabel="BMI INDEX"
            resultValue={bmi.toFixed(1)}
            resultUnit={status.text}
            inputs={
                <>
                    <InputGroup label="키" value={h} onChange={setH} unit="cm" />
                    <InputGroup label="몸무게" value={w} onChange={setW} unit="kg" />
                </>
            }
        />
    );
};

export const AgeCalculator = ({ onResult }: CalcProps) => {
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
        <CalcLayout
            resultLabel="만 나이"
            resultValue={age}
            resultUnit="세"
            inputs={
                <div className="flex flex-col gap-3">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">생년월일</label>
                    <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-lg font-medium focus:outline-none focus:border-indigo-500 transition-all text-slate-800" />
                </div>
            }
        />
    );
};

export const SavingsCalculator = ({ onResult }: CalcProps) => {
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
        <CalcLayout
            resultLabel="만기 예상금액"
            resultValue={Math.round(res)}
            resultUnit="원"
            inputs={
                <div className="grid grid-cols-1 gap-1">
                    <InputGroup label="월 적립액" value={p} onChange={setP} unit="원" />
                    <InputGroup label="연 이율" value={r} onChange={setR} unit="%" />
                    <InputGroup label="적립 기간" value={y} onChange={setY} unit="년" />
                </div>
            }
        />
    );
};

export const PercentCalculator = ({ onResult }: CalcProps) => {
    const [v1, setV1] = useState(100);
    const [v2, setV2] = useState(20);
    const res = (v1 * v2) / 100;
    useEffect(() => { onResult(res.toLocaleString()); }, [res, onResult]);
    return (
        <CalcLayout
            resultLabel="계산 결과"
            resultValue={res}
            resultUnit=""
            inputs={
                <>
                    <InputGroup label="기준 값" value={v1} onChange={setV1} unit="" />
                    <InputGroup label="비율" value={v2} onChange={setV2} unit="%" />
                </>
            }
        />
    );
};

export const LoanCalculator = ({ onResult }: CalcProps) => {
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
        <CalcLayout
            resultLabel="월 상환금"
            resultValue={Math.round(res)}
            resultUnit="원"
            inputs={
                <>
                    <InputGroup label="대출 원금" value={p} onChange={setP} unit="원" />
                    <InputGroup label="금리" value={r} onChange={setR} unit="%" />
                    <InputGroup label="기간" value={y} onChange={setY} unit="년" />
                </>
            }
        />
    );
};

export const InterestCalculator = ({ onResult }: CalcProps) => {
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
        <CalcLayout
            resultLabel="수령 예상액"
            resultValue={Math.round(res)}
            resultUnit="원"
            inputs={
                <div className="space-y-4">
                    <InputGroup label="원금" value={p} onChange={setP} unit="원" />
                    <InputGroup label="금리" value={r} onChange={setR} unit="%" />
                    <InputGroup label="기간" value={y} onChange={setY} unit="년" />
                    <div className="flex gap-2">
                        <button onClick={() => setType('simple')} className={cn("flex-1 py-3 rounded-lg font-bold text-xs transition-all", type === 'simple' ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400")}>단리</button>
                        <button onClick={() => setType('compound')} className={cn("flex-1 py-3 rounded-lg font-bold text-xs transition-all", type === 'compound' ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400")}>복리</button>
                    </div>
                </div>
            }
        />
    );
};

export const VATCalculator = ({ onResult }: CalcProps) => {
    const [amt, setAmt] = useState(100000);
    const [rate, setRate] = useState(10);
    const vat = amt * (rate / 100);
    const total = amt + vat;
    useEffect(() => { onResult(total.toLocaleString() + '원'); }, [total, onResult]);
    return (
        <CalcLayout
            resultLabel="합계"
            resultValue={Math.round(total)}
            resultUnit={"원 (세액: " + Math.round(vat).toLocaleString() + "원)"}
            inputs={
                <>
                    <InputGroup label="원금" value={amt} onChange={setAmt} unit="원" />
                    <InputGroup label="세율" value={rate} onChange={setRate} unit="%" />
                </>
            }
        />
    );
};

export const DateCalculator = ({ onResult }: CalcProps) => {
    const [d2, setD2] = useState(new Date().toISOString().split('T')[0]);
    const diff = useMemo(() => {
        const dt = new Date(d2);
        if (isNaN(dt.getTime())) return 0;
        return Math.floor(Math.abs(dt.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }, [d2]);
    useEffect(() => { onResult(diff + '일'); }, [diff, onResult]);
    return (
        <CalcLayout
            resultLabel="디데이"
            resultValue={diff}
            resultUnit="일"
            inputs={
                <div className="flex flex-col gap-3">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">목표일</label>
                    <input type="date" value={d2} onChange={e => setD2(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-lg font-medium focus:outline-none focus:border-indigo-500 transition-all text-slate-800" />
                </div>
            }
        />
    );
};

export const FuelCalculator = ({ onResult }: CalcProps) => {
    const [dist, setDist] = useState(100);
    const [fuel, setFuel] = useState(10);
    const res = dist / fuel;
    useEffect(() => { onResult(res.toFixed(1) + ' km/L'); }, [res, onResult]);
    return (
        <CalcLayout
            resultLabel="연비"
            resultValue={res.toFixed(1)}
            resultUnit="km/L"
            inputs={
                <>
                    <InputGroup label="거리" value={dist} onChange={setDist} unit="km" />
                    <InputGroup label="유량" value={fuel} onChange={setFuel} unit="L" />
                </>
            }
        />
    );
};

export const DiscountCalculator = ({ onResult }: CalcProps) => {
    const [price, setPrice] = useState(50000);
    const [rate, setRate] = useState(25);
    const disc = price * (rate / 100);
    const res = price - disc;
    useEffect(() => { onResult(res.toLocaleString() + '원'); }, [res, onResult]);
    return (
        <CalcLayout
            resultLabel="할인가"
            resultValue={Math.round(res)}
            resultUnit="원"
            inputs={
                <>
                    <InputGroup label="정가" value={price} onChange={setPrice} unit="원" />
                    <InputGroup label="할인율" value={rate} onChange={setRate} unit="%" />
                </>
            }
        />
    );
};

export const NetSpeedCalculator = ({ onResult }: CalcProps) => {
    const [size, setSize] = useState(1);
    const [sUnit, setSUnit] = useState('GB');
    const [speed, setSpeed] = useState(100);
    const [vUnit, setVUnit] = useState('Mbps');
    const time = useMemo(() => {
        if (!size || !speed) return 0;
        const bits = sUnit === 'GB' ? Number(size) * 8 * 1024 * 1024 * 1024 : Number(size) * 8 * 1024 * 1024;
        const speedBits = vUnit === 'Mbps' ? Number(speed) * 1000000 : Number(speed) * 1000;
        return bits / speedBits;
    }, [size, sUnit, speed, vUnit]);
    useEffect(() => { onResult(Math.round(time) + '초'); }, [time, onResult]);
    return (
        <CalcLayout
            resultLabel="예상 시간"
            resultValue={Math.round(time)}
            resultUnit="초"
            inputs={
                <>
                    <InputGroup label="용량" value={size} onChange={(v: any, u: string) => { if (u) setSUnit(u); else setSize(v); }} unit={sUnit} options={['MB', 'GB']} />
                    <InputGroup label="속도" value={speed} onChange={(v: any, u: string) => { if (u) setVUnit(u); else setSpeed(v); }} unit={vUnit} options={['Kbps', 'Mbps']} />
                </>
            }
        />
    );
};

export const TemperatureConverter = ({ onResult }: CalcProps) => {
    const units = ['°C', '°F', 'K'];
    const [val, setVal] = useState(0);
    const [fromUnit, setFromUnit] = useState('°C');
    const [toUnit, setToUnit] = useState('°F');

    const result = useMemo(() => {
        const v = Number(val);
        if (isNaN(v)) return 0;

        // 1. Convert to Celsius
        let c = v;
        if (fromUnit === '°F') c = (v - 32) / 1.8;
        else if (fromUnit === 'K') c = v - 273.15;

        // 2. Convert to target
        if (toUnit === '°C') return c;
        if (toUnit === '°F') return (c * 1.8) + 32;
        if (toUnit === 'K') return c + 273.15;
        return c;
    }, [val, fromUnit, toUnit]);

    useEffect(() => {
        onResult(result.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + toUnit);
    }, [result, toUnit, onResult]);

    return (
        <CalcLayout
            resultLabel="온도 변환"
            resultValue={result}
            resultUnit={toUnit}
            inputs={
                <>
                    <InputGroup
                        label="입력 온도"
                        value={val}
                        onChange={(v: any, u: string) => { if (u) setFromUnit(u); else setVal(v); }}
                        unit={fromUnit}
                        options={units}
                    />
                    <InputGroup
                        label="출력 온도"
                        value={val}
                        onChange={(v: any, u: string) => { if (u) setToUnit(u); else setVal(v); }}
                        unit={toUnit}
                        options={units}
                    />
                </>
            }
        />
    );
};

export const SpecialConverter = ({ type, onResult }: any) => {
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
        <CalcLayout
            resultLabel={type === 'pyeong' ? "평수" : "한화 (예상)"}
            resultValue={res}
            resultUnit={unit}
            inputs={
                <InputGroup label={type === 'pyeong' ? "면적 (m²)" : "달러 (USD)"} value={val} onChange={setVal} unit={type === 'pyeong' ? "m²" : "USD"} />
            }
        />
    );
};

export const GenericConverter = ({ units, defaultFrom, defaultTo, onResult, label }: any) => {
    const [val, setVal] = useState(1);
    const [fromUnit, setFromUnit] = useState(defaultFrom || Object.keys(units)[0]);
    const [toUnit, setToUnit] = useState(defaultTo || Object.keys(units)[1]);
    const result = useMemo(() => {
        if (!val) return 0;
        return (Number(val) * units[fromUnit]) / units[toUnit];
    }, [val, fromUnit, toUnit, units]);
    useEffect(() => { onResult(result.toLocaleString(undefined, { maximumFractionDigits: 5 }) + ' ' + toUnit); }, [result, toUnit, onResult]);
    return (
        <CalcLayout
            resultLabel={label || "변환 결과"}
            resultValue={result}
            resultUnit={toUnit}
            inputs={
                <>
                    <InputGroup
                        label="입력 유형"
                        value={val}
                        onChange={(v: any, u: string) => { if (u) setFromUnit(u); else setVal(v); }}
                        unit={fromUnit}
                        options={Object.keys(units)}
                    />
                    <InputGroup
                        label="출력 유형"
                        value={val}
                        onChange={(v: any, u: string) => { if (u) setToUnit(u); else setVal(v); }}
                        unit={toUnit}
                        options={Object.keys(units)}
                    />
                </>
            }
        />
    );
};

export const renderCalculator = (id: string, handleResult: (res: any) => void) => {
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
        case 'temp': return <TemperatureConverter onResult={handleResult} />;
        case 'pyeong': return <SpecialConverter type="pyeong" onResult={handleResult} />;
        case 'fx': return <SpecialConverter type="fx" onResult={handleResult} />;
        case 'savings': return <SavingsCalculator onResult={handleResult} />;
        default:
            const unitRefData = unitRef[id];
            if (unitRefData) return <GenericConverter key={id} units={unitRefData.units} defaultFrom={unitRefData.from} defaultTo={unitRefData.to} onResult={handleResult} label={unitRefData.label} />;
            return <div className="p-10 text-center font-black text-slate-300 italic opacity-40">ENGINE RECHARGING...</div>;
    }
};
