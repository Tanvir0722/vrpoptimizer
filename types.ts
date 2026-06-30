/**
 * Core Data Structures for Multi-Objective VRP Optimizer
 */

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Customer {
  id: string;
  name: string;
  x: number; // 0 to 100 coordinate grid
  y: number; // 0 to 100 coordinate grid
  demand: number; // e.g. packages / kg (1 to 50)
  readyTime: number; // Earliest arrival (hours from midnight, e.g. 8.0 for 8:00 AM)
  dueTime: number; // Latest arrival (hours from midnight, e.g. 17.0 for 5:00 PM)
  serviceTime: number; // Duration in hours (e.g. 0.25 = 15 mins)
  priority: PriorityLevel; // Priority level
}

export interface Depot {
  name: string;
  x: number;
  y: number;
  openTime: number; // e.g. 8.0 (8:00 AM)
  closeTime: number; // e.g. 18.0 (6:00 PM)
}

export interface Vehicle {
  id: string;
  name: string;
  capacity: number; // max demand units (e.g. 100 kg)
  fuelConsumptionRate: number; // liters per km (e.g. 0.15 L/km)
  fuelPricePerLiter: number; // cost per liter (e.g. $1.50/L)
  driverHourlyRate: number; // driver wage per hour (e.g. $25/hr)
  maxShiftHours: number; // max working hours (e.g. 8.0 hours)
  color: string; // hex color for visualization
}

export interface StopDetail {
  customerId: string;
  customerName: string;
  x: number;
  y: number;
  demand: number;
  priority: PriorityLevel;
  arrivalTime: number; // calculated arrival time
  waitingTime: number; // waiting if arrived before readyTime
  serviceStartTime: number;
  departureTime: number;
  distanceFromPrev: number; // km
  tardiness: number; // hours late beyond dueTime (0 if on time)
}

export interface RouteViolation {
  type: 'CAPACITY' | 'TIME_WINDOW' | 'SHIFT_LIMIT';
  message: string;
  severity: 'warning' | 'danger';
}

export interface VehicleRoute {
  vehicleId: string;
  vehicleName: string;
  color: string;
  stops: StopDetail[];
  totalDistance: number; // km
  totalTime: number; // hours (including driving + waiting + service)
  totalDemand: number;
  capacity: number;
  utilization: number; // percentage 0-100
  fuelCost: number; // $
  driverCost: number; // $
  totalCost: number; // $
  highPriorityServedOnTime: number;
  totalHighPriorityAssigned: number;
  violations: RouteViolation[];
  isFeasible: boolean;
}

export interface ObjectiveWeights {
  distance: number; // default 20
  cost: number; // default 20
  time: number; // default 20
  priority: number; // default 20
  utilization: number; // default 20
}

export interface VRPSolution {
  routes: VehicleRoute[];
  unassignedCustomers: Customer[];
  metrics: {
    totalDistance: number;
    totalCost: number;
    totalTime: number;
    vehiclesUsed: number;
    totalVehicles: number;
    avgUtilization: number;
    prioritySatisfaction: number; // % of high/critical customers on time
    overallObjectiveScore: number; // normalized composite score 0-100
    subScores: {
      distanceScore: number;
      costScore: number;
      timeScore: number;
      priorityScore: number;
      utilizationScore: number;
    };
  };
  paretoPoints: {
    id: number;
    weights: ObjectiveWeights;
    cost: number;
    distance: number;
    time: number;
    prioritySatisfaction: number;
    utilization: number;
    score: number;
  }[];
}

export interface Scenario {
  id: string;
  name: string;
  timestamp: string;
  weights: ObjectiveWeights;
  metrics: VRPSolution['metrics'];
  routesCount: number;
  customersCount: number;
}
