"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
    X, Check, Loader2, Image as ImageIcon, 
    ArrowLeft, Layout, Calendar, User, ExternalLink, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// --- Types ---
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
    image_alt?: string;
    image_caption?: string;
    image1?: string; image1_alt?: string; image1_caption?: string;
    image2?: string; image2_alt?: string; image2_caption?: string;
    image3?: string; image3_alt?: string; image3_caption?: string;
}

// --- Rich Text Editor Component ---
interface EditorProps {
    value: string;
    onChange: (val: string) => void;
}

const RichTextEditor = ({ value, onChange }: EditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const codeAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isCodeView, setIsCodeView] = useState(false);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value, isCodeView]);

    const execCommand = (command: string, val: string | undefined = undefined) => {
        document.execCommand(command, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const addLink = () => {
        const url = prompt('URL을 입력하세요:', 'https://');
        if (url) execCommand('createLink', url);
    };

    const insertPlaceholder = (id: number) => {
        const marker = `{{IMAGE_${id}}}`;
        if (isCodeView && codeAreaRef.current) {
            const start = codeAreaRef.current.selectionStart;
            const end = codeAreaRef.current.selectionEnd;
            const newValue = value.substring(0, start) + marker + value.substring(end);
            onChange(newValue);
        } else {
            execCommand('insertText', marker);
        }
        toast.info(`본문 이미지 ${id} 플레이스홀더가 삽입되었습니다.`);
    };

    const lineCount = value.split('\n').length;

    return (
        <div className="border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
            <div className="bg-slate-900 p-2 flex flex-wrap gap-1 border-b border-slate-800 sticky top-0 z-10">
                <button type="button" onClick={() => execCommand('bold')} className="p-2 text-white hover:bg-indigo-500 rounded transition-colors" title="굵게"><span className="font-black">B</span></button>
                <button type="button" onClick={() => execCommand('italic')} className="p-2 text-white hover:bg-indigo-500 rounded transition-colors" title="기울임"><span className="italic serif">I</span></button>
                <button type="button" onClick={() => execCommand('underline')} className="p-2 text-white hover:bg-indigo-500 rounded transition-colors" title="밑줄"><span className="underline">U</span></button>
                <div className="w-px h-6 bg-slate-700 mx-1 my-auto" />
                <button type="button" onClick={() => execCommand('formatBlock', 'H2')} className="px-2 py-1 text-white hover:bg-indigo-500 rounded transition-colors text-[10px] font-black" title="제목 2">H2</button>
                <button type="button" onClick={() => execCommand('formatBlock', 'H3')} className="px-2 py-1 text-white hover:bg-indigo-500 rounded transition-colors text-[10px] font-black" title="제목 3">H3</button>
                <button type="button" onClick={() => execCommand('formatBlock', 'P')} className="px-2 py-1 text-white hover:bg-indigo-500 rounded transition-colors text-[10px] font-black" title="본문">P</button>
                <div className="w-px h-6 bg-slate-700 mx-1 my-auto" />
                <button type="button" onClick={addLink} className="p-2 text-white hover:bg-indigo-500 rounded transition-colors" title="링크"><ExternalLink size={14} /></button>
                <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 text-white hover:bg-indigo-500 rounded transition-colors" title="글머리 기호"><Layout size={14} /></button>
                <button type="button" onClick={() => execCommand('insertHorizontalRule')} className="p-2 text-white hover:bg-indigo-500 rounded transition-colors" title="구분선">HR</button>
                <div className="w-px h-6 bg-slate-700 mx-1 my-auto" />
                <button type="button" onClick={() => execCommand('removeFormat')} className="p-2 text-white hover:bg-indigo-500 rounded transition-colors" title="형식 지우기"><Trash2 size={14} /></button>
                <div className="w-px h-6 bg-slate-700 mx-1 my-auto" />
                <div className="flex gap-1">
                    {[1, 2, 3].map(id => (
                        <button key={id} type="button" onClick={() => insertPlaceholder(id)} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-400 text-white rounded text-[8px] font-black uppercase tracking-tight" title={`이미지 ${id} 삽입`}>
                            IMG {id}
                        </button>
                    ))}
                </div>
                <div className="flex-grow" />
                <button type="button" onClick={() => setIsCodeView(!isCodeView)} className={cn("px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all border", isCodeView ? "bg-indigo-500 text-white border-indigo-400" : "text-slate-400 border-slate-700 hover:text-white")}>
                    {isCodeView ? '에디터 보기' : 'HTML 코드 (줄번호)'}
                </button>
            </div>
            <div className="flex-grow relative flex overflow-hidden">
                {isCodeView ? (
                    <>
                        <div className="w-12 bg-slate-900 text-slate-500 text-right p-4 pr-2 font-mono text-[10px] select-none border-r border-slate-800 flex flex-col pt-10">
                            {Array.from({ length: Math.max(lineCount, 50) }).map((_, i) => (
                                <div key={i} className="h-[21px] leading-[21px]">{i + 1}</div>
                            ))}
                        </div>
                        <textarea ref={codeAreaRef} value={value} onChange={(e) => onChange(e.target.value)} className="flex-grow p-10 pt-10 bg-slate-950 text-indigo-400 font-mono text-sm leading-[21px] resize-none focus:outline-none whitespace-pre overflow-x-auto" spellCheck={false} />
                    </>
                ) : (
                    <div ref={editorRef} contentEditable onInput={handleInput} className="absolute inset-0 w-full h-full p-10 py-16 overflow-y-auto focus:outline-none blog-content prose prose-slate prose-indigo max-w-none text-slate-800 leading-loose text-lg whitespace-pre-wrap break-words" title="본문 내용을 입력하세요..." />
                )}
            </div>
        </div>
    );
};

// --- Main Page Component ---
function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({
        slug: '', title: '', excerpt: '', category: '가이드', thumbnail: '',
        image_alt: '', image_caption: '', content: '', published_at: '',
        image1: '', image1_alt: '', image1_caption: '',
        image2: '', image2_alt: '', image2_caption: '',
        image3: '', image3_alt: '', image3_caption: '',
    });
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
    const [thumbName, setThumbName] = useState('');
    const [img1Name, setImg1Name] = useState('');
    const [img2Name, setImg2Name] = useState('');
    const [img3Name, setImg3Name] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            fetchPost(id);
        }
    }, [id]);

    const fetchPost = async (postId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/blog?slug=${postId}`);
            if (res.ok) {
                const data = await res.json();
                setEditingPost(data);
            }
        } catch (e) {
            toast.error('포스트를 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = editingPost.id ? 'PUT' : 'POST';
        try {
            const res = await fetch('/api/admin/blog', {
                method,
                body: JSON.stringify(editingPost),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                toast.success(editingPost.id ? '성공적으로 수정되었습니다.' : '성공적으로 등록되었습니다.');
                router.push('/admin/blog');
            } else {
                const data = await res.json();
                toast.error(data.error || '저장에 실패했습니다.');
            }
        } catch (error) {
            toast.error('서버 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        let targetName = slot === 'thumbnail' ? thumbName : slot === 'image1' ? img1Name : slot === 'image2' ? img2Name : img3Name;
        if (targetName) formData.append('customFilename', targetName);

        try {
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) {
                setEditingPost(prev => ({ ...prev, [slot]: data.url }));
                toast.success('이미지가 업로드되었습니다.');
            }
        } catch (e) { toast.error('업로드 실패'); }
        if (e.target) e.target.value = '';
    };

    const formatContent = (content: string, postData: any) => {
        if (!content) return '';
        let formatted = content;
        for (let i = 1; i <= 3; i++) {
            const marker = `{{IMAGE_${i}}}`;
            const imgUrl = postData[`image${i}`];
            if (imgUrl) {
                const imgHtml = `<figure class="my-10 group bg-slate-50 p-4 border border-slate-100 rounded-2xl"><div class="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-white"><img src="${imgUrl}" alt="${postData[`image${i}_alt`] || ''}" class="w-full h-full object-cover" /></div>${postData[`image${i}_caption`] ? `<figcaption class="mt-4 text-center text-[11px] text-slate-400 font-black uppercase tracking-widest">/ ${postData[`image${i}_caption`]} /</figcaption>` : ''}</figure>`;
                formatted = formatted.replace(marker, imgHtml);
            } else formatted = formatted.replace(marker, '');
        }
        formatted = formatted
            .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-black mt-16 mb-8 text-slate-900 border-l-8 border-blue-600 pl-6 tracking-tight font-outfit font-sans">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-12 mb-6 text-slate-800 tracking-tight font-outfit font-sans">$1</h3>')
            .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-3xl font-black mt-16 mb-8 text-slate-900 border-l-8 border-blue-600 pl-6 tracking-tight font-outfit font-sans">$1</h2>')
            .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-2xl font-bold mt-12 mb-6 text-slate-800 tracking-tight font-outfit font-sans">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 font-bold hover:underline decoration-2 transition-all">$1</a>')
            .replace(/^\d\.\s+(.*$)/gm, '<li class="ml-6 list-decimal pl-2 mb-2 text-slate-700">$1</li>')
            .replace(/^-\s+(.*$)/gm, '<li class="ml-6 list-disc pl-2 mb-2 text-slate-700">$1</li>')
            .replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, '<hr class="my-10 border-t-2 border-slate-100" />');
        return formatted;
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-indigo-500 opacity-20" /></div>;

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden selection:bg-indigo-100">
            {/* Header */}
            <div className="h-16 bg-slate-950 flex justify-between items-center px-6 shrink-0 border-b border-white/5 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16} /> 목록으로</button>
                    <div className="w-px h-4 bg-white/10" />
                    <h3 className="text-white font-black tracking-[0.4em] uppercase text-[10px] italic flex items-center gap-3">
                        <Layout className="w-5 h-5 text-indigo-500" /> Premium Editor
                    </h3>
                    <div className="hidden md:flex bg-white/5 p-1 border border-white/10 rounded-sm">
                        {['edit', 'split', 'preview'].map(m => (
                            <button key={m} onClick={() => setViewMode(m as any)} className={cn("px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all", viewMode === m ? "bg-indigo-500 text-white" : "text-white/40 hover:text-white")}>
                                {m === 'edit' ? '편집기' : m === 'split' ? '분할화면' : '미리보기'}
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={handleSave} disabled={isSaving} className="px-10 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-xl flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 게시물 저장
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex overflow-hidden">
                {/* Editor Pane */}
                <div className={cn("flex-grow flex flex-col transition-all duration-500 overflow-hidden", viewMode === 'preview' ? "w-0 opacity-0" : "w-full md:w-1/2 opacity-100", viewMode === 'edit' && "md:w-full")}>
                    <div className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
                        <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-12 pb-40">
                             <input type="text" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} className="w-full bg-transparent border-b-4 border-slate-900 pb-4 text-4xl font-black text-slate-900 focus:outline-none uppercase" placeholder="제목을 입력하세요" required />
                             <div className="flex flex-wrap gap-4">
                                <div className="flex-grow min-w-[300px] flex items-center bg-white border border-slate-200"><span className="bg-slate-50 px-4 py-4 text-[10px] font-black text-slate-400 border-r border-slate-100 uppercase tracking-widest">URL Slug</span><input type="text" value={editingPost.slug} onChange={e => setEditingPost({...editingPost, slug: e.target.value})} className="flex-grow p-4 text-xs font-bold focus:outline-none" placeholder="url-slug" required /></div>
                                <select value={editingPost.category} onChange={e => setEditingPost({...editingPost, category: e.target.value})} className="bg-white border border-slate-200 p-4 text-xs font-bold focus:outline-none"><option value="가이드">가이드</option><option value="마케팅">마케팅</option><option value="업무 팁">업무 팁</option></select>
                                <input type="date" value={editingPost.created_at?.split(' ')[0] || ''} onChange={e => setEditingPost({...editingPost, created_at: e.target.value + ' 12:00:00'})} className="bg-white border border-slate-200 p-4 text-xs font-bold focus:outline-none cursor-pointer" />
                                <input type="datetime-local" value={editingPost.published_at?.replace(' ', 'T') || ''} onChange={e => setEditingPost({...editingPost, published_at: e.target.value.replace('T', ' ')})} className="bg-white border border-slate-200 p-4 text-xs font-bold focus:outline-none text-indigo-600" />
                             </div>

                             {/* Images */}
                             <div className="space-y-8 pt-6 border-t border-slate-200">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Thumbnail & Sub Images</h4>
                                <div className="bg-white border-2 border-slate-900 p-6 flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/2 space-y-4">
                                        <div className="bg-slate-50 border border-slate-200 aspect-video flex flex-col items-center justify-center relative overflow-hidden group">
                                            {editingPost.thumbnail ? <img src={editingPost.thumbnail} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <ImageIcon className="w-10 h-10 text-slate-200" />}
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative z-10 px-6 py-2 bg-slate-900 text-white text-[9px] font-black tracking-widest shadow-xl">이미지 선택</button>
                                            <input type="file" ref={fileInputRef} onChange={e => handleImageUpload(e, 'thumbnail')} className="hidden" accept="image/*" />
                                        </div>
                                        <input type="text" value={thumbName} onChange={e => setThumbName(e.target.value)} className="w-full bg-slate-100 p-3 text-[10px] font-black focus:outline-none" placeholder="SEO 파일명 (예: main-thumb)" />
                                    </div>
                                    <div className="flex-grow space-y-4">
                                        <input type="text" value={editingPost.image_alt || ''} onChange={e => setEditingPost({...editingPost, image_alt: e.target.value})} className="w-full border p-3 text-[10px] font-bold" placeholder="Alt Tag (이미지 설명)" />
                                        <input type="text" value={editingPost.image_caption || ''} onChange={e => setEditingPost({...editingPost, image_caption: e.target.value})} className="w-full border p-3 text-[10px] font-bold" placeholder="캡션 (사용자 노출)" />
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-6 pt-6 border-t border-slate-200">
                                <textarea rows={2} value={editingPost.excerpt} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} className="w-full bg-slate-900 text-white p-6 text-sm font-medium border-l-4 border-indigo-500 focus:outline-none italic" placeholder="요약 내용을 작성하세요..." required />
                                <RichTextEditor value={editingPost.content || ''} onChange={val => setEditingPost({...editingPost, content: val})} />
                             </div>
                        </form>
                    </div>
                </div>

                {/* Preview Pane */}
                <div className={cn("flex-grow bg-white border-l border-slate-200 transition-all duration-500 overflow-hidden", viewMode === 'edit' ? "w-0 opacity-0" : "w-full md:w-1/2 opacity-100", viewMode === 'preview' && "md:w-full border-none")}>
                    <div className="h-full overflow-y-auto px-8 md:px-12 lg:px-20 py-20 pb-40">
                         <div className="max-w-3xl mx-auto">
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase mb-6 inline-block">{editingPost.category}</span>
                            <h1 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 uppercase italic">{editingPost.title || 'Untitled'}</h1>
                            <div className="flex gap-4 text-[10px] font-black text-slate-400 mb-10"><span className="flex items-center gap-1"><Calendar size={12} /> {editingPost.created_at?.split(' ')[0]}</span><span className="flex items-center gap-1"><User size={12} /> ADMIN</span></div>
                            <div className="aspect-video w-full bg-slate-100 mb-10 overflow-hidden border">
                                {editingPost.thumbnail && <img src={editingPost.thumbnail} className="w-full h-full object-cover" alt="" />}
                            </div>
                            <div className="mb-10 font-black text-xl text-slate-900 border-l-8 border-indigo-600 pl-6 py-6 bg-slate-50 italic">{editingPost.excerpt}</div>
                            <div className="blog-content prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: formatContent(editingPost.content || '', editingPost) }} />
                         </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .blog-content h2 { font-size: 2rem; font-weight: 900; margin: 3rem 0 1.5rem; border-left: 8px solid #2563eb; padding-left: 1.5rem; text-transform: uppercase; font-style: italic; }
                .blog-content h3 { font-size: 1.5rem; font-weight: 800; margin: 2rem 0 1rem; }
                .blog-content p { margin-bottom: 1.5rem; line-height: 1.8; color: #334155; }
                .blog-content figure { margin: 3rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1rem; }
                .blog-content figcaption { margin-top: 1rem; text-align: center; font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
            `}} />
        </div>
    );
}

export default function DedicatedEditor() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-indigo-500 opacity-20" /></div>}>
            <EditorContent />
        </Suspense>
    );
}
