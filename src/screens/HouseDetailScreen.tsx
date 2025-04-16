import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_HOUSE } from '../graphql/queries';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HouseDetailScreen = ({ route, navigation }) => {
  const { houseId } = route.params;
  
  const { loading, error, data } = useQuery(GET_HOUSE, {
    variables: { id: houseId },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading house details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#e74c3c" />
        <Text style={styles.errorText}>Error loading house details.</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const house = data.house;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Image Gallery */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.imageGallery}
        >
          {house.images.exterior.map((image, index) => (
            <Image 
              key={`exterior-${index}`}
              source={{ uri: image }} 
              style={styles.image} 
              resizeMode="cover"
            />
          ))}
          {house.images.interior.map((image, index) => (
            <Image 
              key={`interior-${index}`}
              source={{ uri: image }} 
              style={styles.image} 
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* House Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.price}>${house.price}/month</Text>
          <Text style={styles.title}>{house.title}</Text>
          <Text style={styles.address}>
            {house.address.street}, {house.address.city}, {house.address.state} {house.address.zipCode}
          </Text>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={24} color="#666" />
              <Text style={styles.detailText}>{house.bedrooms} Bedrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={24} color="#666" />
              <Text style={styles.detailText}>{house.bathrooms} Bathrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={24} color="#666" />
              <Text style={styles.detailText}>{house.squareFeet} sqft</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{house.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {house.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#4a90e2" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => navigation.navigate('LeaseForm', { houseId: house.id })}
          >
            <Text style={styles.applyButtonText}>Apply for Lease</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageGallery: {
    height: 300,
  },
  image: {
    width: width,
    height: 300,
  },
  infoContainer: {
    padding: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HouseDetailScreen;
