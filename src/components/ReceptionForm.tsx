import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Car, CheckSquare, FileText, ChevronRight, Phone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../services/db';

const SERVICES = [
  'Mecánica General', 'A/C y Calefacción', 'Sistema Eléctrico', 
  'Suspensión y Frenos', 'Fuel Injection', 'Marchas y Alternadores'
];

export function ReceptionForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [phone, setPhone] = useState('');
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    vin: ''
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Client Search logic
  const handlePhoneSearch = async () => {
    if (!phone) return;
    try {
      setLoading(true);
      setError(null);
      const results = await db.clients.search(phone);
      if (results && results.length > 0) {
        setClientData(results[0]);
        // Also try to find vehicle for this client
        const vehiclesData = await db.vehicles.list();
        const clientVehicle = vehiclesData.find((v: any) => v.client_id === results[0].id);
        if (clientVehicle) {
          setVehicleData({
            make: clientVehicle.make,
            model: clientVehicle.model,
            year: clientVehicle.year.toString(),
            plate: clientVehicle.license_plate,
            vin: clientVehicle.vin || ''
          });
        }
      } else {
        setError('Cliente no encontrado. Por favor, regístrelo.');
        setClientData(null);
      }
    } catch (err) {
      setError('Error al buscar cliente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (s: string) => {
    setSelectedServices(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!phone || !vehicleData.plate) {
        throw new Error('El teléfono y las placas son campos obligatorios.');
      }

      let finalClientId = clientData?.id;

      // 1. Ensure Client exists
      if (!finalClientId) {
        const names = phone.split(' '); // Cheap mock for first/last name if not provided
        const newClient = await db.clients.create({
          first_name: names[0] || 'Cliente',
          last_name: names[1] || 'Nuevo',
          phone: phone
        });
        finalClientId = newClient.id;
      }

      // 2. Ensure Vehicle exists
      const existingVehicle = await db.vehicles.getByPlate(vehicleData.plate);
      let finalVehicleId = existingVehicle?.id;

      if (!finalVehicleId) {
        const newVehicle = await db.vehicles.create({
          client_id: finalClientId,
          make: vehicleData.make || 'Genérico',
          model: vehicleData.model || 'Modelo',
          year: parseInt(vehicleData.year) || new Date().getFullYear(),
          license_plate: vehicleData.plate.toUpperCase(),
          vin: vehicleData.vin
        });
        finalVehicleId = newVehicle.id;
      }

      // 3. Create Service Order
      await db.orders.create({
        client_id: finalClientId,
        vehicle_id: finalVehicleId,
        status: 'Recepcion',
        notes: `${selectedServices.join(', ')}. Notas: ${notes}`,
        apply_iva: false,
        total_amount: 0
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        resetForm();
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Error al guardar la orden.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhone('');
    setClientData(null);
    setVehicleData({ make: '', model: '', year: '', plate: '', vin: '' });
    setSelectedServices([]);
    setNotes('');
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 size={80} className="text-brand-green mb-6 mx-auto" />
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">ORDEN REGISTRADA</h2>
          <p className="text-slate-muted italic text-sm">La orden de {vehicleData.plate} ya está en el tablero.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-full flex flex-col pb-20">
      <div className="mb-8 flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white">RECEPCIÓN</h2>
          <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest leading-none mt-1">NUEVA ORDEN DE SERVICIO</p>
        </div>
        <div className="text-[10px] font-black text-slate-700 bg-brand-sidebar border border-brand-border px-2 py-1 rounded-md italic">
          PASO {step} DE 3
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2 italic">
                <Phone size={14} className="text-brand-accent" /> Datos de Contacto
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={18} />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={handlePhoneSearch}
                  placeholder="Teléfono del cliente..." 
                  className="w-full bg-brand-sidebar border border-brand-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all placeholder:text-slate-600 font-bold"
                />
                {loading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-accent" />}
              </div>
              
              <AnimatePresence>
                {clientData && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-brand-accent/10 border border-brand-accent/30 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-sidebar font-black italic uppercase">
                      {clientData.first_name[0]}{clientData.last_name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white italic uppercase tracking-tighter">{clientData.first_name} {clientData.last_name}</p>
                      <p className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">Cliente Registrado</p>
                    </div>
                  </motion.div>
                )}
                {error && (
                   <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500">
                     <AlertCircle size={16} />
                     <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                   </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={() => setClientData({ first_name: 'Nuevo', last_name: 'Cliente' })}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-brand-border flex items-center justify-center gap-3 text-[10px] font-black text-slate-muted hover:text-white hover:border-brand-accent transition-all uppercase tracking-widest"
              >
                <UserPlus size={18} />
                REGISTRAR NUEVO CLIENTE
              </button>
            </div>
            
            <div className="p-6 bg-brand-sidebar border border-brand-border rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={64} fill="currentColor" /></div>
                <h4 className="text-[10px] font-black text-brand-accent mb-2 tracking-widest uppercase italic">Inteligencia Grillo</h4>
                <p className="text-[11px] text-slate-muted leading-relaxed font-bold uppercase tracking-tight">Si el cliente ya existe, cargaremos automáticamente su historial de vehículos y servicios previos.</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2 italic">
                <Car size={14} className="text-brand-accent" /> Datos del Vehículo
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Marca" 
                  value={vehicleData.make}
                  onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                  className="input-field" 
                />
                <input 
                  type="text" 
                  placeholder="Modelo" 
                  value={vehicleData.model}
                  onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                  className="input-field" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Año" 
                  value={vehicleData.year}
                  onChange={(e) => setVehicleData({...vehicleData, year: e.target.value})}
                  className="input-field" 
                />
                <input 
                  type="text" 
                  placeholder="Placas" 
                  value={vehicleData.plate}
                  onChange={(e) => setVehicleData({...vehicleData, plate: e.target.value})}
                  className="input-field !text-brand-accent uppercase font-black tracking-widest text-center" 
                />
              </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2 italic">
                  <CheckSquare size={14} className="text-brand-accent" /> Checklist de Servicios
                </label>
                <div className="grid grid-cols-1 gap-2">
                    {SERVICES.map(service => (
                        <div 
                          key={service} 
                          onClick={() => toggleService(service)}
                          className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer active:scale-95 ${
                            selectedServices.includes(service) 
                              ? 'bg-brand-accent border-brand-accent text-brand-sidebar shadow-lg shadow-brand-accent/20' 
                              : 'bg-brand-sidebar border-brand-border text-slate-muted'
                          }`}
                        >
                            <span className="text-[11px] font-black uppercase tracking-widest">{service}</span>
                            {selectedServices.includes(service) && <ChevronRight size={16} />}
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-muted uppercase tracking-widest flex items-center gap-2 italic">
                <FileText size={14} className="text-brand-accent" /> Notas de Diagnóstico Inicial
              </label>
              <textarea 
                rows={6} 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe los síntomas, ruidos o fallas reportadas por el cliente..."
                className="w-full bg-brand-sidebar border border-brand-border rounded-3xl p-6 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-slate-600 resize-none h-48 font-medium italic"
              />
            </div>

            <div className="card !bg-brand-sidebar !border-brand-accent/10 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5"><FileText size={48} /></div>
                <div className="flex gap-4 relative z-10">
                    <div className="p-3 bg-brand-accent/10 rounded-2xl shrink-0 h-fit"><AlertCircle size={24} className="text-brand-accent" /></div>
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase mb-2 tracking-widest italic">Aviso de Recepción</h4>
                        <p className="text-[10px] text-slate-muted leading-relaxed italic font-bold">Estas notas son la base para el equipo de diagnóstico. Sea lo más detallado posible sobre los ruidos reportados.</p>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {step > 1 && (
            <button 
                onClick={() => setStep(s => s - 1)}
                disabled={loading}
                className="w-1/3 bg-brand-sidebar text-slate-muted font-black py-4 rounded-2xl border border-brand-border active:scale-95 transition-all text-[10px] uppercase tracking-widest hover:text-white"
            >
                ATRÁS
            </button>
        )}
        <button 
          onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
          disabled={loading}
          className={`flex-1 bg-brand-accent text-brand-sidebar font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-accent/20 text-[10px] uppercase tracking-widest group ${step === 3 ? 'bg-brand-green text-white shadow-brand-green/20' : ''}`}
        >
          {loading ? (
             <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              {step === 3 ? 'FINALIZAR REGISTRO' : 'CONTINUAR'}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      <style>{`
        .input-field {
            @apply w-full bg-brand-sidebar border border-brand-border rounded-2xl py-4 px-4 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-slate-600 font-bold italic;
        }
      `}</style>
    </div>
  );
}
