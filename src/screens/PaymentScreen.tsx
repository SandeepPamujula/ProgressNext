import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useMutation } from '@apollo/client';
import { PROCESS_APPLICATION_PAYMENT } from '../graphql/queries';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ route, navigation }) => {
  const { applicationId, applicationFee = 50 } = route.params;
  const [processPayment] = useMutation(PROCESS_APPLICATION_PAYMENT);
  const [loading, setLoading] = useState(false);
  
  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingZip: ''
  });
  
  const updatePaymentField = (field, value) => {
    setPaymentData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  const validateForm = () => {
    // Basic validation
    if (!paymentData.cardNumber || paymentData.cardNumber.length < 15) {
      Alert.alert('Invalid Card Number', 'Please enter a valid credit card number.');
      return false;
    }
    
    if (!paymentData.expiryDate || !paymentData.expiryDate.includes('/')) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MM/YY).');
      return false;
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV code.');
      return false;
    }
    
    if (!paymentData.nameOnCard) {
      Alert.alert('Missing Information', 'Please enter the name on your card.');
      return false;
    }
    
    if (!paymentData.billingZip) {
      Alert.alert('Missing Information', 'Please enter your billing ZIP code.');
      return false;
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Format payment data for the GraphQL mutation
      const paymentInput = {
        leaseApplicationId: applicationId,
        paymentMethod: 'credit_card',
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        billingZip: paymentData.billingZip
      };
      
      const { data } = await processPayment({
        variables: { payment: paymentInput }
      });
      
      setLoading(false);
      
      if (data && data.processApplicationPayment.success) {
        // Show success message and navigate to confirmation
        Alert.alert(
          'Payment Successful',
          'Your application fee has been processed successfully.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('HomeTab') 
            }
          ]
        );
      } else {
        // Show error message
        Alert.alert(
          'Payment Failed',
          data?.processApplicationPayment.message || 'There was an error processing your payment. Please try again.'
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Payment Error',
        'There was an error processing your payment. Please try again.'
      );
      console.error('Payment processing error:', error);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Processing payment...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Application Fee Payment</Text>
          <Text style={styles.headerSubtitle}>
            Complete your lease application by paying the application fee.
          </Text>
        </View>
        
        <View style={styles.paymentSummary}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Application Fee</Text>
            <Text style={styles.summaryValue}>${applicationFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Processing Fee</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${applicationFee.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={paymentData.cardNumber}
              onChangeText={(text) => updatePaymentField('cardNumber', text)}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={paymentData.expiryDate}
                onChangeText={(text) => updatePaymentField('expiryDate', text)}
                placeholder="MM/YY"
                maxLength={5}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={paymentData.cvv}
                onChangeText={(text) => updatePaymentField('cvv', text)}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name on Card</Text>
            <TextInput
              style={styles.input}
              value={paymentData.nameOnCard}
              onChangeText={(text) => updatePaymentField('nameOnCard', text)}
              placeholder="John Doe"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Billing ZIP Code</Text>
            <TextInput
              style={styles.input}
              value={paymentData.billingZip}
              onChangeText={(text) => updatePaymentField('billingZip', text)}
              placeholder="12345"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>
        
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={20} color="#666" />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pay ${applicationFee.toFixed(2)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  paymentSummary: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

export default PaymentScreen;
