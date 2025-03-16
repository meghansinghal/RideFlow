import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, TrendingUp, Clock, DollarSign } from 'lucide-react-native';
import GoogleMapReact from 'google-map-react';

const SAMPLE_HEATMAP_POINTS = [
  { latitude: 12.9716, longitude: 77.5946, weight: 1 },
  { latitude: 12.9783, longitude: 77.6408, weight: 0.8 },
  { latitude: 12.9851, longitude: 77.7054, weight: 0.6 },
  { latitude: 12.9611, longitude: 77.6387, weight: 0.9 },
  { latitude: 12.9568, longitude: 77.6012, weight: 0.7 },
  { latitude: 12.9346, longitude: 77.6266, weight: 0.5 },
  { latitude: 12.9279, longitude: 77.6271, weight: 0.4 },
  { latitude: 12.9352, longitude: 77.6190, weight: 0.3 },
  { latitude: 12.9440, longitude: 77.6101, weight: 0.2 },
  { latitude: 12.9515, longitude: 77.6420, weight: 0.1 },
];

const initialOpportunities = [
  {
    id: 1,
    area: 'Koramangala',
    time: '10 mins ago',
    fare: '₹450',
    surge: '2.1x',
    lost: true,
  },
  {
    id: 2,
    area: 'Indiranagar',
    time: '25 mins ago',
    fare: '₹380',
    surge: '1.8x',
    lost: true,
  },
];

const MapComponent = Platform.select({
  web: () => {
    const defaultProps = {
      center: {
        lat: 12.9716,
        lng: 77.5946
      },
      zoom: 11
    };

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }} // Add your Google Maps API key here
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          options={{
            styles: [
              {
                "elementType": "geometry",
                "stylers": [{ "color": "#242f3e" }]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#242f3e" }]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#746855" }]
              }
            ]
          }}
        >
          {SAMPLE_HEATMAP_POINTS.map((point, index) => (
            <div
              key={index}
              lat={point.latitude}
              lng={point.longitude}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: `rgba(0, 255, 135, ${point.weight})`,
                position: 'absolute',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </GoogleMapReact>
      </div>
    );
  },
  default: () => {
    const MapView = require('react-native-maps').default;
    const { Heatmap } = require('react-native-maps');

    return (
      <MapView
        provider="google"
        style={styles.map}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Heatmap
          points={SAMPLE_HEATMAP_POINTS}
          radius={50}
          opacity={0.7}
          gradient={{
            colors: ['#79BC6A', '#BBCF4C', '#EEC20B', '#F29305', '#E50000'],
            startPoints: [0.2, 0.4, 0.6, 0.8, 1.0],
            colorMapSize: 256,
          }}
        />
      </MapView>
    );
  }
});

export default function MapScreen() {
  const [currentRide, setCurrentRide] = useState(null);
  const [demandAlert, setDemandAlert] = useState({
    active: true,
    location: 'Koramangala',
    prediction: '₹850 in the next hour',
    surge: '2.1x',
    timeWindow: '7:00 PM - 8:00 PM',
  });

  const [dailyStats, setDailyStats] = useState({
    totalEarnings: '₹2,850',
    potentialEarnings: '₹4,200',
    lostEarnings: '₹1,350',
    peakTimesMissed: 3,
  });

  const [recentOpportunities, setRecentOpportunities] = useState(initialOpportunities);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update demand alert with new mock data
      setDemandAlert({
        active: true,
        location: 'MG Road',
        prediction: '₹950 in the next hour',
        surge: '2.5x',
        timeWindow: '8:00 PM - 9:00 PM',
      });

      // Update recent opportunities with new mock data
      setRecentOpportunities([
        {
          id: 1,
          area: 'Whitefield',
          time: '5 mins ago',
          fare: '₹500',
          surge: '2.3x',
          lost: true,
        },
        {
          id: 2,
          area: 'Electronic City',
          time: '15 mins ago',
          fare: '₹420',
          surge: '1.9x',
          lost: true,
        },
      ]);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {demandAlert.active && (
        <Pressable style={styles.alertContainer}>
          <LinearGradient
            colors={['#00ff87', '#60efff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.alertGradient}>
            <TrendingUp color="#000" size={24} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Peak Demand Alert!</Text>
              <Text style={styles.alertText}>
                {demandAlert.location} • {demandAlert.surge} Surge
              </Text>
              <Text style={styles.alertSubtext}>
                Potential earnings: {demandAlert.prediction}
              </Text>
              <Text style={styles.alertTime}>{demandAlert.timeWindow}</Text>
            </View>
          </LinearGradient>
        </Pressable>
      )}

      <MapComponent />

      <View style={styles.missedContainer}>
        <Text style={styles.missedTitle}>Recent Missed Opportunities</Text>
        {recentOpportunities.map((opp) => (
          <View key={opp.id} style={styles.opportunityCard}>
            <View style={styles.opportunityIcon}>
              <DollarSign color="#FF6B6B" size={24} />
            </View>
            <View style={styles.opportunityContent}>
              <Text style={styles.opportunityArea}>{opp.area}</Text>
              <Text style={styles.opportunityDetails}>
                {opp.fare} • {opp.surge} surge • {opp.time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    flex: 1,
  },
  statsOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statsContainer: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    marginHorizontal: 8,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  negative: {
    color: '#FF6B6B',
  },
  warning: {
    color: '#FFD93D',
  },
  alertContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 1,
  },
  alertGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  alertText: {
    color: '#000',
    fontSize: 16,
    marginTop: 4,
  },
  alertSubtext: {
    color: 'rgba(0,0,0,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  alertTime: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  missedContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 16,
    padding: 16,
  },
  missedTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  opportunityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  opportunityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,107,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  opportunityContent: {
    flex: 1,
  },
  opportunityArea: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  opportunityDetails: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
});