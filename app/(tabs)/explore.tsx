// Import necessary dependencies from React and React Native
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
  useColorScheme, // Hook inside the component
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';       // Custom themed text component
import { ThemedView } from '@/components/ThemedView';       // Custom themed view component

// Array of Walser dealership locations with name and address
const walserLocations = [
  {
    name: 'Walser Buick GMC Bloomington',
    address: '4601 American Boulevard West, Bloomington, MN 55437',
  },
  {
    name: 'Walser Polar Chevrolet',
    address: '1801 County Road F East, White Bear Lake, MN 55110',
  },
  {
    name: 'Walser Chrysler Jeep Dodge Ram',
    address: '314 Main Street, Hopkins, MN 55343',
  },
  {
    name: 'Walser Honda Burnsville',
    address: '14800 Buck Hill Road, Burnsville, MN 55306',
  },
  {
    name: 'Walser Genesis of Kansas City',
    address: '7722 Metcalf Ave, Overland Park, KS 66204',
  },
  {
    name: 'Walser Porsche Wichita',
    address: '10900 East 13th Street, Wichita, KS 67206',
  },
];

// Functional component representing the Explore screen
export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme(); // Hook inside component to determine color scheme

  // Filter the locations based on the search query (case-insensitive)
  const filteredLocations = walserLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to open directions in Apple Maps (iOS) or Google Maps (Android)
  const openInMaps = (address: string) => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${encodeURIComponent(address)}`,
      android: `http://maps.google.com/?daddr=${encodeURIComponent(address)}`,
    });

    Linking.openURL(url!).catch(err =>
      console.error('Failed to open map:', err)
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Input field for searching locations */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search locations..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* FlatList to render the list of filtered dealership locations */}
      <FlatList
        data={filteredLocations}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemBox}
            activeOpacity={0.7}
            onPress={() => openInMaps(item.address)}
          >
            <ThemedText type="subtitle" style={[styles.name, { color: '#333' }]}>
              {item.name}
            </ThemedText>
            <ThemedText type="default" style={styles.address}>{item.address}</ThemedText>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 20 }}>
            No locations found.
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

// Style definitions for the Explore screen elements
const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingHorizontal: 16,
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
});
