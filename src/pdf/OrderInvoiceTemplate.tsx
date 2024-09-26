import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'; // Remove Note import
import { OrderFullyDetailed } from '../models/entities';
import { currentDate, formatTime } from '../utils/formatTime';

// Interface for the props
interface Props {
  detailedOrder: OrderFullyDetailed;
}

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    margin: 10,
    padding: 10,
    backgroundColor: 'white'
  },
  title:{
    borderBottom: '2px solid var(--light-grey)',
    display:'flex',
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },

  section: {
    margin: 10,    
    padding: 10,    
    border: '2px solid var(--light-grey)',
    borderRadius:'15px'
    // padding: 10,
    // flexGrow: 1
  },
  bagRow:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-evenly'
  },
  customer: {
    fontSize:'12px',
    maxWidth:'30%',

  },
  makassarInfos:{
    fontSize:'12px',    
    maxWidth:'30%',
  },
  companiesSection:{
    display:'flex',
    flexDirection:'row',
    margin: 10,
    justifyContent:'space-between'
  },
  logoImage: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    objectFit:'contain',
    width:'40px',
    height:'40px'
  }
});

const OrderInvoiceTemplate = ({ detailedOrder }: Props) => {
  return (
    <Document
      // title={`${detailedOrder?.customer?.name || 'Unknown Customer'}-${detailedOrder?.orderNumber || ''}`}
      // subject={`invoice: ${detailedOrder?.customer?.name || 'Unknown Customer'}-${detailedOrder?.orderNumber || ''}`}
    >
      <Page debug={true} style={styles.page}>


        <View style={styles.companiesSection}>
          {/* Customer Information */}
          <View style={styles.customer}>
            <Text>{detailedOrder?.customer?.name || 'Name not available'}</Text>
            <Text>{detailedOrder?.customer?.mail || 'Email not available'}</Text>
            <Text>Tel: {detailedOrder?.customer?.phone || 'Phone not available'}</Text>
            <Text>Tva: {detailedOrder?.customer?.tva || 'TVA not specified'}</Text>
            <Text>{detailedOrder?.customer?.professionalAddress || 'Address not specified'}</Text>
          </View>

          {/* Your Company Information */}
          <View style={styles.makassarInfos}>
            <Image style={styles.logoImage} src={"/assets/logo-text.png"}></Image>
            <Text>
              laure.callewaert@gmail.com
            </Text>
            <Text>Téléphone: 0495 54 21 51</Text>
            <Text>TVA: 189218928</Text>
            <Text>Av de la mercadona</Text>
          </View>

        </View>

        <View style={styles.title}>
          <Text>Commande:{detailedOrder.orderNumber ?? ""} </Text>
          <Text>Date: {currentDate()} </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.bagRow}>
            <Text style={{width:'400px',margin:3}}>Modèle</Text>
            <Text style={{width:'150px',margin:3}}>Quantité</Text>
            <Text style={{width:'150px',margin:3}}>Prix unitaire</Text>
            <Text style={{width:'150px',margin:3}}>Prix total</Text>
          </View>
          {detailedOrder?.bags && Array.from(detailedOrder?.bags?.entries()).map(([bagId,bagWithQ])=>(
              <View key={bagId} style={styles.bagRow}>
                <Text style={{width:'400px',margin:3}}>{bagWithQ.bag.marketingName}</Text>
                <Text style={{width:'150px',margin:3}}>x{bagWithQ.quantity}</Text>
                <Text style={{width:'150px',margin:3}}>{bagWithQ.bag.retailPrice}€</Text>
                <Text style={{width:'150px',margin:3}}>{parseInt(bagWithQ?.bag?.retailPrice!!,10) * bagWithQ.quantity}€</Text>
              </View>

          ))}

        </View>

      </Page>
    </Document>
  );
};

export default OrderInvoiceTemplate;
