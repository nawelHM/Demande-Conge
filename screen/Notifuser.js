import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import axios from '../axios'; // Make sure to import Axios correctly
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Badge } from 'react-native-paper';

const DemandeListScreen = ({ navigation, userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [clickedNotificationId, setClickedNotificationId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await axios.get('/AllNotification', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseData = response.data;

      if (responseData && responseData.notifications) {
        setNotifications(responseData.notifications);
      } else {
        console.error('Invalid notification data:', responseData);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    // Call the fetchNotifications function when the component mounts
    fetchNotifications();
  }, []);

  const fetchTotalUnreadNotifications = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await axios.get('/unreadCountByRole', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseData = response.data;

      if (responseData && responseData.unread_count) {
        // Update the totalNotifications state with the count
        setTotalNotifications(responseData.unread_count);
      }
    } catch (error) {
      console.error('Error fetching total unread notifications count:', error);
    }
  };

  useEffect(() => {
    // Call the function to fetch the total unread notifications count
    fetchTotalUnreadNotifications();
  }, []);

  const markNotificationAsRead = async (notification) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      
      // Check the notification type
      if (notification.type === 'App\\Notifications\\NotifConge') {
        // Navigate to the demand details page
        navigation.navigate('DemandeDetails', { demande: notification.data });
      } else if (
        notification.type === 'App\\Notifications\\RequestAcceptedNotification' ||
        notification.type === 'App\\Notifications\\RequestRefusedNotification'
      ) {
        // Display an alert for other notification types
        Alert.alert('Notification', notification.data.message);
      }

      // Check if the notification is already marked as read
      if (!notification.read_at) {
        // Mark the notification as read and update the read_at property
        await axios.post(`/markAsRead/${notification.id}`, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        // Update the local state to mark the notification as read and remove it from the list
        const updatedNotifications = notifications.filter((n) => n.id !== notification.id);
        setNotifications(updatedNotifications);

        // Update the totalNotifications count
        setTotalNotifications(totalNotifications - 1);
      }

      setClickedNotificationId(notification.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    // Call the fetchNotifications function again
    fetchNotifications();

    // Call the fetchTotalUnreadNotifications function again
    fetchTotalUnreadNotifications();

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isNotificationRead = !!item.read_at;

          return (
            <TouchableOpacity
              style={[
                styles.demandeItem,
                {
                  backgroundColor: isNotificationRead ? 'lightgray' : 'gray',
                },
              ]}
              onPress={() => markNotificationAsRead(item)}
            >
              <Text>{item.data.nom} {item.data.prenom} - {item.data.message}</Text>
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  demandeItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default DemandeListScreen;
