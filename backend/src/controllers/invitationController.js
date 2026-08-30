const fs = require('fs').promises;
const path = require('path');
const Invitation = require('../models/Invitation');
const User = require('../models/User');

function generateRandomId(size = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < size; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function slugify(text) {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const TEMPLATES_DIR = path.join(__dirname, '../../public/templates/invitation');
const INVITATIONS_DIR = path.join(__dirname, '../../public/invitations');
const DEFAULT_TEMPLATE_ID = 'minimal-red';
const STORAGE_KEY_MARKER = "const STORAGE_KEY = 'weddingInviteConfig_v1';";
const SERVER_CONFIG_MARKER = 'window.__INVITATION_CONFIG__ = null;';
const SERVER_INVITATION_MARKER = 'window.__INVITATION_ID__ = null;';
const PREVIEW_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days clean up
//const PREVIEW_TTL_MS = 5 * 60 * 1000; // 5 minutes for testing
const PAID_TTL_MS = 365 * 24 * 60 * 60 * 1000;

async function ensureInvitationsDir() {
  try {
    await fs.access(INVITATIONS_DIR);
  } catch {
    await fs.mkdir(INVITATIONS_DIR, { recursive: true, mode: 0o755 });
  }
}

function deriveEventDate(config) {
  if (!config || !config.weddingDateISO) return '';
  return config.weddingDateISO.split('T')[0];
}

/**
 * Finds the current user's invitation row and creates it if missing,
 * otherwise updates it in place. Used by both the preview (render) and
 * the share-link (generate) endpoints so that every save — including
 * uploaded photo URLs embedded in `config` — is persisted to the database
 * as soon as the user previews the invitation, not only when they
 * explicitly generate a shareable link.
 */
async function upsertInvitationRecord(userId, { templateId, htmlFileName, publicUrl, brideName, groomName, eventDate, config, isPaid }) {
  let invitation = await Invitation.findOne({ where: { userId } });

  const resolvedBrideName = brideName || config.brideFull;
  const resolvedGroomName = groomName || config.groomFull;
  const resolvedEventDate = eventDate || deriveEventDate(config);
  const expiresAt = new Date(Date.now() + (isPaid ? PAID_TTL_MS : PREVIEW_TTL_MS));

  if (invitation) {
    invitation.templateId = templateId;
    invitation.htmlFileName = htmlFileName;
    invitation.publicUrl = publicUrl;
    invitation.brideName = resolvedBrideName;
    invitation.groomName = resolvedGroomName;
    invitation.eventDate = resolvedEventDate;
    invitation.config = config;
    invitation.isPaid = isPaid;
    invitation.expiresAt = expiresAt;
    await invitation.save();
  } else {
    const baseSlug = slugify(`${resolvedGroomName}-${resolvedBrideName}`) || 'thiep-cuoi';
    let slug = `${baseSlug}-${generateRandomId()}`;

    // eslint-disable-next-line no-await-in-loop
    while (await Invitation.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${generateRandomId()}`;
    }

    invitation = await Invitation.create({
      userId,
      slug,
      templateId,
      htmlFileName,
      publicUrl,
      brideName: resolvedBrideName,
      groomName: resolvedGroomName,
      eventDate: resolvedEventDate,
      config,
      isPaid,
      expiresAt
    });
  }

  return invitation;
}

async function resolveTemplatePath(templateId) {
  const candidate = path.join(TEMPLATES_DIR, `${templateId}.html`);
  try {
    await fs.access(candidate);
    return candidate;
  } catch {
    return path.join(TEMPLATES_DIR, `${DEFAULT_TEMPLATE_ID}.html`);
  }
}

/**
 * Reads the invitation template and writes the couple's config directly
 * into the generated HTML so the template's own client-side script
 * (init()) auto-renders the invitation instead of showing the setup form.
 *
 * The config is embedded twice for robustness:
 *  1) As `window.__INVITATION_CONFIG__` — a plain JS literal baked
 *     straight into the file. This is the primary source the page reads
 *     from, so photo URLs and all other fields are always present in
 *     the file itself, regardless of whether the browser allows/persists
 *     localStorage (private browsing, in-app browsers, cleared storage, etc).
 *  2) Via `localStorage.setItem(...)` — kept as a legacy fallback only.
 */
async function buildInvitationHtml(templateId, config, invitationId) {
  const templatePath = await resolveTemplatePath(templateId);
  let templateContent = await fs.readFile(templatePath, 'utf-8');

  const configJson = JSON.stringify(config);
  const configJsonForLocalStorage = JSON.stringify(configJson);

  if (templateContent.includes(SERVER_CONFIG_MARKER)) {
    templateContent = templateContent.replace(
      SERVER_CONFIG_MARKER,
      `window.__INVITATION_CONFIG__ = ${configJson};`
    );
  }

  if (templateContent.includes(SERVER_INVITATION_MARKER)) {
    templateContent = templateContent.replace(
      SERVER_INVITATION_MARKER,
      `window.__INVITATION_ID__ = ${JSON.stringify(invitationId)};`
    );
  }

  if (templateContent.includes(STORAGE_KEY_MARKER)) {
    templateContent = templateContent.replace(
      STORAGE_KEY_MARKER,
      `${STORAGE_KEY_MARKER}\ntry{localStorage.setItem(STORAGE_KEY, ${configJsonForLocalStorage});}catch(e){}`
    );
  }

  return templateContent;
}

// Auth required: render/refresh the current user's single preview invitation
// HTML file from the submitted config. Reuses the same file every time so
// only one generated file ever exists per user.
exports.renderInvitation = async (req, res) => {
  try {
    const userId = req.user.id;
    const isPaid = Boolean(req.user.isPaid);
    const { templateId, config } = req.body;

    if (!templateId || !config || !config.groomFull || !config.brideFull) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: templateId and config (with groomFull/brideFull) are required'
      });
    }

    await ensureInvitationsDir();

    const htmlFileName = `${userId}.html`;
    const publicUrl = `/invitations/${htmlFileName}`;

    // Persist the invitation (including uploaded photo URLs inside config)
    // to the database as soon as the user previews it, not only when they
    // explicitly generate a shareable link.
    const invitation = await upsertInvitationRecord(userId, {
      templateId,
      htmlFileName,
      publicUrl,
      config,
      isPaid
    });

    const htmlContent = await buildInvitationHtml(templateId, config, invitation.id);
    const outputPath = path.join(INVITATIONS_DIR, htmlFileName);
    await fs.writeFile(outputPath, htmlContent, 'utf-8');
    try {
      await fs.chmod(outputPath, 0o644);
    } catch (error) {
      console.log('Could not set file permissions:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Invitation preview generated successfully',
      htmlFileName,
      publicUrl
    });
  } catch (error) {
    console.error('Error rendering invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Error rendering invitation',
      error: error.message
    });
  }
};

// Auth required: persist the invitation link to the current user's account
// so they can retrieve/share it again later.
exports.generateInvitation = async (req, res) => {
  try {
    const userId = req.user.id;
    const isPaid = Boolean(req.user.isPaid);
    const { templateId, config, brideName, groomName, eventDate } = req.body;

    //TODO: remove comment in future
    // if (!isPaid) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Tính năng tạo link gửi cho khách chỉ dành cho người dùng đã thanh toán.'
    //   });
    // }

    if (!templateId || !config || !config.groomFull || !config.brideFull) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: templateId and config are required'
      });
    }

    await ensureInvitationsDir();

    // Every user has exactly one generated HTML file, named deterministically
    // after their userId. This guarantees no duplicate files ever accumulate,
    // whether the file was first created via /render (preview) or here.
    const htmlFileName = `${userId}.html`;
    const publicUrl = `/invitations/${htmlFileName}`;

    const invitation = await upsertInvitationRecord(userId, {
      templateId,
      htmlFileName,
      publicUrl,
      brideName,
      groomName,
      eventDate,
      config,
      isPaid
    });

    // Always (re)generate the final HTML file so it reflects the latest content
    const htmlContent = await buildInvitationHtml(templateId, config, invitation.id);
    const outputPath = path.join(INVITATIONS_DIR, htmlFileName);
    await fs.writeFile(outputPath, htmlContent, 'utf-8');
    try {
      await fs.chmod(outputPath, 0o644);
    } catch (error) {
      console.log('Could not set file permissions:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Invitation link generated successfully',
      invitation: {
        id: invitation.id,
        slug: invitation.slug,
        templateId: invitation.templateId,
        publicUrl: invitation.publicUrl,
        sharePath: `/i/${invitation.slug}`
      }
    });
  } catch (error) {
    console.error('Error generating invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invitation',
      error: error.message
    });
  }
};

// Get the current user's invitation (for editing / re-sharing)
exports.getMyInvitation = async (req, res) => {
  try {
    const userId = req.user.id;
    const invitation = await Invitation.findOne({ where: { userId } });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    res.status(200).json({
      success: true,
      invitation: {
        id: invitation.id,
        slug: invitation.slug,
        templateId: invitation.templateId,
        publicUrl: invitation.publicUrl,
        sharePath: `/i/${invitation.slug}`,
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        eventDate: invitation.eventDate,
        config: invitation.config,
        isPublished: invitation.isPublished,
        isPaid: invitation.isPaid,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invitation',
      error: error.message
    });
  }
};

// Public: resolve a shareable slug to its backend file URL
exports.getInvitationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const invitation = await Invitation.findOne({ where: { slug, isPublished: true } });

    if (!invitation || (invitation.expiresAt && invitation.expiresAt <= new Date())) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or expired'
      });
    }

    res.redirect(302, invitation.publicUrl);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invitation',
      error: error.message
    });
  }
};

async function cleanupExpiredInvitations() {
  const now = new Date();
  const invitations = await Invitation.findAll();
  const expiredInvitations = [];

  for (const invitation of invitations) {
    const expiresAt = invitation.expiresAt || new Date(new Date(invitation.updatedAt).getTime() + PREVIEW_TTL_MS);
    if (!invitation.expiresAt) {
      invitation.expiresAt = expiresAt;
      await invitation.save();
    }
    if (expiresAt <= now) {
      expiredInvitations.push(invitation);
    }
  }

  for (const invitation of expiredInvitations) {
    try {
      await fs.unlink(path.join(INVITATIONS_DIR, invitation.htmlFileName));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Could not delete expired invitation file ${invitation.htmlFileName}:`, error.message);
      }
    }
    await invitation.destroy();
  }

  if (expiredInvitations.length > 0) {
    console.log(`✓ Cleaned up ${expiredInvitations.length} expired invitation(s)`);
  }
}

exports.cleanupExpiredInvitations = cleanupExpiredInvitations;

exports.deleteInvitation = async (req, res) => {
  try {
    const userId = req.user.id;
    const invitation = await Invitation.findOne({ where: { userId } });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    try {
      const filePath = path.join(INVITATIONS_DIR, invitation.htmlFileName);
      await fs.unlink(filePath);
    } catch (error) {
      console.log('Invitation file not found, continuing...', error.message);
    }

    await invitation.destroy();

    res.status(200).json({
      success: true,
      message: 'Invitation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting invitation',
      error: error.message
    });
  }
};
