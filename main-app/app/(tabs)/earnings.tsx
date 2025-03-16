import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { ArrowUp, TrendingUp, TriangleAlert as AlertTriangle, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function EarningsScreen() {
  const weeklyData = {
    actual: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [2100, 1800, 2400, 2800, 3100, 2900, 2600],
        },
      ],
    },
    potential: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [2500, 2200, 2800, 3200, 3600, 3400, 3000],
        },
      ],
    },
  };

  const missedOpportunities = [
    {
      time: '7:30 PM',
      area: 'Koramangala',
      surge: '2.1x',
      potentialEarnings: '₹450',
      reason: 'Peak hour rejection',
    },
    {
      time: '8:15 PM',
      area: 'Indiranagar',
      surge: '1.8x',
      potentialEarnings: '₹380',
      reason: 'Distance too far',
    },
    {
      time: '9:00 PM',
      area: 'HSR Layout',
      surge: '1.5x',
      potentialEarnings: '₹320',
      reason: 'Peak hour rejection',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings Analysis</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Today's Earnings</Text>
            <Text style={styles.statAmount}>₹2,600</Text>
            <View style={styles.statFooter}>
              <ArrowUp size={16} color="#00ff87" />
              <Text style={styles.statChange}>+15% from yesterday</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Missed Earnings</Text>
            <Text style={[styles.statAmount, styles.negative]}>₹1,150</Text>
            <View style={styles.statFooter}>
              <AlertTriangle size={16} color="#FF6B6B" />
              <Text style={[styles.statChange, styles.negative]}>3 peak rides missed</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Overview</Text>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#00ff87' }]} />
            <Text style={styles.legendText}>Actual Earnings</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>Potential Earnings</Text>
          </View>
        </View>
        <LineChart
          data={{
            labels: weeklyData.actual.labels,
            datasets: [
              {
                data: weeklyData.actual.datasets[0].data,
                color: () => '#00ff87',
              },
              {
                data: weeklyData.potential.datasets[0].data,
                color: () => '#FF6B6B',
              },
            ],
          }}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#1a1a1a',
            backgroundGradientFrom: '#1a1a1a',
            backgroundGradientTo: '#1a1a1a',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Missed Opportunities</Text>
        {missedOpportunities.map((opp, index) => (
          <View key={index} style={styles.opportunityCard}>
            <View style={styles.opportunityHeader}>
              <View style={styles.opportunityTime}>
                <Clock size={16} color="#888" />
                <Text style={styles.timeText}>{opp.time}</Text>
              </View>
              <Text style={styles.surgeText}>{opp.surge} surge</Text>
            </View>
            <View style={styles.opportunityDetails}>
              <Text style={styles.areaText}>{opp.area}</Text>
              <Text style={styles.reasonText}>{opp.reason}</Text>
            </View>
            <View style={styles.opportunityFooter}>
              <Text style={styles.lostText}>Lost earnings:</Text>
              <Text style={styles.amountText}>{opp.potentialEarnings}</Text>
            </View>
          </View>
        ))}
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  statTitle: {
    color: '#888',
    fontSize: 14,
  },
  statAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  negative: {
    color: '#FF6B6B',
  },
  statFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChange: {
    color: '#00ff87',
    marginLeft: 4,
    fontSize: 12,
  },
  chartContainer: {
    padding: 20,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: '#888',
    fontSize: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
  opportunityCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  opportunityTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 6,
  },
  surgeText: {
    color: '#00ff87',
    fontSize: 14,
    fontWeight: 'bold',
  },
  opportunityDetails: {
    marginBottom: 8,
  },
  areaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reasonText: {
    color: '#888',
    fontSize: 14,
  },
  opportunityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  lostText: {
    color: '#888',
    fontSize: 14,
  },
  amountText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});