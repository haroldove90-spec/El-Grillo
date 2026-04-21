import React from 'react';
import { Users, UserPlus, Mail, Phone, BadgeCheck, Wrench, Star, Pencil, Trash2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface Staff {
  id: string;
  name: string;
  role: 'Mecánico A' | 'Mecánico B' | 'Asesor' | 'Gerente' | 'Eléctrico';
  phone: string;
  email: string;
  efficiency: number;
  startDate: string;
  specialty: string;
}

const SAMPLE_STAFF: Staff[] = [
  {
    id: '1',
    name: 'Juan "El Profe" Reyes',
    role: 'Mecánico A',
    email: 'juan.reyes@elgrillo.com',
    phone: '551-234-5678',
    efficiency: 95,
    startDate: '2020-01-15',
    specialty: 'Transmisiones & Motores'
  },
  {
    id: '2',
    name: 'Marco Antonio Sosa',
    role: 'Mecánico B',
    email: 'marco.sosa@elgrillo.com',
    phone: '552-345-6789',
    efficiency: 88,
    startDate: '2022-06-10',
    specialty: 'Suspensión & Frenos'
  },
  {
    id: '3',
    name: 'Karla Valencia',
    role: 'Asesor',
    email: 'karla.v@elgrillo.com',
    phone: '553-456-7890',
    efficiency: 92,
    startDate: '2021-03-22',
    specialty: 'Atención & Refacciones'
  },
  {
    id: '4',
    name: 'Luis "Chispa" Luna',
    role: 'Eléctrico',
    email: 'luis.luna@elgrillo.com',
    phone: '554-567-8901',
    efficiency: 97,
    startDate: '2019-11-05',
    specialty: 'Diagnóstico Computarizado'
  }
];

export function PersonalView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
            <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest italic mb-1">Nómina & Equipo</p>
            <p className="text-sm text-slate-500 font-bold uppercase italic">Gestiona el talento humano de El Grillo</p>
        </div>
        <button className="bg-brand-accent text-brand-sidebar px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/20">
          <UserPlus size={16} /> Agregar Personal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {SAMPLE_STAFF.map((member) => (
          <motion.div 
            key={member.id}
            whileHover={{ y: -5 }}
            className="card !p-0 overflow-hidden border border-brand-border/50 bg-brand-sidebar shadow-2xl relative group"
          >
            <div className="p-8 text-center flex flex-col items-center">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-brand-border p-1 group-hover:border-brand-accent transition-colors">
                        <img 
                            src={`https://picsum.photos/seed/${member.id}/200`} 
                            alt={member.name} 
                            className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-brand-sidebar border border-brand-border p-2 rounded-xl text-brand-accent shadow-xl">
                        <BadgeCheck size={18} />
                    </div>
                </div>

                <h3 className="text-sm font-black text-white italic uppercase tracking-tight mb-1">{member.name}</h3>
                <span className="text-[10px] font-black text-brand-accent bg-brand-accent/5 border border-brand-accent/10 px-3 py-1 rounded-full uppercase tracking-widest italic">{member.role}</span>
                
                <div className="w-full mt-6 space-y-4">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Especialidad</span>
                        <span className="text-xs font-bold text-slate-300 italic">{member.specialty}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-brand-border/30">
                        <div className="flex flex-col items-center text-center">
                            <Star className="text-brand-yellow mb-1" size={14} />
                            <span className="text-[10px] font-black text-white italic">{member.efficiency}%</span>
                        </div>
                        <div className="flex flex-col items-center text-center border-l border-brand-border/30">
                            <Calendar className="text-slate-500 mb-1" size={14} />
                            <span className="text-[10px] font-black text-white italic">{new Date(member.startDate).getFullYear()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-brand-black/40 p-4 border-t border-brand-border/50 flex justify-between items-center">
                <div className="flex gap-2">
                    <a href={`tel:${member.phone}`} className="p-2 rounded-lg bg-brand-sidebar border border-brand-border text-slate-400 hover:text-brand-accent transition-colors">
                        <Phone size={14} />
                    </a>
                    <a href={`mailto:${member.email}`} className="p-2 rounded-lg bg-brand-sidebar border border-brand-border text-slate-400 hover:text-brand-accent transition-colors">
                        <Mail size={14} />
                    </a>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <Pencil size={14} />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-brand-red transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card !p-8 bg-brand-sidebar border border-brand-border flex items-center justify-between rounded-[2.5rem]">
         <div className="flex items-center gap-6">
             <div className="p-4 bg-brand-sidebar border-2 border-brand-accent/20 rounded-2xl text-brand-accent shadow-2xl shadow-brand-accent/5">
                <Users size={32} />
             </div>
             <div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Resumen de Plantilla</h4>
                <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">4 Miembros Activos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">100% Capacitados</span>
                    </div>
                </div>
             </div>
         </div>
         <div className="hidden lg:flex gap-4">
             {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-sidebar -ml-4 ring-2 ring-brand-sidebar overflow-hidden shadow-xl">
                    <img src={`https://picsum.photos/seed/staff${i}/100`} className="w-full h-full object-cover" />
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
}
