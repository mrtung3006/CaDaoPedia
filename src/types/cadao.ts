export interface DiBanItem {
  cau_di_ban: string;
  dia_diem: string;
  nguoi_cung_cap: string;
  ghi_chu?: string;
}

export interface CaDaoItem {
  id: string;
  ten_tu_lieu: string;
  loai_tu_lieu: 'văn bản' | 'ghi âm';
  chu_de: string;
  noi_dung_mo_ta_ngan: string;
  ngu_canh_su_dung?: string;
  y_nghia_van_hoa?: string;
  vung_mien?: string;
  dia_diem_thu_thap: string;
  thoi_diem_thu_thap: string;
  nguoi_thu_thap: string;
  pham_vi_su_dung: string;
  nguon_tu_lieu: string;
  danh_sach_di_ban: DiBanItem[];
}

export interface ReferenceSource {
  id: string;
  ten_nguon: string;
  tac_gia_co_quan: string;
  loai_nguon: 'Chính thống - Viện nghiên cứu' | 'Chính thống - Bộ/Cơ quan Nhà nước' | 'Chính thống - Thư viện Quốc gia' | 'Sách chuyên khảo / Giáo trình' | 'Tạp chí học thuật';
  is_chinh_thong: boolean;
  duong_dan: string;
  nam_xuat_ban: string;
  ngay_truy_cap: string;
  mo_ta_vai_tro: string;
}

export type ScreenType = 'home' | 'detail' | 'ai' | 'references' | 'about';
