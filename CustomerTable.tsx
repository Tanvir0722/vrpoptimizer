import React, { useState } from 'react';
import { Customer, PriorityLevel, VehicleRoute } from '../types';
import { Users, Plus, Trash2, X, AlertCircle } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  routes: VehicleRoute[];
  unassignedCustomers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  isOpenModal: boolean;
  onCloseModal: () => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  routes,
  unassignedCustomers,
  onAddCustomer,
  onDeleteCustomer,
  isOpenModal,
  onCloseModal
}) => {
  // Form State for adding new customer
  const [name, setName] = useState('');
  const [x, setX] = useState('50');
  const [y, setY] = useState('50');
  const [demand, setDemand] = useState('20');
  const [readyTime, setReadyTime] = useState('8.0');
  const [dueTime, setDueTime] = useState('16.0');
  const [serviceTime, setServiceTime] = useState('0.3');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');

  // Lookup helper map: customerId -> assigned vehicleId
  const assignmentMap = new Map<string, string>();
  routes.forEach(r => {
    r.stops.forEach(s => {
      assignmentMap.set(s.customerId, r.vehicleId);
    });
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `C${customers.length + 1}`;
    onAddCustomer({
      id: newId,
      name: name.trim(),
      x: Math.max(0, Math.min(100, Number(x) || 50)),
      y: Math.max(0, Math.min(100, Number(y) || 50)),
      demand: Math.max(1, Math.min(100, Number(demand) || 20)),
      readyTime: Number(readyTime) || 8.0,
      dueTime: Number(dueTime) || 16.0,
      serviceTime: Number(serviceTime) || 0.3,
      priority
    });

    // Reset form
    setName('');
    onCloseModal();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-base">Customer Demand & SLA Manifest ({customers.length})</h3>
        </div>
        <button
          onClick={onCloseModal} // Note: Parent controls opening via navbar, but if needed we can trigger
          className="hidden" // Handled by navbar
        ></button>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Customer Name</th>
              <th className="py-2.5 px-3">Grid Coords (X,Y)</th>
              <th className="py-2.5 px-3">Demand (kg)</th>
              <th className="py-2.5 px-3">Time Window</th>
              <th className="py-2.5 px-3">Svc Time</th>
              <th className="py-2.5 px-3">Priority SLA</th>
              <th className="py-2.5 px-3">Assignment</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {customers.map(c => {
              const vAssigned = assignmentMap.get(c.id);
              const isInfeasible = unassignedCustomers.some(u => u.id === c.id);

              return (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors font-sans">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{c.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{c.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">({c.x}, {c.y})</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{c.demand} kg</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{c.readyTime}:00 - {c.dueTime}:00</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{(c.serviceTime * 60).toFixed(0)}m</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                      c.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                      c.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {isInfeasible ? (
                      <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-bold">
                        UNASSIGNED
                      </span>
                    ) : vAssigned ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                        {vAssigned}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onDeleteCustomer(c.id)}
                      title="Remove customer"
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* Add Customer Modal Overlay */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" /> Add New Customer Location
              </h3>
              <button onClick={onCloseModal} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer / Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memorial Medical Center"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grid X (0-100)</label>
                  <input type="number" min="0" max="100" value={x} onChange={e => setX(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grid Y (0-100)</label>
                  <input type="number" min="0" max="100" value={y} onChange={e => setY(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Demand Units (kg)</label>
                  <input type="number" min="1" max="100" value={demand} onChange={e => setDemand(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority Level</label>
                  <select value={priority} onChange={e => setPriority(e.target.value as PriorityLevel)} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ready Time (hr)</label>
                  <input type="number" step="0.5" min="0" max="23" value={readyTime} onChange={e => setReadyTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Time (hr)</label>
                  <input type="number" step="0.5" min="1" max="24" value={dueTime} onChange={e => setDueTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Service (hr)</label>
                  <input type="number" step="0.1" min="0.1" max="3" value={serviceTime} onChange={e => setServiceTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Adding a customer triggers instant multi-objective re-insertion on the next Optimize turn.</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={onCloseModal} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 shadow">Create Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
