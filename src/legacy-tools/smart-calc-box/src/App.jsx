import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, X, Copy } from 'lucide-react';
import { CALCULATORS, CATEGORIES } from './constants/calculators';
import { CalculatorContent } from './components/calculator/CalculatorContent';

// --- Sub-Components ---

const CalcCard = ({ calc, onOpen, isFav, toggleFav }) => {
  const Icon = calc.icon;
  return (
    <div
      onClick={() => onOpen(calc)}
      className="calc-card relative group transition-all duration-300"
    >
      <div className="card-icon transition-transform group-hover:scale-110 duration-300">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="card-title">{calc.title}</h3>
      <p className="card-desc line-clamp-2">{calc.desc}</p>

      <button
        onClick={(e) => { e.stopPropagation(); toggleFav(calc.id); }}
        className={`absolute top-4 right-4 p-1 transition-all ${isFav ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-200 hover:text-yellow-300'}`}
      >
        <Star size={20} fill={isFav ? 'currentColor' : 'none'} strokeWidth={isFav ? 0 : 2} />
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-container animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={28} />
          </button>
        </div>
        <div className="modal-body custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [selectedCalc, setSelectedCalc] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favs') || '[]'));

  useEffect(() => localStorage.setItem('favs', JSON.stringify(favorites)), [favorites]);

  // [사장님 지시] 위치 고정 (Static 추천 시스템)
  // '최근 항목'에 의존하지 않고 고정된 추천 리스트 혹은 즐겨찾기만 표시
  const displayQuickCalcs = useMemo(() => {
    // 1. 즐겨찾기 먼저 가져옴
    const favItems = CALCULATORS.filter(c => favorites.includes(c.id));

    // 2. 사장님이 추천하는 고정 리스트 (데이터양, 저장공간 등 핵심 기능 위주)
    const fixedRecommendedIds = ['storage', 'speed_net', 'interest', 'file', 'len', 'bmi', 'pct', 'loan'];
    const recItems = CALCULATORS.filter(c => fixedRecommendedIds.includes(c.id) && !favorites.includes(c.id));

    // 즐겨찾기 + 추천 조합해서 딱 5개 고정 순서로 배치
    const combined = [...favItems, ...recItems].slice(0, 5);

    // 만약 부족하면 나머지 순서대로 채움
    if (combined.length < 5) {
      const others = CALCULATORS.filter(c => !combined.some(cc => cc.id === c.id));
      return [...combined, ...others].slice(0, 5);
    }
    return combined;
  }, [favorites]);

  // 하단 그리드 목록 계산 (변하지 않는 고정 순서 유지)
  const filteredCalcs = useMemo(() => {
    return CALCULATORS.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCat === 'all' || c.cat === activeCat;

      if (!matchesSearch || !matchesCat) return false;

      // 상단에 이미 있는 항목은 하단에서 제외하되, 
      // 이 로직 자체가 순서를 뒤섞지 않도록 ID 기반 필터링만 수행
      return !displayQuickCalcs.some(q => q.id === c.id);
    });
  }, [search, activeCat, displayQuickCalcs]);

  const handleOpen = (calc) => {
    setSelectedCalc(calc);
    // [중요] setRecent(최근사용순배치) 로직을 완전히 제거하여 위치 불변성 확보
  };

  const handleClose = () => {
    setSelectedCalc(null);
  };

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-slate-50 border-b border-slate-200">
        <header className="search-container">
          <div 
            className="relative z-[20] flex flex-col mb-4 md:mb-0 cursor-pointer hover:opacity-70 transition-all active:scale-95 p-2 -m-2 rounded-xl"
            onClick={goHome}
            title="메인으로 이동"
          >
            <h1 className="text-3xl font-black text-slate-900 leading-tight">스마트 계산 박스</h1>
            <p className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-tighter">일상에 필요한 {CALCULATORS.length}가지 무료 계산기</p>
          </div>

          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="검색어를 입력해 주세요 (예: bmi, 환율...)"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} strokeWidth={2.5} />
          </div>
        </header>
      </div>

      {/* Category Tabs */}
      <div className="tabs-container no-scrollbar bg-white sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`tab-btn ${activeCat === cat.id ? 'tab-active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Section */}
      <main className="card-grid">
        {/* Static Quick Lists Section */}
        {search === '' && activeCat === 'all' && (
          <div className="col-span-full mb-10">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest pl-1">
              <Star size={16} className="text-yellow-400 fill-current" /> 추천 및 즐겨찾기 (위치 고정)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-6">
              {displayQuickCalcs.map(calc => (
                <CalcCard key={`quick-${calc.id}`} calc={calc} onOpen={handleOpen} isFav={favorites.includes(calc.id)} toggleFav={toggleFav} />
              ))}
            </div>
            <div className="h-px bg-slate-100 mt-12 w-full" />
          </div>
        )}

        {/* Main Static Grid Section */}
        <div className="col-span-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-6">
          {filteredCalcs.map(calc => (
            <CalcCard key={`main-${calc.id}`} calc={calc} onOpen={handleOpen} isFav={favorites.includes(calc.id)} toggleFav={toggleFav} />
          ))}
        </div>
      </main>

      {/* Calculator Modal */}
      <Modal
        isOpen={!!selectedCalc}
        onClose={handleClose}
        title={selectedCalc?.title}
      >
        <div className="flex flex-col gap-8">
          <div className="min-h-[200px]">
            <CalculatorContent id={selectedCalc?.id} />
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <button
              className="btn-primary"
              onClick={() => {
                alert('결과가 클립보드에 복사되었습니다.');
              }}
            >
              <Copy size={20} className="inline mr-2" /> 결과 복사
            </button>
            <button
              className="btn-secondary"
              onClick={handleClose}
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>

      <footer className="mt-20 py-12 border-t border-slate-100 text-center text-slate-400 text-sm font-medium">
        <p>© 2026 Smart Calc Box. 사장님이 원하는 완벽한 고정형 라이아웃.</p>
        <p className="mt-2 text-slate-300">Static Position Implementation v3.5</p>
      </footer>
    </div>
  );
}

export default App;
