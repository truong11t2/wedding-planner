export type TemplateCategory = 'Tối giản' | 'Truyền thống' | 'Cổ điển' | 'Thiên nhiên' | 'Sang trọng' | 'Sáng tạo';
export type TemplateTone = 'Nâu nhạt' | 'Đỏ' | 'Xanh lá' | 'Xanh dương' | 'Xanh navy' | 'Hồng phai' | 'Vàng' | 'Nâu';

export interface InvitationTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  tone: TemplateTone;
  badge?: 'Mới' | 'Hot';
  description: string;
}

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: 'thiep-cuoi-nhat-ban',
    name: 'Nhật Bản',
    category: 'Sáng tạo',
    tone: 'Đỏ',
    badge: 'Hot',
    description: 'Thiết kế đơn giản, hiện đại nhưng vẫn trang trọng và tinh tế theo phong cách Nhật Bản. Phù hợp việc mời khách Nhật.',
  },
  {
    id: 'thiep-cuoi-chau-au-do',
    name: 'Châu Âu',
    category: 'Sáng tạo',
    tone: 'Đỏ',
    badge: 'Hot',
    description: 'Thiết kế đơn giản, hiện đại nhưng vẫn trang trọng và tinh tế theo phong cách Châu Âu. Phù hợp việc mời khách nước ngoài.',
  },
  {
    id: 'thiep-cuoi-western',
    name: 'Hiện đại',
    category: 'Sáng tạo',
    tone: 'Nâu nhạt',
    badge: 'Hot',
    description: 'Thiết kế đơn giản, hiện đại nhưng vẫn trang trọng và tinh tế theo phong cách phương Tây. Phù hợp việc mời khách nước ngoài.',
  },
  {
    id: 'universe',
    name: 'Vũ Trụ',
    category: 'Sáng tạo',
    tone: 'Xanh navy',
    badge: 'Hot',
    description: 'Thiết kế truyền thống với chủ đề vũ trụ bao la, biểu tượng rồng vàng in chìm bên dưới, mang đậm nét khoa học viễn tưởng nhưng không kém phần trang trọng.',
  },
  {
    id: 'passport',
    name: 'Hộ chiếu',
    category: 'Sáng tạo',
    tone: 'Xanh navy',
    badge: 'Hot',
    description: 'Thiết kế hộ chiếu trẻ trung sáng tạo cho giới trẻ, biểu tượng rồng vàng in chìm bên dưới',
  },
  {
    id: 'mien-tay',
    name: 'Miền tây',
    category: 'Thiên nhiên',
    tone: 'Xanh lá',
    badge: 'Hot',
    description: 'Thiết kế truyền thống theo phong cách miền Tây sông nước, nhẹ nhàng thôn quê',
  },
  {
    id: 'vintage',
    name: 'Cổ Điển',
    category: 'Cổ điển',
    tone: 'Đỏ',
    badge: 'Hot',
    description: 'Thiết kế truyền thống theo phong cách cổ điển, biểu tượng rồng vàng in chìm bên dưới',
  },
  {
    id: 'thiep-cuoi-song-long',
    name: 'Song Long',
    category: 'Truyền thống',
    tone: 'Xanh dương',
    badge: 'Hot',
    description: 'Thiết kế truyền thống màu nền xanh với biểu tượng rồng vàng in chìm bên dưới, mang đậm nét văn hóa Á Đông và sự trang trọng.',
  },
  {
    id: 'thiep-cuoi-song-long-pink',
    name: 'Song Long',
    category: 'Truyền thống',
    tone: 'Hồng phai',
    badge: 'Hot',
    description: 'Thiết kế truyền thống màu nền hồng phai nhẹ nhàng tinh tế với biểu tượng rồng vàng in chìm bên dưới, mang đậm nét văn hóa Á Đông và sự trang trọng.',
  },
  {
    id: 'minimal-red',
    name: 'Minimalism - Đỏ',
    category: 'Tối giản',
    tone: 'Đỏ',
    badge: 'Hot',
    description: 'Thiết kế tối giản với sắc đỏ nổi bật, phù hợp cho một lễ cưới hiện đại và ấm áp.',
  },
  {
    id: 'minimal-green',
    name: 'Minimalism - Xanh',
    category: 'Tối giản',
    tone: 'Xanh lá',
    badge: 'Hot',
    description: 'Phong cách thanh thoát với sắc xanh dịu, mang đến cảm giác tự nhiên và gần gũi.',
  },
  {
    id: 'minimal-gold',
    name: 'Minimalism - Vàng',
    category: 'Tối giản',
    tone: 'Vàng',
    badge: 'Mới',
    description: 'Bố cục tinh tế cùng sắc vàng sang trọng, dành cho những cặp đôi yêu vẻ đẹp trang nhã.',
  }
];

export const defaultInvitationTemplate = invitationTemplates[0];

export function getInvitationTemplate(id: string): InvitationTemplate {
  return invitationTemplates.find((template) => template.id === id) ?? defaultInvitationTemplate;
}
