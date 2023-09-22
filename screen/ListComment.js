import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import axios from '../axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const CommentListScreen = ({ navigation }) => {
  const [commentaires, setCommentaires] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details and comments when the component mounts
    const fetchData = async () => {
      try {
        // Fetch user details
        const accessToken = await AsyncStorage.getItem('access_token');
        console.log('Access Token:', accessToken); // Log access token for debugging
        const userResponse = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Set the user state
        setUser(userResponse.data);
        console.log('User Data:', userResponse.data); // Log user data for debugging

        // Fetch comments
        const commentsResponse = await axios.get('/listerCommentaires');
        console.log('Comments Response:', commentsResponse.data); // Log comments response for debugging

        // Set the comments state
        setCommentaires(commentsResponse.data.commentaires);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Trigger the data fetch when the component mounts
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Naviguer vers la page précédente
        style={styles.goBackButton}
      >
        <Ionicons name="arrow-back" size={24} style={styles.arrowIcon} />
        <Text style={styles.title}>Liste des Commentaires</Text>
      </TouchableOpacity>

      
      
      <FlatList
        data={commentaires}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    paddingTop: 16, // Ajout du paddingTop
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  commentItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  arrowIcon: {
    marginRight: 8,
  },
});

export default CommentListScreen;
