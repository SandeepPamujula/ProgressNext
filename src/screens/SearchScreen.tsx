import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_HOUSES_BY_STATE, GET_HOUSES_BY_ZIP_CODE } from '../graphql/queries';
import HouseCard from '../components/HouseCard';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
  const [searchType, setSearchType] = useState('zipCode'); // 'zipCode' or 'state'
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Query for houses by zip code
  const { 
    loading: zipLoading, 
    error: zipError, 
    data: zipData,
    refetch: refetchZip 
  } = useQuery(GET_HOUSES_BY_ZIP_CODE, {
    variables: { zipCode: searchQuery },
    skip: !hasSearched || searchType !== 'zipCode',
  });

  // Query for houses by state
  const { 
    loading: stateLoading, 
    error: stateError, 
    data: stateData,
    refetch: refetchState 
  } = useQuery(GET_HOUSES_BY_STATE, {
    variables: { state: searchQuery },
    skip: !hasSearched || searchType !== 'state',
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    if (searchType === 'zipCode') {
      refetchZip({ zipCode: searchQuery });
    } else {
      refetchState({ state: searchQuery });
    }
  };

  const renderHouses = () => {
    if (!hasSearched) {
      return (
        <View style={styles.messageContainer}>
          <Ionicons name="search" size={64} color="#ccc" />
          <Text style={styles.messageText}>
            Search for houses by {searchType === 'zipCode' ? 'ZIP code' : 'state'}
          </Text>
        </View>
      );
    }

    const loading = zipLoading || stateLoading;
    const error = zipError || stateError;
    const data = searchType === 'zipCode' ? zipData : stateData;
    const houses = searchType === 'zipCode' 
      ? (zipData?.housesByZipCode || []) 
      : (stateData?.housesByState || []);

    if (loading) {
      return (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.messageText}>Loading houses...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.messageContainer}>
          <Ionicons name="alert-circle" size={64} color="#e74c3c" />
          <Text style={styles.messageText}>
            Error loading houses. Please try again.
          </Text>
        </View>
      );
    }

    if (houses.length === 0) {
      return (
        <View style={styles.messageContainer}>
          <Ionicons name="home" size={64} color="#ccc" />
          <Text style={styles.messageText}>
            No houses found for this {searchType === 'zipCode' ? 'ZIP code' : 'state'}.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HouseCard 
            house={item} 
            onPress={() => navigation.navigate('HouseDetail', { houseId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchTypeContainer}>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'zipCode' && styles.activeSearchType,
              ]}
              onPress={() => setSearchType('zipCode')}
            >
              <Text 
                style={[
                  styles.searchTypeText,
                  searchType === 'zipCode' && styles.activeSearchTypeText,
                ]}
              >
                ZIP Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'state' && styles.activeSearchType,
              ]}
              onPress={() => setSearchType('state')}
            >
              <Text 
                style={[
                  styles.searchTypeText,
                  searchType === 'state' && styles.activeSearchTypeText,
                ]}
              >
                State
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={searchType === 'zipCode' ? 'Enter ZIP code...' : 'Enter state...'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsContainer}>
          {renderHouses()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchTypeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchTypeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeSearchType: {
    borderBottomColor: '#4a90e2',
  },
  searchTypeText: {
    fontSize: 16,
    color: '#666',
  },
  activeSearchTypeText: {
    color: '#4a90e2',
    fontWeight: '600',
  },
  searchInputContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SearchScreen;
