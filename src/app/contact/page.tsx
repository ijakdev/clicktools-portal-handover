"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('문의가 성공적으로 전달되었습니다.');
        setFormData({ name: '', email: '', title: '', message: '' });
      } else {
        toast.error(data.error || '발송 중 오류가 발생했습니다.');
      }
    } catch (error) {
      toast.error('서버와의 통신에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 font-outfit">문의하기</h1>
          <p className="text-slate-500">서비스에 대한 제안이나 불편한 점이 있으신가요? 언제든지 연락주세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <Mail className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold mb-2">이메일 문의</h4>
              <p className="text-sm text-slate-500">clicktoolsijak@gmail.com</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <MessageSquare className="w-8 h-8 text-purple-600 mb-4" />
              <h4 className="font-bold mb-2">상담 가능 시간</h4>
              <p className="text-sm text-slate-500">평일 10:00 - 17:00</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">주말, 공휴일 휴무</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">성함 / 닉네임</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="홍길동" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">이메일 주소</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="example@mail.com" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">문의 제목</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="개선 제안 드립니다" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">문의 내용</label>
                <textarea 
                  rows={5} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="내용을 입력해 주세요" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/10 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>{isSubmitting ? '보내는 중...' : '문의 보내기'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
