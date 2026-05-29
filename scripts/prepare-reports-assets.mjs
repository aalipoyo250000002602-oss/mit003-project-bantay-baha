import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.join(rootDir, 'uploads');
const reportsDataSourcePath = path.join(rootDir, 'reports-data.json');
const publicDir = path.join(rootDir, 'public');
const publicUploadsDir = path.join(publicDir, 'uploads');
const manifestPath = path.join(publicDir, 'uploads-manifest.json');
const publicReportsDataPath = path.join(publicDir, 'reports-data.json');

const allowedExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv']);

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const clearDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
};

const classifyFile = (fileName) => {
  if (fileName.includes('-analytics-web')) {
    return 'processed-web';
  }
  if (fileName.includes('-analytics')) {
    return 'processed';
  }
  return 'uploaded';
};

const safeCopyUploads = () => {
  ensureDir(publicDir);
  ensureDir(publicUploadsDir);
  clearDirectory(publicUploadsDir);

  if (!fs.existsSync(uploadsDir)) {
    fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), items: [] }, null, 2));
    return;
  }

  const entries = fs
    .readdirSync(uploadsDir)
    .map((name) => ({
      name,
      sourcePath: path.join(uploadsDir, name),
    }))
    .filter(({ sourcePath, name }) => {
      const stat = fs.statSync(sourcePath);
      const extension = path.extname(name).toLowerCase();
      return stat.isFile() && allowedExtensions.has(extension);
    })
    .map(({ name, sourcePath }) => {
      const stat = fs.statSync(sourcePath);
      return {
        name,
        sourcePath,
        bytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
        kind: classifyFile(name),
      };
    })
    .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

  for (const entry of entries) {
    fs.copyFileSync(entry.sourcePath, path.join(publicUploadsDir, entry.name));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: entries.length,
    items: entries.map((entry) => ({
      fileName: entry.name,
      bytes: entry.bytes,
      modifiedAt: entry.modifiedAt,
      kind: entry.kind,
      url: `./uploads/${entry.name}`,
    })),
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
};

const syncReportsData = () => {
  const fallback = {
    generatedAt: new Date().toISOString(),
    total: 0,
    items: [],
  };

  if (!fs.existsSync(reportsDataSourcePath)) {
    fs.writeFileSync(publicReportsDataPath, JSON.stringify(fallback, null, 2));
    return;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(reportsDataSourcePath, 'utf8'));
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    fs.writeFileSync(
      publicReportsDataPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          total: items.length,
          items,
        },
        null,
        2,
      ),
    );
  } catch {
    fs.writeFileSync(publicReportsDataPath, JSON.stringify(fallback, null, 2));
  }
};

safeCopyUploads();
syncReportsData();
console.log(`Prepared ${manifestPath} and copied uploads into ${publicUploadsDir}`);
