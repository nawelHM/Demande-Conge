import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axios';
import { Ionicons } from '@expo/vector-icons';

const SPACING = 10;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const pageTitle = "Page Commentée"; // Remplacez par le nom de la page commentée

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleSubmitComment = async () => {
    try {
      if (!comment) {
        console.log('Le commentaire est vide. Veuillez saisir un commentaire.');
        return;
      }

      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await axios.post('/ajoutercommentaire', {
        content: comment, // Sending the comment as "content"
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setComment('');

      console.log('Commentaire envoyé avec succès :', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire :', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="arrow-back" size={32} color="#333" onPress={() => navigation.goBack()} />
            <Text style={styles.pageTitle}>{pageTitle}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.centeredImage}>
            <Image source={require('../assets/icons8-comment-2.png')} style={styles.commentImage} />
          </View>
          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Ajoutez un commentaire..."
              onChangeText={handleCommentChange}
              value={comment}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitComment}
            >
              <Text style={styles.submitButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING * 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentImage: {
    width: 80,
    height: 80,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: SPACING,
  },
  centeredImage: {
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: SPACING,
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: SPACING * 2,
  },
  commentContainer: {
    marginTop: SPACING * 2,
  },
  commentInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: SPACING,
  },
  submitButton: {
    backgroundColor: '#151530',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
