import React from 'react';
import { CreditCard, Banknote, MapPin, MessageSquare, ExternalLink, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatMexicanPhone, generateWhatsAppMessage } from '../utils/mechanicsLogic';

type ServiceStatus = 'Recepcion' | 'Diagnostico' | 'En Reparacion' | 'Listo';

interface Order {
  id: string;
  orderNumber: string;
  client: string;
  phone: string;
  vehicle: string;
  plate: string;
  paymentType: 'Card' | 'Cash';
  status: ServiceStatus;
  total: number;
  services: string[];
}

const COLUMNS: { label: ServiceStatus; title: string }[] = [
  { label: 'Recepcion', title: 'Recepción' },
  { label: 'Diagnostico', title: 'Diagnóstico' },
  { label: 'En Reparacion', title: 'En Reparación' },
  { label: 'Listo', title: 'Listo' },
];

const MOCK_ORDERS: Order[] = [
  { id: '1', orderNumber: '2045', client: 'Juan Pérez', phone: '5512345678', vehicle: 'VW Golf GTI 2019', plate: 'GRL-1020', paymentType: 'Card', status: 'Recepcion', total: 1200, services: ['Cambio de Aceite'] },
  { id: '2', orderNumber: '2046', client: 'María Sosa', phone: '5588776655', vehicle: 'Toyota Hilux 2022', plate: 'MEX-9988', paymentType: 'Cash', status: 'Diagnostico', total: 3500, services: ['Revisión Eléctrica', 'A/C'] },
  { id: '3', orderNumber: '2047', client: 'Roberto Ruiz', phone: '5566778899', vehicle: 'Honda CR-V 2015', plate: 'ABC-5566', paymentType: 'Card', status: 'En Reparacion', total: 5400, services: ['Frenos', 'Suspensión'] },
  { id: '4', orderNumber: '2048', client: 'Elena Blanco', phone: '5522334455', vehicle: 'Ford Mustang 2021', plate: 'GRL-7722', paymentType: 'Cash', status: 'En Reparacion', total: 8900, services: ['Mecánica General'] },
  { id: '5', orderNumber: '2049', client: 'Carlos Ten', phone: '5599887766', vehicle: 'Nissan Versa 2018', plate: 'XYZ-1122', paymentType: 'Card', status: 'Listo', total: 2100, services: ['Afinación'] },
];

export function KanbanBoard() {
  const handleWhatsAppAction = (order: Order) => {
    const phone = formatMexicanPhone(order.phone);
    const message = generateWhatsAppMessage({
      client: order.client,
      vehicle: order.vehicle,
      status: order.status,
      services: order.services,
      total: order.total,
      orderNumber: order.orderNumber
    });
    
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <div key={col.label} className="flex-shrink-0 w-80 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-muted">{col.title}</h3>
            <span className="bg-brand-border text-slate-text text-[10px] px-2 py-0.5 rounded-full font-bold">
              {MOCK_ORDERS.filter((o) => o.status === col.label).length}
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {MOCK_ORDERS.filter((o) => o.status === col.label).map((order) => (
              <motion.div
                layoutId={order.id}
                key={order.id}
                className="card !p-4 hover:border-brand-accent/30 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-brand-accent font-bold">#{order.orderNumber}</span>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {order.paymentType === 'Card' ? (
                        <CreditCard size={14} className="text-brand-accent" />
                      ) : (
                        <Banknote size={14} className="text-brand-accent" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-bold text-white mb-0.5 leading-tight">{order.vehicle}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-muted font-mono uppercase">
                    <MapPin size={10} />
                    <span className="tracking-tighter">{order.plate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-brand-border/50">
                  <div className="flex items-center gap-2 max-w-[60%]">
                    <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-[8px] font-bold shrink-0">
                      {order.client.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-[11px] font-medium text-slate-muted truncate">{order.client}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleWhatsAppAction(order)}
                    className="flex items-center gap-2 bg-brand-accent text-brand-sidebar py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/10"
                  >
                    <MessageSquare size={12} strokeWidth={3} />
                    NOTIFICAR
                  </button>
                </div>

                {/* Decorative status gradient tab */}
                <div className={`absolute top-0 right-0 w-1 h-full ${
                  order.status === 'Listo' ? 'bg-brand-green' : 
                  order.status === 'En Reparacion' ? 'bg-brand-red' : 
                  'bg-brand-yellow'
                } opacity-30`} />
              </motion.div>
            ))}
            
            {MOCK_ORDERS.filter((o) => o.status === col.label).length === 0 && (
              <div className="border border-dashed border-brand-border rounded-xl h-32 flex flex-col items-center justify-center gap-2 opacity-30">
                <div className="p-2 border border-brand-border rounded-lg"><ExternalLink size={14} /></div>
                <span className="text-[9px] uppercase font-black tracking-widest">Sin Actividad</span>
              </div>
            )}
          </div>
        </div>
      ))}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
