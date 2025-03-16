import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MapPin, X } from 'lucide-react-native';
import { searchLocations } from '@/utils/here-maps';

type Location = {
  id: string;
  title: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
};

type LocationSearchProps = {
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
};

export default function LocationSearch({ onLocationSelect, placeholder }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.length >= 3) {
        setLoading(true);
        setError(null);
        try {
          const locations = await searchLocations(query);
          setResults(locations);
        } catch (err) {
          setError('Failed to search locations. Please try again.');
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <MapPin size={20} color="#666666" />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder || "Search location..."}
          placeholderTextColor="#666666"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={20} color="#666666" />
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#00E676" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                onLocationSelect(item);
                setQuery('');
                setResults([]);
              }}>
              <MapPin size={16} color="#00E676" />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultAddress}>{item.address}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#331111',
    borderRadius: 12,
    marginBottom: 8,
  },
  errorText: {
    color: '#FF5252',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  resultsList: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  resultTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  resultTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  resultAddress: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});