import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axios';

const Settings = ({ navigation }) => {
  const [access_token, setUserToken] = useState('');

  useEffect(() => {
    // Retrieve the token from AsyncStorage on component mount
    AsyncStorage.getItem('access_token')
      .then(token => {
        if (token) {
          // If token is found, set it in the component state
          setUserToken(token);
          console.log('Token retrieved successfully:', token);
        } else {
          console.log('Token not found in AsyncStorage.');
        }
      })
      .catch(error => {
        console.error('Error retrieving token from AsyncStorage:', error.message);
      });
  }, []);

  const handleLogout = async () => {
    try {
      // Use the userToken state value obtained from AsyncStorage
      console.log('Token before logout API request:', access_token);

      // Call the logout API to invalidate the token on the server
      await axios.post('/logout', null, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem('access_token');

      // Redirect to the login page after successful logout
      navigation.navigate('Login'); // Replace 'Login' with the actual name of your login screen
    } catch (error) {
      // Handle API call errors and logout errors
      console.error('Error while logging out', error);
    }
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };
  const handlecomment = () => {
    navigation.navigate('Comment');
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Ionicons name="log-out" size={20} color={'#151530'} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAbout} style={[styles.button, { marginTop: 10 }]}>
          <Ionicons name="information-circle" size={20} color={'#151530'} />
          <Text style={styles.buttonText}>Plus d'informations</Text>
        </TouchableOpacity>

         <TouchableOpacity onPress={handlecomment} style={[styles.button, { marginTop: 10 }]}>
          <Ionicons name="chatbox" size={20} color={'#151530'} />
          <Text style={styles.buttonText}>Ajouter un commentaire</Text>
        </TouchableOpacity> 
      </View>
      {/* Your other content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  settingsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginTop: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#151530',
  },
});

export default Settings;
