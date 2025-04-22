import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ActivityIndicator, View } from 'react-native';

import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const walserLocations = [
  { name: 'Walser Buick GMC Bloomington', address: '4601 American Boulevard West Bloomington, MN 55437', lat: 44.85738, lon: -93.33818 },
  { name: 'Walser Polar Chevrolet', address: '1801 County Road F East White Bear Lake, MN 55110', lat: 45.0597, lon: -93.0166 },
  { name: 'Walser Chrysler Jeep Dodge Ram', address: '314 Main Street Hopkins, MN 55343', lat: 44.9245, lon: -93.4018 },
  { name: 'Walser Honda Burnsville', address: '14800 Buck Hill Road Burnsville, MN 55306', lat: 44.73305, lon: -93.28595 },
  { name: "Walser Genesis of Kansas City", address: '7722 Metcalf Ave Overland Park, KS 66204', lat: 38.9882762, lon: -94.668206 },
  { name: 'Walser Porsche Wichita', address: '10900 East 13th Street Wichita, KS 67206', lat: 37.7095, lon: -97.2155 },
];

export default function HomeScreen() {
  const [closestLocation, setClosestLocation] = useState<string | null>(null);
  const [closestAddress, setClosestAddress] = useState<string | null>(null);
  const [distanceToNearest, setDistanceToNearest] = useState<number | null>(null);
  const [nextClosestLocation, setNextClosestLocation] = useState<string | null>(null);
  const [nextClosestAddress, setNextClosestAddress] = useState<string | null>(null);
  const [nextDistance, setNextDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ latitude: number, longitude: number } | null>(null);

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
        setUserCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        // Find the closest and next closest locations
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
        setClosestAddress(nearest.address);
        setDistanceToNearest(minDistance);

        // Next closest location logic
        let nextNearest = walserLocations[1];
        let nextMinDistance = getDistance(userCoords, {
          latitude: nextNearest.lat,
          longitude: nextNearest.lon,
        });

        for (let i = 2; i < walserLocations.length; i++) {
          const distance = getDistance(userCoords, {
            latitude: walserLocations[i].lat,
            longitude: walserLocations[i].lon,
          });

          if (distance < nextMinDistance) {
            nextNearest = walserLocations[i];
            nextMinDistance = distance;
          }
        }

        setNextClosestLocation(nextNearest.name);
        setNextClosestAddress(nextNearest.address);
        setNextDistance(nextMinDistance);
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
            {/* Closest Dealer */}
            <ThemedText type="default" style={styles.dealerTitle}>
              Closest Dealer
            </ThemedText>

            <ThemedText type="default" style={styles.closest}>
              {closestLocation}
            </ThemedText>
            <ThemedText type="default" style={styles.address}>
              {closestAddress}
            </ThemedText>

            {distanceToNearest !== null && (
              <ThemedText type="default" style={styles.distance}>
                Distance: {(distanceToNearest / 1609.34).toFixed(2)} miles
              </ThemedText>
            )}
          </View>
        )}

        {/* Next Closest Dealer */}
        {userCoords && (
          <View style={styles.locationBox}>
            <ThemedText type="default" style={styles.dealerTitle}>
              Next Closest Dealer
            </ThemedText>

            <ThemedText type="default" style={styles.closest}>
              {nextClosestLocation}
            </ThemedText>
            <ThemedText type="default" style={styles.address}>
              {nextClosestAddress}
            </ThemedText>

            {nextDistance !== null && (
              <ThemedText type="default" style={styles.distance}>
                Distance: {(nextDistance / 1609.34).toFixed(2)} miles
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
  dealerTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    color: '#333',
  },
  closest: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: '#000',
  },
  address: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    textAlign: 'center',
  },
  distance: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});
