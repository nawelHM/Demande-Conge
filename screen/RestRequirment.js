import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axios';
import { useRoute } from '@react-navigation/native';

const MyComponent = () => {
  const currentDate = moment().format('YYYY-MM-DD');
  const [selectedRange, setSelectedRange] = useState({});
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [solde, setSolde] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedLeavePeriod, setSelectedLeavePeriod] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params; // Access the userId parameter from the route

  useEffect(() => {
    console.log('Received userId:', userId);
    // You can use the userId in your component logic
  }, [userId]);

  const handleDayPress = (day) => {
    const { dateString } = day;
    const selectedDate = moment(dateString);
    const today = moment();

    if (selectedDate.isSameOrAfter(today, 'day')) {
      const markedDates = { ...selectedRange };

      if (!markedDates.start) {
        markedDates.start = dateString;
        markedDates.end = '';
      } else if (!markedDates.end) {
        if (moment(dateString).isSameOrAfter(markedDates.start)) {
          markedDates.end = dateString;
          setShowTimePicker(markedDates.start === markedDates.end);
          setSelectedLeavePeriod('');
        } else {
          markedDates.end = markedDates.start;
          markedDates.start = dateString;
          setShowTimePicker(false);
          setSelectedLeavePeriod('');
        }
        setSelectedStartTime('');
        setSelectedEndTime('');
      } else {
        markedDates.start = dateString;
        markedDates.end = '';
        setShowTimePicker(false);
        setSelectedLeavePeriod('');
      }

      setSelectedRange(markedDates);
    } else {
      console.log('Cannot select past dates');
    }
  };

  const handleStartTimeChange = () => {
    setSelectedStartTime('8:00');
    setSelectedEndTime('12:00');
    setSelectedLeavePeriod('le matin');
  };

  const handleEndTimeChange = () => {
    setSelectedStartTime('13:00');
    setSelectedEndTime('17:00');
    setSelectedLeavePeriod('apres-midi');
  };

  const handleLeaveTypeChange = (value) => {
    setSelectedLeaveType(value);
  };

  const handleConfirmation = () => {
    if (!selectedLeaveType || leaveReason.trim() === '') {
      Alert.alert('Information manquante', 'Veuillez remplir tous les champs.');
      return; // Prevent sending the leave request if conditions are not met
    }
    if (selectedRange.start === selectedRange.end && selectedLeavePeriod === '') {
      Alert.alert(
        'Période de congé',
        'Voulez-vous prendre un congé pour toute la journée ?',
        [
          {
            text: 'Oui',
            onPress: () => {
              setSelectedLeavePeriod('Toute la journée');
              setShowTimePicker(false);
              handleLeaveTypeChange('');
              sendLeaveRequest();
              navigation.goBack(); // Navigate back to the previous screen
            },
          },
          {
            text: 'Non',
            onPress: () => {
              setShowTimePicker(true);
            },
          },
        ]
      );
    } else {
      sendLeaveRequest();
      navigation.goBack(); // Navigate back to the previous screen
    }
  };

  const handleCancel = () => {
    setSelectedRange({});
    setSelectedStartTime('');
    setSelectedEndTime('');
    setSelectedLeaveType('');
    setLeaveReason('');
    setShowTimePicker(false);
    setSelectedLeavePeriod('');
  };

  useEffect(() => {
    async function fetchUserId() {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }

    fetchUserId();
  }, []);

  const sendLeaveRequest = async () => {
    try {
      console.log('Request Data:', {
        user_id: userId,
        date_debut: selectedRange.start,
        date_fin: selectedRange.end,
        temps_debut: selectedStartTime,
        temps_fin: selectedEndTime,
        periode: selectedLeavePeriod,
        type_conge: selectedLeaveType,
        raison: leaveReason,
      });

      const response = await axios.post('/store', {
        user_id: userId,
        date_debut: selectedRange.start,
        date_fin: selectedRange.end,
        temps_debut: selectedStartTime,
        temps_fin: selectedEndTime,
        periode: selectedLeavePeriod,
        type_conge: selectedLeaveType,
        raison: leaveReason,
      });

      console.log('Leave request sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending leave request:', error);
      if (error.response) {
        console.error('Response status code:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={'#151530'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Demande de congé</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          current={currentDate}
          markedDates={selectedRange}
          onDayPress={handleDayPress}
          theme={{
            // ... (calendar theme)
          }}
        />
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.selectionText}>
          {selectedRange.start ? `Date Début: ${selectedRange.start}` : 'Date de début : '}
        </Text>
        {selectedRange.end && (
          <Text style={styles.selectionText}>Date Fin: {selectedRange.end}</Text>
        )}
        {showTimePicker && selectedRange.start === selectedRange.end && (
          <View style={styles.timePickerContainer}>
            <Text style={styles.selectionText}>Choisissez votre période :</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedLeavePeriod('Demi-journée');
                setShowTimePicker(true);
              }}
              style={[
                styles.timePickerButton,
                selectedLeavePeriod === 'Demi-journée' && { backgroundColor: '#151530' },
              ]}
            >
              <Text
                style={[
                  styles.timePickerButtonText,
                  selectedLeavePeriod === 'Demi-journée' && { color: '#ffffff' },
                ]}
              >
                Demi-journée
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedLeavePeriod('Toute une journée');
                setShowTimePicker(false);
                setSelectedStartTime('');
              }}
              style={[
                styles.timePickerButton,
                selectedLeavePeriod === 'Toute une journée' && { backgroundColor: '#151530' },
              ]}
            >
              <Text
                style={[
                  styles.timePickerButtonText,
                  selectedLeavePeriod === 'Toute une journée' && { color: '#ffffff' },
                ]}
              >
                Toute une journée
              </Text>
            </TouchableOpacity>

            {/* Additional question for half-day leave */}
            {selectedLeavePeriod === 'Demi-journée' && (
              <View>
                <Text style={styles.selectionText}>Quand voulez-vous travailler :</Text>
                <TouchableOpacity
                  onPress={handleStartTimeChange}
                  style={[
                    styles.timePickerButton,
                    selectedStartTime === '8:00' && { backgroundColor: '#151530' },
                  ]}
                >
                  <Text
                    style={[
                      styles.timePickerButtonText,
                      selectedStartTime === '8:00' && { color: '#ffffff' },
                    ]}
                  >
                    Matin (8:00 - 12:00)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleEndTimeChange}
                  style={[
                    styles.timePickerButton,
                    selectedStartTime === '13:00' && { backgroundColor: '#151530' },
                  ]}
                >
                  <Text
                    style={[
                      styles.timePickerButtonText,
                      selectedStartTime === '13:00' && { color: '#ffffff' },
                    ]}
                  >
                    Après-midi (13:00 - 17:00)
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <Text style={styles.leaveTypeTitle}>Type de Congé:</Text>
        <View style={styles.leaveTypeContainer}>
          <View style={styles.leaveTypeRow}>
            <Button
              title="Maternité"
              onPress={() => handleLeaveTypeChange('matérnité')}
              color={selectedLeaveType === 'maternityPaid' ? '#151530' : '#ccc'}
            />
          </View>
          <View style={styles.leaveTypeRow}>
            <Button
              title="Non payé"
              onPress={() => handleLeaveTypeChange('non payé')}
              color={selectedLeaveType === 'unpaid' ? '#151530' : '#ccc'}
            />
          </View>
          <View style={styles.leaveTypeRow}>
            <Button
              title="Maladie"
              onPress={() => handleLeaveTypeChange('maladie')}
              color={selectedLeaveType === 'sick' ? '#151530' : '#ccc'}
            />
          </View>
          <View style={styles.leaveTypeRow}>
            <Button
              title="Payé"
              onPress={() => handleLeaveTypeChange('payé')}
              color={selectedLeaveType === 'paid' ? '#151530' : '#ccc'}
            />
          </View>
        </View>

        <Text style={styles.reasonTitle}>Donner plus de détails:</Text>
        <TextInput
          style={styles.reasonInput}
          value={leaveReason}
          onChangeText={setLeaveReason}
          placeholder="Ecrire..."
          multiline
        />
        <View style={styles.buttonContainer}>
          <Button color="#151530" title="Confirmer" onPress={handleConfirmation} />
          <Button color="#151530" title="Annuler" onPress={handleCancel} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#151530',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151530',
    marginBottom: 10,
  },
  currentDate: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#151530',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  selectionContainer: {
    marginBottom: 20,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#151530',
  },
  leaveTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginVertical: 10,
    color: '#151530',
  },
  leaveTypeContainer: {
    margin: 10,
  },
  leaveTypeRow: {
    marginVertical: 5,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginVertical: 10,
    color: '#151530',
  },
  reasonInput: {
    height: 80,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    textAlignVertical: 'top',
    backgroundColor: '#e6e6e6',
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  timePickerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#151530',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  backButtonContainer: {
    position: "absolute",
    left: 0,
    marginTop: 30,
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
  },
});

export default MyComponent;
