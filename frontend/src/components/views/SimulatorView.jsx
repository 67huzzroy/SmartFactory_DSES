import React from 'react';
import { TrendChart } from '../TrendChart';

export const SimulatorView = ({ data, onOpenMachineList }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Virtual Simulator</h2>
                <button
                    onClick={onOpenMachineList}
                    className="text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer border-b border-white/5 hover:border-primary/50 py-1"
                >
                    Real-time data stream from 500 virtual units
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-surface border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Temperature Monitor</h3>
                    <div className="h-[300px]">
                        <TrendChart data={data.history} type="temperature" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface border border-white/5 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Vibration Analysis</h3>
                        <div className="h-[250px]">
                            <TrendChart data={data.history} type="vibration" />
                        </div>
                    </div>
                    <div className="bg-surface border border-white/5 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Power Consumption</h3>
                        <div className="h-[250px]">
                            <TrendChart data={data.history} type="power" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
