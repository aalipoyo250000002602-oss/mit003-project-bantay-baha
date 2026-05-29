import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './app/components/ThemeProvider';
import { TransportsModule } from './app/components/TransportsModule';
import { syncSavedFloodReportsFromUploads, type UploadManifestItem } from './app/components/utils/floodReportStorage';
import './styles/index.css';

type UploadManifestDisplayItem = UploadManifestItem & {
  bytes: number;
};

const formatSize = (bytes: number) => {
  if (bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const kindLabel: Record<UploadManifestItem['kind'], string> = {
  'processed-web': 'Processed (Web)',
  processed: 'Processed',
  uploaded: 'Original Upload',
};

function ExistingUploadsPanel() {
  const [items, setItems] = useState<UploadManifestDisplayItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetch('./uploads-manifest.json', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Unable to load upload manifest: ${response.status}`);
        }
        return response.json() as Promise<{ items?: UploadManifestDisplayItem[] }>;
      })
      .then((payload) => {
        const nextItems = Array.isArray(payload.items) ? payload.items : [];
        setItems(nextItems);
        syncSavedFloodReportsFromUploads(nextItems);
        window.dispatchEvent(new Event('flood-report-saved'));
        setStatus('ready');
      })
      .catch(() => {
        setStatus('error');
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-6">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Existing Uploaded Results</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Results below are loaded from the existing uploads folder and published to this reports page.
        </p>

        {status === 'loading' ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading existing uploads...</p>
        ) : null}

        {status === 'error' ? (
          <p className="mt-4 text-sm text-destructive">
            Upload manifest was not found. Run the build command to regenerate report assets.
          </p>
        ) : null}

        {status === 'ready' && items.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No uploaded videos are available yet.</p>
        ) : null}

        {status === 'ready' && items.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {items.map((item) => (
              <article
                key={item.fileName}
                className="rounded-lg border bg-background p-3"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {kindLabel[item.kind]}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatSize(item.bytes)}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.modifiedAt).toLocaleString()}
                  </span>
                </div>
                <p className="mb-2 text-sm font-medium text-foreground">{item.fileName}</p>
                <video className="w-full rounded-md" controls preload="metadata" src={item.url} />
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ReportsPage() {
  return (
    <ThemeProvider>
      <ExistingUploadsPanel />
      <TransportsModule />
    </ThemeProvider>
  );
}

document.title = 'Project BANTAY-BAHA Reports';

createRoot(document.getElementById('root')!).render(<ReportsPage />);
