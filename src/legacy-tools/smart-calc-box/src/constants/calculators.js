import React, { useState, useMemo } from 'react';
import {
    Ruler, Maximize, Weight, Container, Thermometer, Gauge, Zap, Droplets, Database, Clock,
    User, Percent, Tag, Receipt, Calendar, Cake, Home,
    Coins, CreditCard, TrendingUp, PiggyBank,
    HardDrive, ArrowUpRight, Folder,
    Search, Star, History, X
} from 'lucide-react';

export const CALCULATORS = [
    // A. 단위변환
    { id: 'len', cat: 'unit', title: '길이 변환', desc: 'mm, cm, m, inch, mile 등', icon: Ruler },
    { id: 'area', cat: 'unit', title: '넓이 변환', desc: 'm², km², 평, acre 등', icon: Maximize },
    { id: 'weight', cat: 'unit', title: '무게 변환', desc: 'g, kg, ton, oz, lb 등', icon: Weight },
    { id: 'vol', cat: 'unit', title: '부피 변환', desc: 'mL, L, m³, gal, pt 등', icon: Container },
    { id: 'temp', cat: 'unit', title: '온도 변환', desc: 'Celsius, Fahrenheit, Kelvin', icon: Thermometer },
    { id: 'press', cat: 'unit', title: '압력 변환', desc: 'Pa, bar, atm, psi, mmHg', icon: Gauge },
    { id: 'speed', cat: 'unit', title: '속도 변환', desc: 'm/s, km/h, mph, knot', icon: Zap },
    { id: 'fuel', cat: 'unit', title: '연비 변환', desc: 'km/L, L/100km, mpg', icon: Droplets },
    { id: 'data', cat: 'unit', title: '데이터양', desc: 'bit, B, KB, MB, GB, TB', icon: Database },
    { id: 'time', cat: 'unit', title: '시간 변환', desc: '초, 분, 시, 일, 주, 월, 년', icon: Clock },

    // B. 생활 계산
    { id: 'bmi', cat: 'life', title: 'BMI 계산기', desc: '체질량 지수 및 비만도 측정', icon: User },
    { id: 'pct', cat: 'life', title: '퍼센트 계산', desc: '비율, 증감률, 할인가 계산', icon: Percent },
    { id: 'disc', cat: 'life', title: '할인 계산기', desc: '원가, 할인율 대비 최종가', icon: Tag },
    { id: 'vat', cat: 'life', title: '부가세 계산', desc: '공급가, 세액, 합계 계산', icon: Receipt },
    { id: 'date', cat: 'life', title: '날짜 계산기', desc: '디데이, 날짜 차이 측정', icon: Calendar },
    { id: 'age', cat: 'life', title: '나이 계산기', desc: '생일 기준 만/한국 나이', icon: Cake },
    { id: 'pyeong', cat: 'life', title: '평수 계산기', desc: 'm² ↔ 평 즉시 변환', icon: Home },

    // C. 금융 계산
    { id: 'fx', cat: 'fin', title: '환율 계산기', desc: 'USD, JPY, EUR 등 주요 통화', icon: Coins },
    { id: 'loan', cat: 'fin', title: '대출 계산기', desc: '원리금 상환액 자동 계산', icon: CreditCard },
    { id: 'interest', cat: 'fin', title: '이자 계산기', desc: '단리/복리 이자 수익 시뮬레이션', icon: TrendingUp },
    { id: 'savings', cat: 'fin', title: '예적금 계산', desc: '만기 시 수령액 계산', icon: PiggyBank },

    // D. 디지털/업무
    { id: 'speed_net', cat: 'digital', title: '전송 속도', desc: '다운로드 예상 시간 측정', icon: ArrowUpRight },
    { id: 'storage', cat: 'digital', title: '저장 공간', desc: '저장 용량 및 파일 개수 측정', icon: Folder },
];

export const CATEGORIES = [
    { id: 'all', label: '전체' },
    { id: 'unit', label: '단위변환' },
    { id: 'life', label: '생활 계산' },
    { id: 'fin', label: '금융 계산' },
    { id: 'digital', label: '디지털/업무' },
];
