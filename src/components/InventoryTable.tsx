import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Package, Pencil, Trash2, Plus, AlertCircle, TrendingDown, Loader2, X, Check, Search, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfService } from '../services/pdfService';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await db.inventory.list();
      setItems(data as InventoryItem[]);
      setErrorStatus(null);
    } catch (err: any) {
      console.error('Error cargando inventario:', err);
      setErrorStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta pieza?')) return;
    try {
      await db.inventory.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.part_name || !editingItem?.sku) return;

    try {
      setLoading(true);
      if (editingItem.id) {
        await db.inventory.update(editingItem.id, editingItem);
      } else {
        await db.inventory.create(editingItem);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      loadInventory();
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(i => 
    i.part_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && items.length === 0) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="text-brand-accent animate-spin" size={48} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">Gestión de Refacciones</h2>
          <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-1">Control de stock y suministros</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             <input 
               type="text" 
               placeholder="Buscar pieza..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-brand-sidebar border border-brand-border rounded-xl py-3 pl-10 pr-4 text-xs focus:border-brand-accent outline-none text-white"
             />
          </div>
          <button 
            onClick={() => PdfService.generateInventoryReport(filteredItems)}
            className="p-3 bg-brand-sidebar border border-brand-border rounded-xl text-slate-400 hover:text-white transition-all"
            title="Descargar Reporte"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => { setEditingItem({}); setIsModalOpen(true); }}
            className="bg-brand-accent text-brand-sidebar px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-accent/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={3} />
            Nueva Parte
          </button>
        </div>
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden lg:block card overflow-hidden !p-0 !bg-brand-sidebar shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-white/5">
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Parte / SKU</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-center">Stock</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-right">Precio Unit.</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.quantity <= item.reorder_level ? 'text-brand-red bg-brand-red/10 animate-pulse' : 'text-slate-muted bg-slate-800'}`}>
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.part_name}</p>
                      <p className="text-[10px] font-mono text-brand-accent tracking-tighter uppercase font-bold">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-black italic ${item.quantity <= item.reorder_level ? 'text-brand-red' : 'text-brand-green'}`}>
                      {item.quantity}
                    </span>
                    {item.quantity <= item.reorder_level && (
                      <span className="text-[8px] text-brand-red font-black uppercase mt-1 tracking-tighter">BAJO STOCK</span>
                    )}
                  </div>
                </td>
                <td className="p-5 text-right">
                  <span className="text-sm font-black text-white italic">${item.unit_price.toFixed(2)}</span>
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                      className="p-2 hover:bg-brand-accent/20 rounded-lg text-slate-muted hover:text-brand-accent transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-brand-red/20 rounded-lg text-slate-muted hover:text-brand-red transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet View (Cards) */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="card !bg-brand-sidebar border border-brand-border flex flex-col gap-4">
             <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.quantity <= item.reorder_level ? 'text-brand-red bg-brand-red/10' : 'text-slate-muted bg-slate-800'}`}>
                   <Package size={18} />
                 </div>
                 <div>
                   <p className="text-[13px] font-black text-white uppercase italic">{item.part_name}</p>
                   <p className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">{item.sku}</p>
                 </div>
               </div>
               <div className="flex gap-1">
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-slate-muted active:text-brand-accent"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-muted active:text-brand-red"><Trash2 size={14} /></button>
               </div>
             </div>
             <div className="flex justify-between items-end border-t border-brand-border/30 pt-3">
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Existencia</p>
                   <p className={`text-lg font-black italic ${item.quantity <= item.reorder_level ? 'text-brand-red' : 'text-brand-green'}`}>{item.quantity}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Precio Unit.</p>
                   <p className="text-sm font-black text-white italic">${item.unit_price.toFixed(2)}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="card !bg-brand-red/5 !border-brand-red/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red"><AlertCircle size={24} /></div>
            <div>
               <p className="text-2xl font-black text-white">{items.filter(i => i.quantity <= i.reorder_level).length}</p>
               <p className="text-[9px] uppercase font-black text-brand-red tracking-widest">Bajos de Inventario</p>
            </div>
         </div>
         <div className="card !bg-brand-green/5 !border-brand-green/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green"><Package size={24} /></div>
            <div>
               <p className="text-2xl font-black text-white">{items.reduce((acc, current) => acc + current.quantity, 0)}</p>
               <p className="text-[9px] uppercase font-black text-brand-green tracking-widest">Total de Piezas</p>
            </div>
         </div>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-brand-sidebar border border-brand-border w-full max-w-lg rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6">
                {editingItem?.id ? 'Editar Refacción' : 'Nueva Refacción'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre de Parte</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem?.part_name || ''}
                      onChange={(e) => setEditingItem({...editingItem, part_name: e.target.value})}
                      className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-xs focus:border-brand-accent outline-none text-white italic" 
                      placeholder="Ej: Aceite Sintético"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU / Código</label>
                    <input 
                      type="text" 
                      required
                      value={editingItem?.sku || ''}
                      onChange={(e) => setEditingItem({...editingItem, sku: e.target.value.toUpperCase()})}
                      className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-xs focus:border-brand-accent outline-none text-white uppercase font-bold" 
                      placeholder="Ej: OIL-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Existencia</label>
                    <input 
                      type="number" 
                      value={editingItem?.quantity || 0}
                      onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value)})}
                      className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-xs focus:border-brand-accent outline-none text-white font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Min. Reorden</label>
                    <input 
                      type="number" 
                      value={editingItem?.reorder_level || 5}
                      onChange={(e) => setEditingItem({...editingItem, reorder_level: parseInt(e.target.value)})}
                      className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-xs focus:border-brand-accent outline-none text-white font-bold" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2 lg:col-span-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precio Venta</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editingItem?.unit_price || 0}
                      onChange={(e) => setEditingItem({...editingItem, unit_price: parseFloat(e.target.value)})}
                      className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-xs focus:border-brand-accent outline-none font-black text-brand-accent italic" 
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                   <button 
                     type="button"
                     onClick={() => setIsModalOpen(false)}
                     className="flex-1 py-3 border border-brand-border text-slate-muted rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 py-3 bg-brand-accent text-brand-sidebar rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/20"
                   >
                     Guardar Pieza
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
