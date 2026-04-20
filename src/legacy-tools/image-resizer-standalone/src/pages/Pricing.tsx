import React from 'react';
import { CheckCircle2, Zap, Crown, ShieldCheck } from 'lucide-react';
import { activatePremium, deactivatePremium, getAccessState } from '../utils/subscription';
import { useState } from 'react';
import { cn } from '../utils/cn';

const Pricing: React.FC = () => {
    const [access, setAccess] = useState(getAccessState());

    const handleTogglePremium = () => {
        if (access.premiumActive) {
            deactivatePremium();
        } else {
            activatePremium();
        }
        setAccess(getAccessState());
        window.dispatchEvent(new Event('storage'));
    };

    const plans = [
        {
            name: 'Free Plan',
            price: '₩0',
            desc: '광고 시청 후 5분간 전체 기능을 무제한으로 이용하세요.',
            icon: Zap,
            color: 'blue',
            features: [
                '전체 30+ 도구 접근 가능',
                '광고 시청 후 5분 이용권 지급',
                '최대 50MB 파일 업로드',
                '표준 처리 속도'
            ],
            button: '현 상태 유지',
            active: !access.premiumActive
        },
        {
            name: 'Premium Plan',
            price: '₩10,000',
            period: '/월',
            desc: '광고 없는 쾌적한 환경에서 모든 한계를 뛰어넘으세요.',
            icon: Crown,
            color: 'amber',
            features: [
                '광고 없는 완벽한 무제한 이용',
                '최대 2GB 대용량 파일 업로드',
                '우선 순위 AI 처리 고속 엔진',
                '다중 파일 일괄 처리 지원',
                '고급 AI 배경제거/업스케일'
            ],
            button: access.premiumActive ? 'Premium 구독 중' : 'Premium 시작하기',
            active: access.premiumActive,
            highlight: true
        }
    ];

    return (
        <div className="container mx-auto px-4 py-24 space-y-24 animate-in">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                    가장 효율적인<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">워크플로우를 위한 선택</span>
                </h1>
                <p className="text-gray-500 text-lg font-medium leading-relaxed">
                    UtilityPro는 합리적인 가격 정책을 지향합니다. 광고 시청을 통한 무료 이용 또는 연간 구독을 통한 경제적인 비용으로 생산성을 높이세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "relative flex flex-col p-10 rounded-[3rem] border-2 transition-all duration-500",
                            plan.highlight
                                ? "bg-white dark:bg-gray-900 border-blue-600 shadow-2xl shadow-blue-500/10 scale-105"
                                : "bg-gray-50 dark:bg-gray-950 border-gray-100 dark:border-gray-800"
                        )}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-black text-[10px] tracking-widest uppercase">
                                Best Choice
                            </div>
                        )}

                        <div className="space-y-6 mb-10">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center",
                                plan.color === 'blue' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                            )}>
                                <plan.icon size={32} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{plan.price}</span>
                                    {plan.period && <span className="text-gray-400 font-bold text-lg">{plan.period}</span>}
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-4 leading-relaxed">{plan.desc}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-12 flex-grow">
                            {plan.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 size={18} className={cn("shrink-0", plan.color === 'blue' ? "text-blue-500" : "text-amber-500")} fill="currentColor" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={plan.highlight ? handleTogglePremium : undefined}
                            className={cn(
                                "w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95",
                                plan.highlight
                                    ? (access.premiumActive ? "bg-gray-900 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30")
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {plan.button}
                        </button>
                    </div>
                ))}
            </div>

            {/* Demo Notice */}
            <div className="max-w-3xl mx-auto bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 p-8 rounded-[2rem] text-center space-y-4">
                <ShieldCheck className="text-amber-600 mx-auto" size={32} />
                <h4 className="text-lg font-black text-amber-900 dark:text-amber-100">데모 결제 안내</h4>
                <p className="text-amber-700 dark:text-amber-400 text-sm font-medium leading-relaxed">
                    실제 결제가 발생하지 않습니다. 'Premium 시작하기' 버튼을 누르면 브라우저의 localStorage에 프리미엄 상태가 즉시 활성화됩니다.
                </p>
            </div>
        </div>
    );
};

export default Pricing;
