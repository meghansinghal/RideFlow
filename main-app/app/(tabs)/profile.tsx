import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { Settings, Star, Clock, MapPin } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{
              uri: 'https://i.postimg.cc/fRnhw6p7/Rainbow-Blue.jpg',
            }}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>Amit Sharma</Text>
            <Text style={styles.subtitle}>Professional Driver • 3 years</Text>
          </View>
        </View>
        <Pressable style={styles.settingsButton}>
          <Settings color="#fff" size={24} />
        </Pressable>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Star color="#FFD700" size={24} />
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Clock color="#00ff87" size={24} />
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>On Time</Text>
        </View>
        <View style={styles.statCard}>
          <MapPin color="#60efff" size={24} />
          <Text style={styles.statValue}>1.2k</Text>
          <Text style={styles.statLabel}>Rides</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Star color="#FFD700" size={32} />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Top Rated Driver</Text>
            <Text style={styles.achievementDesc}>
              Maintained 4.8+ rating for 3 months straight
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Goals</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalProgress}>
            <View style={[styles.progressBar, { width: '80%' }]} />
          </View>
          <Text style={styles.goalText}>80/100 rides this week</Text>
          <Text style={styles.goalReward}>Reward: ₹2000 bonus</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    color: '#888',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDesc: {
    color: '#888',
    fontSize: 14,
  },
  goalCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
  },
  goalProgress: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00ff87',
    borderRadius: 4,
  },
  goalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  goalReward: {
    color: '#00ff87',
    fontSize: 14,
  },
});