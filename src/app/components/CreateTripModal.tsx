import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import {
  Package,
  MapPin,
  Calendar as CalendarIcon,
  User,
  Truck,
  DollarSign,
  Clock,
  AlertTriangle,
  Plus,
  Minus,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableDrivers = [
  { id: 'DRV001', name: 'Michael Johnson', status: 'Available', rating: 4.8 },
  { id: 'DRV002', name: 'Sarah Wilson', status: 'Available', rating: 4.9 },
  { id: 'DRV003', name: 'Carlos Rodriguez', status: 'Available', rating: 4.7 },
  { id: 'DRV004', name: 'Lisa Chen', status: 'Available', rating: 4.6 }
];

const availableVehicles = [
  { id: 'TRK001', name: 'Volvo VNL 860', type: 'Truck', capacity: '15,000 lbs', status: 'Available' },
  { id: 'VAN205', name: 'Ford Transit', type: 'Van', capacity: '8,500 lbs', status: 'Available' },
  { id: 'AIR102', name: 'Boeing 747 Cargo', type: 'Aircraft', capacity: '45,000 lbs', status: 'Available' },
  { id: 'SEA301', name: 'Container Ship', type: 'Ship', capacity: '125,000 lbs', status: 'Available' }
];

const customerOptions = [
  { id: 'CUST001', name: 'Acme Corporation', type: 'Premium' },
  { id: 'CUST002', name: 'Global Exports Ltd', type: 'Standard' },
  { id: 'CUST003', name: 'TechFlow Industries', type: 'Premium' },
  { id: 'CUST004', name: 'MedSupply Inc', type: 'Enterprise' }
];

export function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  
  const [tripData, setTripData] = useState({
    customer: '',
    origin: '',
    destination: '',
    distance: '',
    estimatedDuration: '',
    transportMode: '',
    priority: 'Medium',
    assignedDriver: '',
    assignedVehicle: '',
    cargo: {
      type: '',
      weight: '',
      dimensions: '',
      value: '',
      specialRequirements: [] as string[]
    },
    pricing: {
      baseRate: '',
      fuelSurcharge: '',
      additionalFees: '',
      totalEstimate: ''
    }
  });

  const specialRequirements = [
    'Temperature Control',
    'Fragile Handling',
    'Hazardous Materials',
    'Express Delivery',
    'White Glove Service',
    'Insurance Required'
  ];

  const handleSpecialRequirementChange = (requirement: string, checked: boolean) => {
    setTripData(prev => ({
      ...prev,
      cargo: {
        ...prev.cargo,
        specialRequirements: checked
          ? [...prev.cargo.specialRequirements, requirement]
          : prev.cargo.specialRequirements.filter(req => req !== requirement)
      }
    }));
  };

  const calculateEstimate = () => {
    const baseRate = parseFloat(tripData.pricing.baseRate) || 0;
    const fuelSurcharge = parseFloat(tripData.pricing.fuelSurcharge) || 0;
    const additionalFees = parseFloat(tripData.pricing.additionalFees) || 0;
    const total = baseRate + fuelSurcharge + additionalFees;
    
    setTripData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        totalEstimate: total.toFixed(2)
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      // Show success message
      alert('Trip created successfully! Trip ID: TR-2024-' + Math.floor(Math.random() * 1000));
    }, 2000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" />
              Create New Trip
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={tripData.customer} onValueChange={(value) => setTripData({...tripData, customer: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerOptions.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{customer.name}</span>
                              <Badge variant="outline" className="ml-2">{customer.type}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={tripData.priority} onValueChange={(value) => setTripData({...tripData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="High">High Priority</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin Address</Label>
                    <Input
                      id="origin"
                      placeholder="Enter pickup location"
                      value={tripData.origin}
                      onChange={(e) => setTripData({...tripData, origin: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination Address</Label>
                    <Input
                      id="destination"
                      placeholder="Enter delivery location"
                      value={tripData.destination}
                      onChange={(e) => setTripData({...tripData, destination: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance</Label>
                    <Input
                      id="distance"
                      placeholder="e.g., 250 miles"
                      value={tripData.distance}
                      onChange={(e) => setTripData({...tripData, distance: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 4h 30m"
                      value={tripData.estimatedDuration}
                      onChange={(e) => setTripData({...tripData, estimatedDuration: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mode">Transport Mode</Label>
                    <Select value={tripData.transportMode} onValueChange={(value) => setTripData({...tripData, transportMode: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="road">Road Transport</SelectItem>
                        <SelectItem value="air">Air Transport</SelectItem>
                        <SelectItem value="sea">Sea Transport</SelectItem>
                        <SelectItem value="rail">Rail Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pickup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : "Select pickup date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={setPickupDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "PPP") : "Select delivery date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Cargo Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Cargo Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargoType">Cargo Type</Label>
                    <Input
                      id="cargoType"
                      placeholder="e.g., Electronics, Medical Supplies"
                      value={tripData.cargo.type}
                      onChange={(e) => setTripData({...tripData, cargo: {...tripData.cargo, type: e.target.value}})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cargoValue">Cargo Value ($)</Label>
                    <Input
                      id="cargoValue"
                      placeholder="e.g., 125000"
                      value={tripData.cargo.value}
                      onChange={(e) => setTripData({...tripData, cargo: {...tripData.cargo, value: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      placeholder="e.g., 15,000 lbs"
                      value={tripData.cargo.weight}
                      onChange={(e) => setTripData({...tripData, cargo: {...tripData.cargo, weight: e.target.value}})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      placeholder="e.g., 8x6x6 ft"
                      value={tripData.cargo.dimensions}
                      onChange={(e) => setTripData({...tripData, cargo: {...tripData.cargo, dimensions: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Special Requirements</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {specialRequirements.map((requirement) => (
                      <div key={requirement} className="flex items-center space-x-2">
                        <Checkbox
                          id={requirement}
                          checked={tripData.cargo.specialRequirements.includes(requirement)}
                          onCheckedChange={(checked) => handleSpecialRequirementChange(requirement, checked as boolean)}
                        />
                        <Label htmlFor={requirement} className="text-sm">{requirement}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Resource Assignment */}
          {currentStep === 3 && (
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Assign Driver
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableDrivers.map((driver) => (
                      <div
                        key={driver.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          tripData.assignedDriver === driver.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => setTripData({...tripData, assignedDriver: driver.id})}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{driver.name}</h4>
                            <p className="text-sm text-muted-foreground">ID: {driver.id}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">{driver.status}</Badge>
                            <p className="text-sm text-muted-foreground">Rating: {driver.rating}/5</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Assign Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          tripData.assignedVehicle === vehicle.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => setTripData({...tripData, assignedVehicle: vehicle.id})}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{vehicle.name}</h4>
                            <p className="text-sm text-muted-foreground">{vehicle.type} • {vehicle.id}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">{vehicle.status}</Badge>
                            <p className="text-sm text-muted-foreground">{vehicle.capacity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Pricing & Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseRate">Base Rate ($)</Label>
                      <Input
                        id="baseRate"
                        type="number"
                        placeholder="2500"
                        value={tripData.pricing.baseRate}
                        onChange={(e) => setTripData({...tripData, pricing: {...tripData.pricing, baseRate: e.target.value}})}
                        onBlur={calculateEstimate}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fuelSurcharge">Fuel Surcharge ($)</Label>
                      <Input
                        id="fuelSurcharge"
                        type="number"
                        placeholder="375"
                        value={tripData.pricing.fuelSurcharge}
                        onChange={(e) => setTripData({...tripData, pricing: {...tripData.pricing, fuelSurcharge: e.target.value}})}
                        onBlur={calculateEstimate}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="additionalFees">Additional Fees ($)</Label>
                      <Input
                        id="additionalFees"
                        type="number"
                        placeholder="125"
                        value={tripData.pricing.additionalFees}
                        onChange={(e) => setTripData({...tripData, pricing: {...tripData.pricing, additionalFees: e.target.value}})}
                        onBlur={calculateEstimate}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="totalEstimate">Total Estimate ($)</Label>
                      <Input
                        id="totalEstimate"
                        value={tripData.pricing.totalEstimate}
                        disabled
                        className="font-semibold bg-muted"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Route</h4>
                        <p className="font-medium">{tripData.origin} → {tripData.destination}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Distance & Duration</h4>
                        <p className="font-medium">{tripData.distance} • {tripData.estimatedDuration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Transport Mode</h4>
                        <Badge variant="outline" className="capitalize">{tripData.transportMode}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Cargo</h4>
                        <p className="font-medium">{tripData.cargo.type} • {tripData.cargo.weight}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Priority</h4>
                        <Badge 
                          className={
                            tripData.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                            tripData.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            tripData.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }
                        >
                          {tripData.priority}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Total Cost</h4>
                        <p className="font-bold text-lg text-green-600">${tripData.pricing.totalEstimate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Next Step
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                      Creating Trip...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Create Trip
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}