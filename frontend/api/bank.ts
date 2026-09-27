import { API_BASE_URL, ENDPOINTS } from './config';

/** A bank from the VietQR bank list, with the BIN needed to build a QR image. */
export interface Bank {
  /** NAPAS/VietQR bank BIN, e.g. `970436` for Vietcombank. */
  bin: string;
  /** Short bank code, e.g. `VCB`. */
  code: string;
  /** Common display name, e.g. `Vietcombank`. */
  shortName: string;
  /** Full legal name in Vietnamese. */
  name: string;
}

/**
 * Fetches the list of banks usable with VietQR from the public backend endpoint.
 * Returns an empty list on failure so the form degrades to a plain input-less state.
 */
export const getBanks = async (): Promise<Bank[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BANKS}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data?.data) ? (data.data as Bank[]) : [];
  } catch {
    return [];
  }
};
