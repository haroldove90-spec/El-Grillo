/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KanbanBoard } from './components/KanbanBoard';
import { ReceptionForm } from './components/ReceptionForm';
import { InspectionTool } from './components/InspectionTool';
import { InventoryTable } from './components/InventoryTable';
import { FinancialSummary } from './components/FinancialSummary';
import { ProformaInvoice } from './components/ProformaInvoice';
import { LegalValidation } from './components/LegalValidation';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-0 py-2.5 cursor-pointer transition-all ${active ? 'text-brand-accent font-black' : 'text-slate-muted hover:text-white'}`}
  >
    {active && <span className="text-brand-accent text-[8px] mr-1">●</span>}
    <span className="text-[13px] uppercase tracking-wider font-bold">{label}</span>
  </div>
);

const SplashScreen = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-brand-sidebar flex flex-col items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <img 
        src="https://appdesignproyectos.com/elgrillo.png" 
        alt="Logo El Grillo" 
        className="w-32 h-32 object-contain mb-8"
        referrerPolicy="no-referrer"
      />
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-brand-accent animate-pulse" size={20} fill="currentColor" />
        <h2 className="text-lg font-black text-brand-accent uppercase tracking-widest italic">Iniciando Sistemas...</h2>
      </div>
      <div className="w-48 h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-brand-accent"
        />
      </div>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recepcion' | 'inspeccion' | 'inventario' | 'finanzas' | 'presupuesto' | 'autorizacion'>('dashboard');
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isBooting && <SplashScreen key="splash" />}
      </AnimatePresence>

      <div className="flex h-screen bg-brand-black overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-[240px] border-r border-brand-border flex flex-col p-8 bg-brand-sidebar z-20 shadow-2xl">
          <div className="flex flex-col items-center mb-12">
            <img 
              src="https://appdesignproyectos.com/elgrillo.png" 
              alt="Logo El Grillo" 
              className="w-24 h-24 object-contain mb-4"
              referrerPolicy="no-referrer"
            />
            <div className="text-center">
              <h1 className="font-black text-lg tracking-tighter text-brand-accent leading-none uppercase">EL GRILLO</h1>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-1">Servicio Automotriz</p>
            </div>
          </div>

          <nav className="space-y-4 flex-1">
            <div className="space-y-1">
              <SidebarItem label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} />
              <SidebarItem label="Recepción" active={activeTab === 'recepcion'} onClick={() => setActiveTab('recepcion')} icon={PlusSquare} />
              <SidebarItem label="Inspección" active={activeTab === 'inspeccion'} onClick={() => setActiveTab('inspeccion')} icon={ClipboardList} />
            </div>
            
            <div className="pt-6 border-t border-brand-border/50">
              <div className="text-[10px] uppercase font-black text-slate-700 mb-4 tracking-widest italic">Administración</div>
              <SidebarItem label="Finanzas" active={activeTab === 'finanzas'} onClick={() => setActiveTab('finanzas')} icon={TrendingUp} />
              <SidebarItem label="Presupuesto" active={activeTab === 'presupuesto'} onClick={() => setActiveTab('presupuesto')} icon={ClipboardList} />
              <SidebarItem label="Inventario" active={activeTab === 'inventario'} onClick={() => setActiveTab('inventario')} icon={Package} />
            </div>
            
            <div className="pt-6 border-t border-brand-border/50">
              <div className="text-[10px] uppercase font-black text-slate-700 mb-4 tracking-widest italic">Legal</div>
              <SidebarItem label="Validación" active={activeTab === 'autorizacion'} onClick={() => setActiveTab('autorizacion')} icon={Shield} />
              <SidebarItem label="Personal" icon={Users} />
            </div>
          </nav>

          <div className="mt-auto card-branded !bg-slate-800/40 !border-brand-accent/10 !p-4 !rounded-2xl">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center font-black text-[10px] text-brand-sidebar">AD</div>
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
          <header className=" h-20 flex items-center justify-between px-10 z-10">
            <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">
              {activeTab === 'dashboard' ? 'Panel de Control' : 
               activeTab === 'recepcion' ? 'Nueva Recepción' : 
               activeTab === 'inspeccion' ? 'Inspección Semáforo' : 
               activeTab === 'inventario' ? 'Gestión Inventario' :
               activeTab === 'finanzas' ? 'Cierre Financiero' : 
               activeTab === 'autorizacion' ? 'Protección Legal' : 'Presupuesto Proforma'}
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Búsqueda rápida..." 
                  className="bg-brand-sidebar border border-brand-border rounded-full py-2 pl-10 pr-4 text-[11px] focus:border-brand-accent outline-none transition-all w-64"
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
              ) : activeTab === 'inspeccion' ? (
                <motion.div 
                  key="inspeccion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full"
                >
                  <InspectionTool />
                </motion.div>
              ) : activeTab === 'inventario' ? (
                <motion.div 
                  key="inventario"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full"
                >
                  <InventoryTable />
                </motion.div>
              ) : activeTab === 'finanzas' ? (
                <motion.div 
                  key="finanzas"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full"
                >
                  <FinancialSummary />
                </motion.div>
              ) : activeTab === 'autorizacion' ? (
                <motion.div 
                  key="autorizacion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full"
                >
                  <LegalValidation />
                </motion.div>
              ) : (
                <motion.div 
                  key="presupuesto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full"
                >
                  <ProformaInvoice />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Global Accent Grain/Noise or Gradient Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#3e4852_0%,transparent_70%)]"></div>
        </main>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4a5a6a;
            border-radius: 10px;
          }
        `}</style>
      </div>
    </>
  );
}



