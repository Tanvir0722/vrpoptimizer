import React, { useState } from 'react';
import { Customer, Depot, VehicleRoute } from '../types';
import { MapPin, Eye, EyeOff, AlertTriangle, Building2, Package, Clock } from 'lucide-react';

interface RouteCanvasProps {
  depot: Depot;
  routes: VehicleRoute[];
  unassignedCustomers: Customer[];
}

export const RouteCanvas: React.FC<RouteCanvasProps> = ({ depot, routes, unassignedCustomers }) => {
  const [visibleVehicles, setVisibleVehicles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    routes.forEach(r => { initial[r.vehicleId] = true; });
    return initial;
  });

  const [hoveredNode, setHoveredNode] = useState<{
    id: string;
    name: string;
    type: 'depot' | 'customer';
    demand?: number;
    priority?: string;
    timeWindow?: string;
    arrivalTime?: number;
    tardiness?: number;
    vehicleName?: string;
  } | null>(null);

  const toggleVehicleVisibility = (vId: string) => {
    setVisibleVehicles(prev => ({
      ...prev,
      [vId]: prev[vId] === undefined ? false : !prev[vId]
    }));
  };

  // Helper to convert 0-100 grid coords to SVG percentage (with 6% margin padding so nodes don't clip edge)
  const toCoord = (val: number) => 8 + (val * 0.84);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            2D Fleet Geographic Route Map
          </h3>
          <p className="text-xs text-slate-500">Euclidean Coordinate Plane (0-100 km grid)</p>
        </div>

        {/* Vehicle Route Toggle Switches */}
        <div className="flex flex-wrap items-center gap-2">
          {routes.map(r => {
            const isVisible = visibleVehicles[r.vehicleId] !== false;
            return (
              <button
                key={r.vehicleId}
                onClick={() => toggleVehicleVisibility(r.vehicleId)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                  isVisible
                    ? 'bg-slate-900 text-white shadow-sm border-slate-800'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: isVisible ? r.color : '#cbd5e1' }}></span>
                <span>{r.vehicleId}</span>
                {isVisible ? <Eye className="w-3 h-3 text-slate-300" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="relative w-full aspect-4/3 sm:aspect-16/9 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner group">
        
        {/* Subtle Map Coordinate Grid Lines */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>

        {/* Main Routed SVG Elements */}
        <svg className="w-full h-full relative z-10" viewBox="0 0 100 100">
          
          {/* Route Polylines */}
          {routes.map(r => {
            if (visibleVehicles[r.vehicleId] === false || r.stops.length === 0) return null;

            // Generate sequence points: Depot -> Stop 1 -> ... -> Stop N -> Depot
            const points = [
              `${toCoord(depot.x)},${toCoord(depot.y)}`,
              ...r.stops.map(s => `${toCoord(s.x)},${toCoord(s.y)}`),
              `${toCoord(depot.x)},${toCoord(depot.y)}`
            ].join(' ');

            return (
              <g key={r.vehicleId}>
                {/* Glow under route */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={r.color}
                  strokeWidth="2.8"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Main sharp line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={r.color}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={r.violations.length > 0 ? "2,1" : "none"}
                />
              </g>
            );
          })}

          {/* Unassigned Customers Nodes */}
          {unassignedCustomers.map(c => (
            <g
              key={c.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode({
                id: c.id,
                name: c.name,
                type: 'customer',
                demand: c.demand,
                priority: c.priority,
                timeWindow: `${c.readyTime}:00 - ${c.dueTime}:00`,
                vehicleName: 'UNASSIGNED (Infeasible)'
              })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle
                cx={toCoord(c.x)}
                cy={toCoord(c.y)}
                r="2.2"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="0.5"
                className="animate-pulse"
              />
              <text
                x={toCoord(c.x)}
                y={toCoord(c.y) + 4.2}
                fontSize="2.2"
                fill="#fca5a5"
                textAnchor="middle"
                fontWeight="bold"
              >
                {c.id}!
              </text>
            </g>
          ))}

          {/* Assigned Customer Nodes */}
          {routes.map(r => {
            if (visibleVehicles[r.vehicleId] === false) return null;

            return r.stops.map((stop, seqIdx) => {
              const isLate = stop.tardiness > 0;
              const prioColor = stop.priority === 'Critical' ? '#ef4444' : stop.priority === 'High' ? '#f97316' : '#38bdf8';

              return (
                <g
                  key={stop.customerId}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onMouseEnter={() => setHoveredNode({
                    id: stop.customerId,
                    name: stop.customerName,
                    type: 'customer',
                    demand: stop.demand,
                    priority: stop.priority,
                    timeWindow: `Arrival: ${stop.arrivalTime.toFixed(1)}h | Svc: ${stop.departureTime.toFixed(1)}h`,
                    tardiness: stop.tardiness,
                    vehicleName: `${r.vehicleName} (#${seqIdx + 1})`
                  })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer ring for priority */}
                  <circle
                    cx={toCoord(stop.x)}
                    cy={toCoord(stop.y)}
                    r="2.8"
                    fill="none"
                    stroke={prioColor}
                    strokeWidth="0.6"
                  />
                  {/* Inner filled node */}
                  <circle
                    cx={toCoord(stop.x)}
                    cy={toCoord(stop.y)}
                    r="2.1"
                    fill={isLate ? '#f43f5e' : r.color}
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                  {/* Stop Sequence number */}
                  <text
                    x={toCoord(stop.x)}
                    y={toCoord(stop.y) + 0.8}
                    fontSize="1.8"
                    fill="#ffffff"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {seqIdx + 1}
                  </text>
                  {/* Customer ID Tag underneath */}
                  <text
                    x={toCoord(stop.x)}
                    y={toCoord(stop.y) + 4.6}
                    fontSize="2.2"
                    fill="#e2e8f0"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {stop.customerId}
                  </text>
                </g>
              );
            });
          })}

          {/* Central Hub Depot Node (Drawn last on top) */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode({
              id: 'DEPOT',
              name: depot.name,
              type: 'depot',
              timeWindow: `${depot.openTime}:00 - ${depot.closeTime}:00`
            })}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Outer golden halo */}
            <circle
              cx={toCoord(depot.x)}
              cy={toCoord(depot.y)}
              r="4.5"
              fill="rgba(245, 158, 11, 0.2)"
            />
            {/* Inner square/polygon */}
            <polygon
              points={`
                ${toCoord(depot.x)},${toCoord(depot.y) - 3.5}
                ${toCoord(depot.x) + 3.5},${toCoord(depot.y)}
                ${toCoord(depot.x)},${toCoord(depot.y) + 3.5}
                ${toCoord(depot.x) - 3.5},${toCoord(depot.y)}
              `}
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <text
              x={toCoord(depot.x)}
              y={toCoord(depot.y) + 1.0}
              fontSize="2.4"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
            >
              ★
            </text>
            <text
              x={toCoord(depot.x)}
              y={toCoord(depot.y) - 5.0}
              fontSize="2.8"
              fill="#fbbf24"
              textAnchor="middle"
              fontWeight="800"
            >
              DEPOT
            </text>
          </g>

        </svg>

        {/* Live Hover Tooltip Card Overlay */}
        {hoveredNode && (
          <div className="absolute top-3 left-3 bg-slate-900/95 backdrop-blur border border-slate-700 p-3 rounded-lg text-white text-xs max-w-xs shadow-2xl z-30 pointer-events-none animate-in fade-in duration-150">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-1.5 mb-2">
              {hoveredNode.type === 'depot' ? (
                <Building2 className="w-4 h-4 text-amber-400" />
              ) : (
                <MapPin className="w-4 h-4 text-blue-400" />
              )}
              <div>
                <span className="font-bold text-slate-100">{hoveredNode.id}: </span>
                <span className="text-slate-200">{hoveredNode.name}</span>
              </div>
            </div>

            {hoveredNode.type === 'customer' && (
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned To:</span>
                  <span className="font-mono font-semibold text-emerald-400">{hoveredNode.vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Demand:</span>
                  <span className="font-mono">{hoveredNode.demand} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority:</span>
                  <span className="font-semibold text-amber-300">{hoveredNode.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timeline:</span>
                  <span className="font-mono text-[10px]">{hoveredNode.timeWindow}</span>
                </div>
                {hoveredNode.tardiness !== undefined && hoveredNode.tardiness > 0 && (
                  <div className="text-rose-400 font-bold flex items-center gap-1 mt-1 pt-1 border-t border-slate-800">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Tardiness: +{hoveredNode.tardiness.toFixed(1)} hours late!</span>
                  </div>
                )}
              </div>
            )}

            {hoveredNode.type === 'depot' && (
              <div className="text-[11px] text-slate-300">
                <div>Operating Window: {hoveredNode.timeWindow}</div>
              </div>
            )}
          </div>
        )}

        {/* Unassigned Customers Warning Overlay */}
        {unassignedCustomers.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-rose-950/90 border border-rose-700 text-rose-200 px-3 py-2 rounded-lg text-xs flex items-center gap-2 shadow-lg z-20">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{unassignedCustomers.length} customer(s) unassigned due to capacity/shift limits.</span>
          </div>
        )}

      </div>
      
      {/* Map Footer Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1"><span className="text-amber-500 font-bold">★</span> Central Depot</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Stop Node (# Sequence)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse"></span> Unassigned / Late</span>
        </div>
        <div>
          <span>Tip: Hover over any map node to inspect schedule details.</span>
        </div>
      </div>
    </div>
  );
};
