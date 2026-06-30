/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from 'react';
import { Customer, Depot, ObjectiveWeights, Scenario, Vehicle, VRPSolution } from './types';
import { DEFAULT_DEPOT, DEFAULT_WEIGHTS, SAMPLE_CUSTOMERS, SAMPLE_VEHICLES } from './data';
import { solveVRP } from './vrpSolver';
import { Navbar } from './components/Navbar';
import { DashboardCards } from './components/DashboardCards';
import { ScoreFormulaCard } from './components/ScoreFormulaCard';
import { WeightSliders } from './components/WeightSliders';
import { RouteCanvas } from './components/RouteCanvas';
import { ChartsPanel } from './components/ChartsPanel';
import { RouteSummaryTable } from './components/RouteSummaryTable';
import { CustomerTable } from './components/CustomerTable';
import { VehicleTable } from './components/VehicleTable';
import { ScenarioTable } from './components/ScenarioTable';
import { Truck, Users, Layers, TableProperties, Sparkles, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function App() {
  // Core VRP State
  const [depot, setDepot] = useState<Depot>(DEFAULT_DEPOT);
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(SAMPLE_VEHICLES);
  const [weights, setWeights] = useState<ObjectiveWeights>(DEFAULT_WEIGHTS);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  // UI Modals & Tabs State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'routes' | 'customers' | 'vehicles' | 'scenarios'>('routes');
  const [isOptimizing, startTransition] = useTransition();

  // Current Optimization Solution State
  const [solution, setSolution] = useState<VRPSolution>(() => 
    solveVRP(SAMPLE_CUSTOMERS, SAMPLE_VEHICLES, DEFAULT_DEPOT, DEFAULT_WEIGHTS)
  );

  // Auto-recalculate baseline solution whenever customers, vehicles, or weights change
  useEffect(() => {
    startTransition(() => {
      const newSol = solveVRP(customers, vehicles, depot, weights);
      setSolution(newSol);
    });
  }, [customers, vehicles, depot, weights]);

  // Action Handlers
  const handleLoadSample = () => {
    startTransition(() => {
      setCustomers(SAMPLE_CUSTOMERS);
      setVehicles(SAMPLE_VEHICLES);
      setDepot(DEFAULT_DEPOT);
      setWeights(DEFAULT_WEIGHTS);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      // Keep sample data but reset weights
      setWeights(DEFAULT_WEIGHTS);
    });
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles(prev => [...prev, newVehicle]);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const handleSaveScenario = () => {
    const newScenario: Scenario = {
      id: `SC_${Date.now()}`,
      name: `Scenario #${scenarios.length + 1} (${weights.distance}D/${weights.cost}C/${weights.priority}P)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      weights: { ...weights },
      metrics: { ...solution.metrics },
      routesCount: solution.routes.filter(r => r.stops.length > 0).length,
      customersCount: customers.length
    };
    setScenarios(prev => [newScenario, ...prev]);
    setActiveTab('scenarios');
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const handleRestoreScenario = (scenario: Scenario) => {
    setWeights(scenario.weights);
    setActiveTab('routes');
  };

  // Export Results to CSV file download
  const handleExportCSV = () => {
    const csvRows = [
      ['Vehicle ID', 'Vehicle Name', 'Stop Sequence #', 'Customer ID', 'Customer Name', 'Grid Coords (X,Y)', 'Demand (kg)', 'Arrival Time (h)', 'Departure Time (h)', 'Distance from Prev (km)', 'Tardiness (h)']
    ];

    solution.routes.forEach(r => {
      if (r.stops.length === 0) return;
      r.stops.forEach((stop, idx) => {
        csvRows.push([
          r.vehicleId,
          `"${r.vehicleName}"`,
          (idx + 1).toString(),
          stop.customerId,
          `"${stop.customerName}"`,
          `"(${stop.x}, ${stop.y})"`,
          stop.demand.toString(),
          stop.arrivalTime.toFixed(2),
          stop.departureTime.toFixed(2),
          stop.distanceFromPrev.toFixed(2),
          stop.tardiness.toFixed(2)
        ]);
      });
    });

    // Add unassigned warning section if any
    if (solution.unassignedCustomers.length > 0) {
      csvRows.push([]);
      csvRows.push(['UNASSIGNED CUSTOMERS (Infeasible due to Fleet Constraints)']);
      solution.unassignedCustomers.forEach(u => {
        csvRows.push(['NONE', 'UNASSIGNED', '-', u.id, `"${u.name}"`, `"(${u.x}, ${u.y})"`, u.demand.toString(), '-', '-', '-', '-']);
      });
    }

    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VRP_MultiObjective_Optimization_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        onLoadSample={handleLoadSample}
        onAddCustomer={() => setIsCustomerModalOpen(true)}
        onAddVehicle={() => setIsVehicleModalOpen(true)}
        onOptimize={() => {
          startTransition(() => {
            const fresh = solveVRP(customers, vehicles, depot, weights);
            setSolution(fresh);
          });
        }}
        onReset={handleReset}
        onExportCSV={handleExportCSV}
        onSaveScenario={handleSaveScenario}
        isOptimizing={isOptimizing}
      />

      {/* Main Studio Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Academic Presentation Notice / PowerPoint Demo Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-blue-800/60">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 text-amber-300 mt-0.5 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base">Multi-Objective Vehicle Routing Decision Support System (DSS)</h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Simulating soft time windows, priority SLAs, fleet capacity limits, driver shifts, fuel economics, and Pareto trade-off scalarization.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="text-[11px] font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Client-Side Heuristic
            </span>
          </div>
        </div>

        {/* Dashboard KPI Summary Cards */}
        <DashboardCards metrics={solution.metrics} />

        {/* Upper Split Grid: Mathematical Formula & Weight Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col">
            <ScoreFormulaCard weights={weights} metrics={solution.metrics} />
          </div>
          <div className="lg:col-span-6 flex flex-col">
            <WeightSliders weights={weights} onChange={(w) => setWeights(w)} />
          </div>
        </div>

        {/* Middle Split Grid: 2D Route Canvas & Recharts Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 h-[460px]">
            <RouteCanvas
              depot={depot}
              routes={solution.routes}
              unassignedCustomers={solution.unassignedCustomers}
            />
          </div>
          <div className="lg:col-span-6">
            <ChartsPanel
              routes={solution.routes.filter(r => r.stops.length > 0)}
              paretoPoints={solution.paretoPoints}
            />
          </div>
        </div>

        {/* Unassigned Feasibility Warning Banner if any */}
        {solution.unassignedCustomers.length > 0 && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3 text-rose-900">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Hard Constraint Violation Warning: {solution.unassignedCustomers.length} Customer Location(s) Infeasible</h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Vehicle capacity or shift limits prevented assigning customers: <strong>{solution.unassignedCustomers.map(c => c.id).join(', ')}</strong>. Try adding another vehicle or increasing max shift working hours limit.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow shrink-0 transition-colors cursor-pointer ml-4"
            >
              Add Vehicle
            </button>
          </div>
        )}

        {/* Bottom Detailed Inspection Section with Tabs Toolbar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex space-x-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('routes')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'routes'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <TableProperties className="w-4 h-4" />
                <span>Route Assignment Manifest</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'customers'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Directory ({customers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('vehicles')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'vehicles'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Fleet Vehicles ({vehicles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('scenarios')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'scenarios'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Saved Scenarios ({scenarios.length})</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <FileText className="w-3.5 h-3.5" /> Academic Spec v2.4
            </div>
          </div>

          {/* Active Tab View Panel */}
          <div className="transition-all duration-200">
            {activeTab === 'routes' && <RouteSummaryTable routes={solution.routes} />}
            {activeTab === 'customers' && (
              <CustomerTable
                customers={customers}
                routes={solution.routes}
                unassignedCustomers={solution.unassignedCustomers}
                onAddCustomer={handleAddCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                isOpenModal={isCustomerModalOpen}
                onCloseModal={() => setIsCustomerModalOpen(false)}
              />
            )}
            {activeTab === 'vehicles' && (
              <VehicleTable
                vehicles={vehicles}
                onAddVehicle={handleAddVehicle}
                onDeleteVehicle={handleDeleteVehicle}
                isOpenModal={isVehicleModalOpen}
                onCloseModal={() => setIsVehicleModalOpen(false)}
              />
            )}
            {activeTab === 'scenarios' && (
              <ScenarioTable
                scenarios={scenarios}
                onLoadScenario={handleRestoreScenario}
                onDeleteScenario={handleDeleteScenario}
              />
            )}
          </div>
        </div>

      </main>

      {/* Academic Footer Specifications Guide */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-slate-200 font-bold mb-2 uppercase tracking-wider text-[11px]">Multi-Objective Methodology</h4>
            <p className="leading-relaxed">
              This system employs a Weighted Scalarized Insertion Heuristic. It evaluates candidate stops by penalizing incremental Euclidean drive distance, fuel expense, and time window tardiness while rewarding capacity consolidation and on-time service for Critical priority clients.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold mb-2 uppercase tracking-wider text-[11px]">PowerPoint & Word Demo Readiness</h4>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Use <strong>Snapshot Scenario</strong> to capture before/after weight sensitivity.</li>
              <li>Toggle vehicle visibility on the 2D map to isolate single dispatch routes.</li>
              <li>Export CSV for direct inclusion into thesis appendicies or Excel pivot charts.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold mb-2 uppercase tracking-wider text-[11px]">System Constraints Verification</h4>
            <p className="leading-relaxed">
              Hard constraints (Vehicle Capacity & Max Shift Working Limit) trigger red infeasible warnings when breached. Soft constraints (Earliest Ready Time & Due Time SLA) accumulate weighted cost penalties visible in the formulation card.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500 font-mono">
          Multi-Objective VRP Studio • Standalone Browser-Based Simulation • Zero External API Dependencies
        </div>
      </footer>

      {/* Render Modals if triggered from warning banner or direct props */}
      {isCustomerModalOpen && activeTab !== 'customers' && (
        <CustomerTable
          customers={customers}
          routes={solution.routes}
          unassignedCustomers={solution.unassignedCustomers}
          onAddCustomer={handleAddCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          isOpenModal={isCustomerModalOpen}
          onCloseModal={() => setIsCustomerModalOpen(false)}
        />
      )}

      {isVehicleModalOpen && activeTab !== 'vehicles' && (
        <VehicleTable
          vehicles={vehicles}
          onAddVehicle={handleAddVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          isOpenModal={isVehicleModalOpen}
          onCloseModal={() => setIsVehicleModalOpen(false)}
        />
      )}

    </div>
  );
}
