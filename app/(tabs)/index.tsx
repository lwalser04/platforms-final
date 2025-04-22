import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ActivityIndicator, View } from 'react-native';

import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const walserLocations = [
  { name: 'Walser Minneapolis', lat: 44.9778, lon: -93.2650 },
  { name: 'Walser St. Paul', lat: 44.9537, lon: -93.0900 },
  { name: 'Walser Bloomington', lat: 44.8408, lon: -93.2983 },
];

export default function HomeScreen() {
  const [nearestLocations, setNearestLocations] = useState<
    { name: string; distance: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setNearestLocations([{ name: 'Permission denied', distance: 0 }]);
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
            distance: getDistance(userCoords, {
              latitude: loc.lat,
              longitude: loc.lon,
            }),
          }))
          .sort((a, b) => a.distance - b.distance);

        setNearestLocations(sorted.slice(0, 2));
      } catch (error) {
        setNearestLocations([{ name: 'Unable to get location', distance: 0 }]);
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
          nearestLocations.map((loc, index) => (
            <View key={index} style={styles.locationBox}>
              <ThemedText type="default" style={styles.closest}>
                {index === 0 ? 'Closest Location:' : 'Next Closest:'} {loc.name}
              </ThemedText>
              <ThemedText type="default" style={styles.distance}>
                Distance: {(loc.distance / 1609.34).toFixed(2)} miles
              </ThemedText>
            </View>
          ))
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  distance: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
