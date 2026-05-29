import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface TimePeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (period: string) => void;
  currentPeriod?: string;
}

const timePeriods = [
  { value: '7d', label: 'Last 7 days', description: 'Past week data' },
  { value: '30d', label: 'Last 1 month', description: 'Past 30 days data' },
  { value: '3m', label: 'Last 3 months', description: 'Quarterly data' },
  { value: '6m', label: 'Last 6 months', description: 'Semi-annual data' },
  { value: '1y', label: 'Last 1 year', description: 'Annual data' },
  { value: 'ytd', label: 'Year to date', description: 'From Jan 1 to now' },
  { value: 'custom', label: 'Custom range', description: 'Select specific dates' }
];

export function TimePeriodModal({ isOpen, onClose, onSelect, currentPeriod = '7d' }: TimePeriodModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);

  const handleSelect = () => {
    onSelect(selectedPeriod);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Select Time Period
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {timePeriods.map((period) => (
            <div
              key={period.value}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                selectedPeriod === period.value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'border-border'
              }`}
              onClick={() => setSelectedPeriod(period.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{period.label}</span>
                    {selectedPeriod === period.value && (
                      <Badge variant="default" className="text-xs">Selected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{period.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSelect} className="flex-1">
            Apply Period
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}