import React from 'react';
import { AlertFeed } from '../AlertFeed';
import { ShieldCheck, Database } from 'lucide-react';

export const ESView = ({ alerts }) => {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/20 rounded-lg text-success">
                        <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Expert System Diagnostics</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
                    <Database size={14} />
                    <span>200+ Rules Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-2 h-full flex flex-col">
                    <div className="bg-surface border border-white/5 rounded-xl p-6 flex-1 overflow-auto">
                        <AlertFeed alerts={alerts} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-surface border border-white/5 rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4">Inference Engine Status</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Rule Processing Cost</span>
                                    <span className="text-success">12ms</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full"><div className="w-[15%] bg-success h-full rounded-full"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Knowledge Base Hit Rate</span>
                                    <span className="text-primary">98.5%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full"><div className="w-[98%] bg-primary h-full rounded-full"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
