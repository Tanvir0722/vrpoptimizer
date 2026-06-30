import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { VehicleRoute, VRPSolution } from '../types';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

interface ChartsPanelProps {
  routes: VehicleRoute[];
  paretoPoints: VRPSolution['paretoPoints'];
}

export const ChartsPanel: React.FC<ChartsPanelProps> = ({ routes, paretoPoints }) => {
  const [activeTab, setActiveTab] = useState<'bar' | 'pareto'>('bar');

  // Format bar chart data for active vehicle routes
  const barData = routes.map(r => ({
    name: r.vehicleId,
    vehicleName: r.vehicleName,
    Distance: r.totalDistance,
    Cost: r.totalCost,
    Time: r.totalTime,
    Utilization: r.utilization
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-5">
        <div className="flex items-center space-x-2">
          {activeTab === 'bar' ? (
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          ) : (
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          )}
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {activeTab === 'bar' ? 'Fleet Multi-Criteria Comparison' : 'Pareto Trade-Off Frontier Analysis'}
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'bar'
                ? 'Side-by-side metric breakdown across assigned fleet vehicles'
                : 'Empirical objective trade-off across diversified weight preference vectors'}
            </p>
          </div>
        </div>

        {/* Tab Toggle Toolbar */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bar'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bar Comparison
          </button>
          <button
            onClick={() => setActiveTab('pareto')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pareto'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pareto Frontier
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-80">
        {activeTab === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(val: number | string | Array<number | string> | undefined, name: string | number | undefined) => {
                  const numVal = Number(val || 0);
                  if (name === 'Cost') return [`$${numVal}`, name];
                  if (name === 'Distance') return [`${numVal} km`, name];
                  if (name === 'Time') return [`${numVal} hrs`, name];
                  if (name === 'Utilization') return [`${numVal}%`, name];
                  return [val, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Distance" fill="#3b82f6" name="Distance (km)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cost" fill="#10b981" name="Cost ($)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Time" fill="#f59e0b" name="Time (hrs)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Utilization" fill="#8b5cf6" name="Utilization (%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="cost"
                name="Total Transportation Cost ($)"
                unit="$"
                stroke="#64748b"
                fontSize={12}
                domain={['auto', 'auto']}
                label={{ value: 'Total Cost ($) → Minimize', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                type="number"
                dataKey="distance"
                name="Total Travel Distance (km)"
                unit="km"
                stroke="#64748b"
                fontSize={12}
                domain={['auto', 'auto']}
                label={{ value: 'Distance (km) ↑ Minimize', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
              />
              <ZAxis type="number" dataKey="score" range={[80, 400]} name="Overall Fitness Score" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(val: number | string | Array<number | string> | undefined, name: string | number | undefined) => {
                  if (name === 'Total Transportation Cost ($)') return [`$${val}`, 'Cost'];
                  if (name === 'Total Travel Distance (km)') return [`${val} km`, 'Distance'];
                  if (name === 'Overall Fitness Score') return [`${val} / 100`, 'Composite Fitness'];
                  return [val, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
              <Scatter
                name="Pareto Non-Dominated Candidate Scenarios (Bubble size = Overall Fitness Score)"
                data={paretoPoints}
                fill="#10b981"
                line={{ stroke: '#34d399', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <Info className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>
          {activeTab === 'bar' 
            ? 'Note: Bar heights represent direct operational outputs per vehicle shift. Observe how freight consolidation impacts utilization vs distance.'
            : 'Pareto Note: Each point on the frontier scatter plot represents an optimal VRP solution derived from varying criteria weights. The dashed envelope demonstrates classical multi-objective trade-offs between financial cost and geographic travel.'}
        </span>
      </div>
    </div>
  );
};
