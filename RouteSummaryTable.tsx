import React, { useState } from 'react';
import { VehicleRoute } from '../types';
import { Truck, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface RouteSummaryTableProps {
  routes: VehicleRoute[];
}

export const RouteSummaryTable: React.FC<RouteSummaryTableProps> = ({ routes }) => {
  const [expandedVehicles, setExpandedVehicles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    routes.forEach(r => { init[r.vehicleId] = true; });
    return init;
  });

  const toggleExpand = (vId: string) => {
    setExpandedVehicles(prev => ({
      ...prev,
      [vId]: !prev[vId]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-base">Vehicle Route Assignments & Feasibility Manifest</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">Active Fleet: {routes.filter(r => r.stops.length > 0).length} units</span>
      </div>

      <div className="space-y-4">
        {routes.map(route => {
          const isExpanded = expandedVehicles[route.vehicleId];
          const hasStops = route.stops.length > 0;

          return (
            <div
              key={route.vehicleId}
              className={`border rounded-xl transition-all ${
                !route.isFeasible
                  ? 'border-rose-300 bg-rose-50/20'
                  : route.violations.length > 0
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
              }`}
            >
              {/* Vehicle Route Header Bar */}
              <div
                onClick={() => toggleExpand(route.vehicleId)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: route.color }}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800 font-mono text-sm">{route.vehicleId}</span>
                      <span className="text-sm font-semibold text-slate-700">({route.vehicleName})</span>
                      
                      {/* Feasibility Badges */}
                      {!route.isFeasible ? (
                        <span className="bg-rose-100 text-rose-800 text-[11px] px-2 py-0.5 rounded-full font-bold border border-rose-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> INFEASIBLE (Hard Violation)
                        </span>
                      ) : route.violations.length > 0 ? (
                        <span className="bg-amber-100 text-amber-800 text-[11px] px-2 py-0.5 rounded-full font-bold border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> SLA Warnings ({route.violations.length})
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-bold border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> FEASIBLE & COMPLIANT
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-mono">
                      <span>Stops: <strong className="text-slate-700">{route.stops.length}</strong></span>
                      <span>Load: <strong className="text-slate-700">{route.totalDemand} / {route.capacity} kg</strong></span>
                      <span>Dist: <strong className="text-blue-600">{route.totalDistance} km</strong></span>
                      <span>Shift Time: <strong className="text-amber-600">{route.totalTime} hrs</strong></span>
                      <span>Cost: <strong className="text-emerald-600">${route.totalCost}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Utilization Progress & Expand Arrow */}
                <div className="flex items-center space-x-4 self-end md:self-center">
                  <div className="text-right hidden sm:block">
                    <div className="text-[11px] text-slate-400">Capacity Util</div>
                    <div className="text-xs font-mono font-bold text-slate-700">{route.utilization}%</div>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Feasibility Warnings Banner if any */}
              {route.violations.length > 0 && (
                <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-200/60 flex flex-col gap-1 text-xs text-amber-900">
                  {route.violations.map((viol, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${viol.severity === 'danger' ? 'text-rose-600' : 'text-amber-600'}`} />
                      <span className={viol.severity === 'danger' ? 'text-rose-800 font-bold' : ''}>[{viol.type}]: {viol.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Expandable Stops Sequence Table */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-white p-3 overflow-x-auto">
                  {!hasStops ? (
                    <div className="text-center py-4 text-xs text-slate-400 font-mono">
                      Vehicle unassigned during this optimization turn (Consolidated into active fleet).
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3"># Seq</th>
                          <th className="py-2 px-3">Customer ID & Name</th>
                          <th className="py-2 px-3">Coords</th>
                          <th className="py-2 px-3">Demand</th>
                          <th className="py-2 px-3">Priority</th>
                          <th className="py-2 px-3">Arrival</th>
                          <th className="py-2 px-3">Wait Time</th>
                          <th className="py-2 px-3">Departure</th>
                          <th className="py-2 px-3">Tardiness Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        
                        {/* Start Depot Row */}
                        <tr className="bg-amber-50/40 text-slate-600 font-sans">
                          <td className="py-2 px-3 font-bold text-amber-700">★ START</td>
                          <td className="py-2 px-3 font-semibold">Central Depot Hub</td>
                          <td className="py-2 px-3">(50, 50)</td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3 font-mono font-bold">07:00</td>
                          <td className="py-2 px-3 text-emerald-600 font-bold">On Schedule</td>
                        </tr>

                        {/* Customer Stops */}
                        {route.stops.map((stop, sIdx) => {
                          const isLate = stop.tardiness > 0;
                          return (
                            <tr key={stop.customerId} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2 px-3 font-bold text-slate-800">#{sIdx + 1}</td>
                              <td className="py-2 px-3 font-sans font-medium text-slate-800">
                                <span className="font-mono text-blue-600 font-bold mr-1">[{stop.customerId}]</span>
                                {stop.customerName}
                              </td>
                              <td className="py-2 px-3 text-slate-500">({stop.x}, {stop.y})</td>
                              <td className="py-2 px-3 font-semibold">{stop.demand} kg</td>
                              <td className="py-2 px-3 font-sans">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  stop.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                  stop.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {stop.priority}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-700">{stop.arrivalTime.toFixed(2)}h</td>
                              <td className="py-2 px-3 text-slate-500">{stop.waitingTime > 0 ? `${stop.waitingTime.toFixed(1)}h` : '-'}</td>
                              <td className="py-2 px-3 font-bold text-slate-700">{stop.departureTime.toFixed(2)}h</td>
                              <td className="py-2 px-3 font-sans">
                                {isLate ? (
                                  <span className="text-rose-600 font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> +{stop.tardiness.toFixed(1)}h Late
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 font-semibold">On Time</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Return Depot Row */}
                        <tr className="bg-amber-50/40 text-slate-600 font-sans border-t border-slate-200">
                          <td className="py-2 px-3 font-bold text-amber-700">★ END</td>
                          <td className="py-2 px-3 font-semibold">Return to Central Depot</td>
                          <td className="py-2 px-3">(50, 50)</td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-800">
                            {(7.0 + route.totalTime).toFixed(2)}h
                          </td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3">-</td>
                          <td className="py-2 px-3 text-slate-500">Shift Closed</td>
                        </tr>

                      </tbody>
                    </table>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};
