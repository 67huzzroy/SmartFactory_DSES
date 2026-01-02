import React, { useState, useMemo } from 'react';
import { Modal } from './common/Modal';
import { WhatIfControls } from './WhatIfControls';
import { AlertFeed } from './AlertFeed';
import { Search, ArrowLeft, TrendingDown } from 'lucide-react';

const SPECIFIC_ALERTS = {
    'M-080': [
        { machine_id: 'M-080', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' },
        { machine_id: 'M-080', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
    'M-103': [{ machine_id: 'M-103', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' }],
    'M-105': [{ machine_id: 'M-105', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-151': [{ machine_id: 'M-151', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-162': [
        { machine_id: 'M-162', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' },
        { machine_id: 'M-162', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
    'M-182': [{ machine_id: 'M-182', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-212': [{ machine_id: 'M-212', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' }],
    'M-221': [{ machine_id: 'M-221', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-229': [{ machine_id: 'M-229', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' }],
    'M-241': [
        { machine_id: 'M-241', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' },
        { machine_id: 'M-241', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
    'M-261': [
        { machine_id: 'M-261', condition: 'Motor Misalignment', confidence: 0.87, reasoning: 'High vibration with increased power draw suggests motor shaft misalignment.', action: 'Schedule realignment during next shift.' },
        { machine_id: 'M-261', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
    'M-265': [{ machine_id: 'M-265', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-274': [
        { machine_id: 'M-274', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' },
        { machine_id: 'M-274', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
    'M-279': [
        { machine_id: 'M-279', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' },
        { machine_id: 'M-279', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
    'M-313': [{ machine_id: 'M-313', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-321': [{ machine_id: 'M-321', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-434': [{ machine_id: 'M-434', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-461': [{ machine_id: 'M-461', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-464': [
        { machine_id: 'M-464', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' },
        { machine_id: 'M-464', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
    'M-482': [{ machine_id: 'M-482', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }],
    'M-491': [
        { machine_id: 'M-491', condition: 'Likely Bearing Failure', confidence: 0.94, reasoning: 'Simultaneous high vibration (>90Hz) and temperature (>80C) indicates mechanical friction consistent with bearing seizure.', action: 'Immediate shutdown recommended. Replace bearing assembly.' },
        { machine_id: 'M-491', condition: 'Coolant System Degradation', confidence: 0.92, reasoning: 'Temperature critical (>95C) without corresponding vibration spike points to thermal management failure.', action: 'Check coolant levels and pump function.' }
    ],
};

export const MachineListModal = ({ isOpen, onClose, machineList = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMachine, setSelectedMachine] = useState(null);

    const filteredMachines = machineList.filter(m =>
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMachineClick = (machine) => {
        setSelectedMachine(machine);
    };

    const handleBackToList = () => {
        setSelectedMachine(null);
    };

    const getMachineAlerts = (machineId) => {
        return SPECIFIC_ALERTS[machineId] || [];
    };

    const handleClose = () => {
        setSelectedMachine(null);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={selectedMachine ? `Machine Details: ${selectedMachine.id}` : "Virtual Units Detail List"}
            maxWidth="max-w-5xl"
        >
            {selectedMachine ? (
                // Detailed Drill-Down View
                <div className="space-y-6 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2 sticky top-0 bg-surface z-10 py-2 w-full border-b border-white/5"
                    >
                        <ArrowLeft size={16} /> Back to List
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Col: DSS */}
                        <div className="space-y-6">
                            <WhatIfControls machineId={selectedMachine.id} />

                            <div className="bg-surface border border-white/5 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingDown className="text-warning" size={24} />
                                    <h3 className="font-lg font-bold text-white">Efficiency Forecast</h3>
                                </div>
                                <p className="text-base text-gray-300 leading-relaxed">
                                    Based on current operating parameters, overall plant efficiency is projected to degrade by
                                    <span className="text-warning font-bold"> 1.5% </span>
                                    over the next 4 hours due to thermal throttling in Sector 7.
                                </p>
                            </div>
                        </div>

                        {/* Right Col: Expert System */}
                        <div className="space-y-4">
                            {/* Header removed here as AlertFeed has its own */}
                            <div className="h-full">
                                <div className="bg-surface border border-white/5 rounded-xl p-6 mb-6">
                                    <h3 className="font-lg font-bold text-white mb-2">Expert System Diagnostics</h3>
                                    <p className="text-sm text-gray-400 mb-4">
                                        {selectedMachine.diagnostics?.details || "Routine scan complete."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t border-white/5 pt-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span>Rule Processing Cost</span>
                                                <span className="text-gray-300 font-mono">{selectedMachine.diagnostics?.ruleProcessingCost}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Knowledge Base Hit Rate</span>
                                                <span className="text-gray-300 font-mono">{selectedMachine.diagnostics?.kbHitRate}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span>Current Reliability</span>
                                                <span className="text-success font-bold">{selectedMachine.diagnostics?.reliability}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Projected (4h)</span>
                                                <span className="text-warning font-bold">{selectedMachine.diagnostics?.projected}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <AlertFeed alerts={getMachineAlerts(selectedMachine.id)} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // List View
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or Condition..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[60vh] overflow-auto custom-scrollbar rounded-lg border border-white/5">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#0c0c0e] z-10">
                                <tr>
                                    <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/10">Unit ID</th>
                                    <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/10">Status</th>
                                    <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/10">Alert Signal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMachines.map((machine) => (
                                    <tr
                                        key={machine.id}
                                        onClick={() => handleMachineClick(machine)}
                                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-3 text-sm font-mono text-gray-300 group-hover:text-primary transition-colors">{machine.id}</td>
                                        <td className="p-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${machine.status === 'ON' ? 'bg-success' : 'bg-gray-500'}`} />
                                                <span className={machine.status === 'ON' ? 'text-white' : 'text-gray-500'}>
                                                    {machine.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${machine.color}`}>
                                                {machine.condition}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-white/5">
                        <span>Showing {filteredMachines.length} of 500 units</span>
                        <span>Shift A Active</span>
                    </div>
                </div>
            )}
        </Modal>
    );
};
