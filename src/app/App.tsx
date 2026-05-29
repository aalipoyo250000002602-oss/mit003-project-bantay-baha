import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { EnhancedTopNavigation } from './components/EnhancedTopNavigation';
import { EnhancedSidebar } from './components/EnhancedSidebar';
import { DriversModule } from './components/DriversModule';
import { VehiclesModule } from './components/VehiclesModule';
import { TransportsModule } from './components/TransportsModule';
import { RoutesModule } from './components/RoutesModule';
import { RevenueModule } from './components/RevenueModule';
import { SettingsModule } from './components/SettingsModule';
import { LogsModule } from './components/LogsModule';
import { clearVideoAnalysisDraft, readVideoAnalysisDraft } from './components/utils/videoAnalysisDraftStorage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';

// Modal Components
import { UserProfileModal } from './components/UserProfileModal';
import { CreateTripModal } from './components/CreateTripModal';
import { RouteOptimizationModal, AnalyticsModal, AlertsModal, GenerateReportModal } from './components/QuickActionModals';

export default function App() {
  type UnsavedProcessedVideoPrompt = {
    reason: 'leave' | 'background';
    pendingModule?: string;
  };

  // Set document title
  useEffect(() => {
    document.title = 'Project BANTAY-BAHA';
  }, []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('transports');
  const [unsavedVideoPrompt, setUnsavedVideoPrompt] = useState<UnsavedProcessedVideoPrompt | null>(null);

  const handleDiscardProcessedVideo = () => {
    const pendingModule = unsavedVideoPrompt?.pendingModule;
    clearVideoAnalysisDraft();
    setUnsavedVideoPrompt(null);

    if (pendingModule) {
      setActiveModule(pendingModule);
    }
  };

  const handleSaveProcessedVideoNow = () => {
    setUnsavedVideoPrompt(null);
    setActiveModule('vehicles');
  };

  const handleModuleChange = (nextModule: string) => {
    if (nextModule === activeModule) {
      return;
    }

    if (activeModule === 'vehicles') {
      const draft = readVideoAnalysisDraft();
      if (draft?.status === 'ready') {
        setUnsavedVideoPrompt({
          reason: 'leave',
          pendingModule: nextModule,
        });
        return;
      }
    }

    setActiveModule(nextModule);
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app-active-module-changed', {
        detail: { module: activeModule },
      }),
    );
  }, [activeModule]);

  useEffect(() => {
    const handleBackgroundAnalysisReady = () => {
      if (activeModule === 'vehicles') {
        return;
      }

      setUnsavedVideoPrompt((prev) => prev ?? { reason: 'background' });
    };

    window.addEventListener('video-analysis-ready-unsaved', handleBackgroundAnalysisReady);
    return () => {
      window.removeEventListener('video-analysis-ready-unsaved', handleBackgroundAnalysisReady);
    };
  }, [activeModule]);

  // Modal States
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [routeOptimizationOpen, setRouteOptimizationOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);

  // Global action handlers that can be called from any component
  const globalActions = {
    openUserProfile: () => setUserProfileOpen(true),
    openCreateTrip: () => setCreateTripOpen(true),
    openRouteOptimization: () => setRouteOptimizationOpen(true),
    openAnalytics: () => setAnalyticsOpen(true),
    openAlerts: () => setAlertsOpen(true),
    openGenerateReport: () => setGenerateReportOpen(true),
    navigateToModule: (module: string) => handleModuleChange(module)
  };

  const renderContent = () => {
    const commonProps = {
      onOpenCreateTrip: globalActions.openCreateTrip,
      onOpenRouteOptimization: globalActions.openRouteOptimization,
      onOpenAnalytics: globalActions.openAnalytics,
      onOpenAlerts: globalActions.openAlerts,
      onOpenGenerateReport: globalActions.openGenerateReport,
      onNavigateToModule: globalActions.navigateToModule
    };

    switch (activeModule) {
      case 'transports':
        return <TransportsModule {...commonProps} />;

      case 'vehicles':
        return <VehiclesModule {...commonProps} />;

      case 'drivers':
        return <DriversModule {...commonProps} />;

      case 'routes':
        return <RoutesModule {...commonProps} />;

      case 'revenue':
        return <RevenueModule {...commonProps} />;

      case 'logs':
        return <LogsModule {...commonProps} />;

      case 'settings':
        return <SettingsModule {...commonProps} />;
      
      default:
        return <VehiclesModule {...commonProps} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-background transition-colors">
        {/* Enhanced Top Navigation */}
        <EnhancedTopNavigation 
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenUserProfile={globalActions.openUserProfile}
        />
        
        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Enhanced Sidebar */}
          <EnhancedSidebar
            collapsed={sidebarCollapsed}
            onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeModule={activeModule}
            onModuleChange={handleModuleChange}
            onOpenRouteOptimization={globalActions.openRouteOptimization}
            onOpenAnalytics={globalActions.openAnalytics}
            onOpenAlerts={globalActions.openAlerts}
            onOpenGenerateReport={globalActions.openGenerateReport}
          />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="min-h-full">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Global Modals */}
        <UserProfileModal
          isOpen={userProfileOpen}
          onClose={() => setUserProfileOpen(false)}
        />

        <CreateTripModal
          isOpen={createTripOpen}
          onClose={() => setCreateTripOpen(false)}
        />

        <RouteOptimizationModal
          isOpen={routeOptimizationOpen}
          onClose={() => setRouteOptimizationOpen(false)}
        />

        <AnalyticsModal
          isOpen={analyticsOpen}
          onClose={() => setAnalyticsOpen(false)}
        />

        <AlertsModal
          isOpen={alertsOpen}
          onClose={() => setAlertsOpen(false)}
        />

        <GenerateReportModal
          isOpen={generateReportOpen}
          onClose={() => setGenerateReportOpen(false)}
        />

        <AlertDialog
          open={Boolean(unsavedVideoPrompt)}
          onOpenChange={(open) => {
            if (!open) {
              setUnsavedVideoPrompt(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Processed Video Not Yet Saved</AlertDialogTitle>
              <AlertDialogDescription>
                {unsavedVideoPrompt?.reason === 'leave'
                  ? 'The processed video is ready but not saved yet. Would you like to save it now before leaving this page?'
                  : 'Background processing has finished and the processed video is not saved yet. Would you like to save it now?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleSaveProcessedVideoNow}>
                Save Processed Video
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDiscardProcessedVideo}
              >
                Discard And Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ThemeProvider>
  );
}