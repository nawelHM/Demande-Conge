import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Calenderup = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({
    '2023-01-01': { selected: true, marked: true, dots: [{ color: 'red' }], holidayName: 'Jour de l\'an' },
    '2023-03-20': { selected: true, marked: true, dots: [{ color: 'green' }], holidayName: 'Fête de l\'indépendance' },
    '2023-04-09': { selected: true, marked: true, dots: [{ color: 'blue' }], holidayName: 'Journée des Martyrs' },
    '2023-04-21': { selected: true, marked: true, dots: [{ color: 'yellow' }], holidayName: 'Aïd el Fitr' },
    '2023-04-22': { selected: true, marked: true, dots: [{ color: 'yellow' }], holidayName: 'Aïd el Fitr' },
    '2023-05-01': { selected: true, marked: true, dots: [{ color: 'orange' }], holidayName: 'Fête du Travail' },
    '2023-06-28': { selected: true, marked: true, dots: [{ color: 'purple' }], holidayName: 'Aïd el Kébir' },
    '2023-06-29': { selected: true, marked: true, dots: [{ color: 'purple' }], holidayName: 'Aïd el Kébir' },
    '2023-07-19': { selected: true, marked: true, dots: [{ color: 'pink' }], holidayName: 'Jour de l\'an de l\'Hégire' },
    '2023-07-25': { selected: true, marked: true, dots: [{ color: 'yellow' }], holidayName: 'Fête de la République' },
    '2023-08-13': { selected: true, marked: true, dots: [{ color: 'blue' }], holidayName: 'Fête de la Femme' },
    '2023-09-27': { selected: true, marked: true, dots: [{ color: 'green' }], holidayName: 'Mouled' },
    '2023-10-15': { selected: true, marked: true, dots: [{ color: 'orange' }], holidayName: 'Fête de l\'évacuation' },
    '2023-12-17': { selected: true, marked: true, dots: [{ color: 'red' }], holidayName: 'Fête de la Révolution' },
    '2024-01-01': { selected: true, marked: true, dots: [{ color: 'red' }], holidayName: 'Jour de l\'an' },
    '2024-03-20': { selected: true, marked: true, dots: [{ color: 'green' }], holidayName: 'Fête de l\'indépendance' },
    '2024-04-09': { selected: true, marked: true, dots: [{ color: 'blue' }], holidayName: 'Journée des Martyrs' },
    '2024-04-21': { selected: true, marked: true, dots: [{ color: 'yellow' }], holidayName: 'Aïd el Fitr' },
    '2024-04-22': { selected: true, marked: true, dots: [{ color: 'yellow' }], holidayName: 'Aïd el Fitr' },
    '2024-05-01': { selected: true, marked: true, dots: [{ color: 'orange' }], holidayName: 'Fête du Travail' },
    '2024-06-28': { selected: true, marked: true, dots: [{ color: 'purple' }], holidayName: 'Aïd el Kébir' },
    '2024-06-29': { selected: true, marked: true, dots: [{ color: 'purple' }], holidayName: 'Aïd el Kébir' },
    '2024-07-19': { selected: true, marked: true, dots: [{ color: 'pink' }], holidayName: 'Jour de l\'an de l\'Hégire' },
    '2024-07-25': { selected: true, marked: true, dots: [{ color: 'yellow' }], holidayName: 'Fête de la République' },
    '2024-08-13': { selected: true, marked: true, dots: [{ color: 'blue' }], holidayName: 'Fête de la Femme' },
    '2024-09-27': { selected: true, marked: true, dots: [{ color: 'green' }], holidayName: 'Mouled' },
    '2024-10-15': { selected: true, marked: true, dots: [{ color: 'orange' }], holidayName: 'Fête de l\'évacuation' },
    '2024-12-17': { selected: true, marked: true, dots: [{ color: 'red' }], holidayName: 'Fête de la Révolution' },
  });
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [eventColor, setEventColor] = useState('blue');
  const [customEvents, setCustomEvents] = useState({});
  const [eventText, setEventText] = useState('');

  const openEventModal = (date) => {
    setEventDate(date);
    setEventModalVisible(true);
  };

  const addEvent = () => {
    if (eventDate && eventText) {
      const newEvent = {
        selected: true,
        marked: true,
        dots: [{ color: eventColor }],
        holidayName: eventText,
      };

      const updatedMarkedDates = { ...markedDates, [eventDate]: newEvent };
      setMarkedDates(updatedMarkedDates);

      const updatedCustomEvents = { ...customEvents };
      if (updatedCustomEvents[eventDate]) {
        updatedCustomEvents[eventDate].push(newEvent);
      } else {
        updatedCustomEvents[eventDate] = [newEvent];
      }
      setCustomEvents(updatedCustomEvents);

      setEventModalVisible(false);
      setEventText('');
    }
  };

  const onDayPress = (day) => {
    const event = markedDates[day.dateString] || (customEvents[day.dateString] && customEvents[day.dateString][0]);
    if (event) {
      setSelectedDate(event);
    } else {
      setSelectedDate(null);
    }
  };

  const onMonthChange = () => {
    setSelectedDate(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 20,
          left: 10,
          zIndex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <MaterialIcons name="keyboard-arrow-left" size={24} color={'#151530'} />
        <Text style={{ margin: 15, fontSize: 20 }}>Calendrier des jours fériés</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 100 }}>
        <Calendar
          markingType={'custom'}
          markedDates={{ ...markedDates, ...customEvents }}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          theme={{
            dayTextColor: 'black',
            textDisabledColor: 'gray',
            selectedDotColor: '#fff',
            arrowColor: '#151530',
          }}
          onDayLongPress={(day) => openEventModal(day.dateString)}
        />
        {selectedDate && (
          <View style={{ marginTop: 50 }}>
            <Text style={{ margin: 15, color: '#151530', fontSize: 16 }}>
              {selectedDate.holidayName}
            </Text>
            {customEvents[selectedDate.dateString] && customEvents[selectedDate.dateString].map((event, index) => (
              <Text key={index} style={{ margin: 10, color: event.dots[0].color }}>
                {event.holidayName}
              </Text>
            ))}
          </View>
        )}
      </View>

      <Modal visible={eventModalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Choisissez une couleur pour l'événement :</Text>
          <TextInput
            value={eventColor}
            onChangeText={(color) => setEventColor(color)}
            placeholder="Couleur (ex: blue, red, green)"
          />
          <TextInput
            value={eventText}
            onChangeText={(text) => setEventText(text)}
            placeholder="Nom de l'événement"
          />
          <Button title="Ajouter l'événement" onPress={addEvent} />
          <Button title="Annuler" onPress={() => setEventModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Calenderup;
