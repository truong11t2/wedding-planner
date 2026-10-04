import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vemotnha.com.vn').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Về Một Nhà | Chuẩn bị đám cưới dễ dàng hơn',
  description: 'Lập kế hoạch cưới, quản lý ngân sách và khách mời, tạo thiệp cưới online và tìm nhà cung cấp uy tín cùng Về Một Nhà.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: 'Về Một Nhà | Chuẩn bị đám cưới dễ dàng hơn',
    description: 'Mọi kế hoạch đám cưới trong một nơi để hai bạn tận hưởng hành trình về chung một nhà.',
    url: siteUrl,
    siteName: 'Về Một Nhà',
  },
};

export default function Home() {
  return <HomePage />;
}