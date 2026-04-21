import React, { useState } from 'react';
import { calculateSemaforoStatus } from '../utils/mechanicsLogic';
import { Wrench, AlertTriangle, CheckCircle2, Clock, Car, ClipboardCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function InspectionTool() {
  const [inspections, setInspections] = useState([
    { id: 1, name: 'Balatas Delanteras', wear: 15 },
    { id: 2, name: 'Amortiguadores', wear: 45 },
    { id: 3, name: 'Llantas (Profundidad)', wear: 85 },
    { id: 4, name: 'Banda de Distribución', wear: 10 },
  ]);

  const updateWear = (id: number, val: number) => {
    setInspections(prev => prev.map(i => i.id === id ? { ...i, wear: val } : i));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">Inspección de Semáforo</h2>
          <p className="text-xs text-brand-yellow font-bold tracking-widest uppercase mt-1">Calibración de vida útil por componente</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-2xl border border-brand-border">
          <Car size={24} className="text-slate-muted" />
          <div>
            <p className="text-xs font-black text-white">VW GOLF GTI - GRL-1020</p>
            <p className="text-[10px] text-slate-500 uppercase font-black">Orden #2045</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inspections.map((item) => {
          const status = calculateSemaforoStatus(item.wear);
          return (
            <motion.div 
              layout
              key={item.id} 
              className={`card !p-6 transition-all duration-500 border-l-8 ${
                 status === 'Red' ? 'border-l-red-500 bg-red-500/5' : 
                 status === 'Yellow' ? 'border-l-brand-yellow bg-brand-yellow/5' : 
                 'border-l-brand-green bg-brand-green/5'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-white uppercase text-sm tracking-tight">{item.name}</h3>
                  <p className="text-[10px] text-slate-muted font-bold mt-1">SISTEMA MECÁNICO</p>
                </div>
                <div className={`p-2 rounded-xl ${
                   status === 'Red' ? 'text-red-500 bg-red-500/10' : 
                   status === 'Yellow' ? 'text-brand-yellow bg-brand-yellow/10' : 
                   'text-brand-green bg-brand-green/10'
                }`}>
                  {status === 'Red' ? <AlertTriangle size={20} /> : status === 'Yellow' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black italic">
                   <span className="text-slate-muted uppercase tracking-widest">Nivel de Desgaste</span>
                   <span className={status === 'Red' ? 'text-red-500' : status === 'Yellow' ? 'text-brand-yellow' : 'text-brand-green'}>
                      {item.wear}%
                   </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={item.wear} 
                  onChange={(e) => updateWear(item.id, Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                />
                
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-white uppercase tracking-tighter">
                     {status === 'Red' ? '⚠️ Cambio Urgente: Riesgo Detectado' : 
                      status === 'Yellow' ? '⚡ Sugerido: Planificar reemplazo' : 
                      '✅ Estado Óptimo: Seguro para conducir'}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-8 py-4 bg-slate-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest border border-brand-border active:scale-95 transition-all">
          GUARDAR BORRADOR
        </button>
        <button className="px-8 py-4 bg-brand-yellow text-brand-sidebar font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-brand-yellow/20 active:scale-95 transition-all flex items-center gap-2">
          <ClipboardCheck size={18} />
          FIRMAR INSPECCIÓN
        </button>
      </div>
    </div>
  );
}
