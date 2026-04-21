/**
 * Lógica de negocio para Servicio Automotriz El Grillo
 */

export type SemaphoreColor = 'Green' | 'Yellow' | 'Red';

/**
 * Determina el color del semáforo basado en el nivel de desgaste
 * @param wearPercentage Porcentaje de desgaste (0-100)
 * @returns 'Green' | 'Yellow' | 'Red'
 */
export const calculateSemaforoStatus = (wearPercentage: number): SemaphoreColor => {
  if (wearPercentage >= 80) return 'Red'; // Urgente
  if (wearPercentage >= 40) return 'Yellow'; // Sugerido / Próximamente
  return 'Green'; // Correcto
};

/**
 * Formatea un número telefónico para el prefijo de México (+52)
 * @param phone Número de teléfono (10 dígitos o con prefijo)
 * @returns Número listo para API de WhatsApp
 */
export const formatMexicanPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Si ya tiene el 52 (prefijo de México), lo dejamos
  if (cleaned.length === 12 && cleaned.startsWith('52')) {
    return cleaned;
  }
  
  // Si son 10 dígitos (número estándar México), agregamos el 52
  if (cleaned.length === 10) {
    return `52${cleaned}`;
  }
  
  return cleaned;
};

interface WhatsAppOrderData {
  client: string;
  vehicle: string;
  status: string;
  services: string[];
  total: number;
  orderNumber: string;
}

/**
 * Genera el mensaje estructurado para WhatsApp
 */
export const generateWhatsAppMessage = (data: WhatsAppOrderData): string => {
  const { client, vehicle, status, services, total, orderNumber } = data;
  
  // URL Dinámica simulada (en producción sería la URL real del reporte)
  const reportUrl = `${window.location.origin}/reporte/${orderNumber}`;
  
  return `¡Hola ${client}! 👋
Le informamos sobre el estatus de su vehículo en *Servicio Automotriz El Grillo* 🦗🔧

*Vehículo:* ${vehicle}
*Orden:* #${orderNumber}
*Estatus Actual:* ${status.toUpperCase()}

*Servicios Realizados/Pendientes:*
${services.map(s => `• ${s}`).join('\n')}

*Total Estimado:* $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}

Puede consultar el reporte técnico detallado y el *Semáforo de Vida Útil* en el siguiente enlace:
${reportUrl}

¡Quedamos a sus órdenes!`;
};
