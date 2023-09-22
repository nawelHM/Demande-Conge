import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axios';
import { Ionicons } from '@expo/vector-icons';

const SPACING = 10;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [role, setUserRole] = useState('');
  const [nom, setUserName] = useState('');
  const [prenom, setUserLastName] = useState('');
  const [email, setEmail] = useState('');
  const [solde, setSolde] = useState('');
  const [telephone, setTelephone] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUserName(response.data.nom);
        setUserLastName(response.data.prenom);
        setUserRole(response.data.role);
        setEmail(response.data.email);
        setTelephone(response.data.telephone);
        setSolde(response.data.solde);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleRestPress = () => {
    navigation.navigate('RestRequirement', { userId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={80} color="#333" />
          <Text style={styles.greetingText}>
             {prenom} {nom}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <InfoItem icon="briefcase-outline" text={role} />
          <InfoItem icon="mail-outline" text={email} />
          <InfoItem icon="wallet-outline" text={`Solde: ${solde}`} />
          <InfoItem icon="call-outline" text={telephone} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={24} color="#666" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    paddingTop: SPACING,
    paddingHorizontal: SPACING,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING * 2,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: SPACING,
  },
  infoContainer: {
    marginTop: SPACING * 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING,
  },
  infoText: {
    marginLeft: SPACING * 2,
    fontSize: 18,
    color: '#444',
  },
});

export default ProfileScreen;
