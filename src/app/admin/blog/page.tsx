"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    Plus, Search, Edit2, Trash2, ExternalLink, 
    Check, Loader2, Calendar, User, Eye, Layout
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    thumbnail: string;
    content: string;
    created_at: string;
    published_at?: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/blog');
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (e) {
            toast.error('포스트를 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('게시물이 삭제되었습니다.');
                fetchPosts();
            } else {
                toast.error('삭제에 실패했습니다.');
            }
        } catch (error) {
            toast.error('서버 오류가 발생했습니다.');
        }
    };

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 p-4 md:p-8">
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-3">
                        <Layout className="w-8 h-8 text-indigo-600" />
                        Blog Management
                    </h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Premium CMS Dashboard</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-grow md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="제목 또는 슬러그 검색..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 p-3 pl-12 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 shadow-sm transition-all"
                        />
                    </div>
                    <Link 
                        href="/admin/blog/editor"
                        className="bg-slate-950 text-white px-8 py-3 rounded-none font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl active:scale-95 border border-slate-800"
                    >
                        <Plus className="w-4 h-4" />
                        새 게시물 작성
                    </Link>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 border-b border-white/5">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">미디어</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">제목 / 슬러그</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">카테고리</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">상태</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">등록일</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                             <tr>
                                <td colSpan={6} className="p-20 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 opacity-20" />
                                </td>
                             </tr>
                        ) : filteredPosts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">검색 결과가 없거나 데이터가 없습니다</td>
                            </tr>
                        ) : (
                            filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="w-24 aspect-[1.6] border border-slate-200 shadow-sm overflow-hidden bg-slate-100">
                                            {post.thumbnail ? (
                                                <img src={post.thumbnail} alt="" className="w-full h-full object-cover filter grayscale-0 group-hover:grayscale-[0.5] transition-all duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-[8px] font-black uppercase tracking-widest">No Media</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{post.title}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">/{post.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {post.published_at && new Date(post.published_at.replace(' ', 'T')) > new Date() ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1 w-fit">
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                                    예약됨
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-400 italic">Expected: {post.published_at.split(' ')[0]}</span>
                                            </div>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1 w-fit">
                                                <Check className="w-2 h-2" />
                                                발행 완료
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-slate-500 font-mono">
                                            {post.created_at ? post.created_at.split(' ')[0] : '-'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                href={`/admin/blog/editor?id=${post.slug}`}
                                                className="p-3 bg-white text-slate-500 border border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                title="수정하기"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post.id)}
                                                className="p-3 bg-white text-slate-500 border border-slate-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="삭제하기"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <Link 
                                                href={`/blog/${post.slug}`} 
                                                target="_blank"
                                                className="p-3 bg-white text-slate-500 border border-slate-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                title="새창으로 보기"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-center pt-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">ClickTools Premium CMS Framework v2.0</p>
            </div>
        </div>
    );
}
