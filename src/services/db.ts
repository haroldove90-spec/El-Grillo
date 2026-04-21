import { getSupabase } from '../lib/supabase';

// Generic CRUD operations wrapper to include error logging
const handleSupabase = async (operation: any) => {
  try {
    const { data, error } = await operation;
    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Operation failed:', err);
    throw err;
  }
};

export const db = {
  // Clients
  clients: {
    list: () => handleSupabase(getSupabase().from('clients').select('*').order('created_at', { ascending: false })),
    get: (id: string) => handleSupabase(getSupabase().from('clients').select('*').eq('id', id).single()),
    create: (data: any) => handleSupabase(getSupabase().from('clients').insert(data).select().single()),
    update: (id: string, data: any) => handleSupabase(getSupabase().from('clients').update(data).eq('id', id).select().single()),
    delete: (id: string) => handleSupabase(getSupabase().from('clients').delete().eq('id', id)),
    search: (query: string) => handleSupabase(
      getSupabase().from('clients')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%`)
    )
  },

  // Vehicles
  vehicles: {
    list: () => handleSupabase(getSupabase().from('vehicles').select('*, clients(*)').order('created_at', { ascending: false })),
    get: (id: string) => handleSupabase(getSupabase().from('vehicles').select('*, clients(*)').eq('id', id).single()),
    create: (data: any) => handleSupabase(getSupabase().from('vehicles').insert(data).select().single()),
    update: (id: string, data: any) => handleSupabase(getSupabase().from('vehicles').update(data).eq('id', id).select().single()),
    delete: (id: string) => handleSupabase(getSupabase().from('vehicles').delete().eq('id', id)),
    getByPlate: (plate: string) => handleSupabase(getSupabase().from('vehicles').select('*, clients(*)').eq('license_plate', plate.toUpperCase()).maybeSingle())
  },

  // Service Orders
  orders: {
    list: () => handleSupabase(
      getSupabase().from('service_orders')
        .select('*, vehicles(*, clients(*)), staff(*)')
        .order('created_at', { ascending: false })
    ),
    get: (id: string) => handleSupabase(
      getSupabase().from('service_orders')
        .select('*, vehicles(*, clients(*)), staff(*), service_order_items(*)')
        .eq('id', id).single()
    ),
    create: (data: any) => handleSupabase(getSupabase().from('service_orders').insert(data).select().single()),
    update: (id: string, data: any) => handleSupabase(getSupabase().from('service_orders').update(data).eq('id', id).select().single()),
    updateStatus: (id: string, status: string) => handleSupabase(getSupabase().from('service_orders').update({ status }).eq('id', id).select().single()),
    delete: (id: string) => handleSupabase(getSupabase().from('service_orders').delete().eq('id', id))
  },

  // Inventory
  inventory: {
    list: () => handleSupabase(getSupabase().from('inventory').select('*').order('part_name')),
    create: (data: any) => handleSupabase(getSupabase().from('inventory').insert(data).select().single()),
    update: (id: string, data: any) => handleSupabase(getSupabase().from('inventory').update(data).eq('id', id).select().single()),
    delete: (id: string) => handleSupabase(getSupabase().from('inventory').delete().eq('id', id))
  },

  // Staff
  staff: {
    list: () => handleSupabase(getSupabase().from('staff').select('*').order('full_name'))
  }
};
