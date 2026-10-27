import React from 'react';
import { ScreenType } from '../types/cadao';
import { 
  BookOpen, 
  GitCompare, 
  Sparkles, 
  Library, 
  Info, 
  Type, 
  Menu, 
  X,
  ScrollText
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  elderMode: boolean;
  setElderMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  setCurrentScreen,
  elderMode,
  setElderMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home' as ScreenType, label: 'Tra cứu Ca dao', icon: BookOpen },
    { id: 'detail' as ScreenType, label: 'Đối chiếu Dị bản', icon: GitCompare },
    { id: 'ai' as ScreenType, label: 'Trợ lý AI Hỏi đáp', icon: Sparkles },
    { id: 'references' as ScreenType, label: 'Nguồn tư liệu', icon: Library },
    { id: 'about' as ScreenType, label: 'Giới thiệu & Ghi nhận', icon: Info },
  ];

  const handleNavClick = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-red-900 text-amber-100 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 border border-amber-300/30">
              <ScrollText className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-950 folk-serif">
                  CaDaoPedia
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-800/80 font-medium hidden sm:block">
                Thư viện Ca dao Tục ngữ & Đối chiếu Dị bản Vùng miền
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-amber-800 text-amber-50 shadow-sm shadow-amber-900/20'
                      : 'text-amber-950/80 hover:bg-amber-100/80 hover:text-amber-900'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-amber-700'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Elder Mode & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Chế độ Chữ to cho người lớn tuổi */}
            <button
              onClick={() => setElderMode(!elderMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                elderMode
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-400/50'
                  : 'bg-amber-100/70 text-amber-900 border-amber-300 hover:bg-amber-200/80'
              }`}
              title="Phóng to kích thước chữ để người cao tuổi dễ đọc hơn"
              aria-label="Bật tắt chế độ chữ to cho người cao tuổi"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Chữ to:</span>
              <span>{elderMode ? 'BẬT' : 'TẮT'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-amber-900 hover:bg-amber-200/80 transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-amber-50 border-b border-amber-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <p className="px-3 py-1.5 text-xs font-semibold text-amber-800/70 uppercase tracking-wider">
            Danh mục chức năng
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-800 text-amber-50'
                    : 'text-amber-950 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-200' : 'text-amber-700'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-amber-200/70 mt-2">
            <button
              onClick={() => setElderMode(!elderMode)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-amber-900 font-medium"
            >
              <span className="flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-700" />
                Chế độ chữ to người lớn tuổi
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${elderMode ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>
                {elderMode ? 'Đang bật' : 'Đang tắt'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
