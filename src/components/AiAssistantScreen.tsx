import React, { useState, useRef, useEffect } from 'react';
import { CaDaoItem, ScreenType } from '../types/cadao';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  ShieldAlert, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle,
  HelpCircle,
  Loader2,
  GitCompare,
  Info
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  referencedItems?: CaDaoItem[];
}

interface AiAssistantScreenProps {
  allItems: CaDaoItem[];
  selectedContextItem: CaDaoItem | null;
  onClearContextItem: () => void;
  onSelectItem: (item: CaDaoItem) => void;
  onNavigateToScreen: (screen: ScreenType) => void;
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({
  allItems,
  selectedContextItem,
  onClearContextItem,
  onSelectItem,
  onNavigateToScreen,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Xin chào! Tôi là Trợ lý AI Chuyên gia Ca dao Tục ngữ & Dị bản CaDaoPedia.\n\nTôi được thiết lập để hỗ trợ bạn tra cứu, giải nghĩa và đối chiếu các dị bản ca dao vùng miền dựa trên ${allItems.length} hồ sơ tư liệu đã qua thẩm định.\n\nMỗi câu trả lời của tôi đều đính kèm tên câu ca dao, mã tư liệu và nguồn trích dẫn chính thức. Bạn có thể hỏi tôi bất kỳ câu nào trong kho tư liệu!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQueries = [
    'Đối chiếu dị bản câu "Công cha như núi Thái Sơn" ở miền Trung và miền Nam',
    'Tìm các câu ca dao về tình mẫu tử, lòng hiếu thảo',
    'Giải thích ý nghĩa câu "Gió đưa cây cải về trời" và giai thoại Thứ phi Phi Yến',
    'Những câu tục ngữ nào dự báo thời tiết canh tác nông nghiệp?',
    'Phân tích sự khác biệt giữa hình tượng "tấm lụa đào" và "trái bần trôi"',
    'Tìm câu ca dao ca ngợi vẻ đẹp trù phú của vùng đất Nam Bộ'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // If user selected a specific context item to ask about
  useEffect(() => {
    if (selectedContextItem) {
      setInputQuery(`Hãy phân tích ý nghĩa và đối chiếu các dị bản vùng miền của câu: "${selectedContextItem.ten_tu_lieu}"`);
    }
  }, [selectedContextItem]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          currentItemContext: selectedContextItem || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.answer) {
        // Detect matched items from allItems
        const matchedItems = allItems.filter(
          (it) =>
            data.answer.toLowerCase().includes(it.id.toLowerCase()) ||
            data.answer.toLowerCase().includes(it.ten_tu_lieu.toLowerCase().slice(0, 20))
        );

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          referencedItems: matchedItems.length > 0 ? matchedItems : undefined,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Fallback search in local verified data if server has issue
        const fallbackAnswer = generateFallbackAnswer(textToSend, allItems);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: fallbackAnswer.text,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          referencedItems: fallbackAnswer.items,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      const fallbackAnswer = generateFallbackAnswer(textToSend, allItems);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackAnswer.text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        referencedItems: fallbackAnswer.items,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local authoritative matcher ensuring strict safety constraint
  function generateFallbackAnswer(query: string, data: CaDaoItem[]) {
    const q = query.toLowerCase();
    const matched = data.filter((item) => {
      // Direct containment
      if (
        q.includes(item.ten_tu_lieu.toLowerCase().split('/')[0].trim()) ||
        item.ten_tu_lieu.toLowerCase().includes(q) ||
        q.includes(item.chu_de.toLowerCase()) ||
        q.includes(item.id.toLowerCase())
      ) {
        return true;
      }

      // Variant match
      const variantHit = item.danh_sach_di_ban.some((db) => {
        const firstLine = db.cau_di_ban.toLowerCase().split('/')[0].trim();
        return q.includes(firstLine) || db.cau_di_ban.toLowerCase().includes(q);
      });
      if (variantHit) return true;

      // Token overlap
      const significantWords = item.ten_tu_lieu
        .toLowerCase()
        .replace(/[\/,\.;]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !['như', 'trong', 'người', 'phải', 'thì', 'đến'].includes(w));

      const hitCount = significantWords.filter((w) => q.includes(w)).length;
      return hitCount >= 2;
    });

    if (matched.length === 0) {
      return {
        text: `Hiện tại trong cơ sở dữ liệu của thư viện CaDaoPedia chưa có tư liệu về câu ca dao hoặc chủ đề này.\n\nTheo nguyên tắc an toàn di sản, hệ thống tuyệt đối không tự suy đoán thông tin ngoài tư liệu lưu trữ. Bạn vui lòng tra cứu các chủ đề hiện có như: Tình cảm gia đình, Đạo lý làm người, Tình yêu quê hương, Thân phận phụ nữ, Thời tiết canh tác, Ẩm thực...`,
        items: [],
      };
    }

    const first = matched[0];
    const variantsStr = first.danh_sach_di_ban
      .map((d, i) => `  * Dị bản ${i + 1} (${d.dia_diem} - Cung cấp: ${d.nguoi_cung_cap}): "${d.cau_di_ban}"`)
      .join('\n');

    const reply = `Dưới đây là thông tin tra cứu chuẩn xác từ kho dữ liệu CaDaoPedia:

📌 TÊN BẢN GHI / CÂU CHÍNH: "${first.ten_tu_lieu}" (Mã: ${first.id})
- Chủ đề: ${first.chu_de}
- Địa điểm thu thập: ${first.dia_diem_thu_thap} (${first.thoi_diem_thu_thap})
- Người thu thập: ${first.nguoi_thu_thap}

📖 GIẢI NGHĨA & BỐI CẢNH:
${first.noi_dung_mo_ta_ngan}
${first.y_nghia_van_hoa ? `\nÝ nghĩa văn hóa: ${first.y_nghia_van_hoa}` : ''}

🎋 ĐỐI CHIẾU CÁC DỊ BẢN VÙNG MIỀN:
${variantsStr}

📚 NGUỒN TƯ LIỆU ĐÃ DÙNG:
${first.nguon_tu_lieu}`;

    return {
      text: reply,
      items: matched,
    };
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Cuộc trò chuyện đã được làm mới. Bạn muốn tra cứu hoặc đối chiếu câu ca dao nào tiếp theo?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (selectedContextItem) {
      onClearContextItem();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Heritage Safety Principle Notice */}
      <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-950 space-y-1">
          <p className="font-bold">
            RÀNG BUỘC AN TOÀN VÀ BẢO TỒN DI SẢN (MÔ HÌNH GEMINI 3.8 FLASH):
          </p>
          <p className="text-amber-900/90 leading-relaxed">
            Trợ lý AI chỉ giải đáp chính xác dựa trên kho dữ liệu thẩm định <code className="bg-amber-200/80 px-1 py-0.5 rounded font-mono text-xs">cadao_diban.json</code>. 
            Mỗi câu trả lời bắt buộc đính kèm tên bản ghi và nguồn tư liệu đã dùng. Nếu không có trong kho tư liệu, hệ thống thông báo chưa có dữ liệu và không tự suy đoán bịa đặt.
          </p>
        </div>
      </div>

      {/* Context Badge if an item was preselected */}
      {selectedContextItem && (
        <div className="bg-white border border-amber-300/80 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-bold text-amber-900">Đang đối chiếu câu:</span>
            <span className="italic font-semibold text-amber-950 folk-serif">
              "{selectedContextItem.ten_tu_lieu}"
            </span>
            <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              {selectedContextItem.id}
            </span>
          </div>
          <button
            onClick={onClearContextItem}
            className="text-xs text-red-700 hover:text-red-900 font-medium underline cursor-pointer"
          >
            Bỏ chọn ngữ cảnh
          </button>
        </div>
      )}

      {/* Chat Area Container */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-amber-100 bg-amber-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-950 folk-serif">
                  Trợ lý Chuyên gia Ca dao Dị bản
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Đã kết nối Gemini
                </span>
              </div>
              <p className="text-xs text-amber-800/80">
                Tra cứu ngữ nghĩa, bối cảnh vùng miền và đối chiếu các bản dị bản
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 p-2 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>

        {/* Message History List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-amber-50/20">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-800 text-amber-200 border border-amber-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-amber-800 text-amber-50 rounded-tr-none'
                      : 'bg-white text-stone-800 border border-amber-200/90 rounded-tl-none space-y-3'
                  }`}
                >
                  {/* Content text */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Referenced Items Interactive Badges */}
                  {msg.referencedItems && msg.referencedItems.length > 0 && (
                    <div className="pt-3 border-t border-amber-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                        <span>Hồ sơ tư liệu được đối chiếu:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.referencedItems.map((ref) => (
                          <button
                            key={ref.id}
                            onClick={() => {
                              onSelectItem(ref);
                              onNavigateToScreen('detail');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-lg border border-amber-300 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <span className="font-mono font-bold text-amber-700">[{ref.id}]</span>
                            <span className="truncate max-w-[200px]">{ref.ten_tu_lieu}</span>
                            <ExternalLink className="w-3 h-3 text-amber-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-right pt-1 ${
                      isUser ? 'text-amber-200/70' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-xl">
              <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white rounded-2xl p-4 border border-amber-200 text-stone-600 text-xs sm:text-sm flex items-center gap-2 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                <span>Mô hình Gemini đang tra cứu tệp cadao_diban.json và đối chiếu tư liệu...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Tray */}
        <div className="px-4 py-2.5 bg-amber-50/70 border-t border-amber-200/60 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap text-xs">
            <span className="text-amber-900 font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" /> Gợi ý câu hỏi:
            </span>
            {sampleQueries.map((query, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(query)}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 rounded-full border border-amber-300 text-xs font-normal transition-colors cursor-pointer shrink-0"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-amber-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Hỏi về ý nghĩa câu ca dao, tìm dị bản vùng miền hoặc tra cứu theo ý tứ..."
            className="flex-1 py-3 px-4 bg-amber-50/50 border border-amber-300 rounded-xl text-amber-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white"
          />
          <button
            disabled={!inputQuery.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="px-5 py-3 bg-amber-800 hover:bg-amber-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi câu hỏi</span>
          </button>
        </div>

      </div>

    </div>
  );
};
