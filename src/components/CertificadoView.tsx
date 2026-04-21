import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, Download, ExternalLink, Calendar, Car, User, X, Save, Trash2 as TrashIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfService } from '../services/pdfService';

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

const INITIAL_CERTIFICATES: Certificate[] = [
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
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este certificado?')) {
      setCertificates(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      id: editingCert?.id || Math.random().toString(36).substr(2, 9),
      orderNumber: formData.get('orderNumber'),
      client: formData.get('client'),
      vehicle: formData.get('vehicle'),
      plate: formData.get('plate'),
      date: formData.get('date'),
      expiryDate: formData.get('expiryDate'),
      score: Number(formData.get('score')) || 100,
    };

    if (editingCert) {
      setCertificates(prev => prev.map(c => c.id === editingCert.id ? data : c));
    } else {
      setCertificates(prev => [...prev, data]);
    }
    setIsModalOpen(false);
    setEditingCert(null);
  };

  const handleDownload = (cert: Certificate) => {
    PdfService.generateCertificate(cert);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
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
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingCert(cert); setIsModalOpen(true); }}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                  >
                    <PencilIcon size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-brand-red transition-colors"
                  >
                    <TrashIcon size={14} />
                  </button>
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
                <button 
                  onClick={() => handleDownload(cert)}
                  className="flex-1 bg-brand-accent text-brand-sidebar py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/10"
                >
                  <Download size={14} /> Descargar PDF
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
        <div 
          onClick={() => { setEditingCert(null); setIsModalOpen(true); }}
          className="border-2 border-dashed border-brand-border rounded-[2.5rem] flex flex-col items-center justify-center p-8 gap-4 opacity-40 hover:opacity-100 hover:border-brand-accent transition-all cursor-pointer bg-brand-sidebar/20 group"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-brand-sidebar border border-brand-border flex items-center justify-center text-slate-500 group-hover:text-brand-accent group-hover:border-brand-accent transition-all">
            <Award size={32} />
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-white uppercase tracking-widest italic mb-1">Nuevo Certificado</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Emitir Garantía Premium</p>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsModalOpen(false); setEditingCert(null); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative bg-brand-sidebar border border-brand-border w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {editingCert ? 'Editar Certificado' : 'Nuevo Certificado'}
                  </h3>
                  <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-2 italic">Emisión de Garantía El Grillo</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setEditingCert(null); }} className="p-2 rounded-xl bg-white/5 text-slate-muted hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Orden #</label>
                    <input name="orderNumber" defaultValue={editingCert?.orderNumber} required className="w-full bg-brand-black/40 border border-brand-border rounded-xl p-3 text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Cliente</label>
                    <input name="client" defaultValue={editingCert?.client} required className="w-full bg-brand-black/40 border border-brand-border rounded-xl p-3 text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Vehículo</label>
                    <input name="vehicle" defaultValue={editingCert?.vehicle} required className="w-full bg-brand-black/40 border border-brand-border rounded-xl p-3 text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Placas</label>
                    <input name="plate" defaultValue={editingCert?.plate} required className="w-full bg-brand-black/40 border border-brand-border rounded-xl p-3 text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Fecha Emisión</label>
                    <input name="date" type="date" defaultValue={editingCert?.date || new Date().toISOString().split('T')[0]} required className="w-full bg-brand-black/40 border border-brand-border rounded-xl p-3 text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Fecha Vencimiento</label>
                    <input name="expiryDate" type="date" defaultValue={editingCert?.expiryDate} required className="w-full bg-brand-black/40 border border-brand-border rounded-xl p-3 text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Puntaje Salud (0-100)</label>
                    <input name="score" type="number" min="0" max="100" defaultValue={editingCert?.score || 100} required className="w-full bg-brand-black/40 border border-brand-border rounded-xl p-3 text-sm focus:border-brand-accent outline-none" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => { setIsModalOpen(false); setEditingCert(null); }} className="flex-1 bg-white/5 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 bg-brand-accent text-brand-sidebar py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-accent/10">
                    <Save size={16} /> Guardar Certificado
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

function PencilIcon({ size }: { size: number }) {
  return <Pencil size={size} />;
}

import { Pencil } from 'lucide-react';
