import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Navigation, Car, MapPin, Clock, DollarSign } from 'lucide-react-native';

const SAMPLE_RIDES = [
  {
    id: '1',
    pickup: '100 Feet Road, Indiranagar',
    dropoff: 'Koramangala 5th Block',
    price: 250,
    duration: '20 min',
    homeAlignment: 95,
  },
  {
    id: '2',
    pickup: 'MG Road Metro Station',
    dropoff: 'Whitefield',
    price: 480,
    duration: '35 min',
    homeAlignment: 82,
  },
  {
    id: '3',
    pickup: 'Brigade Road',
    dropoff: 'Electronic City Phase 1',
    price: 520,
    duration: '40 min',
    homeAlignment: 78,
  },
];

export default function HomeScreen() {
  const renderRide = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Text style={styles.alignmentScore}>{item.homeAlignment}% Match</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#00E676" />
          <Text style={styles.locationText}>{item.pickup}</Text>
        </View>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#FF5252" />
          <Text style={styles.locationText}>{item.dropoff}</Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <View style={styles.footerItem}>
          <Clock size={16} color="#666666" />
          <Text style={styles.footerText}>{item.duration}</Text>
        </View>
        <View style={styles.footerItem}>
          <DollarSign size={16} color="#666666" />
          <Text style={styles.footerText}>₹{item.price}/ride</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, Driver!</Text>
        <Text style={styles.subtitle}>Ready to head home?</Text>
      </View>

      <TouchableOpacity style={styles.goHomeButton}>
        <Navigation size={24} color="#000000" />
        <Text style={styles.goHomeText}>Enable Go-Home Mode</Text>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Car size={24} color="#00E676" />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Rides Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹2,450</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available Rides</Text>
      <FlatList
        data={SAMPLE_RIDES}
        renderItem={renderRide}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  goHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E676',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  goHomeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginVertical: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  rideCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alignmentScore: {
    fontFamily: 'Inter-SemiBold',
    color: '#00E676',
    fontSize: 16,
  },
  price: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontSize: 20,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 6,
    fontSize: 14,
  },
});