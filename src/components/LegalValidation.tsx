import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Shield, Smartphone, PenTool, ClipboardCheck, Fuel, Radio, LifeBuoy, Wrench, Printer, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatMexicanPhone, generateWhatsAppMessage } from '../utils/mechanicsLogic';

export function LegalValidation() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [fuelLevel, setFuelLevel] = useState(25);
  const [checklist, setChecklist] = useState({
    stereo: true,
    spareTire: true,
    jack: true,
    tools: true
  });
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSignatureData(null);
  };

  const saveAndNotify = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Por favor, capture la firma del cliente antes de continuar.");
      return;
    }

    setIsSaving(true);
    
    // Convertir firma a imagen
    const signatureImage = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || null;
    setSignatureData(signatureImage);

    // Simular guardado en Supabase
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);

      // Disparar WhatsApp automáticamente
      const mockOrderData = {
        client: 'ARTURO HERNÁNDEZ',
        vehicle: 'VOLKSWAGEN JETTA 2014',
        status: 'FIRMADO Y RECIBIDO',
        services: ['Recepción e Inventario'],
        total: 0,
        orderNumber: '2045'
      };

      const phone = formatMexicanPhone('5512345678');
      const message = generateWhatsAppMessage(mockOrderData) + "\n\n✅ *La orden ha sido firmada digitalmente y el vehículo está en resguardo.*";
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      
      window.open(waUrl, '_blank');
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-8 border-4 border-brand-accent/30 rounded-[2.5rem] bg-brand-sidebar shadow-2xl relative overflow-hidden group/tablet">
      <div className="absolute top-0 inset-x-0 h-1 bg-brand-accent/20"></div>
      
      <div className="flex justify-between items-center bg-black/20 p-6 rounded-2xl border border-brand-border">
        <div>
          <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">Validación Legal y Recepción</h2>
          <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-1">Acta de entrada y autorización del cliente</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-slate-800 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-slate-700 transition-all"
        >
          <Printer size={16} />
          Imprimir Ticket
        </button>
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-green/10 border border-brand-green/30 p-4 rounded-2xl flex items-center gap-4 text-brand-green"
        >
          <CheckCircle2 size={24} />
          <div>
            <p className="text-sm font-black uppercase tracking-widest leading-none">¡Registro Guardado!</p>
            <p className="text-[10px] font-bold mt-1 uppercase opacity-80">La firma se ha guardado y se ha enviado la notificación por WhatsApp.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inventario de Recepción */}
        <div className="card space-y-6 !bg-brand-sidebar/40">
          <div className="flex items-center gap-2 mb-4">
             <ClipboardCheck className="text-brand-accent" size={20} />
             <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Inventario de Entrada</h3>
          </div>

          <div className="space-y-6">
            {/* Nivel de Combustible */}
            <div className="p-4 bg-black/30 rounded-2xl border border-brand-border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-slate-400 italic">
                  <Fuel size={14} className="text-brand-accent" /> Nivel de Combustible
                </div>
                <span className="text-brand-accent font-black italic">{fuelLevel}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="12.5" 
                value={fuelLevel}
                onChange={(e) => setFuelLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
              <div className="flex justify-between mt-2 text-[8px] font-black uppercase text-slate-600 tracking-widest italic">
                <span>E</span>
                <span>1/4</span>
                <span>1/2</span>
                <span>3/4</span>
                <span>F</span>
              </div>
            </div>

            {/* Checklist Pertenencias */}
            <div className="grid grid-cols-2 gap-3">
              <CheckItem label="Estéreo" icon={Radio} active={checklist.stereo} onClick={() => setChecklist({...checklist, stereo: !checklist.stereo})} />
              <CheckItem label="Llanta Ref." icon={LifeBuoy} active={checklist.spareTire} onClick={() => setChecklist({...checklist, spareTire: !checklist.spareTire})} />
              <CheckItem label="Gato Hidráulico" icon={LifeBuoy} active={checklist.jack} onClick={() => setChecklist({...checklist, jack: !checklist.jack})} />
              <CheckItem label="Kit Herramienta" icon={Wrench} active={checklist.tools} onClick={() => setChecklist({...checklist, tools: !checklist.tools})} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 italic">Notas de Daño Exterior (Rayones/Golpes)</label>
              <textarea 
                placeholder="Describa rayones, golpes o detalles estéticos aquí..."
                className="w-full bg-black/30 border border-brand-border rounded-2xl p-4 text-xs text-white focus:border-brand-accent outline-none transition-all h-24 italic"
              />
            </div>
          </div>
        </div>

        {/* Firma Digital y Cláusula */}
        <div className="flex flex-col gap-6">
          <div className="card space-y-6 !bg-white text-brand-sidebar">
            <div className="flex items-center gap-2 mb-2">
               <PenTool className="text-brand-sidebar" size={20} />
               <h3 className="text-sm font-black uppercase tracking-widest text-brand-sidebar italic">Firma de Autorización</h3>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-100/50 group-hover:border-brand-accent transition-all">
               <SignatureCanvas 
                  ref={sigCanvas}
                  penColor="#DFC87C"
                  canvasProps={{
                    className: 'w-full h-48 cursor-crosshair'
                  }}
               />
            </div>

            <div className="flex justify-between gap-4">
              <button 
                onClick={clearSignature}
                className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                Limpiar Firma
              </button>
              <button 
                onClick={saveAndNotify}
                disabled={isSaving}
                className="flex-1 py-4 bg-brand-accent text-brand-sidebar rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-brand-accent/20 disabled:opacity-50 disabled:active:scale-100"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-brand-sidebar/30 border-t-brand-sidebar rounded-full animate-spin"></div>
                ) : (
                  <Send size={14} strokeWidth={3} />
                )}
                {isSaving ? 'GUARDANDO...' : 'Guardar y Finalizar'}
              </button>
            </div>
          </div>

          <div className="card-branded !bg-brand-accent/5 border-brand-accent/20">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                   <Shield size={20} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">Aviso de Confianza</h4>
                   <p className="text-[9px] text-slate-muted font-bold leading-relaxed uppercase tracking-tight italic">
                     Al firmar, el cliente autoriza a Servicio Automotriz El Grillo a realizar el diagnóstico y las pruebas de ruta necesarias. Se hace constar que el taller no se hace responsable por objetos de valor no declarados en el inventario de recepción. El cliente acepta que el presupuesto proporcionado es una estimación sujeta a cambios tras el desarmado o hallazgos adicionales, previa autorización vía WhatsApp.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Ticket Térmico Virtual (Solo para previsualizar antes de imprimir) */}
      <div className="hidden print:block bg-white text-black p-8 font-mono text-[10px] w-[58mm] mx-auto uppercase">
         <div className="text-center mb-4">
            <p className="text-sm font-bold">EL GRILLO AUTOMOTRIZ</p>
            <p>RFC: SAGR-800101-GRI</p>
            <p>TEL: 55-1234-1234</p>
         </div>
         <p className="border-t border-dashed pt-2">ORDEN: #2045</p>
         <p>CLIENTE: ARTURO HERNÁNDEZ</p>
         <p>VEHÍCULO: JETTA 2014</p>
         <div className="border-y border-dashed my-2 py-2">
            <p className="font-bold">INVENTARIO:</p>
            <p>GASOLINA: {fuelLevel}%</p>
            <p>ESTÉREO: {checklist.stereo ? '[OK]' : '[X]'}</p>
            <p>REFACCIÓN: {checklist.spareTire ? '[OK]' : '[X]'}</p>
            <p>GATO/HERR: [OK]</p>
         </div>
         <p className="text-[8px] italic mb-4">ACEPTO TÉRMINOS Y CONDICIONES</p>
         {signatureData && (
           <img src={signatureData} alt="Firma" className="w-full h-auto mb-4 border border-slate-100" />
         )}
         <p className="text-center pt-2 border-t border-dashed">GRACIAS POR SU CONFIANZA</p>
      </div>
    </div>
  );
}

function CheckItem({ label, icon: Icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${active ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-black/20 border-brand-border text-slate-500'}`}
    >
      <Icon size={14} strokeWidth={active ? 3 : 2} />
      <span className="text-[10px] font-black uppercase tracking-tighter truncate italic">{label}</span>
      <div className={`ml-auto w-2 h-2 rounded-full ${active ? 'bg-brand-accent shadow-[0_0_8px_#DFC87C]' : 'bg-slate-700'}`} />
    </button>
  );
}
