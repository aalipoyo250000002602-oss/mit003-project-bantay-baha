import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { NotificationDropdown } from './navigation/NotificationDropdown';
import { UserProfileDropdown } from './navigation/UserProfileDropdown';
import { Menu, Droplet, CloudRain } from 'lucide-react';

interface TopNavigationProps {
  onMenuClick: () => void;
  onOpenUserProfile?: () => void;
}

interface WeatherSnapshot {
  locationLabel: string;
  maxTempF: number | null;
  precipitationPercent: number | null;
  precipitationInches: number | null;
}

const DAVAO_COORDINATES = {
  latitude: 7.0731,
  longitude: 125.6128,
};

const DEFAULT_LOCATION = 'Davao City, Philippines';

export function EnhancedTopNavigation({ onMenuClick, onOpenUserProfile }: TopNavigationProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherSnapshot>({
    locationLabel: DEFAULT_LOCATION,
    maxTempF: null,
    precipitationPercent: null,
    precipitationInches: null,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async (latitude: number, longitude: number, locationLabel: string) => {
      try {
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_probability_max,precipitation_sum&forecast_days=1&timezone=auto`,
        );

        if (!weatherResponse.ok) {
          return;
        }

        const weatherData = await weatherResponse.json();
        const maxTempC: number | undefined = weatherData?.daily?.temperature_2m_max?.[0];
        const precipitationPercent: number | undefined = weatherData?.daily?.precipitation_probability_max?.[0];
        const precipitationMm: number | undefined = weatherData?.daily?.precipitation_sum?.[0];

        if (cancelled) {
          return;
        }

        setWeather({
          locationLabel,
          maxTempF: typeof maxTempC === 'number' ? Math.round((maxTempC * 9) / 5 + 32) : null,
          precipitationPercent: typeof precipitationPercent === 'number' ? Math.round(precipitationPercent) : null,
          precipitationInches: typeof precipitationMm === 'number' ? Number((precipitationMm / 25.4).toFixed(2)) : null,
        });
      } catch {
        // Keep default values when weather provider is unavailable.
      }
    };

    const loadWithCoordinates = async (latitude: number, longitude: number) => {
      try {
        const reverseResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`,
        );

        if (reverseResponse.ok) {
          const reverseData = await reverseResponse.json();
          const place = reverseData?.results?.[0];
          if (place) {
            const locality = place.name ?? 'Current Location';
            const country = place.country ?? '';
            const dynamicLabel = country ? `${locality}, ${country}` : locality;
            await loadWeather(latitude, longitude, dynamicLabel);
            return;
          }
        }
      } catch {
        // Fall through to weather load with default label.
      }

      await loadWeather(latitude, longitude, DEFAULT_LOCATION);
    };

    const fallbackLoad = () => {
      void loadWeather(DAVAO_COORDINATES.latitude, DAVAO_COORDINATES.longitude, DEFAULT_LOCATION);
    };

    if (!navigator.geolocation) {
      fallbackLoad();
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadWithCoordinates(position.coords.latitude, position.coords.longitude);
      },
      () => {
        fallbackLoad();
      },
      {
        timeout: 5000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedDay = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: '2-digit',
    day: '2-digit',
  });

  const handleNotificationClick = (notificationId: string) => {
    // Handle notification click
    console.log('Notification clicked:', notificationId);
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMenuClick}
          className="hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Project BANTAY-BAHA</h1>
            <p className="text-xs text-muted-foreground">Flood Control Project Monitoring and Flood Surveillance System</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Weather Info */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-muted/30 rounded-lg border border-border/50">
          <CloudRain className="h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">{weather.locationLabel}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{formattedDay}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{weather.maxTempF === null ? 'High -- °F' : `High ${weather.maxTempF} °F`}</span>
              <span>•</span>
              <span>
                {weather.precipitationPercent === null || weather.precipitationInches === null
                  ? '--% Precip. / -- in'
                  : `${weather.precipitationPercent}% Precip. / ${weather.precipitationInches} in`}
              </span>
            </div>
          </div>
        </div>

        {/* Current Time */}
        <div className="hidden md:block text-sm text-muted-foreground">
          {currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>

        {/* Notifications */}
        <NotificationDropdown onNotificationClick={handleNotificationClick} />

        {/* User Profile */}
        <UserProfileDropdown onOpenProfile={onOpenUserProfile} />
      </div>
    </header>
  );
}