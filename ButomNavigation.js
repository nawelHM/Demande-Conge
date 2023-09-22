import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Home from './screen/Home';
import Profileuser from './screen/Profileuser';
import Settings from './screen/Settings';
import Notifuser from './screen/Notifuser'; // Mettez à jour avec le chemin correct
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './axios'; // Mettez à jour avec le chemin correct

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  // Variables d'état
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [clickedNotificationId, setClickedNotificationId] = useState(null);

  // Fonction pour récupérer les notifications depuis le serveur
  const fetchNotifications = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await axios.get('/AllNotification', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Réponse de l API :', response.data); // Journalise la réponse entière

      if (response && response.data.notifications) {
        const receivedNotifications = response.data.notifications;
        setNotifications(receivedNotifications);
        setTotalNotifications(receivedNotifications.length);
      } else {
        console.error('Données de notification non valides :', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications :', error);
    }
  };

  // Récupérer le nombre total de notifications non lues
  useEffect(() => {
    const fetchTotalUnreadNotifications = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await axios.get('/unreadCount', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response && typeof response.data.unread_count !== 'undefined') {
          setTotalNotifications(response.data.unread_count);
        } else {
          console.error('Données de compteur de notifications non lues non valides :', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre total de notifications non lues :', error);
      }
    };

    fetchTotalUnreadNotifications();
  }, []);

  // Gérer le clic sur une notification
  const handleNotificationClick = async (notification) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await axios.post(`/markAsRead/${notification.id}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        // Notification marquée comme lue avec succès

        // Supprimer la notification cliquée de la liste
        const updatedNotifications = notifications.filter((n) => n.id !== notification.id);
        setNotifications(updatedNotifications);

        // Décrémenter le compteur total des notifications
        setTotalNotifications(totalNotifications - 1);

        // Définir l'état de la notification cliquée
        setClickedNotificationId(notification.id);

        // Naviguer vers l'écran de détails de la notification
        navigation.navigate('DemandeDetails', { demande: notification.data });
      } else {
        console.error('Échec de la marque de la notification comme lue :', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la marque de la notification comme lue :', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-filled';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Notification') {
            iconName = 'notifications';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }
          return <Icon name={iconName} color={'#E6E6E6'} size={20} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label;
          if (route.name === 'Home') {
            label = 'Accueil';
          } else if (route.name === 'Profile') {
            label = 'Profil';
          } else if (route.name === 'Notification') {
            label = 'Notifications';
          } else if (route.name === 'Settings') {
            label = 'Réglages';
          }
          return <Text style={{ color: focused ? '#a4a8b9' : '#8E8E93' }}>{label}</Text>;
        },
        tabBarBadge: route.name === 'Notification' && totalNotifications > 0
          ? totalNotifications.toString()
          : null,
        tabBarBadgeStyle: {
          backgroundColor: 'red',
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Profile' component={Profileuser} />
      <Tab.Screen name='Notification' component={Notifuser} />
      <Tab.Screen name='Settings' component={Settings} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
