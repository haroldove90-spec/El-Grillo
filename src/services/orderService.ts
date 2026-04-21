import { getSupabase } from '../lib/supabase';

export interface ServiceOrder {
  id: string;
  order_number: number;
  status: string;
  notes: string;
  total_amount: number;
  created_at: string;
  clients: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  vehicles: {
    make: string;
    model: string;
    year: number;
    license_plate: string;
  };
}

/**
 * Obtener todas las órdenes de servicio activas con datos relacionados
 */
export const getOrders = async (): Promise<ServiceOrder[]> => {
  const { data, error } = await getSupabase()
    .from('service_orders')
    .select(`
      *,
      clients(first_name, last_name, phone),
      vehicles(make, model, year, license_plate)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as ServiceOrder[];
};

/**
 * Insertar una nueva orden
 */
export const createOrder = async (orderData: any) => {
  const { data, error } = await getSupabase()
    .from('service_orders')
    .insert([orderData])
    .select();

  if (error) throw error;
  return data;
};

/**
 * Cambiar el estado de una orden
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await getSupabase()
    .from('service_orders')
    .update({ status })
    .eq('id', orderId)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Borrar una orden
 */
export const deleteOrder = async (orderId: string) => {
  const { error } = await getSupabase()
    .from('service_orders')
    .delete()
    .eq('id', orderId);

  if (error) throw error;
  return true;
};

/**
 * Obtener inventario
 */
export const getInventory = async () => {
  const { data, error } = await getSupabase()
    .from('inventory')
    .select('*')
    .order('part_name');

  if (error) throw error;
  return data;
};
