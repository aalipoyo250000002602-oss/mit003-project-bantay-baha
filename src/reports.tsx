import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './app/components/ThemeProvider';
import { TransportsModule } from './app/components/TransportsModule';
import { VehiclesModule } from './app/components/VehiclesModule';
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
  const [filteredUploads, setFilteredUploads] = useState<UploadManifestDisplayItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // Fetch both manifest and reports-data.json
    Promise.all([
      fetch('./uploads-manifest.json', { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('Unable to load upload manifest');
          return res.json();
        }),
      fetch('./reports-data.json', { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('Unable to load reports-data.json');
          return res.json();
        })
    ])
      .then(([manifest, reportsData]) => {
        const manifestItems = Array.isArray(manifest.items) ? manifest.items : [];
        const referencedUrls = new Set(
          (Array.isArray(reportsData.items) ? reportsData.items : [])
            .map((r) => r.processedVideoUrl?.replace(/^\.\/?/, './'))
        );
        const filtered = manifestItems.filter((item) => referencedUrls.has(item.url?.replace(/^\.\/?/, './')));
        if (isMounted) {
          setFilteredUploads(filtered);
          syncSavedFloodReportsFromUploads(filtered);
          window.dispatchEvent(new Event('flood-report-saved'));
          setStatus('ready');
        }
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
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

        {status === 'ready' && filteredUploads.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No uploaded videos are available yet.</p>
        ) : null}

        {status === 'ready' && filteredUploads.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {filteredUploads.map((item) => (
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
  const [activeView, setActiveView] = useState<'reports' | 'analyze'>('reports');

  return (
    <ThemeProvider>
      <section className="mx-auto w-full max-w-6xl px-6 pt-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveView('reports')}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              activeView === 'reports'
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Reports View
          </button>
          <button
            type="button"
            onClick={() => setActiveView('analyze')}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              activeView === 'analyze'
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Analyze New Video
          </button>
        </div>
      </section>

      {activeView === 'reports' ? (
        <>
          <ExistingUploadsPanel />
          <TransportsModule />
        </>
      ) : (
        <VehiclesModule />
      )}
    </ThemeProvider>
  );
}

document.title = 'Project BANTAY-BAHA Reports';

createRoot(document.getElementById('root')!).render(<ReportsPage />);
