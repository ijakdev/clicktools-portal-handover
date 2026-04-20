"use client";

import React, { useEffect, useState } from 'react';
import { 
    Search, Mail, Trash2, CheckCircle2, 
    Clock, User as UserIcon, Loader2, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    title: string;
    message: string;
    status: string;
    created_at: string;
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        fetchInquiries();
        // Ensure body overflow is restored if coming from blog editor
        document.body.style.overflow = 'auto';
    }, []);

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/inquiries');
            const data = await res.json();
            setInquiries(Array.isArray(data) ? data : []);
        } catch (e) {
            toast.error('문의 내역을 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch('/api/admin/inquiries', {
                method: 'PUT',
                body: JSON.stringify({ id, status }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                toast.success('처리 상태가 업데이트되었습니다.');
                fetchInquiries();
            }
        } catch (error) {
            toast.error('업데이트 실패');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('문의가 삭제되었습니다.');
                if (expandedId === id) setExpandedId(null);
                fetchInquiries();
            }
        } catch (error) {
            toast.error('삭제 실패');
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-8">
            {/* Search and Action Bar */}
            <div className="flex justify-between items-center bg-white p-6 border border-slate-200 shadow-sm mb-6">
                <div className="relative group w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="문의자 이름 또는 제목 검색..." 
                        className="w-full bg-slate-50 border border-slate-200 p-3 pl-12 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    총 {inquiries.length}건의 문의 데이터
                </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white border border-slate-200 shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">문의자 정보</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">제목</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">상태</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">날짜</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center">
                                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-slate-300" />
                                </td>
                            </tr>
                        ) : inquiries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-slate-400 text-lg font-black uppercase opacity-40">수신된 문의가 없습니다.</td>
                            </tr>
                        ) : (
                            inquiries.map((inquiry) => (
                                <React.Fragment key={inquiry.id}>
                                    <tr 
                                        onClick={() => toggleExpand(inquiry.id)}
                                        className={cn(
                                            "hover:bg-slate-50 transition-colors cursor-pointer group",
                                            expandedId === inquiry.id && "bg-slate-50 border-l-8 border-l-indigo-600"
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 leading-none mb-1">{inquiry.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{inquiry.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-md truncate">
                                                <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{inquiry.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border",
                                                inquiry.status === '처리완료' || inquiry.status === 'resolved'
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                    : "bg-amber-50 text-amber-600 border-amber-100"
                                            )}>
                                                {inquiry.status === 'pending' ? '대기 중' : '처리완료'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {inquiry.created_at.split(' ')[0]}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpand(inquiry.id);
                                                }}
                                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all border border-slate-800"
                                            >
                                                {expandedId === inquiry.id ? '닫기' : '상세 보기'}
                                            </button>
                                        </td>
                                    </tr>
                                    
                                    {/* Expanded Content Section */}
                                    {expandedId === inquiry.id && (
                                        <tr className="bg-slate-50 shadow-inner">
                                            <td colSpan={5} className="px-10 py-10">
                                                <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                                        <div className="md:col-span-2 space-y-6">
                                                            <div className="pb-6 border-b border-slate-200">
                                                                <h5 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">문의 제목</h5>
                                                                <p className="text-2xl font-black text-slate-900 tracking-tight">{inquiry.title}</p>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">문의 내용 상세</h5>
                                                                <div className="p-8 bg-white border border-slate-200 text-sm font-medium leading-[1.8] text-slate-700 whitespace-pre-wrap">
                                                                    {inquiry.message}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <div className="bg-white p-8 border border-slate-200 space-y-6">
                                                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">사용자 식별 정보</h5>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                                                        <UserIcon size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-black text-slate-900 uppercase">{inquiry.name}</p>
                                                                        <a href={`mailto:${inquiry.email}`} className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 uppercase">
                                                                            <Mail size={12} /> {inquiry.email}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                                                                    <button 
                                                                        onClick={() => updateStatus(inquiry.id, inquiry.status === 'pending' ? 'resolved' : 'pending')}
                                                                        className={cn(
                                                                            "w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm",
                                                                            inquiry.status === 'pending' ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700" : "bg-slate-900 text-white border-slate-800 hover:bg-black"
                                                                        )}
                                                                    >
                                                                        {inquiry.status === 'pending' ? <><CheckCircle2 size={12} /> 처리 완료로 변경</> : <><Clock size={12} /> 대기 중으로 복구</>}
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDelete(inquiry.id)}
                                                                        className="w-full py-3 bg-white text-red-600 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2"
                                                                    >
                                                                        <Trash2 size={12} /> 문의 내역 삭제
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
