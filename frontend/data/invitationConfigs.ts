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
		lunar: '(Nhằm ngày 12 tháng 11 năm Bính Ngọ)'
	},
	reception: {
		date: '2026-12-20',
		welcomeTime: '17:30',
		startTime: '18:00',
		venueName: 'The Adora Center',
		address: '431 Hoàng Văn Thụ, Tân Bình, TP.HCM',
		mapQuery: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1683051673813!2d106.6568232753989!3d10.798418358786982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529d96e56d9bd%3A0x205428f74d7f4ddb!2sThe%20ADORA!5e0!3m2!1sen!2s!4v1788687164235!5m2!1sen!2s'
	},
	schedule: [
		{ time: '17:30', label: 'Đón khách' },
		{ time: '18:00', label: 'Nghi thức cưới' },
		{ time: '18:20', label: 'Khai tiệc' },
		{ time: '19:00', label: 'Phục vụ tiệc chính' },
		{ time: '21:00', label: 'Kết thúc tiệc' }
	],
	gallery: [
		"https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/cap-doi.webp",
        "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/cap-doi-1.webp",
    	"https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/DSC_8736.webp",
    	"https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-1.webp",
    	"https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-2.webp",
    	"https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-3.webp"
	],
	gifts: {
		groom: { bank: 'Vietcombank', account: '0123 4567 89', name: 'NGUYEN GIA BAO', qrImage: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/qr-bank/qrcode_chu-re.png' },
		bride: { bank: 'BIDV', account: '9876 5432 10', name: 'TRAN MINH ANH', qrImage: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/qr-bank/qrcode_co-dau.jpg' }
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
		lunar: '(Nhằm ngày 12 tháng 11 năm Bính Ngọ)'
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
	  { "time": "17:30", "label": "Đón khách" },
      { "time": "18:00", "label": "Nghi thức cưới" },
      { "time": "18:20", "label": "Khai tiệc" },
      { "time": "19:00", "label": "Phục vụ tiệc chính" },
      { "time": "21:00", "label": "Kết thúc tiệc" }
	],
	gallery: [
	  "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/cap-doi.webp",
      "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/DSC_8736.webp",
      "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-1.webp",
      "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-2.webp",
      "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/anh-3.webp"
	],
	gifts: {
		groom: { bank: 'Vietcombank', account: '0123456789', name: 'Nguyễn Minh Khang', qrImage: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/qr-bank/qrcode_chu-re.png' },
		bride: { bank: 'Techcombank', account: '9876543210', name: 'Lê Thảo My', qrImage: 'https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/qr-bank/qrcode_co-dau.jpg' }
	},
	story: [
		{ date: 'Mùa thu 2021', text: 'Lần đầu gặp gỡ tại một quán cà phê nhỏ ven sông.' },
		{ date: 'Mùa hè 2025', text: 'Lời cầu hôn bất ngờ dưới ánh hoàng hôn.' },
		{ date: '20.12.2026', text: 'Ngày chúng tôi chính thức nên duyên vợ chồng.' }
	],
	photos: {
      "coverPhoto": "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/cap-doi.webp",
      "groomPhoto": "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/chu-re.webp",
      "bridePhoto": "https://vemotnha.s3.ap-southeast-1.amazonaws.com/invitations/default/co-dau.webp"
	},
	musicUrl: '',
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
 *
 * Derived from the template's *own* default config — never from the in-progress
 * merged config — so a section can't leak into a template that doesn't support
 * it after the user switches templates.
 */
export interface InvitationTemplateFormFeatures {
	schedule: boolean;
	qrGift: boolean;
	lunar: boolean;
	welcomeTime: boolean;
	startTime: boolean;
	story: boolean;
	photos: boolean;
}

export function getInvitationConfigFeatures(templateId: string): InvitationTemplateFormFeatures {
	const config = invitationConfigs[templateId] ?? minimalConfig;

	return {
		schedule: Array.isArray(config.schedule),
		qrGift: Boolean(config.gifts),
		lunar: Boolean(config.ceremony.lunar),
		welcomeTime: Boolean(config.reception.welcomeTime),
		startTime: Boolean(config.reception.startTime),
		story: Array.isArray(config.story),
		photos: Boolean(config.photos)
	};
}
