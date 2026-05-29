import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function FiltersModal({ isOpen, onClose, onApply }: FiltersModalProps) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    vehicleType: 'all',
    priority: 'all',
    revenue: { min: '', max: '' },
    distance: { min: '', max: '' },
    drivers: [],
    customers: [],
    includeCompleted: true,
    includeScheduled: true,
    includeInTransit: true
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: 'all',
      vehicleType: 'all',
      priority: 'all',
      revenue: { min: '', max: '' },
      distance: { min: '', max: '' },
      drivers: [],
      customers: [],
      includeCompleted: true,
      includeScheduled: true,
      includeInTransit: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Advanced Filters
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Search Filter */}
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by trip ID, customer, route..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <Separator />

          {/* Status & Type Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Trip Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select value={filters.vehicleType} onValueChange={(value) => setFilters({ ...filters, vehicleType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="road">Road Transport</SelectItem>
                  <SelectItem value="air">Air Transport</SelectItem>
                  <SelectItem value="sea">Sea Transport</SelectItem>
                  <SelectItem value="rail">Rail Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Revenue Range ($)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  value={filters.revenue.min}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    revenue: { ...filters.revenue, min: e.target.value }
                  })}
                />
                <Input
                  placeholder="Max"
                  value={filters.revenue.max}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    revenue: { ...filters.revenue, max: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Distance Range (miles)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  value={filters.distance.min}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    distance: { ...filters.distance, min: e.target.value }
                  })}
                />
                <Input
                  placeholder="Max"
                  value={filters.distance.max}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    distance: { ...filters.distance, max: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Checkboxes */}
          <div className="space-y-3">
            <Label>Include Trip Types</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  checked={filters.includeCompleted}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeCompleted: checked as boolean })}
                />
                <Label htmlFor="completed">Completed Trips</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheduled"
                  checked={filters.includeScheduled}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeScheduled: checked as boolean })}
                />
                <Label htmlFor="scheduled">Scheduled Trips</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-transit"
                  checked={filters.includeInTransit}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeInTransit: checked as boolean })}
                />
                <Label htmlFor="in-transit">In Transit</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}