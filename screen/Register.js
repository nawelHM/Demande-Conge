import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../axios';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [departement, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');

  const [errorMessages, setErrorMessages] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    departement: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const handleRegister = () => {
    const errors = {};

    if (!nom) {
      errors.nom = 'Le nom est requis.';
    }

    if (!prenom) {
      errors.prenom = 'Le prénom est requis.';
    }

    if (!telephone) {
      errors.telephone = 'Le numéro de téléphone est requis.';
    } else if (!/^([2594])(\d{7})$/.test(telephone)) {
      errors.telephone = 'Le numéro de téléphone doit commencer par 2, 5, 9 ou 4 et contenir 8 chiffres au total.';
    }

    if (!departement) {
      errors.departement = 'Le département est requis.';
    }

    if (!email) {
      errors.email = "L'adresse e-mail est requise.";
    } else if (!isValidEmail(email)) {
      errors.email = 'Veuillez entrer une adresse e-mail valide.';
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis.';
    } else if (password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    }

    if (!password_confirmation) {
      errors.password_confirmation = 'La confirmation du mot de passe est requise.';
    } else if (password !== password_confirmation) {
      errors.password_confirmation = 'Le mot de passe et la confirmation ne correspondent pas.';
    }

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const userData = {
      nom,
      prenom,
      email,
      telephone,
      departement,
      password,
      password_confirmation
    };

    axios.post('/register', userData)
      .then((response) => {
        console.log('Inscription réussie !', response.data);

        setNom('');
        setPrenom('');
        setTelephone('');
        setDepartment('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        const welcomeMessage = `Bienvenue chez Tac-Tic, ${prenom} ${nom}!`;
        Alert.alert('Ajout réussi', welcomeMessage);

        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Inscription échouée :', error);
      });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formcontainer}>
        <View>
          <Text style={styles.heading}>Créer un compte</Text>
        </View>
        <Text>Nom:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={(text) => setNom(text)}
        />
        {errorMessages.nom ? <Text style={styles.errorMessage}>{errorMessages.nom}</Text> : null}

        <Text>Prénom:</Text>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={(text) => setPrenom(text)}
        />
        {errorMessages.prenom ? <Text style={styles.errorMessage}>{errorMessages.prenom}</Text> : null}

        <Text>Téléphone:</Text>
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={telephone}
          onChangeText={(text) => setTelephone(text)}
          keyboardType={'numeric'}
        />
        {errorMessages.telephone ? <Text style={styles.errorMessage}>{errorMessages.telephone}</Text> : null}

        <Text>Département:</Text>
        <TextInput
          style={styles.input}
          placeholder="Département"
          value={departement}
          onChangeText={(text) => setDepartment(text)}
        />
        {errorMessages.departement ? <Text style={styles.errorMessage}>{errorMessages.departement}</Text> : null}

        <Text>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errorMessages.email ? <Text style={styles.errorMessage}>{errorMessages.email}</Text> : null}

        <Text>Mot de passe:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        {errorMessages.password ? <Text style={styles.errorMessage}>{errorMessages.password}</Text> : null}

        <Text>Confirmer le mot de passe:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          value={password_confirmation}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry
        />
        {errorMessages.password_confirmation ? <Text style={styles.errorMessage}>{errorMessages.password_confirmation}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    margin: 10
  },
  formcontainer: {
    backgroundColor: '#fff',
    padding: 15,
    width: '90%',
    borderRadius: 10,
    margin: 10
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#151530',
    fontSize: 25,
    marginBottom: 10,
    margin: 10
  },
  input: {
    backgroundColor: '#e6e6e6',
    padding: 3,
    borderRadius: 6,
    margin: 9,
  },
  button: {
    backgroundColor: '#151530',
    padding: 7,
    borderRadius: 6,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default RegisterScreen;
