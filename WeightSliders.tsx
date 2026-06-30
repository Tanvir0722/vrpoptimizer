import React from 'react';
import { Sliders, Sparkles, MapPin, DollarSign, Clock, Star, Percent } from 'lucide-react';
import { ObjectiveWeights } from '../types';
import { WEIGHT_PRESETS } from '../data';

interface WeightSlidersProps {
  weights: ObjectiveWeights;
  onChange: (newWeights: ObjectiveWeights) => void;
}

export const WeightSliders: React.FC<WeightSlidersProps> = ({ weights, onChange }) => {
  const handleSliderChange = (key: keyof ObjectiveWeights, value: number) => {
    onChange({
      ...weights,
      [key]: value
    });
  };

  const totalSum = weights.distance + weights.cost + weights.time + weights.priority + weights.utilization || 100;

  const getPercentage = (val: number) => Math.round((val / totalSum) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-sm">Multi-Objective Weight Preference Sliders</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Total Relative Allocation: {totalSum} pts</span>
      </div>

      {/* Preset Quick Selector Buttons */}
      <div className="mb-5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Academic Scenario Presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          {WEIGHT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChange(preset.weights)}
              title={preset.description}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-medium rounded-lg border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-4">
        
        {/* Distance Weight Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              Minimize Total Distance
            </span>
            <span className="font-mono font-bold text-blue-600">{weights.distance} <span className="text-[10px] text-slate-400 font-normal">({getPercentage(weights.distance)}%)</span></span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.distance}
            onChange={(e) => handleSliderChange('distance', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Cost Weight Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              Minimize Total Transportation Cost
            </span>
            <span className="font-mono font-bold text-emerald-600">{weights.cost} <span className="text-[10px] text-slate-400 font-normal">({getPercentage(weights.cost)}%)</span></span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.cost}
            onChange={(e) => handleSliderChange('cost', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Delivery Time Weight Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Minimize Delivery Time & Tardiness
            </span>
            <span className="font-mono font-bold text-amber-600">{weights.time} <span className="text-[10px] text-slate-400 font-normal">({getPercentage(weights.time)}%)</span></span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.time}
            onChange={(e) => handleSliderChange('time', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Customer Priority SLA Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-purple-500" />
              Maximize Priority Customer Satisfaction
            </span>
            <span className="font-mono font-bold text-purple-600">{weights.priority} <span className="text-[10px] text-slate-400 font-normal">({getPercentage(weights.priority)}%)</span></span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.priority}
            onChange={(e) => handleSliderChange('priority', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        {/* Vehicle Utilization Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-500" />
              Maximize Fleet Capacity Utilization
            </span>
            <span className="font-mono font-bold text-indigo-600">{weights.utilization} <span className="text-[10px] text-slate-400 font-normal">({getPercentage(weights.utilization)}%)</span></span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.utilization}
            onChange={(e) => handleSliderChange('utilization', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

      </div>
    </div>
  );
};
