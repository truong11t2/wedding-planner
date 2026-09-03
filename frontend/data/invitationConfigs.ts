import type { InvitationConfig } from '@/api/invitation';


const minimalConfig: InvitationConfig = {
	groomShort: 'Gia Bảo',
	brideShort: 'Minh Anh',
	groomFull: 'Nguyễn Gia Bảo',
	brideFull: 'Trần Minh Anh',
	groomRole: 'Trưởng Nam',
	brideRole: 'Út Nữ',
	monogram: 'B & A',
	weddingDateISO: '2026-12-20T18:00:00',
	groomParents: {
		father: 'Ông Nguyễn Văn Long',
		mother: 'Bà Lê Thị Hồng',
		address: '12 Trần Phú, Hải Châu, Đà Nẵng'
	},
	brideParents: {
		father: 'Ông Trần Văn Nam',
		mother: 'Bà Phạm Thị Lan',
		address: '45 Lê Duẩn, Quận 1, TP.HCM'
	},
	ceremony: {
		time: '09:00',
		dateLabel: '20 · 12 · 2026',
		lunar: '(Nhằm ngày 11 tháng 11 năm Bính Ngọ)'
	},
	reception: {
		date: '2026-12-20',
		welcomeTime: '17:30',
		startTime: '18:00',
		venueName: 'The Adora Center, 431 Hoàng Văn Thụ, Tân Bình, TP.HCM',
		mapQuery: ''
	},
	schedule: [
		{ time: '17:30', label: 'Đón khách' },
		{ time: '18:00', label: 'Khai tiệc' },
		{ time: '18:20', label: 'Nghi thức rót rượu, cắt bánh' },
		{ time: '19:00', label: 'Phục vụ tiệc chính' },
		{ time: '21:00', label: 'Kết thúc tiệc' }
	],
	gallery: [],
	gifts: {
		groom: { bank: 'Vietcombank', account: '0123 4567 89', name: 'NGUYEN GIA BAO', qrImage: '' },
		bride: { bank: 'BIDV', account: '9876 5432 10', name: 'TRAN MINH ANH', qrImage: '' }
	},
	musicUrl: ''
};

const songLongConfig: InvitationConfig = {
	groomShort: 'Minh Khang',
	brideShort: 'Thảo My',
	groomFull: 'Nguyễn Minh Khang',
	brideFull: 'Lê Thảo My',
	groomRole: 'Chú Rể',
	brideRole: 'Cô Dâu',
	monogram: 'K & M',
	groomParents: {
		father: 'Ông Nguyễn Văn Long',
		mother: 'Bà Lê Thị Hồng',
		address: '12 Trần Phú, Hải Châu, Đà Nẵng'
	},
	brideParents: {
		father: 'Ông Trần Văn Nam',
		mother: 'Bà Phạm Thị Lan',
		address: '45 Lê Duẩn, Quận 1, TP.HCM'
	},
	weddingDateISO: '2026-12-20T11:00',
	ceremony: {
		time: '09:00',
		dateLabel: '20 · 12 · 2026',
		lunar: '(Nhằm ngày 11 tháng 11 năm Bính Ngọ)'
	},
	reception: {
		date: '2026-12-20',
		welcomeTime: '10:30',
		startTime: '11:00',
		venueName: 'Trung tâm Hội nghị Riverside, 88 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
		mapQuery: ''
	},
	schedule: [],
	gallery: [],
	gifts: {
		groom: { bank: 'Vietcombank', account: '0123456789', name: 'Nguyễn Minh Khang', qrImage: '' },
		bride: { bank: 'Techcombank', account: '9876543210', name: 'Lê Thảo My', qrImage: '' }
	},
	story: [
		{ date: 'Mùa thu 2021', text: 'Lần đầu gặp gỡ tại một quán cà phê nhỏ ven sông.' },
		{ date: 'Mùa hè 2025', text: 'Lời cầu hôn bất ngờ dưới ánh hoàng hôn.' },
		{ date: '20.12.2026', text: 'Ngày chúng tôi chính thức nên duyên vợ chồng.' }
	],
	photos: {
		coverPhoto: '',
		groomPhoto: '',
		bridePhoto: ''
	},
	musicUrl: '',
};

export const invitationConfigs: Record<string, InvitationConfig> = {
	'minimal-red': minimalConfig,
	'minimal-green': minimalConfig,
	'minimal-gold': minimalConfig,
	'garden-blue': minimalConfig,
	'floral-pink': minimalConfig,
	'royal-brown': minimalConfig,
	'thiep-cuoi-song-long': songLongConfig,
	'dual-dragon-green': songLongConfig,
};

/** Deep-clone a config so callers never mutate the shared registry objects. */
export function cloneInvitationConfig(config: InvitationConfig): InvitationConfig {
	return JSON.parse(JSON.stringify(config)) as InvitationConfig;
}

/**
 * Returns a deep-cloned default config for the given template id.
 * Falls back to the minimal-red defaults when the id is unknown.
 */
export function getInvitationConfig(templateId: string): InvitationConfig {
	return cloneInvitationConfig(invitationConfigs[templateId] ?? minimalConfig);
}
