import React from 'react';
import { Scenario } from '../types';
import { Layers, Trash2, Award, Clock, DollarSign, Route } from 'lucide-react';

interface ScenarioTableProps {
  scenarios: Scenario[];
  onLoadScenario: (scenario: Scenario) => void;
  onDeleteScenario: (id: string) => void;
}

export const ScenarioTable: React.FC<ScenarioTableProps> = ({
  scenarios,
  onLoadScenario,
  onDeleteScenario
}) => {
  if (scenarios.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center mb-6">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">No Saved Scenarios Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Click the "Snapshot Scenario" button in the top navigation bar during any optimization run to capture and compare multi-objective trade-offs here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-base">Multi-Objective Scenario Comparison Matrix ({scenarios.length})</h3>
        </div>
        <span className="text-xs text-slate-400">Snapshot trade-off logs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Scenario Name & Time</th>
              <th className="py-2.5 px-3">Weight Vector (Dist/Cost/Time/Prio/Util)</th>
              <th className="py-2.5 px-3">Total Distance</th>
              <th className="py-2.5 px-3">Total Cost</th>
              <th className="py-2.5 px-3">Total Time</th>
              <th className="py-2.5 px-3">Fleet Util</th>
              <th className="py-2.5 px-3">SLA On-Time</th>
              <th className="py-2.5 px-3 font-bold text-indigo-700">Overall Fitness</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {scenarios.map(s => {
              const { weights, metrics } = s;
              return (
                <tr key={s.id} className="hover:bg-indigo-50/40 transition-colors font-sans">
                  <td className="py-3 px-3 font-medium text-slate-900">
                    <div className="font-bold text-indigo-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.timestamp}</div>
                  </td>
                  
                  <td className="py-3 px-3 font-mono text-[10px]">
                    <span className="text-blue-600">{weights.distance}</span> /{' '}
                    <span className="text-emerald-600">{weights.cost}</span> /{' '}
                    <span className="text-amber-600">{weights.time}</span> /{' '}
                    <span className="text-purple-600">{weights.priority}</span> /{' '}
                    <span className="text-indigo-600">{weights.utilization}</span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {metrics.totalDistance} km
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                    ${metrics.totalCost}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-700">
                    {metrics.totalTime} hrs
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                    {metrics.avgUtilization}%
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-purple-700">
                    {metrics.prioritySatisfaction}%
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-base text-amber-600 bg-amber-50/40 rounded">
                    {metrics.overallObjectiveScore}
                  </td>

                  <td className="py-3 px-3 text-right space-x-1 font-sans">
                    <button
                      onClick={() => onLoadScenario(s)}
                      className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded text-xs transition-colors cursor-pointer"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => onDeleteScenario(s.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer inline-block align-middle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
