import React, { useState } from 'react';
import { Play, RotateCcw, Zap, TrendingDown } from 'lucide-react';
import api from '../api';

export const WhatIfControls = ({ machineId, onSimulate }) => {
    const [capacity, setCapacity] = useState(60);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const res = await api.post('/dss/simulate', {
                machine_id: machineId,
                parameter: 'capacity',
                value: capacity
            });
            setResult(res.data);
            if (onSimulate) onSimulate(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-white">Decision Support System</h3>
                <button
                    onClick={handleSimulate}
                    className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded transition-colors border border-white/10"
                >
                    Run What-If Analysis
                </button>
            </div>

            <div className="space-y-6">
                {result && (
                    <div className={`p-4 rounded-lg border ${result.energy_impact > 2 ? 'bg-danger/10 border-danger/30' : 'bg-success/10 border-success/30'}`}>
                        <div className="flex items-start gap-3">
                            {result.energy_impact > 2 ? <TrendingDown className="text-danger" /> : <Zap className="text-success" />}
                            <div>
                                <h4 className={`font-bold ${result.energy_impact > 2 ? 'text-danger' : 'text-success'}`}>
                                    {result.energy_impact > 2 ? 'Production Bottleneck Predicted' : 'Energy Optimization Possible'}
                                </h4>
                                <p className="text-sm text-gray-300 mt-1 mb-2">
                                    Adjusting capacity to {result.new_value}% leads to a {result.energy_impact}kW change in power draw.
                                    Output impact: {result.output_impact}%
                                </p>
                                <div className={`text-xs font-mono p-2 rounded bg-opacity-30 ${result.energy_impact > 2 ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                                    <strong>Recommended Schedule:</strong> Shift A ({result.new_value}%), Shift B (80%) to minimize energy spikes.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-gray-400 mb-4">
                        Machine Capacity Adjustment ({capacity}%)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={capacity}
                        onChange={(e) => setCapacity(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2 font-mono">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSimulate}
                        disabled={loading}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Calculating...' : <><Play size={16} /> Run Simulation</>}
                    </button>
                    <button
                        onClick={() => { setCapacity(60); setResult(null); }}
                        className="px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
