import React from 'react';
import { Play, RotateCcw, Database, UserPlus, Truck, Download, Award, Layers } from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  onAddCustomer: () => void;
  onAddVehicle: () => void;
  onOptimize: () => void;
  onReset: () => void;
  onExportCSV: () => void;
  onSaveScenario: () => void;
  isOptimizing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadSample,
  onAddCustomer,
  onAddVehicle,
  onOptimize,
  onReset,
  onExportCSV,
  onSaveScenario,
  isOptimizing
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Title & Academic Badge */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Multi-Objective VRP Studio</h1>
              <span className="bg-blue-900/80 text-blue-300 text-xs px-2 py-0.5 rounded-full font-mono font-medium border border-blue-700/50 flex items-center gap-1">
                <Award className="w-3 h-3" /> Academic v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">Decision Support System for Multi-Criteria Fleet Optimization</p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onLoadSample}
            title="Load standard 12-customer benchmark dataset"
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={onAddCustomer}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Customer</span>
          </button>

          <button
            onClick={onAddVehicle}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-purple-400" />
            <span>Add Vehicle</span>
          </button>

          <button
            onClick={onSaveScenario}
            title="Snapshot current run into scenario comparison table"
            className="flex items-center space-x-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 px-3 py-2 rounded-lg text-xs font-medium border border-indigo-700/60 transition-colors shadow-sm cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Snapshot Scenario</span>
          </button>

          <button
            onClick={onReset}
            title="Clear customer assignments and reset weights"
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 hover:border-rose-800 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          {/* Primary Optimize Button */}
          <button
            onClick={onOptimize}
            disabled={isOptimizing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer ${
              isOptimizing
                ? 'bg-blue-600/50 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize Routes'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
