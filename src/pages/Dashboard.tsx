import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    requestLocationPermission();
    fetchActivities();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await Geolocation.requestAuthorization('whenInUse');
      if (granted === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            Alert.alert('Erro', 'Não foi possível obter sua localização');
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchActivities = async () => {
    try {
      const activitiesSnapshot = await firestore()
        .collection('activities')
        .orderBy('createdAt', 'desc')
        .get();

      const activitiesData = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Erro', 'Não foi possível carregar as atividades');
    }
  };

  const renderActivity = ({ item }) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetails', { activity: item })}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <Text style={styles.activityLocation}>{item.location}</Text>
      <Text style={styles.activityPrice}>R$ {item.price}/hora</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView style={styles.map} initialRegion={userLocation}>
          <Marker coordinate={userLocation} title="Você está aqui" />
          {activities.map(activity => (
            <Marker
              key={activity.id}
              coordinate={{
                latitude: activity.latitude,
                longitude: activity.longitude,
              }}
              title={activity.title}
              description={activity.description}
            />
          ))}
        </MapView>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>Atividades Próximas</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateActivity')}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Nova Atividade</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  list: {
    flex: 1,
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
  activityLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default Dashboard;
