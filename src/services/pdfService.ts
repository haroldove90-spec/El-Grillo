import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const PdfService = {
  generateCertificate: (data: {
    orderNumber: string;
    client: string;
    vehicle: string;
    plate: string;
    date: string;
    expiryDate: string;
    score: number;
  }) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(53, 63, 72); // brand-sidebar
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(223, 200, 124); // brand-accent
    doc.setFontSize(24);
    doc.text('EL GRILLO', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('CERTIFICADO DE GARANTÍA PREMIUM', 105, 30, { align: 'center' });
    
    // Content Box
    doc.setDrawColor(223, 200, 124);
    doc.setLineWidth(0.5);
    doc.rect(10, 45, 190, 150);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Certificado #${data.orderNumber}`, 20, 60);
    
    doc.setFontSize(11);
    doc.text('Este documento certifica que el vehículo descrito ha sido sometido a un riguroso proceso de', 20, 75);
    doc.text('inspección y mantenimiento en las instalaciones de EL GRILLO SERVICIO AUTOMOTRIZ.', 20, 82);
    
    // Details Table-like
    doc.setFontSize(12);
    doc.text('DETALLES DEL VEHÍCULO Y CLIENTE', 20, 100);
    doc.setLineWidth(0.2);
    doc.line(20, 102, 190, 102);
    
    doc.setFontSize(10);
    doc.text(`CLIENTE: ${data.client.toUpperCase()}`, 20, 115);
    doc.text(`VEHÍCULO: ${data.vehicle.toUpperCase()}`, 20, 125);
    doc.text(`PLACAS: ${data.plate.toUpperCase()}`, 20, 135);
    
    doc.text(`FECHA DE EMISIÓN: ${data.date}`, 20, 155);
    doc.text(`VIGENCIA HASTA: ${data.expiryDate}`, 20, 165);
    
    // Score
    doc.setFillColor(223, 200, 124);
    doc.rect(150, 110, 40, 40, 'F');
    doc.setTextColor(53, 63, 72);
    doc.setFontSize(20);
    doc.text(`${data.score}%`, 170, 130, { align: 'center' });
    doc.setFontSize(8);
    doc.text('SALUD VEHICULAR', 170, 140, { align: 'center' });
    
    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Este certificado es válido únicamente con el sello digital y la firma de autorización.', 105, 185, { align: 'center' });
    
    doc.save(`Certificado_ElGrillo_${data.orderNumber}.pdf`);
  },

  generateStaffReport: (staff: any[]) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Reporte de Personal - EL GRILLO', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    
    const tableData = staff.map(s => [
      s.name,
      s.role,
      s.specialty,
      `${s.efficiency}%`,
      s.email,
      s.phone
    ]);
    
    (doc as any).autoTable({
      head: [['Nombre', 'Rol', 'Especialidad', 'Eficiencia', 'Email', 'Teléfono']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [223, 200, 124], textColor: [53, 63, 72] }
    });
    
    doc.save('Reporte_Personal_ElGrillo.pdf');
  },

  generateFinancialReport: (stats: any) => {
    const doc = new jsPDF();
    doc.setFillColor(53, 63, 72);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(223, 200, 124);
    doc.setFontSize(18);
    doc.text('CIERRE DE CAJA DIARIO - EL GRILLO', 14, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);
    
    (doc as any).autoTable({
      head: [['Concepto', 'Monto (MXN)']],
      body: [
        ['Ingresos Totales', `$${stats.revenue.toLocaleString()}`],
        ['Inversión en Refacciones', `$${stats.partCosts.toLocaleString()}`],
        ['Ganancia Neta Real', `$${stats.netProfit.toLocaleString()}`],
        ['Margen de Utilidad', `${stats.margin}%`],
        ['Órdenes Atendidas', stats.ordersCount]
      ],
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [53, 63, 72] }
    });
    
    doc.save(`Cierre_Caja_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  generateInvoice: (data: any, socials: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA PROFORMA', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('SERVICIO AUTOMOTRIZ EL GRILLO', 14, 35);
    doc.setFont('helvetica', 'normal');
    doc.text('Calle Mecánicos #45, Col. Industrial', 14, 40);
    doc.text('RFC: SAGR-800101-GRI', 14, 45);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`ORDEN: #${data.orderNumber}`, 196, 35, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 196, 40, { align: 'right' });
    
    // Client Info
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 55, 182, 25, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENTE:', 20, 62);
    doc.setFont('helvetica', 'normal');
    doc.text(data.clientName, 45, 62);
    doc.setFont('helvetica', 'bold');
    doc.text('VEHÍCULO:', 20, 72);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.vehicle} (${data.plate})`, 45, 72);
    
    // Items
    const rows = data.items.map((it: any) => [
      it.description,
      it.quantity,
      `$${it.unitPrice.toLocaleString()}`,
      `$${(it.quantity * it.unitPrice).toLocaleString()}`
    ]);
    
    (doc as any).autoTable({
      head: [['Descripción', 'Cant.', 'Precio Unit.', 'Subtotal']],
      body: rows,
      startY: 85,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`SUBTOTAL: $${socials.subtotal.toLocaleString()}`, 196, finalY, { align: 'right' });
    doc.text(`IVA (16%): $${socials.iva.toLocaleString()}`, 196, finalY + 7, { align: 'right' });
    doc.setFontSize(14);
    doc.text(`TOTAL: $${socials.total.toLocaleString()} MXN`, 196, finalY + 17, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Este presupuesto tiene una vigencia de 5 días hábiles.', 14, finalY + 30);
    
    doc.save(`Factura_Proforma_${data.orderNumber}.pdf`);
  },

  generateInventoryReport: (items: any[]) => {
    const doc = new jsPDF();
    doc.setFillColor(53, 63, 72);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(223, 200, 124);
    doc.setFontSize(18);
    doc.text('REPORTE DE INVENTARIO - EL GRILLO', 14, 20);
    
    const tableData = items.map(i => [
      i.sku,
      i.part_name,
      i.category,
      i.quantity,
      `$${i.unit_price.toLocaleString()}`
    ]);
    
    (doc as any).autoTable({
      head: [['SKU', 'Descripción', 'Categoría', 'Stock', 'Precio']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [53, 63, 72] }
    });
    
    doc.save('Inventario_ElGrillo.pdf');
  },

  generateOrderPDF: (order: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(53, 63, 72);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(223, 200, 124);
    doc.setFontSize(24);
    doc.text('ORDEN DE SERVICIO', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`EL GRILLO SERVICIO AUTOMOTRIZ - #${order.order_number}`, 105, 30, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 50);
    doc.text(`Estado Actual: ${order.status.toUpperCase()}`, 14, 57);
    
    // Client & Vehicle Grid
    (doc as any).autoTable({
      head: [['Información del Cliente', 'Información del Vehículo']],
      body: [[
        `Nombre: ${order.client_name}\nTel: ${order.client_phone}`,
        `Vehículo: ${order.vehicle_model}\nPlacas: ${order.vehicle_plate}`
      ]],
      startY: 65,
      theme: 'grid',
      headStyles: { fillColor: [223, 200, 124], textColor: [53, 63, 72] }
    });
    
    // Service Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MOTIVO DEL SERVICIO / DIAGNÓSTICO', 14, (doc as any).lastAutoTable.finalY + 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(order.service_description, 180);
    doc.text(splitText, 14, (doc as any).lastAutoTable.finalY + 22);
    
    // Signature lines
    const sigY = 240;
    doc.setLineWidth(0.5);
    doc.line(30, sigY, 90, sigY);
    doc.line(120, sigY, 180, sigY);
    doc.setFontSize(8);
    doc.text('FIRMA DE CONFORMIDAD CLIENTE', 60, sigY + 5, { align: 'center' });
    doc.text('FIRMA RESPONSABLE TALLER', 150, sigY + 5, { align: 'center' });
    
    doc.save(`Orden_${order.order_number}_ElGrillo.pdf`);
  },

  generateInspectionReport: (vehicle: string, orderNumber: string, inspections: any[]) => {
    const doc = new jsPDF();
    doc.setFillColor(53, 63, 72);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(223, 200, 124);
    doc.setFontSize(20);
    doc.text('REPORTE DE INSPECCIÓN SEMÁFORO', 14, 25);
    
    doc.setTextColor(255);
    doc.setFontSize(10);
    doc.text(`${vehicle} - ORDEN: #${orderNumber}`, 14, 33);
    
    const tableData = inspections.map(i => {
      const status = i.wear > 60 ? 'Óptimo' : i.wear > 30 ? 'Preventivo' : 'Urgente';
      return [
        i.name,
        `${i.wear}%`,
        status,
        status === 'Urgente' ? 'Reemplazo Inmediato' : status === 'Preventivo' ? 'Programar Cambio' : 'Sin acción'
      ];
    });
    
    (doc as any).autoTable({
      head: [['Componente', 'Vida Útil', 'Estado', 'Recomendación']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [53, 63, 72] }
    });
    
    doc.save(`Inspeccion_${orderNumber}_ElGrillo.pdf`);
  },

  generateReceptionSheet: (data: any) => {
    const doc = new jsPDF();
    doc.setFillColor(53, 63, 72);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(223, 200, 124);
    doc.setFontSize(22);
    doc.text('HOJA DE RECEPCIÓN', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('EL GRILLO SERVICIO AUTOMOTRIZ', 105, 30, { align: 'center' });
    doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 105, 36, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('1. DATOS DEL CLIENTE', 14, 55);
    doc.setFontSize(10);
    doc.text(`Nombre/Tel: ${data.client || data.phone}`, 14, 62);
    
    doc.setFontSize(12);
    doc.text('2. DATOS DEL VEHÍCULO', 14, 75);
    doc.setFontSize(10);
    doc.text(`Marca/Modelo: ${data.vehicleData.make} ${data.vehicleData.model}`, 14, 82);
    doc.text(`Placas: ${data.vehicleData.plate}`, 14, 87);
    doc.text(`VIN: ${data.vehicleData.vin || 'N/A'}`, 14, 92);
    
    doc.setFontSize(12);
    doc.text('3. SERVICIOS SOLICITADOS', 14, 105);
    (doc as any).autoTable({
      body: data.selectedServices.map((s: string) => [s]),
      startY: 110,
      theme: 'plain',
      styles: { fontSize: 9 }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('4. OBSERVACIONES DE ENTRADA', 14, finalY);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(data.notes || 'Ninguna', 180);
    doc.text(splitNotes, 14, finalY + 7);
    
    // Checkbox placeholders
    doc.setFontSize(8);
    const boxY = 240;
    doc.rect(14, boxY, 4, 4); doc.text('Tanque Lleno', 20, boxY + 3);
    doc.rect(60, boxY, 4, 4); doc.text('Refacción', 66, boxY + 3);
    doc.rect(110, boxY, 4, 4); doc.text('Gato', 116, boxY + 3);
    doc.rect(160, boxY, 4, 4); doc.text('Herramienta', 166, boxY + 3);
    
    doc.save(`Recepcion_${data.vehicleData.plate}_${new Date().getTime()}.pdf`);
  }
};
