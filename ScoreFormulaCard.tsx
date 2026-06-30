import React from 'react';
import { Sigma, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ObjectiveWeights, VRPSolution } from '../types';

interface ScoreFormulaCardProps {
  weights: ObjectiveWeights;
  metrics: VRPSolution['metrics'];
}

export const ScoreFormulaCard: React.FC<ScoreFormulaCardProps> = ({ weights, metrics }) => {
  const totalW = weights.distance + weights.cost + weights.time + weights.priority + weights.utilization || 100;
  
  const wDist = (weights.distance / totalW).toFixed(2);
  const wCost = (weights.cost / totalW).toFixed(2);
  const wTime = (weights.time / totalW).toFixed(2);
  const wPrio = (weights.priority / totalW).toFixed(2);
  const wUtil = (weights.utilization / totalW).toFixed(2);

  const { subScores, overallObjectiveScore } = metrics;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <Sigma className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Multi-Objective Optimization Formulation</h3>
            <p className="text-xs text-slate-500">Normalized Weighted Scalarization Function</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs font-bold shadow-sm">
          <span>Overall Score:</span>
          <span className="text-sm font-mono">{overallObjectiveScore}</span>
          <span className="text-[10px] text-blue-200">/ 100</span>
        </div>
      </div>

      {/* Formula Display Banner */}
      <div className="my-4 p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs md:text-sm overflow-x-auto shadow-inner border border-slate-800">
        <div className="text-center pb-2 text-slate-400 text-[11px] font-sans tracking-wide">
          SCALARIZED OBJECTIVE FUNCTION: <span className="text-amber-400 font-semibold">Maximize S_overall</span>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 text-center py-1">
          <span className="text-blue-400 font-bold">S_overall</span>
          <span>=</span>
          <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <span className="text-blue-300">({wDist})</span> · <span className="text-emerald-400">S_dist</span>
          </span>
          <span>+</span>
          <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <span className="text-blue-300">({wCost})</span> · <span className="text-emerald-400">S_cost</span>
          </span>
          <span>+</span>
          <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <span className="text-blue-300">({wTime})</span> · <span className="text-emerald-400">S_time</span>
          </span>
          <span>+</span>
          <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <span className="text-blue-300">({wPrio})</span> · <span className="text-emerald-400">S_prio</span>
          </span>
          <span>+</span>
          <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <span className="text-blue-300">({wUtil})</span> · <span className="text-emerald-400">S_util</span>
          </span>
        </div>
      </div>

      {/* Live Sub-scores Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Distance (S_dist)</div>
          <div className="text-base font-mono font-bold text-slate-800">{subScores.distanceScore}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">Weight: {(Number(wDist)*100).toFixed(0)}%</div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Cost (S_cost)</div>
          <div className="text-base font-mono font-bold text-slate-800">{subScores.costScore}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Weight: {(Number(wCost)*100).toFixed(0)}%</div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Delivery Time (S_time)</div>
          <div className="text-base font-mono font-bold text-slate-800">{subScores.timeScore}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Weight: {(Number(wTime)*100).toFixed(0)}%</div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Priority SLA (S_prio)</div>
          <div className="text-base font-mono font-bold text-slate-800">{subScores.priorityScore}</div>
          <div className="text-[10px] text-purple-600 font-medium mt-0.5">Weight: {(Number(wPrio)*100).toFixed(0)}%</div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] text-slate-500 font-medium">Utilization (S_util)</div>
          <div className="text-base font-mono font-bold text-slate-800">{subScores.utilizationScore}</div>
          <div className="text-[10px] text-indigo-600 font-medium mt-0.5">Weight: {(Number(wUtil)*100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-blue-50/60 p-2.5 rounded border border-blue-100">
        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Academic Note:</strong> All sub-scores are normalized linearly against city routing upper bounds. Adjusting weight sliders immediately recalculates route candidate insertion heuristics.
        </span>
      </div>
    </div>
  );
};
