import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a font for a more professional look
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKYMZhrib2Bg-4.ttf', fontWeight: 900 },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: 2,
    borderBottomColor: '#353F48',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
  },
  headerText: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: -1,
    color: '#353F48',
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#DFC87C',
    marginTop: 2,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 900,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    borderLeft: 3,
    borderLeftColor: '#DFC87C',
    paddingLeft: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: 700,
  },
  value: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1e293b',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    backgroundColor: '#353F48',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
    alignItems: 'center',
  },
  colDesc: { flex: 3, fontSize: 9, fontWeight: 700, paddingLeft: 10 },
  colQty: { flex: 0.5, fontSize: 9, textAlign: 'center', fontWeight: 400 },
  colPrice: { flex: 1, fontSize: 9, textAlign: 'right', fontWeight: 400 },
  colTotal: { flex: 1, fontSize: 9, textAlign: 'right', fontWeight: 700, paddingRight: 10 },
  
  totals: {
    alignItems: 'flex-end',
    marginTop: 20,
    paddingRight: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 700,
    width: 100,
    textAlign: 'right',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 700,
    width: 80,
    textAlign: 'right',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 220,
    marginTop: 5,
    paddingTop: 10,
    borderTop: 2,
    borderTopColor: '#353F48',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 900,
    fontStyle: 'italic',
    color: '#353F48',
    width: 120,
    textAlign: 'right',
    marginRight: 20,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 900,
    color: '#353F48',
    width: 80,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4 8',
    borderRadius: 100,
    fontSize: 8,
    fontWeight: 900,
    textTransform: 'uppercase',
    position: 'absolute',
    top: 60,
    right: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 10,
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  qrPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#f8fafc',
    border: 1,
    borderColor: '#e2e8f0',
  }
});

interface ServiceCertificateProps {
  order: any;
  client: any;
  vehicle: any;
  items: any[];
}

export function ServiceCertificate({ order, client, vehicle, items }: ServiceCertificateProps) {
  const subtotal = items.reduce((acc, i) => acc + (i.unit_price * i.quantity), 0);
  const iva = order.apply_iva ? subtotal * 0.16 : 0;
  const total = subtotal + iva;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            src="https://appdesignproyectos.com/elgrillo.png" 
            style={styles.logo} 
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>EL GRILLO</Text>
            <Text style={styles.subtitle}>SERVICIO AUTOMOTRIZ</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 15, fontWeight: 700 }}>ORDEN DE SERVICIO: #{order.id?.toString().slice(-6).toUpperCase()}</Text>
            <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: 2 }}>FECHA: {new Date().toLocaleDateString('es-MX')}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.section}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Cliente</Text>
              <Text style={styles.value}>{client.first_name} {client.last_name}</Text>
              <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>{client.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Vehículo</Text>
              <Text style={styles.value}>{vehicle.make} {vehicle.model}</Text>
              <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>Año: {vehicle.year}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Identificación</Text>
              <Text style={[styles.value, { color: '#ef4444' }]}>PLACAS: {vehicle.license_plate}</Text>
            </View>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de Servicios y Refacciones</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colDesc, { color: '#FFFFFF' }]}>DESCRIPCIÓN</Text>
              <Text style={[styles.colQty, { color: '#FFFFFF' }]}>CANT</Text>
              <Text style={[styles.colPrice, { color: '#FFFFFF' }]}>P. UNIT</Text>
              <Text style={[styles.colTotal, { color: '#FFFFFF' }]}>TOTAL</Text>
            </View>
            
            {items.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.part_name?.toUpperCase() || 'MANO DE OBRA'}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>${item.unit_price?.toLocaleString()}</Text>
                <Text style={styles.colTotal}>${(item.unit_price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SUBTOTAL</Text>
            <Text style={styles.totalValue}>${subtotal.toLocaleString()}</Text>
          </View>
          {iva > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (16%)</Text>
              <Text style={styles.totalValue}>${iva.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>TOTAL MXN</Text>
            <Text style={styles.grandTotalValue}>${total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={[styles.section, { marginTop: 40 }]}>
           <Text style={styles.sectionTitle}>Notas y Observaciones</Text>
           <Text style={{ fontSize: 9, color: '#475569', lineHeight: 1.5, textAlign: 'justify' }}>
             {order.notes || 'No se registraron notas adicionales durante el servicio.'}
           </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            CALLE MECÁNICOS #45, COL. INDUSTRIAL, CDMX | TEL: (55) 1234-1234 | WWW.ELGRILLO.MX
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 40, marginTop: 10 }}>
            <View style={{ alignItems: 'center' }}>
               <View style={{ width: 100, height: 1, backgroundColor: '#e2e8f0', marginBottom: 5 }} />
               <Text style={{ fontSize: 7, color: '#94a3b8', textTransform: 'uppercase' }}>Firma Cliente</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
               <View style={{ width: 100, height: 1, backgroundColor: '#e2e8f0', marginBottom: 5 }} />
               <Text style={{ fontSize: 7, color: '#94a3b8', textTransform: 'uppercase' }}>Firma Taller</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
