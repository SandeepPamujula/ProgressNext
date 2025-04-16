import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import HouseDetailScreen from './src/screens/HouseDetailScreen';
import LeaseFormScreen from './src/screens/LeaseFormScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Create the HTTP link to connect to the GraphQL server
const httpLink = new HttpLink({
  uri: 'http://10.0.2.2:4000/graphql', // Android emulator localhost
  // For iOS simulator, use: 'http://localhost:4000/graphql'
});

// Set up Apollo Client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Create navigation stacks
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home stack navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'ProgressNext' }} />
      <HomeStack.Screen name="HouseDetail" component={HouseDetailScreen} options={{ title: 'House Details' }} />
      <HomeStack.Screen name="LeaseForm" component={LeaseFormScreen} options={{ title: 'Apply for Lease' }} />
      <HomeStack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
    </HomeStack.Navigator>
  );
};

// Search stack navigator
const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} options={{ title: 'Find a Home' }} />
      <SearchStack.Screen name="HouseDetail" component={HouseDetailScreen} options={{ title: 'House Details' }} />
      <SearchStack.Screen name="LeaseForm" component={LeaseFormScreen} options={{ title: 'Apply for Lease' }} />
      <SearchStack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
    </SearchStack.Navigator>
  );
};

// Profile stack navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </ProfileStack.Navigator>
  );
};

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'HomeTab') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'SearchTab') {
                  iconName = focused ? 'search' : 'search-outline';
                } else if (route.name === 'ProfileTab') {
                  iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4a90e2',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen 
              name="HomeTab" 
              component={HomeStackNavigator} 
              options={{ 
                headerShown: false,
                title: 'Home'
              }} 
            />
            <Tab.Screen 
              name="SearchTab" 
              component={SearchStackNavigator} 
              options={{ 
                headerShown: false,
                title: 'Search'
              }} 
            />
            <Tab.Screen 
              name="ProfileTab" 
              component={ProfileStackNavigator} 
              options={{ 
                headerShown: false,
                title: 'Profile'
              }} 
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
