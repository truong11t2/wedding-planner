// Single place to edit homepage routes, copy, pricing and placeholder data.
export const HOME_ROUTES = {
  login: '/login',
  signup: '/login', // no separate signup route exists yet
  vendors: '/vendor',
  vendorSignup: '/contact', // TODO: point at a vendor registration route when one exists
} as const;

export type IconName = 'calendar' | 'wallet' | 'users' | 'mail' | 'store';

export const FEATURES: { icon: IconName; title: string; body: string; href: string }[] = [
  { icon: 'calendar', title: 'Lên kế hoạch cưới', body: 'Tạo checklist, timeline và quản lý toàn bộ công việc chuẩn bị đám cưới.', href: '/timeline' },
  { icon: 'wallet', title: 'Quản lý ngân sách', body: 'Theo dõi chi tiêu, phân bổ theo hạng mục và biết rõ ngân sách còn lại.', href: '/budget' },
  { icon: 'users', title: 'Quản lý khách mời', body: 'Quản lý lời mời, theo dõi RSVP và thông tin từng khách mời.', href: '/guests' },
  { icon: 'mail', title: 'Thiệp cưới online', body: 'Tạo thiệp cưới đẹp, mang dấu ấn riêng của hai bạn.', href: '/invitation' },
  { icon: 'store', title: 'Nhà cung cấp uy tín', body: 'Tìm kiếm và kết nối với các nhà cung cấp dịch vụ cưới.', href: '/vendor' },
];

export const TIMELINE: { period: string; title: string; tasks: string[] }[] = [
  { period: '12 tháng', title: 'Định hình ý tưởng', tasks: ['Thống nhất ngân sách tổng', 'Chọn thời gian tổ chức', 'Lên danh sách khách mời sơ bộ'] },
  { period: '9 tháng', title: 'Chọn địa điểm và nhà cung cấp', tasks: ['Tham quan và đặt địa điểm', 'Chọn chụp ảnh, quay phim', 'Chọn phong cách tiệc cưới'] },
  { period: '6 tháng', title: 'Hoàn thiện kế hoạch', tasks: ['Chọn trang phục cưới', 'Chốt trang trí và thực đơn', 'Hoàn thiện danh sách khách mời'] },
  { period: '3 tháng', title: 'Gửi thiệp mời', tasks: ['Hoàn tất thiệp cưới online', 'Gửi lời mời và theo dõi RSVP', 'Thử makeup và trang phục'] },
  { period: '1 tháng', title: 'Kiểm tra lần cuối', tasks: ['Xác nhận với từng nhà cung cấp', 'Chốt sơ đồ chỗ ngồi', 'Chuẩn bị lịch trình ngày cưới'] },
];

export type Plan = { id: string; name: string; priceLabel: string; period: string; featured?: boolean; badge?: string; features: string[]; cta: string };

export const PLANS: Plan[] = [
  { id: 'free', name: 'Miễn phí', priceLabel: '0đ', period: '/ tháng', features: ['Lập kế hoạch cơ bản', 'Checklist', 'Quản lý khách mời cơ bản'], cta: 'Bắt đầu ngay' },
  { id: 'premium', name: 'Gói Nâng Cao', priceLabel: '199.000đ', period: '/ tháng', featured: true, badge: 'Phổ biến', features: ['Toàn bộ tính năng lập kế hoạch', 'Quản lý ngân sách', 'Quản lý khách mời nâng cao', 'Thiệp cưới online', 'Tính năng nhà cung cấp'], cta: 'Nâng cấp ngay' },
  { id: 'vip', name: 'Gói VIP', priceLabel: '399.000đ', period: '/ tháng', features: ['Toàn bộ tính năng Nâng Cao', 'Tùy chỉnh nâng cao', 'Hỗ trợ ưu tiên', 'Các tính năng cao cấp bổ sung'], cta: 'Nâng cấp ngay' },
];

export type Testimonial = { id: string; couple: string; location: string; quote: string; rating: number; avatarUrl?: string };

// Placeholder content; pass real data into <Testimonials items={...} /> from the backend later.
export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', couple: 'Minh Anh & Thùy Linh', location: 'TP. Hồ Chí Minh', quote: 'Nhờ Về Một Nhà mà tụi mình tiết kiệm được rất nhiều thời gian và chi phí. Giao diện dễ dùng, mọi thứ đều rõ ràng.', rating: 5, avatarUrl: '/images/testimonials/minh-huong.jpg' },
  { id: 't2', couple: 'Hoàng Nam & Mai Anh', location: 'Đà Nẵng', quote: 'Thiệp cưới online đẹp và ai cũng khen. Đặc biệt là tính năng quản lý khách mời rất tiện.', rating: 5, avatarUrl: '/images/testimonials/lan-tuan.jpg' },
  { id: 't3', couple: 'Tuấn Dũng & Bảo Trâm', location: 'Hà Nội', quote: 'Đội ngũ hỗ trợ rất nhiệt tình, giúp mình giải quyết nhanh mọi vấn đề. Cảm ơn Về Một Nhà!', rating: 5, avatarUrl: '/images/testimonials/phuong-nam.jpg' },
];

export const VENDOR_CATEGORIES: { label: string; hue: number; imageUrl?: string }[] = [
  { label: 'Địa điểm', hue: 28, imageUrl: '/images/vendor/diamond-place/dp1-cover.jpg' },
  { label: 'Trang phục cưới', hue: 340, imageUrl: '/images/carousel/wedding-2.jpg' },
  { label: 'Makeup & làm tóc', hue: 350, imageUrl: '/images/testimonials/lan-tuan.jpg' },
  { label: 'Chụp ảnh', hue: 270, imageUrl: '/images/vendor/photographer-1.jpg' },
  { label: 'Quay phim', hue: 300, imageUrl: '/images/vendor/filming-a-wedding.webp' },
  { label: 'Trang trí', hue: 10, imageUrl: '/images/carousel/wedding-1.jpg' },
  { label: 'Bánh cưới', hue: 40, imageUrl: '/images/carousel/wedding-4.jpg' },
  { label: 'Xe cưới', hue: 220, imageUrl: '/images/vendor/photographer-2.jpg' },
];
