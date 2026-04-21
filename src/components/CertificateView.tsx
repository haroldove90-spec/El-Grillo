import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ServiceCertificate } from './ServiceCertificate';
import { Download, Loader2, FileText, Share2, Award, Printer, ShieldCheck } from 'lucide-react';
import { db } from '../services/db';

export function CertificateView({ orderId }: { orderId?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadData(orderId);
    } else {
        // Find latest completed order if none provided
        loadLatest();
    }
  }, [orderId]);

  const loadLatest = async () => {
    try {
        const orders = await db.orders.list();
        const latest = orders[0]; // Assuming sorted by date desc
        if (latest) loadData(latest.id);
        else setLoading(false);
    } catch (err) {
        setLoading(false);
    }
  };

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const orders = await db.orders.list();
      const order = orders.find((o: any) => o.id === id);
      if (!order) throw new Error('Orden no encontrada');

      const clients = await db.clients.list();
      const client = clients.find((c: any) => c.id === order.client_id);
      
      const vehiclesData = await db.vehicles.list();
      const vehicle = vehiclesData.find((v: any) => v.id === order.vehicle_id);

      // Mock items for the PDF if no real ones exist
      const items = [
        { part_name: 'Mantenimiento Preventivo', quantity: 1, unit_price: order.total_amount || 1500 }
      ];

      setData({ order, client, vehicle, items });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="text-brand-accent animate-spin" size={48} />
    </div>
  );

  if (!data) return (
    <div className="flex flex-col h-96 items-center justify-center text-slate-muted italic p-8 text-center">
       <Award size={48} className="mb-4 opacity-20" />
       <p className="text-sm font-black uppercase tracking-widest">No hay certificados disponibles.</p>
       <p className="text-[10px] mt-2 leading-relaxed">Las órdenes aparecerán aquí una vez que sean finalizadas y facturadas.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-brand-sidebar p-8 rounded-3xl border border-brand-border shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><ShieldCheck size={120} /></div>
         <div className="relative z-10">
            <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase leading-none">CERTIFICADO DE MANTENIMIENTO</h2>
            <p className="text-[10px] text-brand-accent font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                <ShieldCheck size={14} /> Garantía de Calidad Certificada
            </p>
         </div>
         
         <div className="flex gap-4 w-full md:w-auto relative z-10">
            <PDFDownloadLink
              document={<ServiceCertificate {...data} />}
              fileName={`Certificado_ElGrillo_${data.order.id?.toString().slice(-6)}.pdf`}
              className="flex-1 md:flex-none"
            >
              <button className="w-full bg-brand-accent text-brand-sidebar px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                <Download size={18} strokeWidth={3} />
                Descargar PDF
              </button>
            </PDFDownloadLink>
            
            <button className="bg-slate-800 text-white p-4 rounded-2xl border border-brand-border active:scale-95 transition-all">
               <Share2 size={20} />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-6">
            <div className="card !bg-brand-sidebar border border-brand-border space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Resumen de Orden</p>
                    <p className="text-lg font-black text-white italic lowercase">ORDEN #{data.order.id?.toString().slice(-6)}</p>
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-brand-border/30">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Cliente</p>
                    <p className="text-sm font-black text-brand-accent italic uppercase">{data.client.first_name} {data.client.last_name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Vehículo</p>
                    <p className="text-sm font-black text-white italic uppercase">{data.vehicle.make} {data.vehicle.model}</p>
                    <p className="text-[10px] font-black text-brand-red bg-brand-red/10 px-2 py-0.5 rounded inline-block mt-1">Placas: {data.vehicle.license_plate}</p>
                  </div>
                  <div className="pt-4 border-t border-brand-border/30">
                    <div className="flex justify-between items-end">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Pagado</p>
                       <p className="text-2xl font-black text-brand-green italic">${(data.order.total_amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-brand-accent border border-brand-accent rounded-3xl text-brand-sidebar relative overflow-hidden shadow-xl shadow-brand-accent/10">
               <div className="absolute right-0 top-0 p-4 opacity-10 -rotate-12"><Award size={96} /></div>
               <h4 className="text-sm font-black uppercase italic tracking-tighter mb-2">Compromiso Grillo</h4>
               <p className="text-[10px] font-bold uppercase leading-relaxed text-brand-sidebar/80 italic">
                 Este documento certifica que el vehículo ha sido intervenido siguiendo altos estándares de calidad industrial.
               </p>
            </div>
         </div>

         <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-brand-border h-[800px] hidden md:block">
               <PDFViewer width="100%" height="100%" className="border-none">
                  <ServiceCertificate {...data} />
               </PDFViewer>
            </div>
            
            <div className="md:hidden card !bg-white !p-8 text-slate-900 shadow-xl rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-brand-accent/10 rounded-3xl flex items-center justify-center text-brand-accent">
                 <Printer size={40} />
               </div>
               <div>
                  <h4 className="font-black text-lg italic uppercase tracking-tighter">Vista Móvil Optimizada</h4>
                  <p className="text-xs text-slate-500 font-medium">Por favor descargue el archivo PDF para ver el certificado completo en su dispositivo.</p>
               </div>
               <PDFDownloadLink
                 document={<ServiceCertificate {...data} />}
                 fileName={`Certificado_ElGrillo_${data.order.id?.toString().slice(-6)}.pdf`}
                 className="w-full"
               >
                 <button className="w-full bg-brand-accent text-brand-sidebar py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                   Bajar Certificado
                 </button>
               </PDFDownloadLink>
            </div>
         </div>
      </div>
    </div>
  );
}
