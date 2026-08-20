import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MARKER = '<!-- VNV_BETA_PROGRAM_V2 -->';
const LEGACY_MARKER = '<!-- VNV_BETA_PROGRAM_V1 -->';
const SCRIPT_URL = 'https://vervenveda.com/assets/vnv-beta-link.js';
const BETA_URL = 'https://vervenveda.com/beta/';
const EXCLUDE_DIRS = new Set([
  '.git', '.github', 'node_modules', 'vendor',
  'archive', 'archives', 'backup', 'backups', 'deprecated', 'private'
]);

const CHECK_ONLY = process.argv.includes('--check');

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && EXCLUDE_DIRS.has(entry.name.toLowerCase())) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.isFile() && isVisibleIndexName(entry.name)) out.push(full);
  }
  return out;
}

function isVisibleIndexName(name) {
  const lower = name.toLowerCase();
  return lower === 'index.html' || lower === 'inndex.html' || lower.endsWith('_index.html') || lower.endsWith('-index.html');
}

function relPath(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function sourceLabel(file) {
  return `Khaemenes_Elementary.github.io/${relPath(file)}`;
}

function safeSource(file) {
  return encodeURIComponent(sourceLabel(file).replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 320));
}

function cspContent(html) {
  const match = html.match(/<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i);
  return match?.[1] || '';
}

function scriptsForbidden(html) {
  const csp = cspContent(html);
  if (!csp) return false;
  return /(?:^|;)\s*script-src(?:-elem)?\s+[^;]*'none'[^;]*(?:;|$)/i.test(csp);
}

function fallbackLink(file) {
  return `<a id="vnvBetaProgramFallback" href="${BETA_URL}?source=${safeSource(file)}&surface=interactive-index" aria-label="Open the Verve N Veda Beta Program for this page">β Beta Program</a>`;
}

function widgetBlock(file, noScript = false) {
  const fallback = fallbackLink(file);
  if (noScript) {
    return `\n${MARKER}\n${fallback}\n`;
  }
  return `\n${MARKER}\n${fallback}\n<script src="${SCRIPT_URL}" defer data-vnv-beta-program="2"></script>\n`;
}

function stripLegacyBeta(html) {
  let out = html;
  // Remove canonical/legacy Beta widget script tags so exactly one controlled copy is installed.
  out = out.replace(/\s*<script\b[^>]*src=["'][^"']*vnv-beta-link\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, '\n');
  // Remove the canonical fallback anchor when present; it will be rebuilt with safe source metadata.
  out = out.replace(/\s*<a\b[^>]*id=["']vnvBetaProgramFallback["'][^>]*>[\s\S]*?<\/a>\s*/gi, '\n');
  out = out.replace(new RegExp(`\\s*${escapeRegExp(MARKER)}\\s*`, 'g'), '\n');
  out = out.replace(new RegExp(`\\s*${escapeRegExp(LEGACY_MARKER)}\\s*`, 'g'), '\n');
  return out;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function inject(html, file) {
  const closeBodyMatches = [...html.matchAll(/<\/body\s*>/gi)];
  if (!closeBodyMatches.length) return { html, status: 'missing-body-close' };

  const cleaned = stripLegacyBeta(html);
  const finalBodyMatches = [...cleaned.matchAll(/<\/body\s*>/gi)];
  const pos = finalBodyMatches.at(-1).index;
  const block = widgetBlock(file, scriptsForbidden(cleaned));
  const updated = cleaned.slice(0, pos).replace(/\s+$/, '') + block + cleaned.slice(pos);
  return { html: updated, status: scriptsForbidden(cleaned) ? 'fallback-only-csp' : 'widget' };
}

const files = await walk(ROOT);
const changed = [];
const compliant = [];
const skipped = [];

for (const file of files) {
  let original;
  try {
    original = await fs.readFile(file, 'utf8');
  } catch (error) {
    skipped.push({ file: relPath(file), reason: `read-failed:${error.code || 'unknown'}` });
    continue;
  }

  const result = inject(original, file);
  if (result.status === 'missing-body-close') {
    skipped.push({ file: relPath(file), reason: result.status });
    continue;
  }

  if (result.html === original) {
    compliant.push({ file: relPath(file), mode: result.status });
    continue;
  }

  changed.push({ file: relPath(file), mode: result.status });
  if (!CHECK_ONLY) await fs.writeFile(file, result.html, 'utf8');
}

const report = {
  version: 2,
  scanned: files.length,
  compliant: compliant.length,
  changed: changed.length,
  skipped: skipped.length,
  checkOnly: CHECK_ONLY,
  changedFiles: changed,
  skippedFiles: skipped
};

console.log(JSON.stringify(report, null, 2));

if (CHECK_ONLY && (changed.length || skipped.length)) {
  process.exitCode = 1;
}
