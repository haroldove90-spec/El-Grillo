import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Trash2, CheckCircle2, ChevronRight, Scale } from 'lucide-react';
import { motion } from 'motion/react';

interface SignaturePadProps {
  onSave: (signatureBase64: string) => void;
  onCancel: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 200;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#DFC87C'; // Brand Secondary (Dorado Arena)
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setIsEmpty(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Support for both Mouse and Touch events
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
      }
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas && !isEmpty) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-brand-accent mb-2">
            <Scale size={20} className="shrink-0" />
            <h4 className="text-[11px] font-black uppercase tracking-widest italic">Autorización Legal del Cliente</h4>
        </div>
        
        <div className="relative bg-slate-900 border-2 border-brand-border rounded-3xl overflow-hidden h-64 shadow-inner">
           <canvas 
             ref={canvasRef}
             onMouseDown={startDrawing}
             onMouseMove={draw}
             onMouseUp={stopDrawing}
             onMouseLeave={stopDrawing}
             onTouchStart={startDrawing}
             onTouchMove={draw}
             onTouchEnd={stopDrawing}
             className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
           />
           {isEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                 <Pencil size={48} className="text-slate-400 mb-2" />
                 <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Firmar Aquí</p>
              </div>
           )}
           <button 
             onClick={clear}
             className="absolute top-4 right-4 p-3 bg-brand-sidebar/80 backdrop-blur-md rounded-2xl text-slate-400 hover:text-brand-red transition-all border border-brand-border"
           >
             <Trash2 size={16} />
           </button>
        </div>
        
        <div className="p-5 bg-brand-sidebar border border-brand-border rounded-2xl">
           <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed text-justify italic">
              Al firmar, el cliente autoriza a <span className="text-white">Servicio Automotriz El Grillo</span> a realizar el diagnóstico y las pruebas de ruta necesarias. Se hace constar que el taller no se hace responsable por objetos de valor no declarados en el inventario de recepción. El cliente acepta que el presupuesto proporcionado es una estimación sujeta a cambios tras el desarme y diagnóstico profundo.
           </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onCancel}
          className="flex-1 py-4 bg-brand-sidebar border border-brand-border text-slate-muted font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
        >
          Cancelar
        </button>
        <button 
          onClick={save}
          disabled={isEmpty}
          className={`flex-1 py-4 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
            isEmpty ? 'bg-slate-800 text-slate-600' : 'bg-brand-accent text-brand-sidebar shadow-brand-accent/20'
          }`}
        >
          <CheckCircle2 size={18} />
          Confirmar Firma
        </button>
      </div>
    </div>
  );
}
