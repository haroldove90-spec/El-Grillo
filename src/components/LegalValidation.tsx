import React, { useState } from 'react';
import { Shield, Printer, Send, CheckCircle2, FileText, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatMexicanPhone, generateWhatsAppMessage } from '../utils/mechanicsLogic';
import { SignaturePad } from './SignaturePad';
import { InventoryChecklist } from './InventoryChecklist';

export function LegalValidation() {
  const [checklistResults, setChecklistResults] = useState<Record<string, boolean>>({});
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const saveAndNotify = (signatureBase64?: string) => {
    const finalSignature = signatureBase64 || signatureData;
    if (!finalSignature) {
      alert("Por favor, capture la firma del cliente antes de continuar.");
      return;
    }

    setIsSaving(true);
    setSignatureData(finalSignature);

    // Simulated Supabase Save
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);

      const mockOrderData = {
        client: 'ARTURO HERNÁNDEZ',
        vehicle: 'VOLKSWAGEN JETTA 2014',
        status: 'FIRMADO Y RECIBIDO',
        services: ['Recepción e Inventario Digital'],
        total: 0,
        orderNumber: Math.floor(Math.random() * 1000).toString()
      };

      const phone = formatMexicanPhone('5512345678');
      const message = generateWhatsAppMessage(mockOrderData) + "\n\n✅ *La orden ha sido validada legalmente y el vehículo está bajo el resguardo oficial de El Grillo.*";
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      
      window.open(waUrl, '_blank');
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-brand-sidebar p-8 rounded-[2.5rem] border border-brand-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Shield size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase leading-none">MÓDULO DE PROTECCIÓN LEGAL</h2>
          <p className="text-[10px] text-brand-accent font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
            <Smartphone size={14} /> Validación Digital 100% Sin Papel
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="relative z-10 bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-3 hover:scale-105 transition-all border border-brand-border"
        >
          <Printer size={18} />
          Imprimir Resguardo
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-brand-green/10 border-2 border-brand-green/30 p-6 rounded-[2rem] flex items-center gap-6 text-brand-green shadow-xl shadow-brand-green/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-green/20 flex items-center justify-center shrink-0">
               <CheckCircle2 size={32} />
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-tight italic leading-tight">ACTA DE RECEPCIÓN CONFIRMADA</p>
              <p className="text-[10px] font-bold mt-2 uppercase opacity-80 leading-relaxed max-w-xl">
                 El vehículo ha sido registrado exitosamente. Se ha guardado la evidencia del checklist y la firma del cliente en la nube. Notificación de WhatsApp activada.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Inventory */}
        <div className="lg:col-span-7 space-y-8">
           <div className="card !p-8 !bg-brand-sidebar border border-brand-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform"><FileText size={64} /></div>
              <InventoryChecklist onChange={setChecklistResults} />
           </div>

           <div className="card !p-8 !bg-brand-sidebar border border-brand-border">
              <div className="flex items-center gap-3 text-brand-accent mb-6">
                  <FileText size={20} className="shrink-0" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest italic">Observaciones Estéticas</h4>
              </div>
              <textarea 
                placeholder="Declare golpes, rayones preexistentes o pertenencias adicionales del cliente..."
                className="w-full bg-slate-900/50 border-2 border-brand-border rounded-[2rem] p-6 text-xs text-white focus:border-brand-accent outline-none transition-all h-32 italic leading-relaxed placeholder:text-slate-700"
              />
           </div>
        </div>

        {/* Right Column: Signature and Clauses */}
        <div className="lg:col-span-5 space-y-8">
          <div className="card !p-8 !bg-white text-brand-sidebar shadow-2xl shadow-brand-accent/5">
             <SignaturePad 
               onSave={saveAndNotify}
               onCancel={() => setSignatureData(null)}
             />
          </div>

          <div className="p-8 bg-brand-accent rounded-[2.5rem] text-brand-sidebar relative overflow-hidden shadow-2xl shadow-brand-accent/20">
             <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><Shield size={84} /></div>
             <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-sidebar flex items-center justify-center text-brand-accent shrink-0 shadow-lg">
                   <Shield size={24} />
                </div>
                <div className="space-y-3">
                   <h4 className="text-sm font-black uppercase tracking-tighter italic">Protección Grillo Automotriz</h4>
                   <p className="text-[10px] font-bold leading-relaxed uppercase italic opacity-70">
                     Este módulo provee validez jurídica al taller al documentar el estado físico de entrada del vehículo. Los datos son cifrados y almacenados para aclaraciones posteriores.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Ticket Térmico Virtual (Solo para previsualizar antes de imprimir) */}
      <div className="hidden print:block bg-white text-black p-12 font-mono text-[11px] w-[80mm] mx-auto uppercase">
         <div className="text-center mb-6 space-y-1">
            <p className="text-xl font-black italic">EL GRILLO</p>
            <p className="text-[9px] border-b border-brand-border pb-2 mb-2">SERVICIO AUTOMOTRIZ PREMIUM</p>
            <p>RFC: SAGR-800101-GRI</p>
            <p>CALLE MECÁNICOS #45, CDMX</p>
         </div>
         <div className="border-y-2 border-black border-dashed my-4 py-4 space-y-1">
            <p className="font-black">RESGUARDO DE RECEPCIÓN</p>
            <p>FOLIO: #GRI-{Math.floor(Math.random() * 10000)}</p>
            <p>FECHA: {new Date().toLocaleString()}</p>
         </div>
         <div className="space-y-1 mb-6">
            <p><span className="font-bold">CLIENTE:</span> ARTURO HERNÁNDEZ</p>
            <p><span className="font-bold">VEHÍCULO:</span> JETTA 2014</p>
         </div>
         <div className="border-b border-dashed mb-4 pb-4">
            <p className="font-black mb-2">ESTADO DE RECEPCIÓN:</p>
            {Object.entries(checklistResults).map(([key, val]) => (
                <p key={key}>{key.toUpperCase()}: {val ? '[✓]' : '[X]'}</p>
            ))}
         </div>
         <div className="text-center mt-10">
            {signatureData && (
              <img src={signatureData} alt="Firma Cliente" className="w-full h-auto mb-4 border border-slate-200" />
            )}
            <p className="text-[9px] border-t border-black pt-2">FIRMA DE CONFORMIDAD DEL CLIENTE</p>
         </div>
      </div>
    </div>
  );
}
