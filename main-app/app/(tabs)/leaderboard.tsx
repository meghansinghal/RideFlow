import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { Crown, Medal } from 'lucide-react-native';

const TOP_DRIVERS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    earnings: '₹24,500',
    rides: 82,
    rating: 4.9,
    avatar: 'https://i.postimg.cc/ydYHMc5w/driver.webp',
  },
  {
    id: 2,
    name: 'Priya Singh',
    earnings: '₹23,800',
    rides: 78,
    rating: 4.8,
    avatar: 'https://i.postimg.cc/cLw0wsw-5/portrait-proud-female-driver-uniform-260nw-2141815169-jpg.webp',
  },
  {
    id: 3,
    name: 'Mohammed Ali',
    earnings: '₹22,900',
    rides: 75,
    rating: 4.9,
    avatar: 'https://i.postimg.cc/PH483tmf/Rainbow-Blue.jpg',
  },
];

export default function LeaderboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Crown size={32} color="#FFD700" />
        <Text style={styles.title}>Top Drivers This Week</Text>
      </View>

      {TOP_DRIVERS.map((driver, index) => (
        <View key={driver.id} style={styles.driverCard}>
          <View style={styles.rank}>
            {index === 0 ? (
              <Medal size={24} color="#FFD700" />
            ) : (
              <Text style={styles.rankNumber}>#{index + 1}</Text>
            )}
          </View>
          <Image source={{ uri: driver.avatar }} style={styles.avatar} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.stats}>
              <Text style={styles.statText}>{driver.earnings}</Text>
              <Text style={styles.statDivider}>•</Text>
              <Text style={styles.statText}>{driver.rides} rides</Text>
              <Text style={styles.statDivider}>•</Text>
              <Text style={styles.statText}>{driver.rating}⭐</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.yourRank}>
        <Text style={styles.yourRankText}>Your Current Rank: #8</Text>
        <Text style={styles.yourRankSubtext}>Complete 5 more rides to reach #7!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 10,
    padding: 16,
    borderRadius: 12,
  },
  rank: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#888',
    fontSize: 14,
  },
  statDivider: {
    color: '#888',
    marginHorizontal: 8,
  },
  yourRank: {
    margin: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    alignItems: 'center',
  },
  yourRankText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  yourRankSubtext: {
    color: '#00ff87',
    fontSize: 14,
  },
});