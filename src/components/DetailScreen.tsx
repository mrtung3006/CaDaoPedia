import React, { useState } from 'react';
import { CaDaoItem, ScreenType } from '../types/cadao';
import { 
  ArrowLeft, 
  GitCompare, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  User, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Mic, 
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface DetailScreenProps {
  item: CaDaoItem;
  allItems: CaDaoItem[];
  onSelectItem: (item: CaDaoItem) => void;
  onNavigateToScreen: (screen: ScreenType) => void;
  onAskAiWithContext: (item: CaDaoItem) => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({
  item,
  allItems,
  onSelectItem,
  onNavigateToScreen,
  onAskAiWithContext,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Index navigation
  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const handleCopy = () => {
    const variantsText = item.danh_sach_di_ban
      .map((db, i) => `+ Dị bản ${i + 1} (${db.dia_diem} - Cung cấp: ${db.nguoi_cung_cap}):\n  "${db.cau_di_ban}"`)
      .join('\n\n');

    const fullContent = `【TƯ LIỆU CA DAO TỤC NGỮ VÀ DỊ BẢN】\nMã: ${item.id}\nCâu chính: "${item.ten_tu_lieu}"\nChủ đề: ${item.chu_de}\nNơi sưu tầm: ${item.dia_diem_thu_thap} (${item.thoi_diem_thu_thap})\nNgười thu thập: ${item.nguoi_thu_thap}\n\nGIẢI NGHĨA:\n${item.noi_dung_mo_ta_ngan}\n\nCÁC DỊ BẢN ĐỐI CHIẾU:\n${variantsText}\n\nNGUỒN TƯ LIỆU:\n${item.nguon_tu_lieu}\nPhạm vi sử dụng: ${item.pham_vi_su_dung}`;

    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const fullSpeech = `${item.ten_tu_lieu}. Giải nghĩa: ${item.noi_dung_mo_ta_ngan}`;
    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.88;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Navigation & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToScreen('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-700" />
            <span>Quay lại Tra cứu</span>
          </button>

          <span className="text-amber-300">|</span>

          {/* Quick Item Picker */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-900">
            <span className="font-medium hidden sm:inline">Chuyển nhanh câu:</span>
            <select
              value={item.id}
              onChange={(e) => {
                const found = allItems.find((i) => i.id === e.target.value);
                if (found) onSelectItem(found);
              }}
              className="bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-medium text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-600 max-w-[200px] sm:max-w-xs truncate"
            >
              {allItems.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.id} - {it.ten_tu_lieu.slice(0, 36)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            disabled={!prevItem}
            onClick={() => prevItem && onSelectItem(prevItem)}
            className="p-1.5 rounded-lg border border-amber-200 text-amber-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 transition-colors"
            title="Câu trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-amber-900 px-1">
            {currentIndex + 1} / {allItems.length}
          </span>
          <button
            disabled={!nextItem}
            onClick={() => nextItem && onSelectItem(nextItem)}
            className="p-1.5 rounded-lg border border-amber-200 text-amber-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 transition-colors"
            title="Câu kế tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Proverb Showcase Card */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-850 to-stone-900 text-amber-50 rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-700/50 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-500/30 text-amber-200 border border-amber-400/30">
                MÃ TƯ LIỆU: {item.id}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-700/80 text-white border border-red-500/40">
                {item.chu_de}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="px-2.5 py-1 rounded-full bg-amber-800/60 border border-amber-600/40 text-amber-200 flex items-center gap-1.5">
                {item.loai_tu_lieu === 'văn bản' && <FileText className="w-3.5 h-3.5 text-emerald-300" />}
                {item.loai_tu_lieu === 'ghi âm' && <Mic className="w-3.5 h-3.5 text-amber-300" />}
                Định dạng: {item.loai_tu_lieu.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-800/60 border border-amber-600/40 text-amber-200">
                {item.vung_mien || item.dia_diem_thu_thap}
              </span>
            </div>
          </div>

          {/* Primary Couplet Verse */}
          <div className="py-2 text-center sm:text-left">
            <p className="text-xs font-bold tracking-widest text-amber-300 uppercase mb-2">
              CÂU CA DAO / TỤC NGỮ CHÍNH
            </p>
            <div className="folk-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-100 tracking-wide proverb-highlight leading-relaxed sm:leading-loose">
              {item.ten_tu_lieu.split(' / ').map((line, idx) => (
                <div key={idx} className="block py-1">
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Audio & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-700/50">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSpeak}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-amber-950 font-bold shadow-md animate-pulse'
                    : 'bg-amber-700/60 hover:bg-amber-600 text-amber-100 border border-amber-500/40'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Dừng giọng đọc</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span>Nghe ngâm thơ / phát âm</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-800/70 hover:bg-amber-700 text-amber-100 border border-amber-600/40 transition-colors cursor-pointer"
                title="Sao chép toàn bộ hồ sơ tư liệu"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Sao chép hồ sơ</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => onAskAiWithContext(item)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white shadow-sm border border-amber-400/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Hỏi Trợ lý AI về câu này</span>
            </button>
          </div>

        </div>
      </section>


      {/* SIDE-BY-SIDE REGIONAL VARIANT COMPARISON (ĐỐI CHIẾU DỊ BẢN) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-800 text-amber-100">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold folk-serif text-amber-950">
                Đối chiếu Dị bản Vùng miền ({item.danh_sach_di_ban.length} Dị bản)
              </h2>
              <p className="text-xs text-amber-800/80">
                Sự khác biệt về từ ngữ, địa danh và phong thổ sinh hoạt qua các miền đất nước
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            Khảo cứu đa vùng
          </span>
        </div>

        {/* Matrix Comparison Container: Primary + All Variants side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Primary Version Reference Column */}
          <div className="bg-amber-50/80 rounded-2xl border-2 border-amber-600/60 p-5 shadow-xs flex flex-col justify-between relative">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-700 text-white">
              Bản ghi chuẩn
            </div>
            
            <div className="space-y-3">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 pt-1">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>BẢN CHÍNH (PHỔ BIẾN TOÀN QUỐC)</span>
              </div>

              <blockquote className="folk-serif text-base font-bold text-amber-950 italic border-l-3 border-amber-700 pl-3 leading-relaxed">
                "{item.ten_tu_lieu}"
              </blockquote>

              <div className="text-xs space-y-1.5 text-stone-600 pt-2 border-t border-amber-200/60">
                <div>
                  <strong>Địa phương sưu tầm:</strong> {item.dia_diem_thu_thap}
                </div>
                <div>
                  <strong>Người thu thập:</strong> {item.nguoi_thu_thap}
                </div>
                <div>
                  <strong>Thời điểm:</strong> {item.thoi_diem_thu_thap}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-amber-800 italic">
              * Đây là dạng thức được ghi nhận trong các sách giáo khoa và tổng tập ca dao quốc gia.
            </div>
          </div>

          {/* Regional Variants Columns */}
          {item.danh_sach_di_ban.map((db, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    DỊ BẢN {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {db.dia_diem}
                  </span>
                </div>

                {/* Variant verse */}
                <blockquote className="folk-serif text-base font-semibold text-amber-950 italic border-l-3 border-red-700/80 pl-3 leading-relaxed bg-amber-50/40 py-2 rounded-r">
                  "{db.cau_di_ban}"
                </blockquote>

                {/* Informant / Artisan details */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <User className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-500">Nghệ nhân / Người cung cấp:</span>
                      <p className="font-semibold text-amber-950">{db.nguoi_cung_cap}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-500">Khu vực văn hóa:</span>
                      <p className="text-stone-800">{db.dia_diem}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Cultural Insight pill */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-amber-900/80 bg-amber-50/60 p-2 rounded-lg">
                <strong>Nét biến đổi:</strong> Thể hiện phương ngữ, sản vật và tâm tình đặc trưng của cư dân địa phương.
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* Cultural Analysis & Meaning Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cultural Meaning */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-base folk-serif">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h3>Ý nghĩa văn hóa & Triết lý nhân sinh</h3>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            {item.y_nghia_van_hoa || item.noi_dung_mo_ta_ngan}
          </p>
        </div>

        {/* Use Context */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-base folk-serif">
            <Info className="w-5 h-5 text-amber-700" />
            <h3>Ngữ cảnh sử dụng & Diễn xướng</h3>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            {item.ngu_canh_su_dung || 'Thường được lưu truyền trong đời sống lao động, lời ru của bà, của mẹ, hoặc trong các buổi sinh hoạt văn nghệ dân gian tại đình làng, bến sông.'}
          </p>
        </div>

      </section>

      {/* Scientific Field Collection Metadata & Source Citation */}
      <section className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-base folk-serif border-b border-amber-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3>Hồ sơ Nghiên cứu & Bản quyền Tư liệu (Chuẩn A02)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
            <span className="text-stone-500 block text-xs">Mã định danh tư liệu:</span>
            <span className="font-mono font-bold text-amber-950 text-base">{item.id}</span>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
            <span className="text-stone-500 block text-xs">Địa điểm thu thập:</span>
            <span className="font-semibold text-stone-800">{item.dia_diem_thu_thap}</span>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
            <span className="text-stone-500 block text-xs">Thời điểm thu thập:</span>
            <span className="font-semibold text-stone-800">{item.thoi_diem_thu_thap}</span>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
            <span className="text-stone-500 block text-xs">Người thu thập tư liệu:</span>
            <span className="font-bold text-amber-950">{item.nguoi_thu_thap}</span>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 sm:col-span-2">
            <span className="text-stone-500 block text-xs">Phạm vi sử dụng cho phép:</span>
            <span className="font-medium text-emerald-800">{item.pham_vi_su_dung}</span>
          </div>
        </div>

        {/* Source link citation */}
        <div className="p-4 bg-amber-100/60 rounded-xl border border-amber-300/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              NGUỒN TƯ LIỆU THAM KHẢO CHÍNH THỨC:
            </span>
            <span className="text-xs text-amber-700 font-medium">Đã kiểm chứng</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 font-medium">
            {item.nguon_tu_lieu}
          </p>
          {item.nguon_tu_lieu.includes('http') && (
            <div className="pt-1">
              <a
                href={(() => {
                  const match = item.nguon_tu_lieu.match(/https?:\/\/[^\s,]+/);
                  return match ? match[0] : '#';
                })()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                <span>Mở đường dẫn tư liệu gốc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
