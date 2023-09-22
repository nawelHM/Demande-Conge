import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axios';
import { Ionicons } from "@expo/vector-icons";
import SPACING from "../SPACING";

const Home = () => {
  const navigation = useNavigation();
  const [role, setUserRole] = useState('');
  const [nom, setUserName] = useState('');
  const [prenom, setUserLastName] = useState('');
  const [userId, setUserId] = useState(null); // State for user ID
  const [showGreeting, setShowGreeting] = useState(true); // State for showing the greeting

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        const accessToken = await AsyncStorage.getItem('access_token');
        console.log('Access token before API request:', accessToken);

        // Use the access token in the API request header
        const response = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Handle the response and update the state with user data
        setUserName(response.data.nom);
        setUserLastName(response.data.prenom);
        setUserRole(response.data.role);
        setUserId(response.data.id); // Set the user ID

        // Show the greeting for 5 seconds
        setShowGreeting(true);
        setTimeout(() => {
          setShowGreeting(false);
        }, 5000); // 5 seconds

        // Rest of your code...
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleRestPress = () => {
    navigation.navigate('RestRequirment', { userId }); // Pass the userId as a parameter
  };

  const handleListPress = () => {
    navigation.navigate('Listuser'); // Pass the userId as a parameter
  };

  const handleCalenderPress = () => {
    navigation.navigate('Calenderup');
  };

  const handlerolePress = () => {
    navigation.navigate('Role');
  };

  const handlehistrPress = () => {
    navigation.navigate('Historique');
  };

  const handlerepportPress = () => {
    navigation.navigate('Repport');
  };
  const handlecommentPress = () => {
    navigation.navigate('ListComment');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {showGreeting && (
          <Text style={styles.greetingText}>
            Bienvenue, {prenom} {nom} !
          </Text>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleRestPress} style={styles.button}>
            <Text style={styles.buttonText}>Demande de congé</Text>
          </TouchableOpacity>
          {role === 'rh' && (
            <TouchableOpacity onPress={handleListPress} style={styles.button}>
              <Text style={styles.buttonText}>Liste des demandes</Text>
            </TouchableOpacity>
          )}
          {role === 'admin' && (
            <TouchableOpacity onPress={handleListPress} style={styles.button}>
              <Text style={styles.buttonText}>Liste des Employés</Text>
            </TouchableOpacity>
          )}
          {role === 'admin' && (
            <TouchableOpacity onPress={handlerolePress} style={styles.button}>
              <Text style={styles.buttonText}>changer rôle </Text>
            </TouchableOpacity>
          )}
          {role === 'admin' && (
            <TouchableOpacity onPress={handlerepportPress} style={styles.button}>
              <Text style={styles.buttonText}>Génére rapport d'absence</Text>
            </TouchableOpacity>
          )}
          {role === 'rh' && (
            <TouchableOpacity onPress={handlerepportPress} style={styles.button}>
              <Text style={styles.buttonText}>Génére rapport d'absence</Text>
            </TouchableOpacity>
          )}
          {role === 'admin' && (
            <TouchableOpacity onPress={handlecommentPress} style={styles.button}>
              <Text style={styles.buttonText}>Liste des commentaires</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handlehistrPress} style={styles.button}>
            <Text style={styles.buttonText}>Historique de congé</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCalenderPress}>
            <Text style={styles.buttonText}>Calendrier des Jours fériés</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.large,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    marginBottom: SPACING.medium,
    borderRadius: 25,
    backgroundColor: '#151530',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
