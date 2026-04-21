import React, { useState } from 'react';
import { Search, UserPlus, Car, CheckSquare, FileText, ChevronRight, Phone } from 'lucide-react';
import { motion } from 'motion/react';

const SERVICES = [
  'Mecánica General', 'A/C y Calefacción', 'Sistema Eléctrico', 
  'Suspensión y Frenos', 'Fuel Injection', 'Marchas y Alternadores'
];

export function ReceptionForm() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (s: string) => {
    setSelectedServices(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col pb-20">
      <div className="mb-8 flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white">RECEPCIÓN</h2>
          <p className="text-xs text-brand-accent font-bold uppercase tracking-widest">NUEVA ORDEN DE SERVICIO</p>
        </div>
        <div className="text-xs font-mono text-slate-muted">PASO {step} DE 3</div>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2">
                <Phone size={14} /> Buscar Cliente
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="tel" 
                  placeholder="Teléfono del cliente..." 
                  className="w-full bg-brand-card border border-brand-border rounded-xl py-4 pl-12 pr-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              <button className="w-full py-4 rounded-xl border border-dashed border-brand-border flex items-center justify-center gap-3 text-sm font-bold text-slate-muted hover:text-white hover:border-brand-accent transition-all">
                <UserPlus size={18} />
                REGISTRAR NUEVO CLIENTE
              </button>
            </div>
            
            <div className="p-6 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><UserPlus size={48} /></div>
                <h4 className="text-xs font-bold text-brand-accent mb-1 tracking-widest uppercase">Info Rápida</h4>
                <p className="text-xs text-slate-text leading-relaxed">Si el cliente ya existe, cargaremos automáticamente su historial de vehículos y servicios previos.</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2">
                <Car size={14} /> Datos del Vehículo
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Marca (Ej: Toyota)" className="input-field" />
                <input type="text" placeholder="Modelo (Ej: Hilux)" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Año (Ej: 2022)" className="input-field" />
                <input type="text" placeholder="Placas (Ej: GRL-123)" className="input-field" />
              </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2">
                  <CheckSquare size={14} /> Checklist de Servicios
                </label>
                <div className="grid grid-cols-1 gap-2">
                    {SERVICES.map(service => (
                        <div 
                          key={service} 
                          onClick={() => toggleService(service)}
                          className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            selectedServices.includes(service) 
                              ? 'bg-brand-accent border-brand-accent text-brand-sidebar shadow-lg shadow-brand-accent/10' 
                              : 'bg-brand-card border-brand-border text-slate-text'
                          }`}
                        >
                            <span className="text-xs font-bold">{service.toUpperCase()}</span>
                            {selectedServices.includes(service) && <ChevronRight size={16} />}
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Notas de Diagnóstico Inicial
              </label>
              <textarea 
                rows={6} 
                placeholder="Describe los síntomas, ruidos o fallas reportadas por el cliente..."
                className="w-full bg-brand-card border border-brand-border rounded-xl p-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 outline-none transition-all placeholder:text-slate-600 resize-none h-40"
              />
            </div>

            <div className="card !bg-red-500/10 !border-red-500/30">
                <div className="flex gap-3">
                    <div className="p-2 bg-red-500 rounded-lg shrink-0 h-fit"><FileText size={18} className="text-white" /></div>
                    <div>
                        <h4 className="text-xs font-bold text-red-500 uppercase mb-1 tracking-widest">Aviso Técnico</h4>
                        <p className="text-xs text-slate-muted leading-relaxed italic">Estas notas son la base para el equipo de diagnóstico. Sea lo más detallado posible sobre los ruidos reportados.</p>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 left-6 max-w-md mx-auto flex gap-4">
        {step > 1 && (
            <button 
                onClick={() => setStep(s => s - 1)}
                className="w-1/3 bg-slate-800 text-white font-bold py-4 rounded-2xl border border-brand-border active:scale-95 transition-all text-xs"
            >
                ATRÁS
            </button>
        )}
        <button 
          onClick={() => step < 3 ? setStep(s => s + 1) : null}
          className={`flex-1 bg-brand-accent text-brand-sidebar font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-accent/20 text-xs ${step === 3 ? 'bg-brand-green text-white shadow-brand-green/20' : ''}`}
        >
          {step === 3 ? 'FINALIZAR REGISTRO' : 'CONTINUAR'}
          <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        .input-field {
            @apply w-full bg-brand-card border border-brand-border rounded-xl py-4 px-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 outline-none transition-all placeholder:text-slate-600;
        }
      `}</style>
    </div>
  );
}
