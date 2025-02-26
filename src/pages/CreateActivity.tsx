import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CreateActivity = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigation = useNavigation();

  const handleCreateActivity = async () => {
    if (!title || !description || !location || !price || !selectedLocation) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const userId = auth().currentUser.uid;
      await firestore().collection('activities').add({
        title,
        description,
        location,
        price: parseFloat(price),
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Sucesso', 'Atividade criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]);
    } catch (error) {
      console.error('Error creating activity:', error);
      Alert.alert('Erro', 'Não foi possível criar a atividade');
    }
  };

  const handleMapPress = event => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Criar Nova Atividade</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título da atividade"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição da atividade"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Localização"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Preço por hora"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.mapLabel}>Selecione a localização no mapa:</Text>
        <MapView
          style={styles.map}
          onPress={handleMapPress}
          initialRegion={{
            latitude: -23.5505,
            longitude: -46.6333,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>

        <TouchableOpacity style={styles.button} onPress={handleCreateActivity}>
          <Text style={styles.buttonText}>Criar Atividade</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  form: {
    padding: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mapLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  map: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateActivity;
