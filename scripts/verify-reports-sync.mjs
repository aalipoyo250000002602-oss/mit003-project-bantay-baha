import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const uploadsDir = path.join(rootDir, 'uploads');
const publicUploadsDir = path.join(rootDir, 'public', 'uploads');
const docsUploadsDir = path.join(rootDir, 'docs', 'uploads');
const publicManifestPath = path.join(rootDir, 'public', 'uploads-manifest.json');
const docsManifestPath = path.join(rootDir, 'docs', 'uploads-manifest.json');

const allowedExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv']);

const readFiles = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((name) => {
      const fullPath = path.join(dirPath, name);
      const extension = path.extname(name).toLowerCase();
      return fs.statSync(fullPath).isFile() && allowedExtensions.has(extension);
    })
    .sort((a, b) => a.localeCompare(b));
};

const readManifestItems = (manifestPath) => {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing manifest: ${manifestPath}`);
  }

  const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  return items
    .map((item) => item?.fileName)
    .filter((name) => typeof name === 'string')
    .sort((a, b) => a.localeCompare(b));
};

const arraysEqual = (a, b) => a.length === b.length && a.every((item, index) => item === b[index]);

const uploads = readFiles(uploadsDir);
const publicUploads = readFiles(publicUploadsDir);
const docsUploads = readFiles(docsUploadsDir);
const publicManifestItems = readManifestItems(publicManifestPath);
const docsManifestItems = readManifestItems(docsManifestPath);

const checks = [
  {
    name: 'uploads -> public/uploads',
    ok: arraysEqual(uploads, publicUploads),
    left: uploads,
    right: publicUploads,
  },
  {
    name: 'uploads -> docs/uploads',
    ok: arraysEqual(uploads, docsUploads),
    left: uploads,
    right: docsUploads,
  },
  {
    name: 'uploads -> public/uploads-manifest.json',
    ok: arraysEqual(uploads, publicManifestItems),
    left: uploads,
    right: publicManifestItems,
  },
  {
    name: 'uploads -> docs/uploads-manifest.json',
    ok: arraysEqual(uploads, docsManifestItems),
    left: uploads,
    right: docsManifestItems,
  },
];

const failed = checks.filter((check) => !check.ok);

if (failed.length > 0) {
  console.error('Report sync verification failed.');
  for (const check of failed) {
    console.error(`\n[${check.name}] mismatch`);
    console.error(`Expected (${check.left.length}): ${check.left.join(', ') || '(empty)'}`);
    console.error(`Actual   (${check.right.length}): ${check.right.join(', ') || '(empty)'}`);
  }
  process.exit(1);
}

console.log('Report sync verification passed.');
console.log(`Files: ${uploads.length}`);
