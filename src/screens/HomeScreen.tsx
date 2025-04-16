import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Find Your Perfect Home</Text>
          <Text style={styles.subtitle}>
            Browse our selection of quality rental properties across the US
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="search" size={32} color="#4a90e2" />
            <Text style={styles.featureTitle}>Easy Search</Text>
            <Text style={styles.featureDescription}>
              Find properties by state or ZIP code
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="document-text" size={32} color="#4a90e2" />
            <Text style={styles.featureTitle}>Simple Application</Text>
            <Text style={styles.featureDescription}>
              Apply for a lease with our streamlined process
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="card" size={32} color="#4a90e2" />
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureDescription}>
              Pay application fees safely and securely
            </Text>
          </View>
        </View>
        
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>Ready to find your new home?</Text>
          <View style={styles.ctaButton} onTouchEnd={() => navigation.navigate('SearchTab')}>
            <Text style={styles.ctaButtonText}>Start Searching</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
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
  header: {
    padding: 24,
    backgroundColor: '#4a90e2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresContainer: {
    padding: 24,
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 32,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ctaContainer: {
    padding: 24,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    marginTop: 16,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default HomeScreen;
