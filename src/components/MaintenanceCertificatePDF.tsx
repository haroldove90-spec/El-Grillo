import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  Font,
  Link
} from '@react-pdf/renderer';

// Register a clean font if possible, otherwise use standard fonts
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    color: '#353F48',
  },
  accentBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#DFC87C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  workshopInfo: {
    flexDirection: 'column',
  },
  workshopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353F48',
    letterSpacing: -0.5,
  },
  workshopSub: {
    fontSize: 8,
    color: '#DFC87C',
    fontWeight: 'bold',
    marginTop: 2,
    letterSpacing: 2,
  },
  contactInfo: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 1.4,
  },
  certificateTitleContainer: {
    textAlign: 'right',
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#353F48',
  },
  orderNumber: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#DFC87C',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#DFC87C',
    paddingLeft: 8,
  },
  grid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  gridCol: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#353F48',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 8,
  },
  colDesc: { flex: 4, fontSize: 9, fontWeight: 'bold' },
  colQty: { flex: 1, fontSize: 9, textAlign: 'center' },
  colPrice: { flex: 1.5, fontSize: 9, textAlign: 'right' },
  colTotal: { flex: 1.5, fontSize: 9, textAlign: 'right', fontWeight: 'bold' },
  
  totalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#353F48',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 30,
  },
  totalLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 18,
    color: '#DFC87C',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  photoItem: {
    width: '48%',
    marginBottom: 10,
  },
  photoImage: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    objectFit: 'cover',
  },
  photoLabel: {
    fontSize: 7,
    marginTop: 4,
    textAlign: 'center',
    color: '#6B7280',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  recommendations: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 8,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DFC87C',
    marginRight: 8,
  },
  recText: {
    fontSize: 9,
    color: '#92400E',
    fontWeight: 'medium',
  },
  
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  warrantyBox: {
    width: '50%',
  },
  warrantyTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  warrantyText: {
    fontSize: 8,
    color: '#6B7280',
    lineHeight: 1.4,
  },
  signatureContainer: {
    alignItems: 'center',
    width: '30%',
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 4,
    width: '100%',
    textAlign: 'center',
  },
  qrContainer: {
    width: 50,
    height: 50,
  },
  qrImage: {
    width: 50,
    height: 50,
  }
});

interface PDFData {
  orderNumber: string;
  client: string;
  phone: string;
  vehicle: string;
  plate: string;
  year: string;
  km: string;
  services: any[];
  total: number;
  paymentMethod: string;
  signature: string | null;
  recommendations: string[];
  photos: { before: string, after: string, label: string }[];
  qrCodeUrl: string;
}

export const MaintenanceCertificatePDF = ({ data }: { data: PDFData }) => (
  <Document title={`Certificado_Mantenimiento_${data.orderNumber}`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.accentBorder} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image src="https://appdesignproyectos.com/elgrillo.png" style={styles.logo} />
          <View style={styles.workshopInfo}>
            <Text style={styles.workshopName}>EL GRILLO</Text>
            <Text style={styles.workshopSub}>SERVICIO AUTOMOTRIZ</Text>
            <Text style={styles.contactInfo}>
              CALLE MECÁNICOS #45, CDMX{"\n"}
              TEL: (55) 1234-1234{"\n"}
              WWW.ELGRILLOAUTOS.COM
            </Text>
          </View>
        </View>
        <View style={styles.certificateTitleContainer}>
          <Text style={styles.certificateTitle}>CERTIFICADO</Text>
          <Text style={styles.orderNumber}>ORDEN DE SERVICIO: #{data.orderNumber}</Text>
        </View>
      </View>

      {/* Info Grid */}
      <View style={styles.grid}>
        <View style={styles.gridCol}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.infoLabel}>Cliente</Text>
            <Text style={styles.infoValue}>{data.client}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Vehículo</Text>
            <Text style={styles.infoValue}>{data.vehicle} ({data.year})</Text>
          </View>
        </View>
        <View style={styles.gridCol}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.infoLabel}>Placas / Registro</Text>
            <Text style={styles.infoValue}>{data.plate}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Kilometraje Registrado</Text>
            <Text style={styles.infoValue}>{data.km} KM</Text>
          </View>
        </View>
      </View>

      {/* Services Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servicios y Refacciones</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>CONCEPTO / DESCRIPCIÓN</Text>
            <Text style={styles.colQty}>CANT.</Text>
            <Text style={styles.colPrice}>P. UNITARIO</Text>
            <Text style={styles.colTotal}>TOTAL</Text>
          </View>
          {data.services.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>${item.unitPrice.toLocaleString()}</Text>
              <Text style={styles.colTotal}>${(item.unitPrice * item.quantity).toLocaleString()}</Text>
            </View>
          ))}
        </View>
        <View style={styles.totalContainer}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 7, color: '#9CA3AF', marginBottom: 2 }}>MÉTODO DE PAGO</Text>
            <Text style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 'bold' }}>{data.paymentMethod}</Text>
          </View>
          <View>
            <Text style={styles.totalLabel}>TOTAL PAGADO MXN</Text>
            <Text style={styles.totalValue}>${data.total.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Before & After */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidencia Técnica (Antes vs. Después)</Text>
        <View style={styles.photosGrid}>
          {data.photos.map((pair, index) => (
            <View key={index} style={styles.photoItem}>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                 <View style={{ flex: 1 }}>
                    <Image src={pair.before} style={styles.photoImage} />
                    <Text style={styles.photoLabel}>Inicial</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                    <Image src={pair.after} style={styles.photoImage} />
                    <Text style={styles.photoLabel}>Finalizado</Text>
                 </View>
              </View>
              <Text style={{ fontSize: 8, fontWeight: 'bold', marginTop: 5, textAlign: 'center' }}>{pair.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Semáforo de Servicios Preventivos</Text>
        <View style={styles.recommendations}>
          <Text style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 8, color: '#92400E' }}>
            ATENCIÓN RECOMENDADA PARA SU PRÓXIMA VISITA:
          </Text>
          {data.recommendations.map((rec, index) => (
            <View key={index} style={styles.recItem}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer} wrap={false}>
        <View style={styles.warrantyBox}>
          <Text style={styles.warrantyTitle}>GARANTÍA EL GRILLO</Text>
          <Text style={styles.warrantyText}>
            Este certificado avala que su vehículo ha sido intervenido bajo estándares de calidad premium. 
            Mano de obra garantizada por 30 días o 1,000 KM. Las refacciones cuentan con la garantía 
            del fabricante. Conserve este documento para historial de mantenimiento.
          </Text>
          <View style={{ marginTop: 15 }}>
            <Image src={data.qrCodeUrl} style={styles.qrImage} />
            <Text style={{ fontSize: 6, color: '#9CA3AF', marginTop: 2 }}>ESCANEÉ PARA SOPORTE O RESEÑA</Text>
          </View>
        </View>

        <View style={styles.signatureContainer}>
          {data.signature ? (
            <Image src={data.signature} style={styles.signatureImage} />
          ) : (
            <View style={{ height: 50 }} />
          )}
          <Text style={styles.signatureLabel}>FIRMA DE CONFORMIDAD DEL CLIENTE</Text>
        </View>
      </View>
    </Page>
  </Document>
);
