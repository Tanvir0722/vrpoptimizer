import React from 'react';
import { Route, DollarSign, Clock, Truck, Percent, Star, Award } from 'lucide-react';
import { VRPSolution } from '../types';

interface DashboardCardsProps {
  metrics: VRPSolution['metrics'];
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ metrics }) => {
  const {
    totalDistance,
    totalCost,
    totalTime,
    vehiclesUsed,
    totalVehicles,
    avgUtilization,
    prioritySatisfaction,
    overallObjectiveScore
  } = metrics;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      
      {/* Total Distance KPI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Distance</span>
          <Route className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-xl font-bold font-mono text-slate-900">{totalDistance} <span className="text-xs font-sans font-normal text-slate-500">km</span></div>
        <div className="text-[10px] text-slate-400 mt-1">Sum across fleet</div>
      </div>

      {/* Total Cost KPI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Cost</span>
          <DollarSign className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl font-bold font-mono text-emerald-600">${totalCost}</div>
        <div className="text-[10px] text-slate-400 mt-1">Fuel burn + wages</div>
      </div>

      {/* Total Time KPI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Time</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-xl font-bold font-mono text-slate-900">{totalTime} <span className="text-xs font-sans font-normal text-slate-500">hrs</span></div>
        <div className="text-[10px] text-slate-400 mt-1">Drive + wait + unload</div>
      </div>

      {/* Vehicles Used KPI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-purple-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Vehicles Used</span>
          <Truck className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-xl font-bold font-mono text-slate-900">{vehiclesUsed} <span className="text-xs font-sans font-normal text-slate-400">/ {totalVehicles}</span></div>
        <div className="text-[10px] text-slate-400 mt-1">Active routed units</div>
      </div>

      {/* Vehicle Utilization KPI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Utilization</span>
          <Percent className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xl font-bold font-mono text-slate-900">{avgUtilization}%</div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, avgUtilization)}%` }}></div>
        </div>
      </div>

      {/* Priority Satisfaction KPI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-rose-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">SLA On-Time</span>
          <Star className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-xl font-bold font-mono text-rose-600">{prioritySatisfaction}%</div>
        <div className="text-[10px] text-slate-400 mt-1">Critical & High SLA</div>
      </div>

      {/* Composite Overall Objective Score KPI */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 rounded-xl shadow-md border border-indigo-800 text-white col-span-2 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-indigo-300 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Objective Score</span>
          <Award className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-amber-300">{overallObjectiveScore}</div>
        <div className="text-[10px] text-indigo-200 mt-0.5 font-medium">Composite fitness</div>
      </div>

    </div>
  );
};
