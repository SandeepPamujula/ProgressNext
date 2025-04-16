import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface HouseCardProps {
  house: {
    id: string;
    title: string;
    price: number;
    address: {
      city: string;
      state: string;
    };
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    images: {
      exterior: string[];
    };
  };
  onPress: () => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: house.images.exterior[0] }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.price}>${house.price}/month</Text>
        <Text style={styles.title}>{house.title}</Text>
        <Text style={styles.location}>{house.address.city}, {house.address.state}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>{house.bedrooms} bed</Text>
          <Text style={styles.detail}>{house.bathrooms} bath</Text>
          <Text style={styles.detail}>{house.squareFeet} sqft</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
});

export default HouseCard;
