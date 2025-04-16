import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useMutation } from '@apollo/client';
import { SUBMIT_LEASE_APPLICATION } from '../graphql/queries';
import { Ionicons } from '@expo/vector-icons';

// Multi-step form component for lease application
const LeaseFormScreen = ({ route, navigation }) => {
  const { houseId } = route.params;
  const [currentStep, setCurrentStep] = useState(1);
  const [submitLeaseApplication] = useMutation(SUBMIT_LEASE_APPLICATION);
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    
    // Current Address
    currentStreet: '',
    currentCity: '',
    currentState: '',
    currentZipCode: '',
    
    // Employment Information
    employer: '',
    position: '',
    monthlyIncome: '',
    employmentLength: '',
    employerContact: '',
    
    // Rental History
    previousStreet: '',
    previousCity: '',
    previousState: '',
    previousZipCode: '',
    landlordName: '',
    landlordContact: '',
    monthlyRent: '',
    lengthOfStay: '',
    
    // Additional Occupants
    additionalOccupants: [
      { name: '', relationship: '', age: '' }
    ]
  });
  
  const updateFormField = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  const updateOccupantField = (index, field, value) => {
    const updatedOccupants = [...formData.additionalOccupants];
    updatedOccupants[index] = {
      ...updatedOccupants[index],
      [field]: value
    };
    
    setFormData(prevData => ({
      ...prevData,
      additionalOccupants: updatedOccupants
    }));
  };
  
  const addOccupant = () => {
    setFormData(prevData => ({
      ...prevData,
      additionalOccupants: [
        ...prevData.additionalOccupants,
        { name: '', relationship: '', age: '' }
      ]
    }));
  };
  
  const removeOccupant = (index) => {
    if (formData.additionalOccupants.length <= 1) return;
    
    const updatedOccupants = [...formData.additionalOccupants];
    updatedOccupants.splice(index, 1);
    
    setFormData(prevData => ({
      ...prevData,
      additionalOccupants: updatedOccupants
    }));
  };
  
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Information
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phone || !formData.dateOfBirth || !formData.ssn) {
          Alert.alert('Missing Information', 'Please fill in all personal information fields.');
          return false;
        }
        break;
      case 2: // Current Address
        if (!formData.currentStreet || !formData.currentCity || 
            !formData.currentState || !formData.currentZipCode) {
          Alert.alert('Missing Information', 'Please fill in all current address fields.');
          return false;
        }
        break;
      case 3: // Employment Information
        if (!formData.employer || !formData.position || !formData.monthlyIncome || 
            !formData.employmentLength || !formData.employerContact) {
          Alert.alert('Missing Information', 'Please fill in all employment information fields.');
          return false;
        }
        break;
      case 4: // Rental History
        if (!formData.previousStreet || !formData.previousCity || !formData.previousState || 
            !formData.previousZipCode || !formData.landlordName || !formData.landlordContact || 
            !formData.monthlyRent || !formData.lengthOfStay) {
          Alert.alert('Missing Information', 'Please fill in all rental history fields.');
          return false;
        }
        break;
      case 5: // Additional Occupants
        // This step is optional, so no validation needed
        break;
    }
    return true;
  };
  
  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      submitApplication();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const submitApplication = async () => {
    try {
      // Format the data for the GraphQL mutation
      const applicationData = {
        houseId,
        applicantInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          ssn: formData.ssn,
          currentAddress: {
            street: formData.currentStreet,
            city: formData.currentCity,
            state: formData.currentState,
            zipCode: formData.currentZipCode
          }
        },
        employmentInfo: {
          employer: formData.employer,
          position: formData.position,
          monthlyIncome: parseFloat(formData.monthlyIncome),
          employmentLength: parseInt(formData.employmentLength),
          employerContact: formData.employerContact
        },
        rentalHistory: {
          previousAddress: {
            street: formData.previousStreet,
            city: formData.previousCity,
            state: formData.previousState,
            zipCode: formData.previousZipCode
          },
          landlordName: formData.landlordName,
          landlordContact: formData.landlordContact,
          monthlyRent: parseFloat(formData.monthlyRent),
          lengthOfStay: parseInt(formData.lengthOfStay)
        },
        additionalOccupants: formData.additionalOccupants
          .filter(occupant => occupant.name.trim() !== '')
          .map(occupant => ({
            name: occupant.name,
            relationship: occupant.relationship,
            age: parseInt(occupant.age)
          }))
      };
      
      const { data } = await submitLeaseApplication({
        variables: { application: applicationData }
      });
      
      if (data && data.submitLeaseApplication) {
        // Navigate to payment screen with the application ID
        navigation.navigate('Payment', { 
          applicationId: data.submitLeaseApplication.id,
          applicationFee: data.submitLeaseApplication.applicationFee
        });
      }
    } catch (error) {
      Alert.alert(
        'Submission Error',
        'There was an error submitting your application. Please try again.'
      );
      console.error('Application submission error:', error);
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4, 5].map(step => (
          <View 
            key={step} 
            style={[
              styles.stepDot,
              currentStep === step ? styles.currentStepDot : null,
              currentStep > step ? styles.completedStepDot : null
            ]}
          />
        ))}
      </View>
    );
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => updateFormField('firstName', text)}
                  placeholder="Enter first name"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => updateFormField('lastName', text)}
                  placeholder="Enter last name"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => updateFormField('email', text)}
                placeholder="Enter email address"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => updateFormField('phone', text)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={formData.dateOfBirth}
                onChangeText={(text) => updateFormField('dateOfBirth', text)}
                placeholder="MM/DD/YYYY"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Social Security Number</Text>
              <TextInput
                style={styles.input}
                value={formData.ssn}
                onChangeText={(text) => updateFormField('ssn', text)}
                placeholder="XXX-XX-XXXX"
                secureTextEntry
              />
            </View>
          </View>
        );
        
      case 2:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Current Address</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={formData.currentStreet}
                onChangeText={(text) => updateFormField('currentStreet', text)}
                placeholder="Enter street address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={formData.currentCity}
                onChangeText={(text) => updateFormField('currentCity', text)}
                placeholder="Enter city"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={formData.currentState}
                  onChangeText={(text) => updateFormField('currentState', text)}
                  placeholder="Enter state"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>ZIP Code</Text>
                <TextInput
                  style={styles.input}
                  value={formData.currentZipCode}
                  onChangeText={(text) => updateFormField('currentZipCode', text)}
                  placeholder="Enter ZIP code"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        );
        
      case 3:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Employment Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Employer</Text>
              <TextInput
                style={styles.input}
                value={formData.employer}
                onChangeText={(text) => updateFormField('employer', text)}
                placeholder="Enter employer name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Position</Text>
              <TextInput
                style={styles.input}
                value={formData.position}
                onChangeText={(text) => updateFormField('position', text)}
                placeholder="Enter job title"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Monthly Income ($)</Text>
              <TextInput
                style={styles.input}
                value={formData.monthlyIncome}
                onChangeText={(text) => updateFormField('monthlyIncome', text)}
                placeholder="Enter monthly income"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Length of Employment (months)</Text>
              <TextInput
                style={styles.input}
                value={formData.employmentLength}
                onChangeText={(text) => updateFormField('employmentLength', text)}
                placeholder="Enter number of months"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Employer Contact</Text>
              <TextInput
                style={styles.input}
                value={formData.employerContact}
                onChangeText={(text) => updateFormField('employerContact', text)}
                placeholder="Enter employer phone or email"
              />
            </View>
          </View>
        );
        
      case 4:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Rental History</Text>
            
            <Text style={styles.subsectionTitle}>Previous Address</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={formData.previousStreet}
                onChangeText={(text) => updateFormField('previousStreet', text)}
                placeholder="Enter street address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={formData.previousCity}
                onChangeText={(text) => updateFormField('previousCity', text)}
                placeholder="Enter city"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={formData.previousState}
                  onChangeText={(text) => updateFormField('previousState', text)}
                  placeholder="Enter state"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>ZIP Code</Text>
                <TextInput
                  style={styles.input}
                  value={formData.previousZipCode}
                  onChangeText={(text) => updateFormField('previousZipCode', text)}
                  placeholder="Enter ZIP code"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <Text style={styles.subsectionTitle}>Previous Landlord</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Landlord Name</Text>
              <TextInput
                style={styles.input}
                value={formData.landlordName}
                onChangeText={(text) => updateFormField('landlordName', text)}
                placeholder="Enter landlord name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Landlord Contact</Text>
              <TextInput
                style={styles.input}
                value={formData.landlordContact}
                onChangeText={(text) => updateFormField('landlordContact', text)}
                placeholder="Enter landlord phone or email"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Monthly Rent ($)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.monthlyRent}
                  onChangeText={(text) => updateFormField('monthlyRent', text)}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Length of Stay (months)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lengthOfStay}
                  onChangeText={(text) => updateFormField('lengthOfStay', text)}
                  placeholder="Enter months"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        );
        
      case 5:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Occupants</Text>
            <Text style={styles.sectionDescription}>
              Please list all additional people who will be living in the property.
            </Text>
            
            {formData.additionalOccupants.map((occupant, index) => (
              <View key={index} style={styles.occupantContainer}>
                <View style={styles.occupantHeader}>
                  <Text style={styles.occupantTitle}>Occupant {index + 1}</Text>
                  {index > 0 && (
                    <TouchableOpacity 
                      onPress={() => removeOccupant(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="close-circle" size={24} color="#e74c3c" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={occupant.name}
                    onChangeText={(text) => updateOccupantField(index, 'name', text)}
                    placeholder="Enter full name"
                  />
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Relationship</Text>
                    <TextInput
                      style={styles.input}
                      value={occupant.relationship}
                      onChangeText={(text) => updateOccupantField(index, 'relationship', text)}
                      placeholder="e.g. Spouse, Child"
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Age</Text>
                    <TextInput
                      style={styles.input}
                      value={occupant.age}
                      onChangeText={(text) => updateOccupantField(index, 'age', text)}
                      placeholder="Enter age"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addOccupant}
            >
              <Ionicons name="add-circle" size={20} color="#4a90e2" />
              <Text style={styles.addButtonText}>Add Another Occupant</Text>
            </TouchableOpacity>
            
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                By submitting this application, you agree to pay a non-refundable application fee of $50.
              </Text>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lease Application</Text>
            <Text style={styles.headerSubtitle}>Step {currentStep} of 5</Text>
          </View>
          
          {renderStepIndicator()}
          {renderStepContent()}
          
          <View style={styles.navigationButtons}>
            {currentStep > 1 && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={prevStep}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={nextStep}
            >
              <Text style={styles.nextButtonText}>
                {currentStep < 5 ? 'Next' : 'Submit Application'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginHorizontal: 6,
  },
  currentStepDot: {
    backgroundColor: '#4a90e2',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  completedStepDot: {
    backgroundColor: '#7ed321',
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
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
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
  occupantContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  occupantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  occupantTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    color: '#4a90e2',
    marginLeft: 8,
  },
  disclaimerContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fff9e6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#f57c00',
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default LeaseFormScreen;
