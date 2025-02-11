import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'; // Remove Note import
import { OrderFullyDetailed, User } from '../models/entities';
import { currentDate, formatTime } from '../utils/formatTime';

// Interface for the props
interface Props {
  user: User;
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
  productRow:{
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

const OrderInvoiceTemplate = ({ user, detailedOrder }: Props) => {
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
              {user.mail ?? "Mail not provided"}
            </Text>
            <Text>Phone: {user.phone ?? ""}</Text>
            <Text>VAT: {user.vat ?? ""}</Text>
            <Text>{user.address ?? ""}</Text>
          </View>

        </View>

        <View style={styles.title}>
          <Text>Order:{detailedOrder.orderNumber ?? ""} </Text>
          <Text>Date: {currentDate()} </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.productRow}>
            <Text style={{width:'400px',margin:3}}>Product</Text>
            <Text style={{width:'150px',margin:3}}>Quantity</Text>
            <Text style={{width:'150px',margin:3}}>Unit price</Text>
            <Text style={{width:'150px',margin:3}}>Total price</Text>
          </View>
          {detailedOrder?.products && Array.from(detailedOrder?.products?.entries()).map(([productId,productWithQ])=>(
              <View key={productId} style={styles.productRow}>
                <Text style={{width:'400px',margin:3}}>{productWithQ.product.marketingName}</Text>
                <Text style={{width:'150px',margin:3}}>x{productWithQ.quantity}</Text>
                <Text style={{width:'150px',margin:3}}>{productWithQ.product.retailPrice}€</Text>
                <Text style={{width:'150px',margin:3}}>{parseInt(productWithQ?.product?.retailPrice!!,10) * productWithQ.quantity}€</Text>
              </View>

          ))}

        </View>

      </Page>
    </Document>
  );
};

export default OrderInvoiceTemplate;
