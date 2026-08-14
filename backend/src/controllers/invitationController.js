const fs = require('fs').promises;
const path = require('path');
const Invitation = require('../models/Invitation');

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
async function upsertInvitationRecord(userId, { templateId, htmlFileName, publicUrl, brideName, groomName, eventDate, config }) {
  let invitation = await Invitation.findOne({ where: { userId } });

  const resolvedBrideName = brideName || config.brideFull;
  const resolvedGroomName = groomName || config.groomFull;
  const resolvedEventDate = eventDate || deriveEventDate(config);

  if (invitation) {
    invitation.templateId = templateId;
    invitation.htmlFileName = htmlFileName;
    invitation.publicUrl = publicUrl;
    invitation.brideName = resolvedBrideName;
    invitation.groomName = resolvedGroomName;
    invitation.eventDate = resolvedEventDate;
    invitation.config = config;
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
      config
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
async function buildInvitationHtml(templateId, config) {
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
    const { templateId, config } = req.body;

    if (!templateId || !config || !config.groomFull || !config.brideFull) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: templateId and config (with groomFull/brideFull) are required'
      });
    }

    await ensureInvitationsDir();

    const htmlContent = await buildInvitationHtml(templateId, config);
    const htmlFileName = `invitation-${userId}.html`;
    const outputPath = path.join(INVITATIONS_DIR, htmlFileName);
    await fs.writeFile(outputPath, htmlContent, 'utf-8');
    try {
      await fs.chmod(outputPath, 0o644);
    } catch (error) {
      console.log('Could not set file permissions:', error.message);
    }

    const publicUrl = `/invitations/${htmlFileName}`;

    // Persist the invitation (including uploaded photo URLs inside config)
    // to the database as soon as the user previews it, not only when they
    // explicitly generate a shareable link.
    await upsertInvitationRecord(userId, {
      templateId,
      htmlFileName,
      publicUrl,
      config
    });

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
    const { templateId, config, brideName, groomName, eventDate } = req.body;

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
    const htmlFileName = `invitation-${userId}.html`;
    const publicUrl = `/invitations/${htmlFileName}`;

    // Always (re)generate the final HTML file so it reflects the latest content
    const htmlContent = await buildInvitationHtml(templateId, config);
    const outputPath = path.join(INVITATIONS_DIR, htmlFileName);
    await fs.writeFile(outputPath, htmlContent, 'utf-8');
    try {
      await fs.chmod(outputPath, 0o644);
    } catch (error) {
      console.log('Could not set file permissions:', error.message);
    }

    const invitation = await upsertInvitationRecord(userId, {
      templateId,
      htmlFileName,
      publicUrl,
      brideName,
      groomName,
      eventDate,
      config
    });

    res.status(200).json({
      success: true,
      message: 'Invitation link generated successfully',
      invitation: {
        id: invitation.id,
        slug: invitation.slug,
        templateId: invitation.templateId,
        publicUrl: invitation.publicUrl,
        sharePath: `/invitation/view/${invitation.slug}`
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
        sharePath: `/invitation/view/${invitation.slug}`,
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        eventDate: invitation.eventDate,
        config: invitation.config,
        isPublished: invitation.isPublished
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

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    res.status(200).json({
      success: true,
      invitation: {
        slug: invitation.slug,
        templateId: invitation.templateId,
        publicUrl: invitation.publicUrl
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
