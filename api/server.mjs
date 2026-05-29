import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.join(rootDir, 'uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const port = Number(process.env.API_PORT || 8787);
const maxBodyBytes = 350 * 1024 * 1024;

const getPythonExecutable = () => {
  const envPython = process.env.PYTHON_MONITOR_PYTHON;
  if (envPython && envPython.trim()) {
    return envPython;
  }
  return path.join(rootDir, '.venv', 'Scripts', 'python.exe');
};

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(payload));
};

const sendFile = (res, absolutePath) => {
  if (!fs.existsSync(absolutePath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const contentType =
    ext === '.mp4'
      ? 'video/mp4'
      : ext === '.mov'
        ? 'video/quicktime'
        : ext === '.avi'
          ? 'video/x-msvideo'
          : ext === '.mkv'
            ? 'video/x-matroska'
            : 'application/octet-stream';

  const stat = fs.statSync(absolutePath);
  const fileSize = stat.size;
  const rangeHeader = res.req?.headers?.range;

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', contentType);

  if (rangeHeader && /^bytes=\d*-\d*$/.test(rangeHeader)) {
    const [startRaw, endRaw] = rangeHeader.replace('bytes=', '').split('-');
    const start = startRaw ? Number.parseInt(startRaw, 10) : 0;
    const end = endRaw ? Number.parseInt(endRaw, 10) : fileSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= fileSize) {
      res.statusCode = 416;
      res.setHeader('Content-Range', `bytes */${fileSize}`);
      res.end();
      return;
    }

    const clampedEnd = Math.min(end, fileSize - 1);
    const chunkSize = clampedEnd - start + 1;

    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${clampedEnd}/${fileSize}`);
    res.setHeader('Content-Length', String(chunkSize));
    fs.createReadStream(absolutePath, { start, end: clampedEnd }).pipe(res);
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Length', String(fileSize));
  fs.createReadStream(absolutePath).pipe(res);
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBodyBytes) {
        reject(new Error('Payload too large.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', (error) => reject(error));
  });

const sanitizeExt = (filename) => {
  const ext = path.extname(filename || '').toLowerCase();
  const allowed = new Set(['.mp4', '.mov', '.avi', '.mkv']);
  return allowed.has(ext) ? ext : '.mp4';
};

const transcodeForWeb = (inputPath, outputPath) =>
  new Promise((resolve) => {
    const args = [
      '-y',
      '-i',
      inputPath,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
      outputPath,
    ];

    const ffmpeg = spawn('ffmpeg', args, { cwd: rootDir });
    ffmpeg.on('error', () => resolve(false));
    ffmpeg.on('close', (code) => resolve(code === 0));
  });

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: 'Invalid request URL.' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/uploads/')) {
    const fileName = path.basename(req.url.replace('/uploads/', ''));
    const absolutePath = path.join(uploadsDir, fileName);
    sendFile(res, absolutePath);
    return;
  }

  if (req.method === 'POST' && req.url === '/api/analyze-video') {
    try {
      const payload = await readJsonBody(req);
      const base64 = typeof payload?.base64Video === 'string' ? payload.base64Video : '';
      const fileName = typeof payload?.fileName === 'string' ? payload.fileName : 'upload.mp4';

      if (!base64) {
        sendJson(res, 400, { error: 'Missing base64Video in request body.' });
        return;
      }

      const fileBuffer = Buffer.from(base64, 'base64');
      const ext = sanitizeExt(fileName);
      const stem = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const uploadedPath = path.join(uploadsDir, `${stem}${ext}`);
      const outputPath = path.join(uploadsDir, `${stem}-analytics.mp4`);
      const webOutputPath = path.join(uploadsDir, `${stem}-analytics-web.mp4`);

      fs.writeFileSync(uploadedPath, fileBuffer);

      const pythonExe = getPythonExecutable();
      const monitorPath = path.join(rootDir, 'river_monitoring', 'monitor.py');
      const args = [monitorPath, '--video', uploadedPath, '--output', outputPath];

      let stdout = '';
      let stderr = '';

      const child = spawn(pythonExe, args, { cwd: rootDir });

      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('error', (error) => {
        sendJson(res, 500, { error: `Failed to start monitor.py: ${String(error)}` });
      });

      child.on('close', (code) => {
        if (code !== 0) {
          sendJson(res, 500, {
            error: `monitor.py failed with exit code ${code}`,
            details: stderr || stdout,
          });
          return;
        }

        const boundaryMatch = stdout.match(
          /Boundary points summary:\s*total=(\d+),\s*average_per_frame=([0-9]+(?:\.[0-9]+)?)/,
        );
        const boundaryPointsTotal = boundaryMatch ? Number.parseInt(boundaryMatch[1], 10) : null;
        const boundaryPointsAveragePerFrame = boundaryMatch ? Number.parseFloat(boundaryMatch[2]) : null;

        const flowMatch = stdout.match(
          /Flow particles summary:\s*total=(\d+),\s*average_per_frame=([0-9]+(?:\.[0-9]+)?),\s*average_speed=([0-9]+(?:\.[0-9]+)?)/,
        );
        const flowParticlesTotal = flowMatch ? Number.parseInt(flowMatch[1], 10) : null;
        const flowParticlesAveragePerFrame = flowMatch ? Number.parseFloat(flowMatch[2]) : null;
        const flowParticlesAverageSpeed = flowMatch ? Number.parseFloat(flowMatch[3]) : null;

        const flowFrameMatches = [...stdout.matchAll(/Frame\s+(\d+):\s+flow particles\s*=\s*(\d+),\s*avg speed\s*=\s*([0-9]+(?:\.[0-9]+)?)/g)];
        const flowParticleFrames = flowFrameMatches.map((match) => ({
          frame: Number.parseInt(match[1], 10),
          flowParticles: Number.parseInt(match[2], 10),
          avgSpeed: Number.parseFloat(match[3]),
        }));

        if (!fs.existsSync(outputPath)) {
          sendJson(res, 500, { error: 'monitor.py completed but no processed video was produced.' });
          return;
        }

        transcodeForWeb(outputPath, webOutputPath).then((ok) => {
          const finalPath = ok && fs.existsSync(webOutputPath) ? webOutputPath : outputPath;
          sendJson(res, 200, {
            processedVideoUrl: `/uploads/${path.basename(finalPath)}`,
            boundaryPointsTotal,
            boundaryPointsAveragePerFrame,
            flowParticlesTotal,
            flowParticlesAveragePerFrame,
            flowParticlesAverageSpeed,
            flowParticleFrames,
          });
        });
      });
    } catch (error) {
      sendJson(res, 400, { error: `Invalid JSON payload: ${String(error)}` });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found.' });
});

server.listen(port, () => {
  console.log(`Video analysis API listening on http://localhost:${port}`);
});
