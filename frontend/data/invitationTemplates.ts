export type TemplateCategory = 'Tối giản' | 'Truyền thống' | 'Cổ điển' | 'Thiên nhiên' | 'Sang trọng' | 'Sáng tạo';
export type TemplateTone = 'Đỏ' | 'Xanh lá' | 'Xanh dương' | 'Xanh navy' | 'Hồng phai' | 'Vàng' | 'Nâu';

export interface InvitationTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  tone: TemplateTone;
  badge?: 'Mới' | 'Hot';
  description: string;
  accent: string;
  background: string;
  /** Soft accent used for section backgrounds on the demo page. */
  soft: string;
}

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: 'universe',
    name: 'Vũ Trụ',
    category: 'Sáng tạo',
    tone: 'Xanh navy',
    badge: 'Hot',
    description: 'Thiết kế truyền thống với chủ đề vũ trụ bao la, biểu tượng rồng vàng in chìm bên dưới, mang đậm nét khoa học viễn tưởng nhưng không kém phần trang trọng.',
    accent: '#A61B1B',
    background: 'linear-gradient(160deg, #FFF6F6 0%, #FFE9E9 100%)',
    soft: '#FFF1F1'
  },
  {
    id: 'vintage',
    name: 'Cổ Điển',
    category: 'Cổ điển',
    tone: 'Đỏ',
    badge: 'Hot',
    description: 'Thiết kế truyền thống theo phong cách cổ điển, biểu tượng rồng vàng in chìm bên dưới',
    accent: '#A61B1B',
    background: 'linear-gradient(160deg, #FFF6F6 0%, #FFE9E9 100%)',
    soft: '#FFF1F1'
  },
  {
    id: 'mien-tay',
    name: 'Miền tây',
    category: 'Thiên nhiên',
    tone: 'Xanh lá',
    badge: 'Hot',
    description: 'Thiết kế truyền thống theo phong cách miền Tây sông nước, nhẹ nhàng thôn quê',
    accent: '#A61B1B',
    background: 'linear-gradient(160deg, #FFF6F6 0%, #FFE9E9 100%)',
    soft: '#FFF1F1'
  },
  {
    id: 'thiep-cuoi-song-long',
    name: 'Song Long',
    category: 'Truyền thống',
    tone: 'Xanh dương',
    badge: 'Hot',
    description: 'Thiết kế truyền thống màu nền xanh với biểu tượng rồng vàng in chìm bên dưới, mang đậm nét văn hóa Á Đông và sự trang trọng.',
    accent: '#A61B1B',
    background: 'linear-gradient(160deg, #FFF6F6 0%, #FFE9E9 100%)',
    soft: '#FFF1F1'
  },
  {
    id: 'thiep-cuoi-song-long-pink',
    name: 'Song Long',
    category: 'Truyền thống',
    tone: 'Hồng phai',
    badge: 'Hot',
    description: 'Thiết kế truyền thống màu nền hồng phai nhẹ nhàng tinh tế với biểu tượng rồng vàng in chìm bên dưới, mang đậm nét văn hóa Á Đông và sự trang trọng.',
    accent: '#A61B1B',
    background: 'linear-gradient(160deg, #FFF6F6 0%, #FFE9E9 100%)',
    soft: '#FFF1F1'
  },
  {
    id: 'minimal-red',
    name: 'Minimalism - Đỏ',
    category: 'Tối giản',
    tone: 'Đỏ',
    badge: 'Hot',
    description: 'Thiết kế tối giản với sắc đỏ nổi bật, phù hợp cho một lễ cưới hiện đại và ấm áp.',
    accent: '#A61B1B',
    background: 'linear-gradient(160deg, #FFF6F6 0%, #FFE9E9 100%)',
    soft: '#FFF1F1'
  },
  {
    id: 'minimal-green',
    name: 'Minimalism - Xanh',
    category: 'Tối giản',
    tone: 'Xanh lá',
    badge: 'Hot',
    description: 'Phong cách thanh thoát với sắc xanh dịu, mang đến cảm giác tự nhiên và gần gũi.',
    accent: '#17683C',
    background: 'linear-gradient(160deg, #F3FFF8 0%, #DFF7EA 100%)',
    soft: '#EEFCF3'
  },
  {
    id: 'minimal-gold',
    name: 'Minimalism - Vàng',
    category: 'Tối giản',
    tone: 'Vàng',
    badge: 'Mới',
    description: 'Bố cục tinh tế cùng sắc vàng sang trọng, dành cho những cặp đôi yêu vẻ đẹp trang nhã.',
    accent: '#A4741A',
    background: 'linear-gradient(160deg, #FFF8E8 0%, #FCE9BD 100%)',
    soft: '#FFF7E4'
  },
  // {
  //   id: 'garden-blue',
  //   name: 'Vườn Xuân - Lam',
  //   category: 'Thiên nhiên',
  //   tone: 'Xanh dương',
  //   description: 'Cảm hứng khu vườn xanh trong trẻo, tạo nên lời mời nhẹ nhàng và tươi mới.',
  //   accent: '#1E5EA8',
  //   background: 'linear-gradient(160deg, #F2F9FF 0%, #E0EEFF 100%)',
  //   soft: '#EEF6FF'
  // },
  // {
  //   id: 'floral-pink',
  //   name: 'Hoa Mộc - Hồng',
  //   category: 'Thiên nhiên',
  //   tone: 'Hồng',
  //   badge: 'Mới',
  //   description: 'Họa tiết hoa mềm mại và gam hồng lãng mạn, dành cho một ngày cưới đầy cảm xúc.',
  //   accent: '#B04374',
  //   background: 'linear-gradient(160deg, #FFF3FA 0%, #FFE5F3 100%)',
  //   soft: '#FFF0F8'
  // },
  // {
  //   id: 'royal-brown',
  //   name: 'Hoàng Kim - Nâu',
  //   category: 'Sang trọng',
  //   tone: 'Nâu',
  //   description: 'Gam nâu trầm ấm kết hợp phong cách cổ điển, tạo cảm giác sang trọng và bền vững.',
  //   accent: '#7B4B2B',
  //   background: 'linear-gradient(160deg, #F9F5F1 0%, #EFE4DA 100%)',
  //   soft: '#F7F1EA'
  // },
];

export const defaultInvitationTemplate = invitationTemplates[0];

export function getInvitationTemplate(id: string): InvitationTemplate {
  return invitationTemplates.find((template) => template.id === id) ?? defaultInvitationTemplate;
}
