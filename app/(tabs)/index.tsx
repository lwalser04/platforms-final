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
  const [closestLocation, setClosestLocation] = useState<string | null>(null);
  const [distanceToNearest, setDistanceToNearest] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setClosestLocation('Permission denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        let nearest = walserLocations[0];
        let minDistance = getDistance(userCoords, {
          latitude: nearest.lat,
          longitude: nearest.lon,
        });

        for (let i = 1; i < walserLocations.length; i++) {
          const distance = getDistance(userCoords, {
            latitude: walserLocations[i].lat,
            longitude: walserLocations[i].lon,
          });

          if (distance < minDistance) {
            nearest = walserLocations[i];
            minDistance = distance;
          }
        }

        setClosestLocation(nearest.name);
        setDistanceToNearest(minDistance);
      } catch (error) {
        setClosestLocation('Unable to get location');
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
          <View style={styles.locationBox}>
            <ThemedText type="default" style={styles.closest}>
              Closest Location: {closestLocation}
            </ThemedText>
            {distanceToNearest !== null && (
              <ThemedText type="default" style={styles.distance}>
                Distance: {(distanceToNearest / 1000).toFixed(2)} km
              </ThemedText>
            )}
          </View>
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
