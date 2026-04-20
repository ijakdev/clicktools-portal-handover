import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="bg-blue-600 p-2 rounded-xl">
                                <Zap className="text-white" size={18} fill="currentColor" />
                            </div>
                            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                UtilityPro
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            세상의 모든 유틸리티를 한 곳에서.<br />
                            광고 시청만으로 모든 고급 기능을 무료로 이용하세요.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-black mb-6 text-gray-900 dark:text-white uppercase tracking-widest text-xs">제품</h4>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400 font-bold">
                            <li><Link to="/tools" className="hover:text-blue-600 transition-colors">모든 도구</Link></li>
                            <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">가격 정책</Link></li>
                            <li><button className="hover:text-blue-600 transition-colors">API 연동</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black mb-6 text-gray-900 dark:text-white uppercase tracking-widest text-xs">고객 지원</h4>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400 font-bold">
                            <li><button className="hover:text-blue-600 transition-colors">도움말 센터</button></li>
                            <li><button className="hover:text-blue-600 transition-colors">이용 약관</button></li>
                            <li><button className="hover:text-blue-600 transition-colors">개인정보 처리방침</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black mb-6 text-gray-900 dark:text-white uppercase tracking-widest text-xs">소셜</h4>
                        <div className="flex gap-4">
                            {[Twitter, Github, Mail].map((Icon, i) => (
                                <button key={i} className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-blue-600 transition-all hover:-translate-y-1">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-900 pt-10 flex flex-col md:row justify-between items-center gap-6">
                    <p className="text-xs text-gray-400 font-bold tracking-tight">© 2026 UtilityPro Service Group. All rights reserved.</p>
                    <p className="text-xs text-gray-400 font-bold tracking-tight bg-gray-50 dark:bg-gray-900 px-4 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">Designed with ❤️ for total productivity</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
