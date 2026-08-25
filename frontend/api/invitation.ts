import { API_BASE_URL, ENDPOINTS } from './config';

export interface InvitationParent {
  father: string;
  mother: string;
  address: string;
}

export interface InvitationCeremony {
  time: string;
  dateLabel: string;
  lunar: string;
}

export interface InvitationReception {
  date: string;
  welcomeTime: string;
  startTime: string;
  venueName: string;
  mapQuery: string;
}

export interface InvitationScheduleItem {
  time: string;
  label: string;
}

export interface InvitationGift {
  bank: string;
  account: string;
  name: string;
  qrImage?: string;
}

export interface InvitationConfig {
  groomShort: string;
  brideShort: string;
  groomFull: string;
  brideFull: string;
  groomRole: string;
  brideRole: string;
  monogram: string;
  weddingDateISO: string;
  groomParents: InvitationParent;
  brideParents: InvitationParent;
  ceremony: InvitationCeremony;
  reception: InvitationReception;
  schedule: InvitationScheduleItem[];
  gallery: string[];
  gifts: {
    groom: InvitationGift;
    bride: InvitationGift;
  };
  musicUrl: string;
}

export interface RenderInvitationResponse {
  success: boolean;
  message: string;
  htmlFileName: string;
  publicUrl: string;
}

export async function renderInvitationPreview(
  templateId: string,
  config: InvitationConfig
): Promise<RenderInvitationResponse> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVITATION.RENDER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ templateId, config }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to render invitation preview');
  }

  return response.json();
}

export interface InvitationSummary {
  id: string;
  slug: string;
  templateId: string;
  publicUrl: string;
  sharePath: string;
  isPaid?: boolean;
  expiresAt?: string | null;
}

export interface GenerateInvitationResponse {
  success: boolean;
  message: string;
  invitation: InvitationSummary;
}

export async function generateInvitation(
  templateId: string,
  config: InvitationConfig,
  meta: { brideName: string; groomName: string; eventDate: string }
): Promise<GenerateInvitationResponse> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVITATION.GENERATE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ templateId, config, ...meta }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate invitation link');
  }

  return response.json();
}

export interface MyInvitation {
  id: string;
  slug: string;
  templateId: string;
  publicUrl: string;
  sharePath: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  config: InvitationConfig;
  isPublished: boolean;
  isPaid?: boolean;
  expiresAt?: string | null;
}

export interface GetMyInvitationResponse {
  success: boolean;
  invitation: MyInvitation;
}

export interface InvitationRsvp {
  id: string;
  name: string;
  phone?: string;
  attendanceStatus: 'attending' | 'declined';
  guestCount: number;
  mealPreference?: string;
  message?: string;
  createdAt: string;
}

export async function getInvitationRsvps(): Promise<{
  success: boolean;
  rsvps?: InvitationRsvp[];
  message?: string;
}> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVITATION.BASE}/mine/rsvps`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch RSVPs');
  }

  return data;
}

export async function getMyInvitation(): Promise<GetMyInvitationResponse> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVITATION.MINE}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch invitation');
  }

  return response.json();
}

export interface PublicInvitationLookup {
  slug: string;
  templateId: string;
  publicUrl: string;
}

export interface GetInvitationBySlugResponse {
  success: boolean;
  invitation: PublicInvitationLookup;
}

export async function getInvitationBySlug(slug: string): Promise<GetInvitationBySlugResponse> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVITATION.BASE}/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch invitation');
  }

  return response.json();
}

export async function deleteInvitation(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVITATION.BASE}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete invitation');
  }

  return response.json();
}
