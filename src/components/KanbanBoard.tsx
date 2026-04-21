import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, MapPin, MessageSquare, ExternalLink, Share2, MoreVertical, Trash2, Loader2, Gauge, ShieldCheck, CheckCircle2, Clock, Search, Wrench, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatMexicanPhone, generateWhatsAppMessage } from '../utils/mechanicsLogic';
import { db } from '../services/db';
import { SignaturePad } from './SignaturePad';

type ServiceStatus = 'Recepcion' | 'Diagnostico' | 'En Reparacion' | 'Listo' | 'Entregado';

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

const COLUMNS: { label: ServiceStatus; title: string; color: string }[] = [
  { label: 'Recepcion', title: 'Recepción', color: 'bg-brand-accent' },
  { label: 'Diagnostico', title: 'Diagnóstico', color: 'bg-brand-yellow' },
  { label: 'En Reparacion', title: 'En Reparación', color: 'bg-brand-red' },
  { label: 'Listo', title: 'Listo', color: 'bg-brand-green' },
  { label: 'Entregado', title: 'Entregado', color: 'bg-slate-600' },
];

export function KanbanBoard({ searchQuery = '' }: { searchQuery?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [finalizingOrderId, setFinalizingOrderId] = useState<string | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await db.orders.list();
      
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number.toString(),
        client: `${o.vehicles?.clients?.first_name} ${o.vehicles?.clients?.last_name}`,
        phone: o.vehicles?.clients?.phone || '',
        vehicle: `${o.vehicles?.make} ${o.vehicles?.model}`,
        plate: o.vehicles?.license_plate || 'S/P',
        paymentType: o.apply_iva ? 'Card' : 'Cash',
        status: o.status as ServiceStatus,
        total: o.total_amount || 0,
        services: o.notes ? [o.notes] : ['Servicio General']
      }));
      
      setOrders(mappedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: ServiceStatus) => {
    try {
      if (newStatus === 'Entregado') {
        setFinalizingOrderId(orderId);
        return;
      }
      await db.orders.updateStatus(orderId, newStatus);
      // Immediate reflection in UI
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Error al actualizar el estatus');
    }
  };

  const handleFinalizeSignature = async (signatureBase64: string) => {
    if (!finalizingOrderId) return;
    try {
        setLoading(true);
        await db.orders.updateStatus(finalizingOrderId, 'Entregado');
        setOrders(prev => prev.map(o => o.id === finalizingOrderId ? { ...o, status: 'Entregado' } : o));
        setFinalizingOrderId(null);
    } catch (err) {
        alert('Error al finalizar orden');
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!window.confirm(`¿Estás seguro de eliminar la orden del vehículo [${order.plate}]?`)) return;
    try {
      await db.orders.delete(order.id);
      setOrders(prev => prev.filter(o => o.id !== order.id));
      setActiveMenu(null);
    } catch (err) {
      alert('Error al eliminar la orden');
    }
  };

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

  const filteredOrders = orders.filter(o => 
    (o.client?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (o.plate?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    o.orderNumber.includes(searchQuery)
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-brand-accent animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="flex gap-4 lg:gap-6 h-full overflow-x-auto pb-6 pt-2 custom-scrollbar-h">
      {COLUMNS.map((col) => (
        <div key={col.label} className="flex-shrink-0 w-[300px] lg:w-80 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${col.color.replace('bg-', 'bg-')}`} />
               <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white italic">{col.title}</h3>
            </div>
            <span className="bg-brand-sidebar border border-brand-border text-slate-muted text-[9px] px-2 py-0.5 rounded-md font-black italic">
              {filteredOrders.filter((o) => o.status === col.label).length} ORDENES
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredOrders.filter((o) => o.status === col.label).map((order) => (
                <motion.div
                  layoutId={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={order.id}
                  onClick={() => setViewingOrder(order)}
                  className="card !p-5 group relative overflow-hidden border border-brand-border/50 hover:border-brand-accent/50 shadow-2xl transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-brand-accent italic bg-brand-accent/5 px-2 py-1 rounded-lg border border-brand-accent/10">#{order.orderNumber}</span>
                    </div>
                    <div className="relative">
                       <button 
                         onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === order.id ? null : order.id) }}
                         className="p-1.5 rounded-xl bg-brand-sidebar border border-brand-border text-slate-muted hover:text-white transition-all shadow-inner"
                       >
                         <MoreVertical size={14} />
                       </button>
                       
                       <AnimatePresence>
                         {activeMenu === order.id && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.9, y: -10 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.9, y: -10 }}
                             className="absolute right-0 top-10 w-44 bg-brand-sidebar border border-brand-border rounded-2xl shadow-2xl z-20 py-2 divide-y divide-brand-border/30 overflow-hidden"
                           >
                              <button 
                                onClick={(e) => { e.stopPropagation(); setViewingOrder(order); setActiveMenu(null); }}
                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-muted hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                              >
                                <ExternalLink size={12} /> Ver Detalles
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(order); }}
                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-brand-red hover:bg-brand-red/10 flex items-center gap-3 transition-colors"
                              >
                                <Trash2 size={12} /> Eliminar
                              </button>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-black text-white mb-2 leading-tight uppercase italic">{order.vehicle}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black italic">
                      <span className="text-brand-red bg-brand-red/10 px-2 py-0.5 rounded border border-brand-red/10">{order.plate}</span>
                      <span className="text-slate-500 uppercase tracking-widest font-bold">Placas</span>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 custom-scrollbar-h" onClick={(e) => e.stopPropagation()}>
                    {COLUMNS.map(c => (
                      <button 
                        key={c.label}
                        onClick={() => handleStatusChange(order.id, c.label)}
                        className={`p-2 rounded-xl transition-all border ${order.status === c.label ? `${c.color} text-brand-sidebar border-transparent shadow-lg scale-110` : 'bg-brand-sidebar border-brand-border text-slate-600 hover:border-slate-500'}`}
                        title={c.title}
                      >
                         {c.label === 'Recepcion' && <Clock size={10} />}
                         {c.label === 'Diagnostico' && <Search size={10} />}
                         {c.label === 'En Reparacion' && <Wrench size={10} />}
                         {c.label === 'Listo' && <CheckCircle2 size={10} />}
                         {c.label === 'Entregado' && <ShieldCheck size={10} />}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-brand-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-brand-border flex items-center justify-center text-[10px] font-black text-slate-muted italic uppercase">
                        {order.client?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-white uppercase truncate max-w-[80px]">{order.client}</span>
                         {order.total > 0 && <span className="text-[10px] font-black text-brand-green italic tracking-tighter">${order.total.toLocaleString()}</span>}
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleWhatsAppAction(order); }}
                      className="flex items-center gap-2 bg-brand-accent text-brand-sidebar py-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/20"
                    >
                      <MessageSquare size={14} strokeWidth={3} />
                      AVISAR
                    </button>
                  </div>

                  <div className={`absolute top-0 right-0 w-1.5 h-full ${
                    order.status === 'Listo' ? 'bg-brand-green' : 
                    order.status === 'En Reparacion' ? 'bg-brand-red' : 
                    order.status === 'Diagnostico' ? 'bg-brand-yellow' :
                    order.status === 'Recepcion' ? 'bg-brand-accent' :
                    'bg-slate-700'
                  } opacity-40`} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredOrders.filter((o) => o.status === col.label).length === 0 && (
              <div className="border-2 border-dashed border-brand-border rounded-[2rem] h-40 flex flex-col items-center justify-center gap-3 opacity-20 hover:opacity-40 transition-all group">
                <div className="p-3 border border-brand-border rounded-2xl bg-brand-sidebar group-hover:scale-110 transition-transform"><Gauge size={24} className="text-slate-600" /></div>
                <span className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-600 italic">Despejado</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Order Details Modal */}
      <AnimatePresence>
        {viewingOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingOrder(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-brand-sidebar border border-brand-border w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                         <FileText size={32} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Orden #{viewingOrder.orderNumber}</h3>
                         <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-2">{viewingOrder.status} - El Grillo Automotriz</p>
                      </div>
                   </div>
                   <button onClick={() => setViewingOrder(null)} className="p-2 rounded-xl bg-white/5 text-slate-muted hover:text-white"><Trash2 size={24} className="rotate-45" /></button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cliente y Contacto</p>
                      <div className="p-4 bg-brand-black/40 rounded-2xl border border-brand-border">
                         <p className="text-sm font-black text-white italic uppercase">{viewingOrder.client}</p>
                         <p className="text-xs text-brand-accent font-bold mt-1">{viewingOrder.phone}</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vehículo Registrado</p>
                      <div className="p-4 bg-brand-black/40 rounded-2xl border border-brand-border">
                         <p className="text-sm font-black text-white italic uppercase">{viewingOrder.vehicle}</p>
                         <p className="text-xs text-brand-red font-bold mt-1 uppercase tracking-widest">Placas: {viewingOrder.plate}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Servicios y Diagnóstico</p>
                   <div className="p-6 bg-brand-black/40 rounded-2xl border border-brand-border min-h-[120px]">
                      <ul className="space-y-3">
                         {viewingOrder.services.map((s, idx) => (
                            <li key={idx} className="flex gap-3 text-xs text-slate-300 font-medium leading-relaxed italic">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-1.5" />
                               {s}
                            </li>
                         ))}
                      </ul>
                   </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent"><CreditCard size={20} /></div>
                      <div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Presupuesto Estimado</p>
                         <p className="text-xl font-black text-brand-green italic">${viewingOrder.total.toLocaleString()}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleWhatsAppAction(viewingOrder)}
                     className="bg-brand-accent text-brand-sidebar px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/10"
                   >
                     RE-NOTIFICAR CLIENTE
                   </button>
                </div>

                {/* Photos Simulation */}
                <div className="mt-8 space-y-4">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Evidencia Fotográfica</p>
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="aspect-video bg-white/5 rounded-xl border border-brand-border flex items-center justify-center overflow-hidden relative group">
                           <img src={`https://picsum.photos/seed/grillo${i}/400/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {finalizingOrderId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFinalizingOrderId(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-brand-sidebar border border-brand-border w-full max-w-xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex items-center gap-5 mb-8">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-brand-accent/10 flex items-center justify-center text-brand-accent shadow-inner border border-brand-accent/10">
                    <ShieldCheck size={40} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Cerrar Servicio</h3>
                    <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-3 flex items-center gap-2">
                       <CheckCircle2 size={12} /> Validación Jurídica del Cliente
                    </p>
                 </div>
              </div>
              
              <SignaturePad 
                onSave={handleFinalizeSignature}
                onCancel={() => setFinalizingOrderId(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track, .custom-scrollbar-h::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb, .custom-scrollbar-h::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
