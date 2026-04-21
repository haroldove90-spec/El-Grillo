import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Download, ExternalLink, Calendar, Car, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Certificate {
  id: string;
  orderNumber: string;
  client: string;
  vehicle: string;
  plate: string;
  date: string;
  expiryDate: string;
  score: number;
}

const SAMPLE_CERTIFICATES: Certificate[] = [
  {
    id: '1',
    orderNumber: '1004',
    client: 'Claudia Mendoza',
    vehicle: 'Honda Civic 2020',
    plate: 'HND-20-Civ',
    date: '2026-04-15',
    expiryDate: '2026-10-15',
    score: 98
  },
  {
    id: '2',
    orderNumber: '1008',
    client: 'Gabriela Torres',
    vehicle: 'BMW 330i 2021',
    plate: 'BMW-33-I',
    date: '2026-04-18',
    expiryDate: '2026-10-18',
    score: 100
  },
  {
    id: '3',
    orderNumber: '992',
    client: 'Juan Pérez',
    vehicle: 'Toyota Corolla 2019',
    plate: 'TPZ-22-90',
    date: '2026-03-20',
    expiryDate: '2026-09-20',
    score: 95
  }
];

export function CertificadoView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SAMPLE_CERTIFICATES.map((cert) => (
          <motion.div 
            key={cert.id}
            whileHover={{ y: -5 }}
            className="card !p-0 overflow-hidden border border-brand-border/50 bg-brand-sidebar shadow-2xl relative group"
          >
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-br from-brand-sidebar to-brand-black p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Award size={120} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className="bg-brand-accent/20 border border-brand-accent/20 p-2 rounded-xl">
                  <Award className="text-brand-accent" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">Certificado Premium</p>
                  <p className="text-xl font-black text-white italic">#{cert.orderNumber}</p>
                </div>
              </div>
              <div className="relative z-10">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cert.score}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-brand-accent" 
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Salud Vehicular</span>
                    <span className="text-[10px] font-black text-brand-accent italic">{cert.score}/100</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Titular</p>
                    <p className="text-sm font-black text-white italic uppercase">{cert.client}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Car size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vehículo</p>
                    <p className="text-sm font-black text-white italic uppercase">{cert.vehicle}</p>
                    <p className="text-[10px] font-bold text-brand-red uppercase mt-1">Placas: {cert.plate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border/30">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={12} className="text-brand-accent" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Emisión</span>
                        </div>
                        <p className="text-[11px] font-bold text-white italic">{cert.date}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck size={12} className="text-brand-green" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Garantía</span>
                        </div>
                        <p className="text-[11px] font-bold text-white italic">{cert.expiryDate}</p>
                    </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-brand-accent text-brand-sidebar py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/10">
                  <Download size={14} /> Descargar PDF
                </button>
                <button className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-colors">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute bottom-6 right-6 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                <CheckCircle2 size={64} className="text-brand-accent" />
            </div>
          </motion.div>
        ))}

        {/* Create New Certificate Button */}
        <div className="border-2 border-dashed border-brand-border rounded-[2.5rem] flex flex-col items-center justify-center p-8 gap-4 opacity-40 hover:opacity-100 hover:border-brand-accent transition-all cursor-pointer bg-brand-sidebar/20 group">
          <div className="w-16 h-16 rounded-[1.5rem] bg-brand-sidebar border border-brand-border flex items-center justify-center text-slate-500 group-hover:text-brand-accent group-hover:border-brand-accent transition-all">
            <Award size={32} />
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-white uppercase tracking-widest italic mb-1">Nuevo Certificado</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Emitir Garantía Premium</p>
          </div>
        </div>
      </div>

      <div className="card border border-brand-border/50 bg-brand-accent/5 p-8 rounded-[3rem]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-brand-accent text-brand-sidebar flex items-center justify-center shadow-2xl shadow-brand-accent/20 shrink-0">
             <ShieldCheck size={40} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Protocolo de Confianza El Grillo</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed italic max-w-2xl">
              Cada certificado emitido por nuestro taller respalda estrictamente la calidad de las refacciones utilizadas y la mano de obra certificada. Nuestro sistema de escaneo pre-entrega asegura que el 100% de los puntos de seguridad han sido validados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
