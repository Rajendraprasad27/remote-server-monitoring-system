
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Alert } from '../types';
import { ICONS } from '../constants';

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  const fetchAlerts = async () => {
    try {
      const data = await apiService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await apiService.resolveAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    } catch (err) {
      alert('Failed to resolve alert');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">System Alerts</h1>
          <p className="text-slate-400 mt-1">Investigate and resolve operational incidents across nodes.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
          {(['ALL', 'CRITICAL', 'WARNING'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-slate-500">Retrieving alert history...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border-dashed border-2 border-white/5">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <ICONS.Sparkles className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">All Clear!</h3>
            <p className="text-slate-500 mt-2">No active {filter !== 'ALL' ? filter.toLowerCase() : ''} alerts found for this segment.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';
            const severityColor = isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400';
            const severityBg = isCritical ? 'bg-red-500/10' : isWarning ? 'bg-yellow-500/10' : 'bg-blue-500/10';

            return (
              <div 
                key={alert.id} 
                className={`glass-card rounded-2xl p-6 border transition-all ${
                  alert.resolved ? 'opacity-50 border-white/5' : isCritical ? 'border-red-500/30' : 'border-white/10'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className={`p-4 rounded-xl ${severityBg} border border-white/5 hidden md:block`}>
                    <ICONS.Alerts className={`w-8 h-8 ${severityColor}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${severityColor} ${severityBg}`}>
                        {alert.severity}
                      </span>
                      <span className="text-slate-500 text-xs font-medium">Server: <span className="text-slate-300">{alert.serverName}</span></span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-slate-500 text-xs">{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{alert.message}</h4>
                    <p className="text-slate-400 text-sm">Potential infrastructure bottleneck detected. Manual review recommended.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {alert.resolved ? (
                      <div className="flex items-center gap-2 text-green-500 font-bold text-sm bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Resolved
                      </div>
                    ) : (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
                      >
                        Acknowledge & Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
