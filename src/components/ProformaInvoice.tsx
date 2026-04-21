import React from 'react';
import { FileText, Wrench, Printer, Download, CreditCard, ShieldCheck } from 'lucide-react';
import { formatCurrency, calculateOrderFinancials, FinancialDetail } from '../utils/financialLogic';
import { motion } from 'motion/react';

interface InvoiceProps {
  orderNumber: string;
  clientName: string;
  vehicle: string;
  plate: string;
  items: FinancialDetail[];
  applyIva?: boolean;
}

const MOCK_INVOICE: InvoiceProps = {
  orderNumber: '2045',
  clientName: 'ARTURO HERNÁNDEZ',
  vehicle: 'VOLKSWAGEN JETTA CLASSICO 2014',
  plate: 'MX-45-A1',
  items: [
    { description: 'Reparación de Alternador (Bendix)', quantity: 1, costPrice: 420, unitPrice: 1200, isPart: true },
    { description: 'Mano de Obra Especializada', quantity: 1, costPrice: 0, unitPrice: 850, isPart: false },
    { description: 'Cableado Eléctrico Reforzado', quantity: 2, costPrice: 45, unitPrice: 120, isPart: true }
  ],
  applyIva: true
};

export function ProformaInvoice() {
  const { subtotal, iva, total, grossProfit, margin } = calculateOrderFinancials(MOCK_INVOICE.items, MOCK_INVOICE.applyIva);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-brand-sidebar p-6 rounded-2xl border border-brand-border">
         <div>
            <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">Factura Proforma</h2>
            <p className="text-[10px] text-brand-yellow font-black uppercase tracking-widest mt-1">Presupuesto sujeto a vigencia por 5 días</p>
         </div>
         <div className="flex gap-3">
            <button className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors border border-brand-border">
               <Printer size={20} />
            </button>
            <button className="p-3 bg-brand-yellow rounded-xl text-brand-sidebar shadow-lg shadow-brand-yellow/10 active:scale-95 transition-all">
               <Download size={20} strokeWidth={3} />
            </button>
         </div>
      </div>

      <div className="card !bg-white text-slate-900 !p-12 shadow-2xl relative overflow-hidden font-sans">
        {/* Invoice Header */}
        <div className="flex justify-between mb-16">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <Wrench className="text-brand-yellow" size={20} />
                 </div>
                 <h1 className="font-black text-xl italic tracking-tighter uppercase">SERVICIO AUTOMOTRIZ EL GRILLO</h1>
              </div>
              <div className="text-[10px] font-bold text-slate-500 space-y-0.5 leading-tight">
                 <p>CALLE MECÁNICOS #45, COL. INDUSTRIAL</p>
                 <p>CIUDAD DE MÉXICO, C.P. 55000</p>
                 <p>TEL: (55) 1234-1234 | rfc: SAGR-800101-GRI</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Orden de Servicio</p>
              <p className="text-4xl font-black italic tracking-tighter mb-4">#{MOCK_INVOICE.orderNumber}</p>
              <p className="text-[10px] font-bold uppercase leading-none">Fecha: 21 ABR 2026</p>
           </div>
        </div>

        {/* Client & Vehicle Section */}
        <div className="grid grid-cols-2 gap-12 mb-12 py-8 border-y border-slate-100">
           <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Datos del Cliente</p>
              <p className="font-black text-sm italic mb-1">{MOCK_INVOICE.clientName}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase leading-none">Ciudad de México</p>
           </div>
           <div className="text-right italic">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Especificaciones del Vehículo</p>
              <p className="font-black text-sm mb-1">{MOCK_INVOICE.vehicle}</p>
              <p className="text-[10px] font-black text-brand-red uppercase tracking-widest leading-none">Placas: {MOCK_INVOICE.plate}</p>
           </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-12">
           <thead className="border-b-2 border-black">
              <tr>
                 <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest">Descripción del Servicio / Refacción</th>
                 <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest w-24">Cant.</th>
                 <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest w-32">Unitario</th>
                 <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest w-32">Importe</th>
              </tr>
           </thead>
           <tbody className="text-sm font-medium border-b border-slate-100">
              {MOCK_INVOICE.items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50">
                   <td className="py-5 font-bold uppercase text-[12px] tracking-tight">{item.description}</td>
                   <td className="py-5 text-center font-mono">{item.quantity}</td>
                   <td className="py-5 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                   <td className="py-5 text-right font-black">{formatCurrency(item.unitPrice * item.quantity)}</td>
                </tr>
              ))}
           </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-between items-start mb-24">
           {/* Summary badges for internal use - hidden in PDF print usually */}
           <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3 bg-brand-green/5 border border-brand-green/10 p-3 rounded-xl print:hidden">
                 <div className="text-brand-green"><ShieldCheck size={18} /></div>
                 <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Utilidad Estimada</p>
                    <p className="text-xs font-black text-brand-green">{formatCurrency(grossProfit)} ({margin.toFixed(1)}%)</p>
                 </div>
              </div>
              <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl print:hidden text-center">
                 <p className="text-[8px] font-black text-slate-300 uppercase italic">Espacio para Firma Digital</p>
                 <div className="h-12 flex items-center justify-center mt-2 opacity-20">
                    <Wrench size={24} className="text-slate-400 rotate-12" />
                 </div>
              </div>
           </div>

           <div className="w-64 space-y-3 bg-slate-50 p-6 rounded-2xl">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest italic">
                 <span>Subtotal</span>
                 <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              {iva > 0 && (
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest italic">
                   <span>IVA (16%)</span>
                   <span className="font-mono">{formatCurrency(iva)}</span>
                </div>
              )}
              <div className="pt-3 border-t-2 border-black flex justify-between items-center">
                 <span className="text-[12px] font-black uppercase tracking-tighter italic">Total MXN</span>
                 <span className="text-xl font-black italic">{formatCurrency(total)}</span>
              </div>
           </div>
        </div>

        {/* Footer Terms */}
        <div className="grid grid-cols-2 gap-8 text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic">
           <div>
              <p className="text-black font-black mb-1">Garantía de Servicio</p>
              <p>Mano de obra garantizada por 30 días o 1,000 KM. No aplica en partes eléctricas sin certificado de fábrica.</p>
           </div>
           <div className="text-right">
              <p className="text-black font-black mb-1">Términos de Pago</p>
              <p>Se requiere el 50% de anticipo en trabajos mayores a $5,000 MXN. Aceptamos todas las tarjetas con comisión bancaria aplicable.</p>
           </div>
        </div>

        {/* Industrial background accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
