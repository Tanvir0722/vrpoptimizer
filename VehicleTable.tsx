import React, { useState } from 'react';
import { Vehicle } from '../types';
import { Truck, Plus, Trash2, X, AlertCircle } from 'lucide-react';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  isOpenModal: boolean;
  onCloseModal: () => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onAddVehicle,
  onDeleteVehicle,
  isOpenModal,
  onCloseModal
}) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [fuelRate, setFuelRate] = useState('0.15');
  const [fuelPrice, setFuelPrice] = useState('1.65');
  const [driverRate, setDriverRate] = useState('25');
  const [maxShift, setMaxShift] = useState('8.5');
  const [color, setColor] = useState('#ec4899'); // Default pink

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `V${vehicles.length + 1}`;
    onAddVehicle({
      id: newId,
      name: name.trim(),
      capacity: Math.max(10, Number(capacity) || 100),
      fuelConsumptionRate: Math.max(0.01, Number(fuelRate) || 0.15),
      fuelPricePerLiter: Math.max(0.1, Number(fuelPrice) || 1.65),
      driverHourlyRate: Math.max(1, Number(driverRate) || 25),
      maxShiftHours: Math.max(1, Number(maxShift) || 8.5),
      color
    });

    setName('');
    onCloseModal();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-800 text-base">Fleet Vehicle Specification & Capacity Constraints ({vehicles.length})</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Vehicle ID</th>
              <th className="py-2.5 px-3">Vehicle / Fleet Model</th>
              <th className="py-2.5 px-3">Max Capacity</th>
              <th className="py-2.5 px-3">Fuel Burn (L/km)</th>
              <th className="py-2.5 px-3">Fuel Price</th>
              <th className="py-2.5 px-3">Driver Wage</th>
              <th className="py-2.5 px-3">Max Working Shift</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {vehicles.map(v => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors font-sans">
                <td className="py-2.5 px-3 font-mono font-bold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block shrink-0 shadow-sm" style={{ backgroundColor: v.color }}></span>
                  <span className="text-purple-700">{v.id}</span>
                </td>
                <td className="py-2.5 px-3 font-medium text-slate-800">{v.name}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{v.capacity} kg</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{v.fuelConsumptionRate} L/km</td>
                <td className="py-2.5 px-3 font-mono text-emerald-600">${v.fuelPricePerLiter}/L</td>
                <td className="py-2.5 px-3 font-mono text-emerald-600">${v.driverHourlyRate}/hr</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-amber-600">{v.maxShiftHours} hours</td>
                <td className="py-2.5 px-3 text-right">
                  {vehicles.length > 1 && (
                    <button
                      onClick={() => onDeleteVehicle(v.id)}
                      title="Remove vehicle"
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal Overlay */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" /> Commission New Fleet Vehicle
              </h3>
              <button onClick={onCloseModal} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Vehicle Model / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Cargo Shuttle Delta"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Capacity (kg)</label>
                  <input type="number" min="10" max="500" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Color Marker</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-12 rounded cursor-pointer border p-0.5" />
                    <span className="font-mono text-[11px] text-slate-500">{color}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fuel Consumption (L/km)</label>
                  <input type="number" step="0.01" min="0.01" max="1.0" value={fuelRate} onChange={e => setFuelRate(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fuel Price ($/L)</label>
                  <input type="number" step="0.05" min="0.5" max="5.0" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Driver Wage ($/hr)</label>
                  <input type="number" min="10" max="150" value={driverRate} onChange={e => setDriverRate(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Shift Hours limit</label>
                  <input type="number" step="0.5" min="4" max="16" value={maxShift} onChange={e => setMaxShift(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl text-purple-900 text-[11px] flex items-center gap-2 border border-purple-100">
                <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Adding vehicles increases fleet availability during multi-objective candidate route generation.</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={onCloseModal} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 shadow">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
