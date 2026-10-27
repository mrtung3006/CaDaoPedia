/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { DetailScreen } from './components/DetailScreen';
import { AiAssistantScreen } from './components/AiAssistantScreen';
import { ReferencesScreen } from './components/ReferencesScreen';
import { AboutScreen } from './components/AboutScreen';
import { CaDaoItem, ScreenType } from './types/cadao';
import cadaoFallbackData from './data/cadao_diban.json';
import { 
  Heart, 
  Sparkles, 
  ScrollText, 
  ArrowUp,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [elderMode, setElderMode] = useState<boolean>(false);
  const [items, setItems] = useState<CaDaoItem[]>(cadaoFallbackData as CaDaoItem[]);
  const [selectedItem, setSelectedItem] = useState<CaDaoItem>(
    (cadaoFallbackData[0] as CaDaoItem) || null
  );
  const [contextItemForAi, setContextItemForAi] = useState<CaDaoItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync elder mode with html element class
  useEffect(() => {
    if (elderMode) {
      document.documentElement.classList.add('elder-text-mode');
    } else {
      document.documentElement.classList.remove('elder-text-mode');
    }
  }, [elderMode]);

  // Track scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch from server /api/cadao on mount if available
  useEffect(() => {
    fetch('/api/cadao')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data);
          if (!selectedItem) {
            setSelectedItem(data.data[0]);
          }
        }
      })
      .catch((_err) => {
        // use fallback data already initialized
      });
  }, []);

  const handleSelectItem = (item: CaDaoItem) => {
    setSelectedItem(item);
  };

  const handleAskAiWithContext = (item: CaDaoItem) => {
    setSelectedItem(item);
    setContextItemForAi(item);
    setCurrentScreen('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Sticky Header */}
      <Navbar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        elderMode={elderMode}
        setElderMode={setElderMode}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Screen 1: Home & Search */}
        {currentScreen === 'home' && (
          <HomeScreen
            items={items}
            onSelectItem={handleSelectItem}
            onNavigateToScreen={setCurrentScreen}
            onAskAiWithContext={handleAskAiWithContext}
          />
        )}

        {/* Screen 2: Detail & Regional Variant Comparison */}
        {currentScreen === 'detail' && selectedItem && (
          <DetailScreen
            item={selectedItem}
            allItems={items}
            onSelectItem={handleSelectItem}
            onNavigateToScreen={setCurrentScreen}
            onAskAiWithContext={handleAskAiWithContext}
          />
        )}

        {/* Screen 3: AI Assistant */}
        {currentScreen === 'ai' && (
          <AiAssistantScreen
            allItems={items}
            selectedContextItem={contextItemForAi}
            onClearContextItem={() => setContextItemForAi(null)}
            onSelectItem={handleSelectItem}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {/* Screen 4: References */}
        {currentScreen === 'references' && <ReferencesScreen />}

        {/* Screen 5: About & Acknowledgements */}
        {currentScreen === 'about' && <AboutScreen />}

      </main>

      {/* Back to top floating button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-amber-800 hover:bg-amber-900 text-amber-100 shadow-lg transition-all duration-200 cursor-pointer border border-amber-600/50"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Global Footer */}
      <footer className="mt-auto bg-amber-950 text-amber-200/80 border-t border-amber-800/60 pt-10 pb-8 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Project identity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-base text-amber-100 folk-serif">
                  CaDaoPedia (Mã A02)
                </span>
              </div>
              <p className="text-amber-300/80 text-xs leading-relaxed">
                Thư viện số hóa ca dao tục ngữ và đối chiếu dị bản vùng miền văn hóa dân gian Việt Nam. 
                Dự án phục vụ mục đích học tập, nghiên cứu và giáo dục phi lợi nhuận.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
                Danh mục tính năng
              </span>
              <ul className="space-y-1.5 text-xs text-amber-200/70">
                <li>
                  <button onClick={() => { setCurrentScreen('home'); scrollToTop(); }} className="hover:text-amber-100 cursor-pointer">
                    • Trang chủ & Tra cứu
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentScreen('detail'); scrollToTop(); }} className="hover:text-amber-100 cursor-pointer">
                    • Hồ sơ chi tiết & Đối chiếu dị bản
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentScreen('ai'); scrollToTop(); }} className="hover:text-amber-100 cursor-pointer">
                    • Trợ lý AI Hỏi đáp & Phân tích (Gemini)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentScreen('references'); scrollToTop(); }} className="hover:text-amber-100 cursor-pointer">
                    • Danh mục Nguồn tư liệu tham khảo
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentScreen('about'); scrollToTop(); }} className="hover:text-amber-100 cursor-pointer">
                    • Giới thiệu & Ghi nhận thực tập sinh
                  </button>
                </li>
              </ul>
            </div>

            {/* Student & Internship Note */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-300">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Nghiệm thu Thực tập sinh
                </span>
              </div>
              <p className="text-amber-200/90 text-xs leading-relaxed bg-amber-900/40 p-3 rounded-xl border border-amber-800">
                "Sản phẩm thực tập của Nguyễn Văn Tùng, MSV: PH62340, Nhóm: A02, Chương trình Thực tập sinh FPT Polytechnic & IMTA TECH, dự án xã hội phi lợi nhuận."
              </p>
            </div>

          </div>

          <div className="border-t border-amber-900/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-400/60">
            <span>
              © 2026 CaDaoPedia. Bản quyền thuộc về Di sản Văn hóa phi vật thể Việt Nam.
            </span>
            <div className="flex items-center gap-1 text-amber-300/80">
              <span>Được xây dựng với tình yêu văn hóa dân gian Việt Nam</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
