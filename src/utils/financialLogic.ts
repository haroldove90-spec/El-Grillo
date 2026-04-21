/**
 * Lógica Financiera para Servicio Automotriz El Grillo
 */

export interface FinancialDetail {
  description: string;
  quantity: number;
  costPrice: number; // Costo interno
  unitPrice: number; // Precio al cliente
  isPart: boolean;
}

export interface FinancialCalculation {
  subtotal: number;
  iva: number;
  total: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
}

/**
 * Calcula el resumen financiero de una orden
 */
export const calculateOrderFinancials = (
  items: FinancialDetail[],
  applyIva: boolean = false
): FinancialCalculation => {
  let subtotal = 0;
  let totalCost = 0;

  items.forEach(item => {
    const itemTotal = item.unitPrice * item.quantity;
    const itemCost = item.costPrice * item.quantity;
    
    subtotal += itemTotal;
    totalCost += itemCost;
  });

  const iva = applyIva ? subtotal * 0.16 : 0;
  const total = subtotal + iva;
  const grossProfit = subtotal - totalCost; // La utilidad bruta se calcula sobre el subtotal sin impuestos
  const margin = subtotal > 0 ? (grossProfit / subtotal) * 100 : 0;

  return {
    subtotal,
    iva,
    total,
    totalCost,
    grossProfit,
    margin
  };
};

/**
 * Formatea valores a Moneda Mexicana (MXN)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};
