import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable, SectionList, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GOOGLE_SHEET_URL } from '../config/config';
import Card from '../components/Card';
import { commonStyles } from '../styles/commonStyles';
import FloatingActionButton from '../components/FloatingActionButton';
import { groupByMonthYear, sortByDate } from '../utils/utils';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchSchedule = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const sortedData = sortByDate(data);
      const groupedData = groupByMonthYear(data);
      setScheduleData(groupedData);

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSchedule();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedule();
  };

  return (

    <SafeAreaView style={commonStyles.SafeAreaViewStyle} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust if you have header/navbar
      >



        <View style={commonStyles.containerCards}>

          <Header />

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={{ marginTop: 10, color: '#666' }}>Cargando datos...</Text>

            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
              <Pressable onPress={fetchSchedule} style={styles.retryButton}>
                <Text style={styles.retryText}>Intentalo de nuevo</Text>
              </Pressable>
            </View>
          ) : (

            <SectionList
              sections={scheduleData}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              renderItem={({ item }) => <Card item={item} />}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
              contentContainerStyle={styles.listContent}
              refreshing={refreshing}
              onRefresh={onRefresh}
              showsVerticalScrollIndicator={false}
            />

          )}

          {/* <FloatingActionButton onPress={() => router.push('/form')} /> */}
          <Footer />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 45,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    zIndex: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 10,
    borderRadius: 6,
  },
});
