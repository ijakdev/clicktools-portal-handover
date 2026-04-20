"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const VideoAudioConverter = dynamic(() => import('./VideoAudioConverter'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-24 bg-white rounded-[3rem] shadow-2xl border border-slate-50 text-center space-y-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      <p className="text-slate-400 font-bold">도구를 불러오고 있습니다...</p>
    </div>
  )
});

export default function VideoAudioClientWrapper() {
    return <VideoAudioConverter />;
}
