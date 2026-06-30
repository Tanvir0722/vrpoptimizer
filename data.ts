import { Customer, Depot, ObjectiveWeights, Vehicle } from './types';

export const DEFAULT_DEPOT: Depot = {
  name: 'Central Distribution Hub (Depot)',
  x: 50,
  y: 50,
  openTime: 7.0,  // 7:00 AM
  closeTime: 19.0 // 7:00 PM
};

export const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: 'V1',
    name: 'Heavy Freight Van Alpha',
    capacity: 120, // kg
    fuelConsumptionRate: 0.18, // L/km
    fuelPricePerLiter: 1.65, // $
    driverHourlyRate: 28, // $/hr
    maxShiftHours: 9.0, // hours
    color: '#3b82f6' // Blue
  },
  {
    id: 'V2',
    name: 'Express Sprinter Beta',
    capacity: 85, // kg
    fuelConsumptionRate: 0.12, // L/km
    fuelPricePerLiter: 1.65, // $
    driverHourlyRate: 24, // $/hr
    maxShiftHours: 8.5, // hours
    color: '#10b981' // Emerald
  },
  {
    id: 'V3',
    name: 'Eco City Courier Gamma',
    capacity: 65, // kg
    fuelConsumptionRate: 0.09, // L/km
    fuelPricePerLiter: 1.65, // $
    driverHourlyRate: 22, // $/hr
    maxShiftHours: 8.0, // hours
    color: '#8b5cf6' // Violet
  }
];

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'C1',
    name: 'St. Jude Medical Center',
    x: 25,
    y: 75,
    demand: 35,
    readyTime: 8.0,
    dueTime: 11.0,
    serviceTime: 0.5, // 30 mins
    priority: 'Critical'
  },
  {
    id: 'C2',
    name: 'Metro Tech University',
    x: 80,
    y: 85,
    demand: 40,
    readyTime: 9.0,
    dueTime: 14.0,
    serviceTime: 0.4,
    priority: 'High'
  },
  {
    id: 'C3',
    name: 'Grand Plaza Hotel',
    x: 45,
    y: 85,
    demand: 25,
    readyTime: 8.0,
    dueTime: 12.0,
    serviceTime: 0.3,
    priority: 'High'
  },
  {
    id: 'C4',
    name: 'Apex Manufacturing Co.',
    x: 15,
    y: 35,
    demand: 45,
    readyTime: 8.0,
    dueTime: 16.0,
    serviceTime: 0.6,
    priority: 'Medium'
  },
  {
    id: 'C5',
    name: 'Oakridge Residential Complex',
    x: 35,
    y: 20,
    demand: 15,
    readyTime: 10.0,
    dueTime: 17.0,
    serviceTime: 0.2,
    priority: 'Low'
  },
  {
    id: 'C6',
    name: 'Harbor View Seafood Market',
    x: 85,
    y: 45,
    demand: 30,
    readyTime: 7.5,
    dueTime: 10.5,
    serviceTime: 0.35,
    priority: 'Critical'
  },
  {
    id: 'C7',
    name: 'Downtown Financial Tower',
    x: 55,
    y: 65,
    demand: 20,
    readyTime: 8.5,
    dueTime: 13.0,
    serviceTime: 0.25,
    priority: 'Medium'
  },
  {
    id: 'C8',
    name: 'Silver Lake Shopping Mall',
    x: 65,
    y: 25,
    demand: 35,
    readyTime: 11.0,
    dueTime: 18.0,
    serviceTime: 0.45,
    priority: 'High'
  },
  {
    id: 'C9',
    name: 'Westside Community Clinic',
    x: 10,
    y: 60,
    demand: 25,
    readyTime: 8.0,
    dueTime: 12.0,
    serviceTime: 0.3,
    priority: 'Critical'
  },
  {
    id: 'C10',
    name: 'Pine Tree Logistics Park',
    x: 90,
    y: 15,
    demand: 30,
    readyTime: 12.0,
    dueTime: 17.5,
    serviceTime: 0.4,
    priority: 'Low'
  },
  {
    id: 'C11',
    name: 'Sunnyside Elementary School',
    x: 70,
    y: 60,
    demand: 18,
    readyTime: 8.0,
    dueTime: 14.5,
    serviceTime: 0.25,
    priority: 'Medium'
  },
  {
    id: 'C12',
    name: 'Eastgate Supermarket',
    x: 92,
    y: 70,
    demand: 38,
    readyTime: 9.5,
    dueTime: 16.0,
    serviceTime: 0.5,
    priority: 'High'
  }
];

export const DEFAULT_WEIGHTS: ObjectiveWeights = {
  distance: 20,
  cost: 20,
  time: 20,
  priority: 25,
  utilization: 15
};

export const WEIGHT_PRESETS: { name: string; description: string; weights: ObjectiveWeights }[] = [
  {
    name: 'Academic Balanced',
    description: 'Equally distributed compromise across all five objectives.',
    weights: { distance: 20, cost: 20, time: 20, priority: 20, utilization: 20 }
  },
  {
    name: 'Green & Eco Distance',
    description: 'Heavily penalizes total travel distance and fuel burn.',
    weights: { distance: 45, cost: 25, time: 10, priority: 10, utilization: 10 }
  },
  {
    name: 'Urgent & SLA Priority',
    description: 'Prioritizes zero tardiness for Critical and High priority customers.',
    weights: { distance: 10, cost: 10, time: 35, priority: 40, utilization: 5 }
  },
  {
    name: 'Budget Cost Optimizer',
    description: 'Minimizes driver hourly wages and fuel operational expenses.',
    weights: { distance: 20, cost: 50, time: 10, priority: 10, utilization: 10 }
  },
  {
    name: 'Fleet Capacity Maximizer',
    description: 'Encourages consolidating freight into fewer high-utilization vehicles.',
    weights: { distance: 15, cost: 15, time: 10, priority: 10, utilization: 50 }
  }
];
