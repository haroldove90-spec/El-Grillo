import React, { useState } from 'react';
import { CheckCircle2, Circle, Car, Disc, Fuel, FlaskConical, Battery, Zap, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface InspectionItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const INSPECTION_ITEMS: InspectionItem[] = [
  { id: 'fuel', label: 'Nivel de Gasolina', icon: Fuel },
  { id: 'oil', label: 'Nivel de Aceite', icon: FlaskConical },
  { id: 'coolant', label: 'Anticongelante', icon: FlaskConical },
  { id: 'battery', label: 'Estado Batería', icon: Battery },
  { id: 'spare', label: 'Llanta Refacción', icon: Disc },
  { id: 'jack', label: 'Gato y Herramienta', icon: Zap },
  { id: 'stereo', label: 'Estéreo / Pantalla', icon: ShieldAlert },
  { id: 'scratches', label: 'Sin Rayones Ni Golpes', icon: Car },
];

export function InventoryChecklist({ onChange }: { onChange: (results: Record<string, boolean>) => void }) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    const newChecks = { ...checks, [id]: !checks[id] };
    setChecks(newChecks);
    onChange(newChecks);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-brand-accent mb-4">
          <Car size={20} className="shrink-0" />
          <h4 className="text-[11px] font-black uppercase tracking-widest italic">Inventario de Recepción</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INSPECTION_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleCheck(item.id)}
            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
              checks[item.id] 
                ? 'bg-brand-accent/10 border-brand-accent shadow-lg shadow-brand-accent/5' 
                : 'bg-brand-sidebar border-brand-border'
            }`}
          >
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-xl transition-colors ${checks[item.id] ? 'bg-brand-accent text-brand-sidebar' : 'bg-slate-800 text-slate-400'}`}>
                  <item.icon size={16} />
               </div>
               <span className={`text-[11px] uppercase font-black tracking-tight ${checks[item.id] ? 'text-white' : 'text-slate-400'}`}>
                 {item.label}
               </span>
            </div>
            {checks[item.id] ? (
              <CheckCircle2 size={18} className="text-brand-accent" />
            ) : (
              <Circle size={18} className="text-slate-700" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-brand-sidebar border border-dashed border-brand-border rounded-2xl text-center">
         <p className="text-[10px] font-bold text-slate-500 italic">
            Marque todos los elementos presentes o en buen estado al recibir el vehículo.
         </p>
      </div>
    </div>
  );
}
