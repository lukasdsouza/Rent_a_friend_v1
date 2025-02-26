import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NearbyActivities = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [activities, setActivities] = useState([]);
  const [radius, setRadius] = useState(5000); // 5km em metros
  const navigation = useNavigation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyActivities();
    }
  }, [userLocation, radius]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível obter sua localização');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const fetchNearbyActivities = async () => {
    try {
      const activitiesSnapshot = await firestore()
        .collection('activities')
        .get();

      const activitiesData = activitiesSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(activity => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            activity.latitude,
            activity.longitude,
          );
          return distance <= radius / 1000; // Converter metros para km
        });

      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching nearby activities:', error);
      Alert.alert('Erro', 'Não foi possível carregar as atividades próximas');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = value => {
    return (value * Math.PI) / 180;
  };

  const renderActivity = ({ item }) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetails', { activity: item })}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <View style={styles.activityFooter}>
        <Text style={styles.activityPrice}>R$ {item.price}/hora</Text>
        <Text style={styles.activityDistance}>
          {calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            item.latitude,
            item.longitude,
          ).toFixed(1)}{' '}
          km
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={userLocation}>
        <Marker coordinate={userLocation} title="Sua localização" />
        <Circle
          center={userLocation}
          radius={radius}
          fillColor="rgba(0, 122, 255, 0.1)"
          strokeColor="rgba(0, 122, 255, 0.3)"
          strokeWidth={1}
        />
        {activities.map(activity => (
          <Marker
            key={activity.id}
            coordinate={{
              latitude: activity.latitude,
              longitude: activity.longitude,
            }}
            title={activity.title}
            description={`R$ ${activity.price}/hora`}
          />
        ))}
      </MapView>

      <View style={styles.radiusControl}>
        <TouchableOpacity
          style={styles.radiusButton}
          onPress={() => setRadius(Math.max(1000, radius - 1000))}>
          <Icon name="remove" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.radiusText}>{radius / 1000}km</Text>
        <TouchableOpacity
          style={styles.radiusButton}
          onPress={() => setRadius(radius + 1000)}>
          <Icon name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: 300,
  },
  radiusControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  radiusButton: {
    padding: 8,
  },
  radiusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  activityDistance: {
    fontSize: 14,
    color: '#666',
  },
});

export default NearbyActivities;
