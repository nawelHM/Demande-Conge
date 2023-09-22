import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from '../axios'; // Import Axios
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoriquePage = () => {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    fetchHistorique(); // Fetch historical records
  }, []);

  const fetchHistorique = async () => {
    try {
      // Retrieve the access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem('access_token');

      // Make the API request to fetch historical records
      const response = await axios.get('/historique', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Check if the response contains historical records
      if (response.data && response.data.historique) {
        // Set the fetched data and stop loading
        setHistorique(response.data.historique);
      } else {
        // Handle the case where 'historique' is missing or empty
        setHistorique([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical records:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.demandeItem}>
      <Text>Type: {item.type_conge}</Text>
      <Text>Date: {item.date_debut} to {item.date_fin}</Text>
      <Text>{item.periode}  {item.temps_debut}  {item.temps_fin}</Text>
      <Text>Raison: {item.raison}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.arrowContainer}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color={'#151530'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Historique des congés acceptés</Text>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : historique.length > 0 ? (
        <FlatList
          data={historique}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/icons8-empty-96.png')}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>Aucune donnée d'historique disponible.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowContainer: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  demandeItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
  },
});

export default HistoriquePage;
