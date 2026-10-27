import React from 'react';
import { 
  Award, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  AlertCircle, 
  Compass, 
  Sparkles, 
  ScrollText, 
  MapPin, 
  BookOpenCheck
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const artisans = [
    { name: 'Nghệ nhân dân gian Lê Văn Hậu', location: 'Xã An Nhơn, Bình Định', field: 'Dị bản Nam Trung Bộ (Công cha như núi ngút trời)' },
    { name: 'Nghệ nhân Ví Giặm Nguyễn Thị Loan', location: 'Hưng Nguyên, Nghệ An', field: 'Dân ca Ví Giặm Xứ Nghệ (Thân em như hạt mưa sa)' },
    { name: 'Nghệ nhân Đờn ca tài tử Huỳnh Văn Mười', location: 'Mỏ Cày Bắc, Bến Tre', field: 'Dị bản Nam Bộ (Thân em như trái bần trôi)' },
    { name: 'Bà Hoàng Thị Mỹ', location: 'Làng cổ Kim Long, TP. Huế', field: 'Dị bản Thừa Thiên Huế (Công cha như núi Côn Lôn)' },
    { name: 'Cụ bà Trần Thị Vọng', location: 'Huyện Duy Tiên, Hà Nam', field: 'Dị bản Bắc Bộ (Thân em như giếng giữa đàng)' },
    { name: 'Nhà nghiên cứu Trần Đại Vinh', location: 'TP. Huế', field: 'Khảo sát dị bản ca dao Thừa Thiên Huế' },
    { name: 'Cụ Lê Thị Nguyệt', location: 'Điện Bàn, Quảng Nam', field: 'Dân ca Đất Quảng (Nhiễu điều phủ lấy giá gương)' },
    { name: 'Nghệ nhân Đỗ Văn Bảy', location: 'Huyện Cần Đước, Long An', field: 'Dị bản Tây Nam Bộ (Gió đưa cây cải về trời)' },
    { name: 'Nghệ nhân Quan họ Nguyễn Thị Kỷ', location: 'Việt Yên, Bắc Giang', field: 'Dân ca Quan họ bờ bắc sông Cầu' },
    { name: 'Nhà nghiên cứu Nguyễn Hữu Hiệp', location: 'TP. Châu Đốc, An Giang', field: 'Văn học dân gian vùng Thất Sơn sông nước' },
    { name: 'Nghệ sĩ Ca trù Bạch Vân', location: 'CLB Ca trù Hà Nội', field: 'Diễn xướng ca trù Thăng Long' },
    { name: 'Cụ đồ Vũ Đức Mậu', location: 'Vũ Thư, Thái Bình', field: 'Tục ngữ kinh nghiệm nông nghiệp châu thổ sông Hồng' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Official Required Student Statement Banner */}
      <section className="bg-gradient-to-r from-red-800 via-amber-800 to-amber-900 text-amber-50 rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-500/40 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs sm:text-sm font-semibold">
          <GraduationCap className="w-4 h-4 text-amber-200" />
          <span>Thông tin Thực tập sinh & Nghiệm thu Đề án</span>
        </div>

        <div className="p-4 sm:p-5 bg-black/25 rounded-2xl border border-amber-400/30">
          <p className="text-base sm:text-xl font-bold folk-serif leading-relaxed text-amber-100">
            "Sản phẩm thực tập của Nguyễn Văn Tùng, MSV: PH62340, Nhóm: A02, Chương trình Thực tập sinh FPT Polytechnic & IMTA TECH, dự án xã hội phi lợi nhuận."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-100">Họ và tên:</span>
            <span>Nguyễn Văn Tùng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-100">Mã sinh viên:</span>
            <span className="font-mono font-bold text-amber-300">PH62340</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-100">Mã nhóm đề án:</span>
            <span className="font-bold text-amber-300">Nhóm A02</span>
          </div>
        </div>
      </section>

      {/* Heritage Scope (Phạm vi di sản) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
          <div className="p-2 rounded-xl bg-amber-800 text-amber-100">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold folk-serif text-amber-950">
              Phạm vi Di sản Văn hóa & Mục tiêu Nghiên cứu
            </h2>
            <p className="text-xs text-amber-800/80">
              Bảo tồn và số hóa di sản truyền khẩu phi vật thể của dân tộc Việt Nam
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-stone-750">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
              <ScrollText className="w-4 h-4 text-amber-700" />
              <span>Đối chiếu Dị bản Liên vùng</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Tập trung khảo sát tính biến thể sinh động của ca dao, tục ngữ qua các nẻo đường di cư lịch sử từ cái nôi châu thổ sông Hồng (Bắc Bộ) qua dải đất hẹp miền Trung (xứ Nghệ, Huế, Quảng Nam, Bình Định) tới vùng đồng bằng phù sa màu mỡ Nam Bộ.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
              <BookOpenCheck className="w-4 h-4 text-amber-700" />
              <span>Chuẩn hóa Dữ liệu Học thuật</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Mỗi câu ca dao đều được cấu trúc hóa theo chuẩn hồ sơ khoa học: mã định danh, thể loại tư liệu, bối cảnh diễn xướng, ý nghĩa triết lý nhân sinh, thời điểm thu thập và dẫn chứng nguồn xuất bản rõ ràng.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Ứng dụng Trí tuệ Nhân tạo An toàn</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Ứng dụng mô hình Gemini hỗ trợ học sinh, sinh viên và giáo viên tra cứu ngữ nghĩa và tìm kiếm theo ý tứ với nguyên tắc đạo đức bảo tồn nghiêm ngặt: không bịa đặt, không suy diễn ngoài kho dữ liệu đã thẩm định.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations / What hasn't been done yet (Những gì chưa làm được) */}
      <section className="bg-amber-50/50 rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-amber-200/80 pb-3">
          <div className="p-2 rounded-xl bg-red-700 text-white">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold folk-serif text-amber-950">
              Những điều còn hạn chế & Định hướng tương lai
            </h2>
            <p className="text-xs text-amber-800/80">
              Nhận diện thẳng thắn các giới hạn của giai đoạn thử nghiệm đầu tiên
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-700">
          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-amber-200">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div>
              <strong className="text-stone-900 block font-semibold mb-0.5">
                Quy mô số lượng câu và địa bàn khảo sát:
              </strong>
              <span>
                Hiện tại hệ thống mới số hóa và đối chiếu sâu được 16 bản ghi tiêu biểu có dị bản liên vùng điển hình. Chưa thể số hóa toàn bộ kho tàng hàng vạn câu ca dao, tục ngữ đồ sộ của người Việt và ca dao của 53 dân tộc anh em khác (Tày, Nùng, Mường, Ê-đê, Chăm, Khmer...).
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-amber-200">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div>
              <strong className="text-stone-900 block font-semibold mb-0.5">
                Chất lượng âm thanh giọng đọc thực địa:
              </strong>
              <span>
                Hiện tính năng ngâm thơ/phát âm đang sử dụng giọng đọc tổng hợp Web Speech API tiếng Việt. Dự án chưa có điều kiện tài chính để tới từng địa phương thu âm trực tiếp giọng ngâm điệu ví của các nghệ nhân cao tuổi bằng thiết bị thu âm chuyên dụng tiêu chuẩn phát thanh.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-amber-200">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div>
              <strong className="text-stone-900 block font-semibold mb-0.5">
                Bản đồ tương tác không gian văn hóa (GIS):
              </strong>
              <span>
                Chưa tích hợp bản đồ số GIS tương tác để người dùng xem trực quan đường đi của một câu ca dao từ Bắc vào Nam theo dòng sông hoặc ranh giới hành chính các triều đại lịch sử.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgements to Informants & Artisans (Mục ghi nhận người cung cấp tư liệu) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
          <div className="p-2 rounded-xl bg-amber-800 text-amber-100">
            <HeartHandshake className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold folk-serif text-amber-950">
              Ghi nhận & Tri ân Người cung cấp tư liệu (Cộng đồng & Nghệ nhân)
            </h2>
            <p className="text-xs text-amber-800/80">
              Lòng biết ơn chân thành tới các bô lão, nghệ nhân dân gian và các nhà nghiên cứu địa phương
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Đề án CaDaoPedia xin trân trọng gửi lời cảm ơn sâu sắc tới các nghệ nhân dân gian, già làng, trưởng thôn, 
          các bậc cao niên tại các vùng miền trên khắp dải đất hình chữ S đã tận tâm lưu giữ, truyền khẩu và cung cấp 
          những dị bản vô giá cho công tác nghiên cứu học tập cộng đồng:
        </p>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artisans.map((artisan, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1.5"
            >
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="font-bold text-xs sm:text-sm text-amber-950">
                  {artisan.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{artisan.location}</span>
              </div>
              <p className="text-[11px] text-stone-500 italic pt-1 border-t border-amber-200/40">
                Đóng góp: {artisan.field}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-300 text-xs sm:text-sm text-amber-950 space-y-1">
          <p className="font-bold">
            Tri ân các Tổ chức & Viện nghiên cứu:
          </p>
          <p className="text-stone-700">
            Xin chân thành cảm ơn Viện Hàn lâm Khoa học Xã hội Việt Nam, Viện Nghiên cứu Hán Nôm, 
            Viện Văn học, Cục Di sản Văn hóa - Bộ Văn hóa Thể thao và Du lịch, Thư viện Quốc gia Việt Nam 
            và các Nhà xuất bản đã công bố những tư liệu quý báu giúp thế hệ trẻ tiếp cận và kế thừa tinh hoa văn hóa dân tộc.
          </p>
        </div>
      </section>

    </div>
  );
};
