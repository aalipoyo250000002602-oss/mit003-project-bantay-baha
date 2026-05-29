import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './app/components/ThemeProvider';
import { TransportsModule } from './app/components/TransportsModule';
import './styles/index.css';

function ReportsPage() {
  return (
    <ThemeProvider>
      <TransportsModule />
    </ThemeProvider>
  );
}

document.title = 'Project BANTAY-BAHA Reports';

createRoot(document.getElementById('root')!).render(<ReportsPage />);
