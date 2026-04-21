/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Car, 
  Users, 
  ClipboardList, 
  Package, 
  Wrench, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  LayoutDashboard,
  LogOut,
  Bell,
  Settings,
  PlusSquare,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KanbanBoard } from './components/KanbanBoard';
import { ReceptionForm } from './components/ReceptionForm';
import { InspectionTool } from './components/InspectionTool';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-0 py-2.5 cursor-pointer transition-all ${active ? 'text-brand-yellow font-black' : 'text-slate-muted hover:text-white'}`}
  >
    {active && <span className="text-brand-yellow text-[8px] mr-1">●</span>}
    <span className="text-[13px] uppercase tracking-wider font-bold">{label}</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recepcion' | 'inspeccion'>('dashboard');

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-brand-border flex flex-col p-8 bg-brand-sidebar z-20 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-brand-yellow/10">
            <Wrench className="text-brand-sidebar" size={24} strokeWidth={3} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tighter text-white leading-none">EL GRILLO</h1>
            <p className="text-[9px] text-brand-yellow font-black uppercase tracking-widest mt-0.5">Automotriz</p>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <div className="space-y-1">
            <SidebarItem label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} />
            <SidebarItem label="Recepción" active={activeTab === 'recepcion'} onClick={() => setActiveTab('recepcion')} icon={PlusSquare} />
            <SidebarItem label="Inspección" active={activeTab === 'inspeccion'} onClick={() => setActiveTab('inspeccion')} icon={ClipboardList} />
          </div>
          
          <div className="pt-6 border-t border-brand-border/50">
            <div className="text-[10px] uppercase font-black text-slate-700 mb-4 tracking-widest italic">Operaciones</div>
            <SidebarItem label="Inventario" icon={Package} />
            <SidebarItem label="Vehículos" icon={Car} />
            <SidebarItem label="Personal" icon={Users} />
            <SidebarItem label="Reportes" icon={TrendingUp} />
          </div>
        </nav>

        <div className="mt-auto card !bg-slate-800/40 !border-slate-700/50 !p-4 !rounded-2xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-brand-border flex items-center justify-center font-black text-[10px]">AD</div>
             <div>
                <div className="text-xs font-black text-white leading-none">Admin Grillo</div>
                <div className="text-[10px] text-slate-muted mt-1 uppercase font-bold">Sucursal Matriz</div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative bg-brand-black">
        {/* Header Overlay (for Desktop Desktop) */}
        <header className="h-20 flex items-center justify-between px-10 z-10">
          <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">
            {activeTab === 'dashboard' ? 'Panel de Control' : activeTab === 'recepcion' ? 'Nueva Recepción' : 'Inspección Semáforo'}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Búsqueda rápida..." 
                className="bg-brand-sidebar border border-brand-border rounded-full py-2 pl-10 pr-4 text-[11px] focus:border-brand-yellow outline-none transition-all w-64"
              />
            </div>
            <button className="p-2 rounded-xl bg-brand-sidebar border border-brand-border relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-brand-red rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-10 pb-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <KanbanBoard />
              </motion.div>
            ) : activeTab === 'recepcion' ? (
              <motion.div 
                key="recepcion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <ReceptionForm />
              </motion.div>
            ) : (
              <motion.div 
                key="inspeccion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <InspectionTool />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Accent Grain/Noise or Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,transparent_50%)]"></div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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



