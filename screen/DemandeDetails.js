import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../axios'; // Replace with the correct import path for Axios

const DemandeDetailsScreen = ({ route }) => {
  const { demande } = route.params;
  console.log('Contenu de la demande:', demande);
  const navigation = useNavigation();
  const [soldeInsuffisant, setSoldeInsuffisant] = useState(false);

  // Function to handle the request (accept or refuse)
  const handleRequest = (endpoint, successMessage, errorMessage, successCallback) => {
    axios
      .put(endpoint)
      .then(response => {
        console.log(successMessage, response.data.message);

        // Execute the success callback if provided
        if (successCallback) {
          successCallback();
        }
        navigation.goBack();
      })
      .catch(error => {
        console.error(errorMessage, error);
      });
  };

  // Handler for accepting the request
  const handleAccept = () => {
    // Calculate the number of days between date_debut and date_fin
    const startDate = new Date(demande.date_debut);
    const endDate = new Date(demande.date_fin);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    console.log('Days Difference:', daysDifference);

    // Calculate the amount to deduct based on the number of days
    let amountToDeduct = daysDifference;

    // Check if the request amount is under 1 and decrement 0.5 if true
    if (amountToDeduct < 1) {
      amountToDeduct = 0.5;
    }
    console.log('Amount To Deduct:', amountToDeduct);

    // Log the userId before making the API request
    console.log('User ID (before request):', demande.user_id);

    axios
      .put(`/decrementUserSolde/${demande.user_id}/${amountToDeduct}`)
      .then(response => {
        console.log('User Solde Updated:', response.data.message);
        console.log('UI update after request acceptance');

        console.log('User ID (after request):', demande.user_id);

        handleRequest(
          `/acceptRequest/${demande.id}`,
          'Request Accepted:',
          'Error accepting request:'
        );
      })
      .catch(error => {
        // Afficher une alerte lorsque le solde est insuffisant
        Alert.alert(
          'Solde Insuffisant',
          'Votre solde est insuffisant pour accepter cette demande. .',
          [
            {
              text: 'OK',
            },
          ],
          { cancelable: false }
        );

        setSoldeInsuffisant(true);
      });
  };

  // Handler for refusing the request
  const handleRefuse = () => {
    handleRequest(
      `/refuseRequest/${demande.id}`,
      'Request Refused:',
      'Error refusing request:'
    );
  };

  // Function to render each info item
  const renderInfoItem = (label, value) => (
    <View style={styles.infoContainer}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demande Details</Text>
      {renderInfoItem('Nom', demande.nom)}
      {renderInfoItem('Prénom', demande.prenom)}
      {renderInfoItem('Date Debut', demande.date_debut)}
      {renderInfoItem('Date Fin', demande.date_fin)}
      {demande.periode && renderInfoItem('Période', demande.periode)}
      {renderInfoItem('Raison', demande.raison)}
      {renderInfoItem('Type congé', demande.type_conge)}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.acceptButton,
            soldeInsuffisant && styles.disabledButton, // Ajout de la classe disabledButton si le solde est insuffisant
          ]}
          onPress={soldeInsuffisant ? null : handleAccept} // Désactive le bouton si le solde est insuffisant
        >
          <Text style={styles.buttonText}>Accepter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.refuseButton]}
          onPress={handleRefuse}
        >
          <Text style={styles.buttonText}>Réfuser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  label: {
    flex: 1,
    fontSize: 18,
    color: '#555',
  },
  value: {
    flex: 2,
    fontSize: 18,
    color: '#111',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  refuseButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#ccc', // Style du bouton désactivé (grisé)
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DemandeDetailsScreen;
