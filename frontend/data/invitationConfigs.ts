import type { InvitationConfig } from '@/api/invitation';


type CoreInvitationConfig = Pick<
	InvitationConfig,
	'groomShort' | 'brideShort' | 'groomFull' | 'brideFull' | 'groomRole' | 'brideRole' | 'monogram' | 'weddingDateISO' | 'gifts' | 'reception' | 'schedule' | 'gallery' | 'musicUrl'
>;

const coreConfig: CoreInvitationConfig = {
	groomShort: 'Minh Khang',
	brideShort: 'Thảo My',
	groomFull: 'Nguyễn Minh Khang',
	brideFull: 'Lê Thảo My',
	groomRole: 'Trưởng Nam',
	brideRole: 'Út Nữ',
	monogram: 'K & M',
	weddingDateISO: '2026-12-20',
	gifts: {
		groom: { bank: 'Vietcombank', account: '0123456789', name: 'Nguyễn Minh Khang', qrImage: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/qr-bank/qrcode_chu-re.png' },
		bride: { bank: 'Techcombank', account: '9876543210', name: 'Lê Thảo My', qrImage: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/qr-bank/qrcode_co-dau.jpg' }
	},
	reception: {
		date: '2026-12-20',
		welcomeTime: '10:30',
		startTime: '11:00',
		venueName: 'Trung tâm Hội nghị Riverside',
		address: '88 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
		mapQuery: ''
	},
	schedule: [
		{ time: '17:30', label: 'Đón khách' },
		{ time: '18:00', label: 'Nghi thức cưới' },
		{ time: '18:20', label: 'Khai tiệc' },
		{ time: '19:00', label: 'Phục vụ tiệc chính' },
		{ time: '21:00', label: 'Kết thúc tiệc' }
	],
	gallery: [
		'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/cap-doi.webp',
		'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/DSC_8736.webp',
		'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-1.webp',
		'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-2.webp',
		'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-3.webp'
	],
	musicUrl: ''
};

const minimalConfig: InvitationConfig = {
	...coreConfig,
	photos: {
		coverPhoto: '',
		groomPhoto: '',
		bridePhoto: ''
	},
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
		lunar: '(Nhằm ngày 12 tháng 11 năm Bính Ngọ)'
	},
	story: null,
};

const songLongConfig: InvitationConfig = {
	...coreConfig,
	photos: {
		coverPhoto: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/cap-doi.webp',
		groomPhoto: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/chu-re.webp',
		bridePhoto: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/co-dau.webp'
	},
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
		lunar: '(Nhằm ngày 12 tháng 11 năm Bính Ngọ)'
	},
	story: [
		{ date: 'Mùa thu 2021', text: 'Lần đầu gặp gỡ tại một quán cà phê nhỏ ven sông.' },
		{ date: 'Mùa hè 2025', text: 'Lời cầu hôn bất ngờ dưới ánh hoàng hôn.' },
		{ date: '20.12.2026', text: 'Ngày chúng tôi chính thức nên duyên vợ chồng.' }
	],
};

const hienDaiConfig: InvitationConfig = {
	...coreConfig,
	photos: {
		coverPhoto: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/cap-doi.webp',
		groomPhoto: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/chu-re.webp',
		bridePhoto: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/co-dau.webp'
	},
	story: [
		{ date: 'Tháng 9, 2019', title: 'Lần đầu gặp gỡ', text: 'Mô tả ngắn ngọn 2 bạn đã gặp gỡ như thế nào.', photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80' },
		{ date: 'Tháng 3, 2021', title: 'Chuyến đi đầu tiên', text: 'Mô tả về chuyến đi chơi chung đầu tiên của hai bạn', photo: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80' },
		{ date: 'Tháng 12, 2023', title: 'Lời cầu hôn', text: 'Anh ấy đã cầu hôn bạn như thế nào', photo: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80' },
		{ date: 'Tháng 6, 2026', title: 'Lễ cưới', text: 'Lúc [tên cặp đôi] tất cả những người đến chung vui trong ngày khởi đầu cho mãi mãi.', photo: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80' }
	],
	groomParents: null,
	brideParents: null,
	ceremony: null,
};

export const invitationConfigs: Record<string, InvitationConfig> = {
	'minimal-red': minimalConfig,
	'minimal-green': minimalConfig,
	'minimal-gold': minimalConfig,
	'thiep-cuoi-song-long': songLongConfig,
	'thiep-cuoi-song-long-pink': songLongConfig,
	'universe': songLongConfig,
	'vintage': songLongConfig,
	'mien-tay': songLongConfig,
	'passport': songLongConfig,
	// Must match the template id in `invitationTemplates` — `thiep-cuoi-western`,
	// not `western`. A missing key silently fell back to `minimalConfig`.
	'thiep-cuoi-western': hienDaiConfig,
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

/**
 * Optional form sections a template supports.
 */
export interface InvitationTemplateFormFeatures {
	photos: boolean;
	story: boolean;
	groomParents: boolean;
	brideParents: boolean;
	ceremony: boolean;
}

export function getInvitationConfigFeatures(templateId: string): InvitationTemplateFormFeatures {
	const config = invitationConfigs[templateId] ?? minimalConfig;

	return {
		photos: Boolean(config.photos),
		story: Array.isArray(config.story),
		groomParents: config.groomParents != null,
		brideParents: config.brideParents != null,
		ceremony: config.ceremony != null,
	};
}
