import React, { useState, useMemo } from 'react';
import { CaDaoItem, ScreenType } from '../types/cadao';
import { 
  Search, 
  Sparkles, 
  GitCompare, 
  Volume2, 
  Copy, 
  Check, 
  MapPin, 
  FileText, 
  Mic, 
  Filter, 
  BookMarked, 
  X,
  Compass
} from 'lucide-react';

interface HomeScreenProps {
  items: CaDaoItem[];
  onSelectItem: (item: CaDaoItem) => void;
  onNavigateToScreen: (screen: ScreenType) => void;
  onAskAiWithContext: (item: CaDaoItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  items,
  onSelectItem,
  onNavigateToScreen,
  onAskAiWithContext,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  // Extract unique topics
  const topics = useMemo(() => {
    const list = Array.from(new Set(items.map((i) => i.chu_de)));
    return ['all', ...list];
  }, [items]);

  // Featured "Câu ca dao hôm nay" (Daily folk proverb)
  const featuredItem = useMemo(() => {
    if (!items.length) return null;
    // Stable pick or first one
    return items[0];
  }, [items]);

  // Filtered list
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search matching: ten_tu_lieu, noi_dung_mo_ta_ngan, chu_de, dia_diem_thu_thap, variants
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.ten_tu_lieu.toLowerCase().includes(q) ||
        item.noi_dung_mo_ta_ngan.toLowerCase().includes(q) ||
        item.chu_de.toLowerCase().includes(q) ||
        item.dia_diem_thu_thap.toLowerCase().includes(q) ||
        (item.vung_mien && item.vung_mien.toLowerCase().includes(q)) ||
        item.danh_sach_di_ban.some(
          (db) =>
            db.cau_di_ban.toLowerCase().includes(q) ||
            db.dia_diem.toLowerCase().includes(q)
        );

      const matchTopic = selectedTopic === 'all' || item.chu_de === selectedTopic;
      const matchMedia = selectedMediaType === 'all' || item.loai_tu_lieu === selectedMediaType;
      
      let matchRegion = true;
      if (selectedRegion !== 'all') {
        const text = ((item.vung_mien || '') + ' ' + item.dia_diem_thu_thap).toLowerCase();
        matchRegion = text.includes(selectedRegion.toLowerCase());
      }

      return matchSearch && matchTopic && matchMedia && matchRegion;
    });
  }, [items, searchQuery, selectedTopic, selectedMediaType, selectedRegion]);

  const handleCopy = (item: CaDaoItem) => {
    const textToCopy = `${item.ten_tu_lieu}\n(Trích từ CaDaoPedia - Nguồn: ${item.nguon_tu_lieu})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (item: CaDaoItem) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeakingId === item.id) {
        setIsSpeakingId(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(item.ten_tu_lieu);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeakingId(null);
      utterance.onerror = () => setIsSpeakingId(null);
      setIsSpeakingId(item.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
    setSelectedMediaType('all');
    setSelectedRegion('all');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Cultural Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-amber-800 to-red-950 text-amber-50 p-6 sm:p-10 shadow-xl border border-amber-600/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs sm:text-sm font-medium mb-4">
            <Compass className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Di sản Văn hóa phi vật thể Việt Nam</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold folk-serif tracking-tight leading-tight sm:leading-snug text-amber-100">
            Thư viện Ca dao Tục ngữ & Đối chiếu Dị bản
          </h1>
          
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-amber-200/90 leading-relaxed font-normal">
            Không gian số hóa tra cứu, thưởng thức và nghiên cứu kho tàng văn học dân gian truyền khẩu. 
            Khám phá sự giao thoa, biến đổi tinh tế của từng câu hát ru, lời ví qua các vùng miền Bắc - Trung - Nam.
          </p>

          {/* Quick Metrics */}
          <div className="mt-6 pt-6 border-t border-amber-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                {items.length}
              </div>
              <div className="text-xs text-amber-200/70 font-medium">Câu ca dao chuẩn</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                {items.reduce((acc, curr) => acc + curr.danh_sach_di_ban.length, 0)}
              </div>
              <div className="text-xs text-amber-200/70 font-medium">Dị bản vùng miền</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                100%
              </div>
              <div className="text-xs text-amber-200/70 font-medium">Tư liệu có nguồn dẫn</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
                Gemini
              </div>
              <div className="text-xs text-amber-200/70 font-medium">Trợ lý AI phân tích</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Proverb Card */}
      {featuredItem && (
        <section className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-700 text-white">
                  Câu nổi bật hôm nay
                </span>
                <span className="text-xs text-amber-800 font-semibold">
                  Chủ đề: {featuredItem.chu_de}
                </span>
              </div>
              
              <blockquote className="folk-serif text-lg sm:text-xl font-bold text-amber-950 italic proverb-highlight leading-relaxed">
                "{featuredItem.ten_tu_lieu}"
              </blockquote>
              
              <p className="text-sm text-amber-900/90 leading-normal line-clamp-2">
                {featuredItem.noi_dung_mo_ta_ngan}
              </p>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => {
                  onSelectItem(featuredItem);
                  onNavigateToScreen('detail');
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <GitCompare className="w-4 h-4 text-amber-200" />
                <span>Xem {featuredItem.danh_sach_di_ban.length} dị bản</span>
              </button>
              <button
                onClick={() => onAskAiWithContext(featuredItem)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-200/70 text-amber-950 text-xs sm:text-sm font-medium rounded-xl border border-amber-300 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Hỏi AI về câu này</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search & Filters Section */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-sm space-y-4">
        
        {/* Main Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-700">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tra cứu theo từ khóa, câu ca dao, địa danh (Huế, Bình Định, Cần Thơ...), ý tứ nghĩa..."
            className="w-full pl-11 pr-10 py-3.5 bg-amber-50/50 border border-amber-300 rounded-xl text-amber-950 placeholder-amber-700/50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-600 hover:text-amber-900 cursor-pointer"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          
          {/* Topic Dropdown */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-900">
            <Filter className="w-4 h-4 text-amber-700" />
            <span className="font-medium">Chủ đề:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-amber-950 focus:ring-1 focus:ring-amber-600 focus:outline-none"
            >
              <option value="all">Tất cả chủ đề ({items.length})</option>
              {topics.filter((t) => t !== 'all').map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Media Type Dropdown */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-900">
            <span className="font-medium">Loại tư liệu:</span>
            <select
              value={selectedMediaType}
              onChange={(e) => setSelectedMediaType(e.target.value)}
              className="bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-amber-950 focus:ring-1 focus:ring-amber-600 focus:outline-none"
            >
              <option value="all">Mọi định dạng</option>
              <option value="văn bản">Văn bản</option>
              <option value="ghi âm">Ghi âm</option>
            </select>
          </div>

          {/* Region Dropdown */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-900">
            <MapPin className="w-4 h-4 text-amber-700" />
            <span className="font-medium">Vùng miền:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-amber-950 focus:ring-1 focus:ring-amber-600 focus:outline-none"
            >
              <option value="all">Toàn quốc (Bắc - Trung - Nam)</option>
              <option value="Bắc">Bắc Bộ (Đồng bằng sông Hồng, Kinh Bắc...)</option>
              <option value="Trung">Trung Bộ (Xứ Nghệ, Huế, Quảng Nam, Bình Định...)</option>
              <option value="Nam">Nam Bộ (Sông nước Cửu Long, Cần Thơ, Bến Tre...)</option>
            </select>
          </div>

          {/* Reset button if filtered */}
          {(searchQuery || selectedTopic !== 'all' || selectedMediaType !== 'all' || selectedRegion !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-700 hover:text-red-900 underline ml-auto cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          )}

        </div>

        {/* Results summary counter */}
        <div className="text-xs sm:text-sm text-amber-900/70 flex items-center justify-between border-t border-amber-100 pt-3">
          <span>
            Tìm thấy <strong>{filteredItems.length}</strong> câu ca dao / tục ngữ phù hợp
          </span>
          <span className="text-amber-800 font-medium">
            Mã lưu trữ chuẩn: A02-CD
          </span>
        </div>
      </section>

      {/* Grid of Ca Dao Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-amber-300 p-12 text-center space-y-3">
          <BookMarked className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-amber-950 folk-serif">
            Không tìm thấy tư liệu phù hợp
          </h3>
          <p className="text-sm text-amber-800/80 max-w-md mx-auto">
            Không có câu ca dao nào khớp với từ khóa "{searchQuery}". Bạn có thể thử tìm theo từ đồng nghĩa hoặc bấm "Đặt lại bộ lọc".
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-amber-800 text-amber-50 text-sm font-medium rounded-xl hover:bg-amber-900 transition-colors"
          >
            Hiện lại toàn bộ danh mục
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;
            const isSpeaking = isSpeakingId === item.id;

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-amber-400"
              >
                <div className="space-y-3.5">
                  
                  {/* Card Header: Badges & ID */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                        {item.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                        {item.chu_de}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
                      {item.loai_tu_lieu === 'văn bản' && (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <FileText className="w-3.5 h-3.5" /> Văn bản
                        </span>
                      )}
                      {item.loai_tu_lieu === 'ghi âm' && (
                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          <Mic className="w-3.5 h-3.5" /> Ghi âm
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Primary Proverb Text */}
                  <h2 
                    onClick={() => {
                      onSelectItem(item);
                      onNavigateToScreen('detail');
                    }}
                    className="text-base sm:text-lg font-bold folk-serif text-amber-950 proverb-highlight leading-relaxed cursor-pointer hover:text-amber-700 transition-colors"
                  >
                    {item.ten_tu_lieu}
                  </h2>

                  {/* Short description */}
                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {item.noi_dung_mo_ta_ngan}
                  </p>

                  {/* Regional Variant Preview Box */}
                  <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
                      <span className="flex items-center gap-1">
                        <GitCompare className="w-3.5 h-3.5 text-amber-700" />
                        Có {item.danh_sach_di_ban.length} dị bản vùng miền:
                      </span>
                      <span className="text-[11px] text-amber-700 font-normal">
                        {item.danh_sach_di_ban.map((d) => d.dia_diem.split(',')[0]).join(' • ')}
                      </span>
                    </div>

                    {item.danh_sach_di_ban[0] && (
                      <p className="text-xs text-amber-950/90 italic line-clamp-1 border-l-2 border-amber-400 pl-2">
                        "{item.danh_sach_di_ban[0].cau_di_ban}"
                      </p>
                    )}
                  </div>

                  {/* Field origin */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Nơi thu thập: <strong className="text-stone-700">{item.dia_diem_thu_thap}</strong></span>
                    <span className="text-stone-300">•</span>
                    <span>{item.thoi_diem_thu_thap}</span>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(item)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-700 text-white animate-pulse'
                          : 'text-amber-800 hover:bg-amber-100'
                      }`}
                      title="Nghe đọc câu ca dao"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-2 text-amber-800 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                      title="Sao chép nội dung"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onAskAiWithContext(item)}
                      className="p-2 text-amber-800 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                      title="Hỏi AI phân tích câu này"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onSelectItem(item);
                      onNavigateToScreen('detail');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Đối chiếu dị bản</span>
                    <GitCompare className="w-3.5 h-3.5" />
                  </button>
                </div>

              </article>
            );
          })}
        </div>
      )}

    </div>
  );
};
