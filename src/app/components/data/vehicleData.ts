export const worldVehicleData = [
  // Davao Rivers
  {
    id: 'TRK-001',
    name: 'Volvo VNL 860',
    type: 'road',
    status: 'In Transit',
    driver: {
      name: 'Michael Johnson',
      photo: 'https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Davao River Station', country: 'Davao River', lat: 40.7128, lng: -74.0060 },
    destination: 'Boston, MA',
    speed: '65 mph',
    fuelLevel: 78,
    eta: '2h 15m',
    mapPosition: { x: '25%', y: '35%' }
  },
  {
    id: 'VAN-205',
    name: 'Ford Transit',
    type: 'road',
    status: 'Loading',
    driver: {
      name: 'Sarah Wilson',
      photo: 'https://images.unsplash.com/photo-1622175691858-a4deb912838e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Matina River Station', country: 'Matina River', lat: 33.9425, lng: -118.4081 },
    destination: 'San Francisco, CA',
    speed: '0 mph',
    fuelLevel: 42,
    eta: 'Loading...',
    mapPosition: { x: '15%', y: '42%' }
  },
  {
    id: 'EUR-301',
    name: 'Mercedes Actros',
    type: 'road',
    status: 'In Transit',
    driver: {
      name: 'Hans Mueller',
      photo: 'https://images.unsplash.com/photo-1710242078536-fe62a305a86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Talomo River Station', country: 'Talomo River', lat: 52.5200, lng: 13.4050 },
    destination: 'Paris, France',
    speed: '90 km/h',
    fuelLevel: 67,
    eta: '8h 30m',
    mapPosition: { x: '52%', y: '28%' }
  },
  {
    id: 'UK-102',
    name: 'Scania R730',
    type: 'road',
    status: 'Delivered',
    driver: {
      name: 'James Wilson',
      photo: 'https://images.unsplash.com/photo-1659353740059-5554fb2ac89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhkZWxpdmVyeSUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Lipadas River Station', country: 'Lipadas River', lat: 51.5074, lng: -0.1278 },
    destination: 'Completed',
    speed: '0 mph',
    fuelLevel: 23,
    eta: 'Delivered',
    mapPosition: { x: '48%', y: '25%' }
  },
  {
    id: 'AIR-505',
    name: 'Boeing 747 Cargo',
    type: 'air',
    status: 'In Transit',
    driver: {
      name: 'Captain Tanaka',
      photo: 'https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Bunawan River Station', country: 'Bunawan River', lat: 35.6762, lng: 139.6503 },
    destination: 'Seoul, South Korea',
    speed: '950 km/h',
    fuelLevel: 91,
    eta: '1h 45m',
    mapPosition: { x: '85%', y: '38%' }
  },
  {
    id: 'CN-203',
    name: 'FAW Jiefang J6',
    type: 'road',
    status: 'In Transit',
    driver: {
      name: 'Li Wei',
      photo: 'https://images.unsplash.com/photo-1622175691858-a4deb912838e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Lasang River Station', country: 'Lasang River', lat: 31.2304, lng: 121.4737 },
    destination: 'Hong Kong',
    speed: '80 km/h',
    fuelLevel: 58,
    eta: '12h 30m',
    mapPosition: { x: '82%', y: '45%' }
  },
  {
    id: 'SEA-401',
    name: 'Container Ship Pacific',
    type: 'sea',
    status: 'In Transit',
    driver: {
      name: 'Captain Martinez',
      photo: 'https://images.unsplash.com/photo-1659353740059-5554fb2ac89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhkZWxpdmVyeSUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Pacific Ocean', country: 'International Waters', lat: 36.7783, lng: -150.4179 },
    destination: 'Yokohama Port',
    speed: '22 knots',
    fuelLevel: 65,
    eta: '8 days',
    mapPosition: { x: '35%', y: '55%' }
  },
  {
    id: 'AUS-106',
    name: 'Kenworth T909',
    type: 'road',
    status: 'Maintenance',
    driver: {
      name: 'Steve Cooper',
      photo: 'https://images.unsplash.com/photo-1710242078536-fe62a305a86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Sydney, Australia', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    destination: 'Melbourne',
    speed: '0 km/h',
    fuelLevel: 15,
    eta: 'In Service',
    mapPosition: { x: '88%', y: '78%' }
  },
  {
    id: 'BR-204',
    name: 'Volkswagen Constellation',
    type: 'road',
    status: 'In Transit',
    driver: {
      name: 'Carlos Silva',
      photo: 'https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'São Paulo, Brazil', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
    destination: 'Rio de Janeiro',
    speed: '75 km/h',
    fuelLevel: 73,
    eta: '4h 15m',
    mapPosition: { x: '32%', y: '72%' }
  }
];

export const filterOptions = [
  { key: 'all', label: 'All Vehicles' },
  { key: 'active', label: 'Active Only' },
  { key: 'road', label: 'Road' },
  { key: 'air', label: 'Air' },
  { key: 'sea', label: 'Sea' }
];