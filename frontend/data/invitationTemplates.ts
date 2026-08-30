export type TemplateCategory = 'Tối giản' | 'Truyền thống' | 'Cổ điển' | 'Thiên nhiên' | 'Sang trọng';
export type TemplateTone = 'Đỏ' | 'Xanh lá' | 'Xanh dương' | 'Hồng' | 'Vàng' | 'Nâu';

export interface InvitationTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  tone: TemplateTone;
  badge?: 'Mới' | 'Hot';
  accent: string;
  background: string;
  /** Soft accent used for section backgrounds on the demo page. */
  soft: string;
}

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: 'minimal-red',
    name: 'Minimalism - Đỏ',
    category: 'Tối giản',
    tone: 'Đỏ',
    badge: 'Hot',
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
    accent: '#A4741A',
    background: 'linear-gradient(160deg, #FFF8E8 0%, #FCE9BD 100%)',
    soft: '#FFF7E4'
  },
  {
    id: 'garden-blue',
    name: 'Vườn Xuân - Lam',
    category: 'Thiên nhiên',
    tone: 'Xanh dương',
    accent: '#1E5EA8',
    background: 'linear-gradient(160deg, #F2F9FF 0%, #E0EEFF 100%)',
    soft: '#EEF6FF'
  },
  {
    id: 'floral-pink',
    name: 'Hoa Mộc - Hồng',
    category: 'Thiên nhiên',
    tone: 'Hồng',
    badge: 'Mới',
    accent: '#B04374',
    background: 'linear-gradient(160deg, #FFF3FA 0%, #FFE5F3 100%)',
    soft: '#FFF0F8'
  },
  {
    id: 'royal-brown',
    name: 'Hoàng Kim - Nâu',
    category: 'Sang trọng',
    tone: 'Nâu',
    accent: '#7B4B2B',
    background: 'linear-gradient(160deg, #F9F5F1 0%, #EFE4DA 100%)',
    soft: '#F7F1EA'
  },
  {
    id: 'thiep-cuoi-song-long',
    name: 'Thiệp Cưới Song Long',
    category: 'Truyền thống',
    tone: 'Xanh dương',
    badge: 'Hot',
    accent: '#A61B1B',
    background: 'linear-gradient(160deg, #FFF6F6 0%, #FFE9E9 100%)',
    soft: '#FFF1F1'
  }
];

export const defaultInvitationTemplate = invitationTemplates[0];

export function getInvitationTemplate(id: string): InvitationTemplate {
  return invitationTemplates.find((template) => template.id === id) ?? defaultInvitationTemplate;
}
