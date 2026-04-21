import React, { useEffect, useState } from 'react';
import { getInventory } from '../services/orderService';
import { Package, Pencil, Trash2, Plus, AlertCircle, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface InventoryItem {
  id: string;
  part_name: string;
  sku: string;
  category: string;
  quantity: number;
  unit_price: number;
  reorder_level: number;
}

export function InventoryTable() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await getInventory();
      setItems(data as InventoryItem[]);
      setErrorStatus(null);
    } catch (err: any) {
      console.error('Error cargando inventario:', err);
      if (err.message.includes('CONFIG_MISSING')) {
        setErrorStatus('CONFIG_MISSING');
      } else {
        setErrorStatus('ERROR');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center text-slate-muted italic text-xs animate-pulse uppercase font-black tracking-widest">
      Conectando con Almacén...
    </div>
  );

  if (errorStatus === 'CONFIG_MISSING') return (
    <div className="flex flex-col h-96 items-center justify-center space-y-4">
      <div className="p-6 bg-brand-red/10 border border-brand-red rounded-3xl text-center max-w-lg">
        <AlertCircle size={48} className="text-brand-red mx-auto mb-4" />
        <h3 className="text-xl font-black text-white italic tracking-tight mb-2 uppercase">Configuración Pendiente</h3>
        <p className="text-sm text-slate-muted font-medium mb-6">
          Para conectar con la base de datos de producción, es necesario configurar las llaves de Supabase en el panel de <span className="text-brand-yellow font-bold">Secrets</span>.
        </p>
        <div className="flex flex-col gap-2 text-left bg-black/40 p-4 rounded-xl font-mono text-[10px] text-slate-400 border border-white/5">
          <p>• VITE_SUPABASE_URL</p>
          <p>• VITE_SUPABASE_ANON_KEY</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">Gestión de Refacciones</h2>
          <p className="text-[10px] text-brand-yellow font-black uppercase tracking-widest mt-1">Control de stock y suministros</p>
        </div>
        <button className="bg-brand-yellow text-brand-sidebar px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-yellow/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
          <Plus size={16} strokeWidth={3} />
          Alta de Parte
        </button>
      </div>

      <div className="card overflow-hidden !p-0 !bg-brand-sidebar/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-white/5">
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Parte / SKU</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Categoría</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Stock</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Precio Unit.</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.quantity <= item.reorder_level ? 'text-brand-red bg-brand-red/10 animate-pulse' : 'text-slate-muted bg-slate-800'}`}>
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.part_name}</p>
                      <p className="text-[10px] font-mono text-slate-500 tracking-tighter">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-muted px-2 py-1 rounded-md border border-brand-border">
                    {item.category}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-black ${item.quantity <= item.reorder_level ? 'text-brand-red' : 'text-brand-green'}`}>
                      {item.quantity}
                    </span>
                    {item.quantity <= item.reorder_level && (
                      <span className="text-[8px] text-brand-red font-black uppercase mt-1 tracking-tighter">STOCK BAJO</span>
                    )}
                  </div>
                </td>
                <td className="p-5 text-right">
                  <span className="text-sm font-bold text-white">${item.unit_price.toFixed(2)}</span>
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button className="p-2 hover:bg-brand-red/10 rounded-lg text-slate-400 hover:text-brand-red transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="card !bg-brand-red/5 !border-brand-red/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red">
               <AlertCircle size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-white">3</p>
               <p className="text-[9px] uppercase font-black text-brand-red tracking-widest">Alertas Críticas</p>
            </div>
         </div>
         <div className="card !bg-brand-green/5 !border-brand-green/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
               <Package size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-white">142</p>
               <p className="text-[9px] uppercase font-black text-brand-green tracking-widest">Piezas en Stock</p>
            </div>
         </div>
         <div className="card !bg-brand-yellow/5 !border-brand-yellow/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
               <TrendingDown size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-white">8</p>
               <p className="text-[9px] uppercase font-black text-brand-yellow tracking-widest">Repositorios Pendientes</p>
            </div>
         </div>
      </div>
    </div>
  );
}
