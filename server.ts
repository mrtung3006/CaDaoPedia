import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Helper to load cadao data
function getCaDaoData() {
  const jsonPath = path.resolve(process.cwd(), 'cadao_diban.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(raw);
  }
  const fallbackPath = path.resolve(process.cwd(), 'src/data/cadao_diban.json');
  if (fs.existsSync(fallbackPath)) {
    const raw = fs.readFileSync(fallbackPath, 'utf-8');
    return JSON.parse(raw);
  }
  return [];
}

// API endpoint to fetch list of ca dao
app.get('/api/cadao', (_req: Request, res: Response) => {
  try {
    const data = getCaDaoData();
    res.json({ success: true, count: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to fetch single ca dao by id
app.get('/api/cadao/:id', (req: Request, res: Response) => {
  try {
    const data = getCaDaoData();
    const item = data.find((d: any) => d.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy tư liệu' });
    }
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for Gemini AI Assistant
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { question, currentItemContext } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp câu hỏi hợp lệ.'
      });
    }

    const cadaoList = getCaDaoData();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: 'Chưa cấu hình GEMINI_API_KEY phía máy chủ trong Secrets.'
      });
    }

    // Initialize Gemini SDK with User-Agent
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Provide the dataset into the system instruction
    const systemPrompt = `Bạn là Trợ lý AI Chuyên gia Ca dao Tục ngữ & Dị bản của ứng dụng CaDaoPedia (Mã dự án A02).
Nhiệm vụ của bạn là giải đáp câu hỏi của người dùng về ca dao, tục ngữ, phân tích ý nghĩa và đối chiếu dị bản vùng miền.

RÀNG BUỘC CỰC KỲ QUAN TRỌNG (BẮT BUỘC TUÂN THỦ 100%):
1. Bạn CHỈ ĐƯỢC trả lời dựa trên kho dữ liệu "cadao_diban.json" được cung cấp bên dưới.
2. TUYỆT ĐỐI KHÔNG tự suy đoán, không bịa thông tin, không tạo ra câu ca dao hay dị bản mới nằm ngoài tập dữ liệu này.
3. Nếu câu hỏi của người dùng hỏi về một câu ca dao hoặc chủ đề KHÔNG CÓ trong dữ liệu, bạn BẮT BUỘC phải thông báo lịch sự rằng: "Hiện tại trong cơ sở dữ liệu của thư viện CaDaoPedia chưa có tư liệu về câu này/chủ đề này. Bạn có thể tra cứu các câu ca dao và dị bản hiện có trong danh mục."
4. BẮT BUỘC ĐÍNH KÈM THÔNG TIN TƯ LIỆU: Với mỗi câu trả lời có sử dụng thông tin từ dữ liệu, bạn PHẢI nêu rõ:
   - Tên bản ghi / câu ca dao chính: [Trường ten_tu_lieu] (Mã [id])
   - Nguồn tư liệu đã dùng: [Trường nguon_tu_lieu]
   - Người thu thập / địa điểm thu thập nếu phù hợp.
5. Khi người dùng hỏi phân tích hoặc tìm kiếm dị bản, hãy trích dẫn các dị bản và địa điểm/nghệ nhân cung cấp từ trường "danh_sach_di_ban" một cách chính xác.

DỮ LIỆU CADAPEDIA ĐÃ ĐƯỢC THẨM ĐỊNH (${cadaoList.length} bản ghi):
${JSON.stringify(cadaoList, null, 2)}
`;

    let userPromptContent = `Câu hỏi của người dùng: "${question}"`;
    if (currentItemContext) {
      userPromptContent += `\n(Ghi chú: Người dùng đang xem xét bản ghi: ${JSON.stringify(currentItemContext)})`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPromptContent,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2, // low temperature to ensure strict adherence to provided dataset
        },
      });

      const answer = response.text || 'Không nhận được câu trả lời từ hệ thống.';
      return res.json({
        success: true,
        answer,
      });
    } catch (genAiError: any) {
      console.warn('Gemini API temporary issue, synthesizing from cadao_diban.json:', genAiError.message);
      
      // Scholarly local synthesis based strictly on cadao_diban.json
      const q = question.toLowerCase();
      
      // Smart matching: exact substring or keyword overlap
      const matched = cadaoList.filter((item: any) => {
        // Direct containment
        if (
          q.includes(item.ten_tu_lieu.toLowerCase().split('/')[0].trim()) ||
          item.ten_tu_lieu.toLowerCase().includes(q) ||
          q.includes(item.chu_de.toLowerCase()) ||
          q.includes(item.id.toLowerCase())
        ) {
          return true;
        }

        // Check if any variant is mentioned in question
        const variantHit = item.danh_sach_di_ban.some((db: any) => {
          const firstLine = db.cau_di_ban.toLowerCase().split('/')[0].trim();
          return q.includes(firstLine) || db.cau_di_ban.toLowerCase().includes(q);
        });
        if (variantHit) return true;

        // Keyword tokens matching
        const significantWords = item.ten_tu_lieu
          .toLowerCase()
          .replace(/[\/,\.;]/g, ' ')
          .split(/\s+/)
          .filter((w: string) => w.length > 3 && !['như', 'trong', 'người', 'phải', 'thì', 'đến'].includes(w));

        const hitCount = significantWords.filter((w: string) => q.includes(w)).length;
        return hitCount >= 2;
      });

      if (matched.length === 0) {
        return res.json({
          success: true,
          answer: `Hiện tại trong cơ sở dữ liệu của thư viện CaDaoPedia chưa có tư liệu về câu ca dao hoặc chủ đề: "${question}".\n\nTheo nguyên tắc an toàn di sản (mã đề án A02), hệ thống tuyệt đối không tự suy đoán thông tin ngoài tư liệu lưu trữ. Bạn vui lòng tra cứu các chủ đề hiện có trong danh mục như: Tình cảm gia đình, Đạo lý làm người, Tình yêu quê hương, Thân phận phụ nữ, Thời tiết canh tác, Sức mạnh đoàn kết, Ẩm thực...`
        });
      }

      const top = matched[0];
      const variantsText = top.danh_sach_di_ban
        .map((d: any, idx: number) => `  * Dị bản ${idx + 1} (${d.dia_diem} - Cung cấp: ${d.nguoi_cung_cap}):\n    "${d.cau_di_ban}"`)
        .join('\n\n');

      const formattedAnswer = `Dưới đây là thông tin tra cứu chuẩn xác từ kho dữ liệu CaDaoPedia:

📌 TÊN BẢN GHI / CÂU CA DAO CHÍNH: "${top.ten_tu_lieu}" (Mã tư liệu: ${top.id})
- Chủ đề: ${top.chu_de}
- Địa điểm thu thập: ${top.dia_diem_thu_thap} (${top.thoi_diem_thu_thap})
- Người thu thập: ${top.nguoi_thu_thap}
- Phạm vi sử dụng: ${top.pham_vi_su_dung}

📖 GIẢI NGHĨA & BỐI CẢNH VĂN HÓA:
- ${top.noi_dung_mo_ta_ngan}
${top.y_nghia_van_hoa ? `- Ý nghĩa văn hóa: ${top.y_nghia_van_hoa}` : ''}
${top.ngu_canh_su_dung ? `- Ngữ cảnh diễn xướng: ${top.ngu_canh_su_dung}` : ''}

🎋 ĐỐI CHIẾU CÁC DỊ BẢN VÙNG MIỀN:
${variantsText}

📚 NGUỒN TƯ LIỆU ĐÃ DÙNG:
${top.nguon_tu_lieu}`;

      return res.json({
        success: true,
        answer: formattedAnswer,
      });
    }
  } catch (error: any) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi xử lý câu hỏi.',
    });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer();
