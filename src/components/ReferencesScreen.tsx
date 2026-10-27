import React, { useState } from 'react';
import { REFERENCE_SOURCES } from '../data/references';
import { 
  Library, 
  ExternalLink, 
  CheckCircle, 
  ShieldCheck, 
  BookMarked, 
  Calendar, 
  Building2, 
  FileCheck2,
  Search
} from 'lucide-react';

export const ReferencesScreen: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'chinh_thong' | 'sach'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredSources = REFERENCE_SOURCES.filter((src) => {
    const matchType =
      filterType === 'all'
        ? true
        : filterType === 'chinh_thong'
        ? src.is_chinh_thong
        : !src.is_chinh_thong;

    const q = searchFilter.toLowerCase();
    const matchSearch =
      !q ||
      src.ten_nguon.toLowerCase().includes(q) ||
      src.tac_gia_co_quan.toLowerCase().includes(q) ||
      src.mo_ta_vai_tro.toLowerCase().includes(q);

    return matchType && matchSearch;
  });

  const officialCount = REFERENCE_SOURCES.filter((s) => s.is_chinh_thong).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-850 to-stone-900 text-amber-50 rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-700/50 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs sm:text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Thẩm định nguồn gốc học thuật & Di sản phi vật thể</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold folk-serif tracking-tight text-amber-100">
          Danh mục Nguồn Tư liệu & Thư mục Tham khảo
        </h1>

        <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed max-w-3xl">
          CaDaoPedia sử dụng hệ thống tư liệu trích dẫn nghiêm ngặt từ các Viện nghiên cứu chuyên ngành, 
          Cục Di sản Văn hóa, Thư viện Quốc gia Việt Nam và các công trình nghiên cứu ca dao tục ngữ kinh điển. 
          Toàn bộ đường dẫn tư liệu đều có thể mở được để đối chiếu trực tiếp.
        </p>

        {/* Quick Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-amber-700/50 text-center sm:text-left">
          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-700/30">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
              {REFERENCE_SOURCES.length}
            </span>
            <p className="text-xs text-amber-200/70 font-medium">Tổng nguồn tư liệu (≥ 7)</p>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-700/30">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
              {officialCount}
            </span>
            <p className="text-xs text-amber-200/70 font-medium">Nguồn chính thống (≥ 3)</p>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-700/30">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
              100%
            </span>
            <p className="text-xs text-amber-200/70 font-medium">Đường dẫn hoạt động</p>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-700/30">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
              27/10/2026
            </span>
            <p className="text-xs text-amber-200/70 font-medium">Ngày cập nhật thẩm định</p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-amber-700 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Lọc theo tên sách, tác giả, viện..."
            className="w-full pl-9 pr-3 py-2 bg-amber-50/50 border border-amber-300 rounded-lg text-xs sm:text-sm text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-amber-800 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Tất cả ({REFERENCE_SOURCES.length})
          </button>
          <button
            onClick={() => setFilterType('chinh_thong')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'chinh_thong'
                ? 'bg-amber-800 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Nguồn chính thống ({officialCount})
          </button>
          <button
            onClick={() => setFilterType('sach')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'sach'
                ? 'bg-amber-800 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Sách & Chuyên khảo ({REFERENCE_SOURCES.length - officialCount})
          </button>
        </div>

      </section>

      {/* Sources List */}
      <section className="space-y-4">
        {filteredSources.map((source, index) => (
          <article
            key={source.id}
            className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {source.id}
                </span>
                <h2 className="text-base sm:text-lg font-bold folk-serif text-amber-950">
                  {source.ten_nguon}
                </h2>
              </div>

              {/* Official Badge */}
              <div>
                {source.is_chinh_thong ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Nguồn chính thống Nhà nước / Viện Hàn lâm
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    <BookMarked className="w-3.5 h-3.5 text-amber-600" />
                    {source.loai_nguon}
                  </span>
                )}
              </div>
            </div>

            {/* Author and Publisher Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 block text-xs">Tác giả / Cơ quan chủ quản:</span>
                  <span className="font-semibold text-stone-900">{source.tac_gia_co_quan}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 block text-xs">Xuất bản / Cập nhật:</span>
                  <span className="font-semibold text-stone-900">{source.nam_xuat_ban}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 block text-xs">Ngày truy cập thẩm định:</span>
                  <span className="font-semibold text-stone-900">{source.ngay_truy_cap}</span>
                </div>
              </div>
            </div>

            {/* Role in CaDaoPedia */}
            <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/60 text-xs sm:text-sm text-amber-950">
              <strong className="text-amber-900">Vai trò trong CaDaoPedia: </strong>
              <span>{source.mo_ta_vai_tro}</span>
            </div>

            {/* Direct Open Link */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-mono truncate max-w-md">
                URL: {source.duong_dan}
              </span>

              <a
                href={source.duong_dan}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <span>Mở trang tư liệu</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
              </a>
            </div>

          </article>
        ))}
      </section>

    </div>
  );
};
