import React from 'react';
import { TrendingUp, Wallet, ShoppingBag, PieChart, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../utils/financialLogic';
import { motion } from 'motion/react';

const MOCK_DAILY_STATS = {
  revenue: 12450.50,
  partCosts: 4200.00,
  netProfit: 8250.50,
  margin: 66.2,
  ordersCount: 8
};

export function FinancialSummary() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">Cierre de Caja Diario</h2>
        <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-1">Análisis de rentabilidad hoy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Ingresos Totales" 
          value={formatCurrency(MOCK_DAILY_STATS.revenue)} 
          icon={Wallet} 
          trend="+12%" 
          color="accent"
        />
        <StatCard 
          label="Inversión Refacciones" 
          value={formatCurrency(MOCK_DAILY_STATS.partCosts)} 
          icon={ShoppingBag} 
          trend="Estable" 
          color="slate"
        />
        <StatCard 
          label="Ganancia Neta Real" 
          value={formatCurrency(MOCK_DAILY_STATS.netProfit)} 
          icon={TrendingUp} 
          trend="+18%" 
          color="green"
        />
        <StatCard 
          label="Margen de Utilidad" 
          value={`${MOCK_DAILY_STATS.margin}%`} 
          icon={PieChart} 
          trend="Alto" 
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card !bg-brand-sidebar/40 border-brand-border/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Servicios más Rentables</h3>
            <button className="text-[10px] text-brand-accent font-bold uppercase hover:underline flex items-center gap-1">
              Ver reporte histórico <ArrowUpRight size={12} />
            </button>
          </div>
          
          <div className="space-y-6">
            <ProfitRow label="Afinación de Motor" profit={3200} margin={65} />
            <ProfitRow label="Servicio de A/C" profit={1850} margin={72} />
            <ProfitRow label="Reparación Eléctrica" profit={4200} margin={85} />
            <ProfitRow label="Frenos (Balatas)" profit={1200} margin={45} />
          </div>
        </div>

        <div className="card !bg-brand-red/5 border-brand-red/10 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red mb-6">
             <TrendingUp size={40} />
          </div>
          <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">Meta Mensual</h4>
          <p className="text-xs text-slate-muted font-medium mb-6">Estás al 72% de tu meta de utilidad para Abril.</p>
          <div className="w-full h-3 bg-brand-sidebar rounded-full overflow-hidden border border-brand-border/50">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '72%' }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-brand-red to-brand-accent"
             />
          </div>
          <div className="flex justify-between w-full mt-2 text-[10px] font-black uppercase tracking-widest italic">
             <span className="text-slate-600">$0</span>
             <span className="text-brand-accent">$150,000 MXN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  const colors: any = {
    accent: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20',
    green: 'text-brand-green bg-brand-green/10 border-brand-green/20',
    red: 'text-brand-red bg-brand-red/10 border-brand-red/20',
    slate: 'text-slate-400 bg-slate-800 border-brand-border'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`card !p-6 border ${colors[color]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl bg-black/20 ${colors[color].split(' ')[0]}`}>
           <Icon size={20} />
        </div>
        <span className="text-[10px] font-black italic uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tighter leading-tight italic">{value}</p>
    </motion.div>
  );
}

function ProfitRow({ label, profit, margin }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div>
        <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
           <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-accent/40" style={{ width: `${margin}%` }} />
           </div>
           <span className="text-[10px] font-bold text-slate-500">{margin}% margen</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-white italic">{formatCurrency(profit)}</p>
        <p className="text-[9px] font-bold text-brand-green uppercase tracking-tighter">Utilidad Neta</p>
      </div>
    </div>
  );
}
