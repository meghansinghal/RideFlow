import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { MapPin } from 'lucide-react-native';
import LocationSearch from '@/components/LocationSearch';

// Only import MapView on native platforms
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

const DARK_MAP_STYLE = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
];

const { width } = Dimensions.get('window');

type Location = {
  title: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
};

export default function LocationScreen() {
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocation({
      latitude: location.position.lat,
      longitude: location.position.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Location</Text>
      
      <LocationSearch
        placeholder="Search for your home location"
        onLocationSelect={handleLocationSelect}
      />

      {Platform.OS !== 'web' ? (
        <View style={styles.mapContainer}>
          {MapView && (
            <MapView
              style={styles.map}
              region={location}
              customMapStyle={DARK_MAP_STYLE}
              onMapReady={() => setMapReady(true)}
              showsUserLocation
              showsMyLocationButton>
              {selectedLocation && mapReady && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.position.lat,
                    longitude: selectedLocation.position.lng,
                  }}
                  title={selectedLocation.title}
                  description={selectedLocation.address}
                />
              )}
            </MapView>
          )}
        </View>
      ) : (
        <View style={styles.webMapPlaceholder}>
          <MapPin size={32} color="#666666" />
          <Text style={styles.webMapText}>Map view is not available on web</Text>
          <Text style={styles.webMapSubtext}>Please use the mobile app for full functionality</Text>
        </View>
      )}

      {selectedLocation && (
        <View style={styles.addressContainer}>
          <MapPin size={20} color="#00E676" />
          <Text style={styles.addressText}>{selectedLocation.address}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.updateButton, !selectedLocation && styles.updateButtonDisabled]}
        disabled={!selectedLocation}>
        <Text style={[
          styles.updateButtonText,
          !selectedLocation && styles.updateButtonTextDisabled
        ]}>
          Set as Home Location
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 60,
    marginBottom: 20,
  },
  mapContainer: {
    height: width * 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 20,
  },
  webMapPlaceholder: {
    height: width * 0.8,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapText: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 12,
  },
  webMapSubtext: {
    color: '#444444',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
  },
  map: {
    flex: 1,
    borderRadius: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  addressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#00E676',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: '#1A1A1A',
  },
  updateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  updateButtonTextDisabled: {
    color: '#666666',
  },
});