const fs = require('fs');
const path = require('path');

// The raw list is the VietQR "Get Bank list" payload that ships with the app.
const BANKS_FILE = path.join(__dirname, '..', '..', 'public', 'banks', 'banks.json');

let cachedBanks = null;

/**
 * Reads and normalises the bundled bank list.
 *
 * Only the fields the frontend needs are kept, and only banks that support
 * transfers (i.e. have a NAPAS/VietQR BIN) are exposed — those are the only
 * ones that can produce a VietQR image.
 */
function loadBanks() {
  if (cachedBanks) return cachedBanks;

  const raw = fs.readFileSync(BANKS_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed.data || [];

  cachedBanks = list
    .filter((bank) => bank && bank.bin && (bank.shortName || bank.short_name) && bank.transferSupported !== 0)
    .map((bank) => ({
      bin: String(bank.bin),
      code: bank.code || '',
      shortName: bank.shortName || bank.short_name || '',
      name: bank.name || ''
    }))
    .sort((a, b) => a.shortName.localeCompare(b.shortName, 'vi'));

  return cachedBanks;
}

/** GET /api/banks — public list of banks usable with VietQR. */
exports.getBanks = (_req, res) => {
  try {
    res.status(200).json({ success: true, data: loadBanks() });
  } catch (error) {
    console.error('Get banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải danh sách ngân hàng'
    });
  }
};
