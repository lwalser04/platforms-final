import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ActivityIndicator, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import * as Linking from 'expo-linking';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const walserLocations = [
  {
    name: 'Walser Buick GMC Bloomington',
    address: '4601 American Boulevard West Bloomington, MN 55437',
    lat: 44.85738,
    lon: -93.33818,
  },
  {
    name: 'Walser Polar Chevrolet',
    address: '1801 County Road F East White Bear Lake, MN 55110',
    lat: 45.0597,
    lon: -93.0166,
  },
  {
    name: 'Walser Chrysler Jeep Dodge Ram',
    address: '314 Main Street Hopkins, MN 55343',
    lat: 44.9245,
    lon: -93.4018,
  },
  {
    name: 'Walser Honda Burnsville',
    address: '14800 Buck Hill Road Burnsville, MN 55306',
    lat: 44.73305,
    lon: -93.28595,
  },
  {
    name: 'Walser Genesis of Kansas City',
    address: '7722 Metcalf Ave Overland Park, KS 66204',
    lat: 38.9882762,
    lon: -94.668206,
  },
  {
    name: 'Walser Porsche Wichita',
    address: '10900 East 13th Street Wichita, KS 67206',
    lat: 37.7095,
    lon: -97.2155,
  },
];

export default function HomeScreen() {
  const [nearestLocations, setNearestLocations] = useState<
    { name: string; address: string; lat: number; lon: number; distance: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const handleGetDirections = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setNearestLocations([{ name: 'Permission denied', address: '', lat: 0, lon: 0, distance: 0 }]);
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const sorted = walserLocations
          .map((loc) => ({
            name: loc.name,
            address: loc.address,
            lat: loc.lat,
            lon: loc.lon,
            distance: getDistance(userCoords, {
              latitude: loc.lat,
              longitude: loc.lon,
            }),
          }))
          .sort((a, b) => a.distance - b.distance);

        setNearestLocations(sorted.slice(0, 2));
      } catch (error) {
        setNearestLocations([{ name: 'Unable to get location', address: '', lat: 0, lon: 0, distance: 0 }]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/walserimage.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <>
            <ThemedText type="title" style={styles.findingLabel}>
              Finding your closest dealership:
            </ThemedText>

            {nearestLocations.map((loc, index) => (
              <View key={index} style={styles.locationBox}>
                <ThemedText type="default" style={styles.closest}>
                  {index === 0 ? 'Closest Location:' : 'Next Closest:'}
                </ThemedText>
                <ThemedText type="default" style={styles.name}>
                  {loc.name}
                </ThemedText>
                <ThemedText type="default" style={styles.address}>
                  {loc.address}
                </ThemedText>
                <ThemedText type="default" style={styles.distance}>
                  Distance: {(loc.distance / 1609.34).toFixed(2)} miles
                </ThemedText>
                <ThemedText
                  type="default"
                  style={styles.directions}
                  onPress={() => handleGetDirections(loc.lat, loc.lon)}
                >
                  Get Directions
                </ThemedText>
              </View>
            ))}
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 280,
    width: 390,
    bottom: 0,
    left: 0,
    marginTop: 2,
    position: 'absolute',
  },
  content: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  findingLabel: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: 'black',
  },
  locationBox: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  closest: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: 'black',
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    color: '#222',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 6,
  },
  distance: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  directions: {
    fontSize: 15,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});
